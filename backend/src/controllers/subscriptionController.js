// ─── Subscription Controller ──────────────────────────────────────────────────
const subscriptionService = require('../services/subscriptionService');
const googlePlayService   = require('../services/googlePlayService');

// POST /subscription/checkout (autenticado)
exports.checkout = async (req, res, next) => {
  try {
    const data = await subscriptionService.createCheckout(req.userId);
    res.json(data);
  } catch (err) { next(err); }
};

// GET /subscription/status (autenticado)
exports.status = async (req, res, next) => {
  try {
    const data = await subscriptionService.getStatus(req.userId);
    res.json(data);
  } catch (err) { next(err); }
};

// POST /subscription/cancel (autenticado)
exports.cancel = async (req, res, next) => {
  try {
    const user = await subscriptionService.cancel(req.userId);
    res.json({ ok: true, user });
  } catch (err) { next(err); }
};

// POST /subscription/webhook (PÚBLICO — validado por assinatura HMAC)
exports.webhook = async (req, res, next) => {
  try {
    const result = await subscriptionService.handleWebhook(req);
    // MP exige 200/201 rápido (<22s), senão reenvia.
    res.status(200).json(result);
  } catch (err) {
    // 401 para assinatura inválida; outros → 500
    if (err.status === 401) return res.status(401).json({ error: err.message });
    next(err);
  }
};

// POST /subscription/google/verify (autenticado)
// Valida server-side um purchaseToken do Google Play Billing e ativa o Premium.
// Body: { purchaseToken, productId, orderId? }
exports.googleVerify = async (req, res, next) => {
  try {
    const { purchaseToken, productId, orderId } = req.body || {};
    const data = await googlePlayService.verifyPurchase(req.userId, {
      purchaseToken, productId, orderId,
    });
    res.json(data);
  } catch (err) { next(err); }
};
