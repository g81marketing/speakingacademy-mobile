// ─── Google Play Subscription Service ─────────────────────────────────────────
// Lógica de negócio para assinaturas compradas DENTRO do app Android via
// Google Play Billing. Mantém a camada unificada (plan + subscriptionStatus +
// subscriptionExpiresAt) como fonte da verdade, marcando paymentProvider =
// 'google_play'.
//
// NÃO substitui o Mercado Pago — ambos coexistem. MP continua atendendo as
// assinaturas feitas no site.
const userRepo   = require('../repositories/userRepository');
const googlePlay = require('../lib/googlePlay');

class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

// Estados de assinatura do Google (subscriptionsv2 → subscriptionState):
// SUBSCRIPTION_STATE_ACTIVE, _IN_GRACE_PERIOD, _ON_HOLD, _PAUSED,
// _CANCELED, _EXPIRED, _PENDING, _UNSPECIFIED
function mapGoogleStateToStatus(state) {
  switch (state) {
    case 'SUBSCRIPTION_STATE_ACTIVE':
    case 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD':
      return 'active';
    case 'SUBSCRIPTION_STATE_CANCELED':
      return 'cancelled';
    case 'SUBSCRIPTION_STATE_ON_HOLD':
    case 'SUBSCRIPTION_STATE_PAUSED':
      return 'payment_failed';
    case 'SUBSCRIPTION_STATE_EXPIRED':
      return 'expired';
    case 'SUBSCRIPTION_STATE_PENDING':
    default:
      return 'pending';
  }
}

// ── Verifica e ativa uma assinatura Google Play ───────────────────────────────
// Recebe o purchaseToken (e o productId/SKU) enviados pelo app após a compra,
// valida server-side com a API do Google e atualiza o usuário.
async function verifyPurchase(userId, { purchaseToken, productId, orderId }) {
  if (!purchaseToken) throw new AppError('purchaseToken é obrigatório.', 400);
  if (!productId)     throw new AppError('productId é obrigatório.', 400);

  const user = await userRepo.findById(userId);
  if (!user) throw new AppError('Usuário não encontrado.', 404);

  if (!googlePlay.isConfigured()) {
    throw new AppError(
      'Validação do Google Play indisponível: credenciais não configuradas no servidor.',
      503,
    );
  }

  // 1) Valida o token com a API Android Publisher
  let sub;
  try {
    sub = await googlePlay.getSubscriptionV2(purchaseToken);
  } catch (e) {
    throw new AppError(
      `Falha ao validar a compra no Google Play: ${e.message}`,
      502,
    );
  }

  // 2) Interpreta o estado e a data de expiração
  const state  = sub.subscriptionState;
  const status = mapGoogleStateToStatus(state);

  // expiryTime fica em lineItems[].expiryTime (v2). Pega o maior (mais distante).
  const expiries = (sub.lineItems || [])
    .map((li) => li.expiryTime)
    .filter(Boolean)
    .map((t) => new Date(t));
  const expiresAt = expiries.length
    ? new Date(Math.max(...expiries.map((d) => d.getTime())))
    : null;

  const isActive = status === 'active' && (!expiresAt || expiresAt > new Date());

  // 3) Acknowledge (obrigatório p/ não ser reembolsado) quando ainda pendente
  //    de reconhecimento e a compra está ativa.
  try {
    if (isActive && sub.acknowledgementState === 'ACKNOWLEDGEMENT_STATE_PENDING') {
      await googlePlay.acknowledgeSubscription(productId, purchaseToken);
    }
  } catch (e) {
    // Não falha a request por causa do acknowledge; apenas loga.
    console.warn('[GooglePlay] acknowledge falhou:', e.message);
  }

  // 4) Atualiza a camada unificada do usuário
  const updated = await userRepo.update(userId, {
    plan:                  isActive ? 'premium' : 'free',
    subscriptionStatus:    status,
    subscriptionExpiresAt: expiresAt,
    paymentProvider:       'google_play',
    googlePurchaseToken:   purchaseToken,
    googleProductId:       productId,
    googleOrderId:         orderId || sub.latestOrderId || null,
  });

  return {
    ok:        true,
    isPremium: isActive,
    plan:      updated.plan,
    subscriptionStatus:    updated.subscriptionStatus,
    subscriptionExpiresAt: updated.subscriptionExpiresAt,
    googleState: state,
  };
}

module.exports = {
  verifyPurchase,
  mapGoogleStateToStatus,
};
