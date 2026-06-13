// ─── Subscription Service ─────────────────────────────────────────────────────
// Toda a lógica de negócio para assinaturas Mercado Pago.
const crypto    = require('crypto');
const userRepo  = require('../repositories/userRepository');
const { preApproval, payment } = require('../lib/mercadoPago');

class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

// Plano único: Premium R$ 19,90/mês
const PREMIUM_PRICE_BRL = Number(process.env.PREMIUM_PRICE_BRL || 19.90);
const PREMIUM_NAME      = process.env.PREMIUM_NAME || 'Speaking Academy Premium';
const BACKEND_URL       = process.env.BACKEND_URL  || 'http://localhost:3000';
const SUCCESS_URL       = process.env.MP_SUCCESS_URL || `${BACKEND_URL}/subscription/return`;

// ── Cria checkout (Preapproval) e devolve init_point para o app abrir ─────────
async function createCheckout(userId) {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError('Usuário não encontrado.', 404);
  if (user.plan === 'premium' && user.subscriptionStatus === 'active')
    throw new AppError('Você já possui uma assinatura ativa.', 409);

  // Cria a preapproval (assinatura mensal). MP retorna init_point (URL de checkout).
  const body = {
    reason: PREMIUM_NAME,
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      transaction_amount: PREMIUM_PRICE_BRL,
      currency_id: 'BRL',
    },
    back_url: SUCCESS_URL,
    payer_email: user.email,
    // external_reference nos permite associar o webhook ao userId
    external_reference: user.id,
    status: 'pending',
  };

  const created = await preApproval.create({ body });

  // Salva como pending até o webhook confirmar o pagamento
  await userRepo.update(userId, {
    subscriptionStatus:    'pending',
    paymentSubscriptionId: created.id,
    paymentCustomerId:     user.email, // MP identifica o pagador pelo email
  });

  return {
    initPoint:      created.init_point,
    preapprovalId:  created.id,
    status:         created.status,
  };
}

// ── Status atual da assinatura ────────────────────────────────────────────────
async function getStatus(userId) {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError('Usuário não encontrado.', 404);

  // Verificação preguiçosa: se a data de expiração passou, rebaixa.
  if (
    user.plan === 'premium' &&
    user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) < new Date()
  ) {
    const downgraded = await userRepo.update(userId, {
      plan: 'free',
      subscriptionStatus: 'expired',
    });
    return publicSubInfo(downgraded);
  }

  return publicSubInfo(user);
}

function publicSubInfo(user) {
  return {
    plan:                 user.plan,
    subscriptionStatus:   user.subscriptionStatus,
    subscriptionExpiresAt: user.subscriptionExpiresAt,
    isPremium:            user.plan === 'premium' && user.subscriptionStatus === 'active',
  };
}

// ── Validação do webhook ──────────────────────────────────────────────────────
// MP envia header x-signature: "ts=...,v1=hex" assinado com MP_WEBHOOK_SECRET
// Doc: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks#editor_2
function verifyWebhookSignature(req) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[MP] MP_WEBHOOK_SECRET não configurado — pulando verificação (DEV ONLY).');
    return true;
  }
  const sigHeader = req.header('x-signature');
  const requestId = req.header('x-request-id');
  if (!sigHeader || !requestId) return false;

  // Parse "ts=...,v1=..."
  const parts = Object.fromEntries(
    sigHeader.split(',').map((kv) => kv.trim().split('='))
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  // dataId pode vir como query ?data.id=... ou no body
  const dataId = req.query['data.id'] || req.body?.data?.id || '';
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(v1));
}

// ── Processa notificação do webhook ───────────────────────────────────────────
// MP envia: { type: 'subscription_preapproval' | 'payment' | ..., data: { id } }
async function handleWebhook(req) {
  if (!verifyWebhookSignature(req)) {
    throw new AppError('Assinatura do webhook inválida.', 401);
  }
  const type   = req.body?.type || req.query?.type;
  const dataId = req.body?.data?.id || req.query['data.id'];
  if (!type || !dataId) return { ignored: true };

  if (type === 'subscription_preapproval') {
    return processPreapproval(dataId);
  }
  if (type === 'payment') {
    return processPayment(dataId);
  }
  return { ignored: true, type };
}

// ── Processa atualização de uma preapproval (assinatura) ──────────────────────
async function processPreapproval(preapprovalId) {
  const sub = await preApproval.get({ id: preapprovalId });
  const userId = sub.external_reference;
  if (!userId) return { ignored: true, reason: 'sem external_reference' };

  // Status MP: pending | authorized | paused | cancelled
  // - authorized → ativa: marca premium ativo, soma 1 mês
  // - cancelled  → cancela: mantém acesso até expires_at, depois expira
  // - paused     → payment_failed
  let update = {};
  switch (sub.status) {
    case 'authorized': {
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);
      update = {
        plan: 'premium',
        subscriptionStatus: 'active',
        subscriptionExpiresAt: expires,
        paymentSubscriptionId: sub.id,
      };
      break;
    }
    case 'cancelled':
      update = { subscriptionStatus: 'cancelled' };
      break;
    case 'paused':
      update = { subscriptionStatus: 'payment_failed' };
      break;
    case 'pending':
    default:
      update = { subscriptionStatus: 'pending' };
  }
  await userRepo.update(userId, update);
  return { ok: true, userId, status: sub.status };
}

// ── Processa pagamento individual (renovação mensal) ──────────────────────────
async function processPayment(paymentId) {
  const pay = await payment.get({ id: paymentId });
  // Renovação de assinatura: o pagamento tem metadata.preapproval_id
  const preapprovalId = pay.metadata?.preapproval_id || pay.point_of_interaction?.transaction_data?.preapproval_id;
  if (!preapprovalId) return { ignored: true };

  if (pay.status === 'approved') {
    // Encontra o user pelo preapproval_id e estende +1 mês
    const user = await userRepo.findByPaymentSubscriptionId(preapprovalId);
    if (!user) return { ignored: true };
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    await userRepo.update(user.id, {
      plan: 'premium',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: expires,
    });
    return { ok: true, renewed: user.id };
  }
  if (pay.status === 'rejected' || pay.status === 'cancelled') {
    const user = await userRepo.findByPaymentSubscriptionId(preapprovalId);
    if (user) await userRepo.update(user.id, { subscriptionStatus: 'payment_failed' });
  }
  return { ok: true, paymentStatus: pay.status };
}

// ── Cancelamento iniciado pelo usuário ────────────────────────────────────────
async function cancel(userId) {
  const user = await userRepo.findById(userId);
  if (!user?.paymentSubscriptionId) throw new AppError('Sem assinatura ativa.', 404);

  await preApproval.update({
    id: user.paymentSubscriptionId,
    body: { status: 'cancelled' },
  });
  // Mantém premium até subscriptionExpiresAt; só marca status como cancelled
  return userRepo.update(userId, { subscriptionStatus: 'cancelled' });
}

module.exports = {
  createCheckout,
  getStatus,
  handleWebhook,
  cancel,
};
