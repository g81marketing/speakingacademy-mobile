// ─── Google Play Billing — Android Publisher Client ───────────────────────────
// Inicializa o cliente da API Android Publisher do Google usando uma
// Service Account. Usado para VALIDAR (server-side) os purchaseTokens de
// assinaturas compradas dentro do app Android via Google Play Billing.
//
// Documentação:
// - https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2/get
// - https://developers.google.com/android-publisher/authorization
//
// Variáveis de ambiente necessárias:
// - GOOGLE_PACKAGE_NAME              → applicationId do app (ex: com.speakingacademy.app)
// - GOOGLE_SERVICE_ACCOUNT_JSON      → JSON da service account (string única) **OU**
// - GOOGLE_SERVICE_ACCOUNT_KEY_FILE  → caminho para o arquivo .json da service account
const { google } = require('googleapis');

const PACKAGE_NAME = process.env.GOOGLE_PACKAGE_NAME || 'com.speakingacademy.app';

let androidPublisher = null;

// Monta as credenciais a partir de JSON inline (env) ou arquivo.
function buildAuth() {
  const scopes = ['https://www.googleapis.com/auth/androidpublisher'];

  // 1) JSON inline (recomendado em produção/secret manager)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON inválido (não é um JSON válido).');
    }
    return new google.auth.GoogleAuth({ credentials, scopes });
  }

  // 2) Caminho para arquivo .json
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
    return new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      scopes,
    });
  }

  return null;
}

// Lazy init: só cria o cliente quando realmente for usado.
function getClient() {
  if (androidPublisher) return androidPublisher;

  const auth = buildAuth();
  if (!auth) {
    throw new Error(
      'Credenciais do Google Play ausentes. Configure GOOGLE_SERVICE_ACCOUNT_JSON ou GOOGLE_SERVICE_ACCOUNT_KEY_FILE.'
    );
  }

  androidPublisher = google.androidpublisher({ version: 'v3', auth });
  return androidPublisher;
}

// Retorna true se as credenciais estiverem configuradas (sem inicializar).
function isConfigured() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE
  );
}

// ── Valida uma assinatura via purchaseToken (API subscriptionsv2) ─────────────
// Retorna o recurso SubscriptionPurchaseV2 do Google.
// Doc do recurso: https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2#SubscriptionPurchaseV2
async function getSubscriptionV2(purchaseToken) {
  const client = getClient();
  const res = await client.purchases.subscriptionsv2.get({
    packageName: PACKAGE_NAME,
    token: purchaseToken,
  });
  return res.data;
}

// ── Reconhece (acknowledge) uma compra ────────────────────────────────────────
// O Google exige que toda compra seja "acknowledged" em até 3 dias, senão
// é reembolsada automaticamente. Usa a API v1 de subscriptions para isso.
async function acknowledgeSubscription(subscriptionId, purchaseToken) {
  const client = getClient();
  await client.purchases.subscriptions.acknowledge({
    packageName: PACKAGE_NAME,
    subscriptionId, // = productId / SKU
    token: purchaseToken,
    requestBody: {},
  });
}

module.exports = {
  PACKAGE_NAME,
  isConfigured,
  getSubscriptionV2,
  acknowledgeSubscription,
};
