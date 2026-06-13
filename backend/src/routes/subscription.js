// ─── Subscription Routes ──────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const {
  checkout, status, cancel, webhook, googleVerify,
} = require('../controllers/subscriptionController');

// Webhook é PÚBLICO (sem JWT) — validado por HMAC do Mercado Pago.
// IMPORTANTE: precisa ser registrado ANTES do express.json() global
// OU usar express.raw() aqui. Como o body do MP é JSON simples,
// vamos com json mas guardamos o raw para validar a assinatura.
router.post('/webhook', webhook);

// Tudo abaixo exige autenticação JWT
router.use(auth);
router.post('/checkout', checkout);
router.get ('/status',   status);
router.post('/cancel',   cancel);

// ── Google Play Billing (assinaturas vindas do app Android) ───────────────────
// Valida o purchaseToken server-side e ativa o Premium na camada unificada.
router.post('/google/verify', googleVerify);

module.exports = router;
