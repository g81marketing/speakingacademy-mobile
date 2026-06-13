// ─── Mercado Pago SDK ─────────────────────────────────────────────────────────
// Inicializa o cliente do MP usando o ACCESS_TOKEN da conta.
// Usamos PreApproval (Assinaturas) para cobrança recorrente.
//
// Documentação:
// - https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post
// - Webhook: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
const { MercadoPagoConfig, PreApproval, Payment } = require('mercadopago');

if (!process.env.MP_ACCESS_TOKEN) {
  // Não throw em import-time para não quebrar healthcheck; loga aviso.
  console.warn('[MP] MP_ACCESS_TOKEN ausente — endpoints de assinatura ficarão indisponíveis.');
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'missing',
  options: { timeout: 8000 },
});

const preApproval = new PreApproval(client);
const payment    = new Payment(client);

module.exports = { client, preApproval, payment };
