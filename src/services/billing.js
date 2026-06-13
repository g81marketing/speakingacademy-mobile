// ─── Billing (Google Play Billing) ───────────────────────────────────────────
// Wrapper em volta de `react-native-iap` para compras de assinatura DENTRO do
// app Android. Responsável por:
// - Conectar/desconectar com a loja
// - Buscar os produtos (SKUs)
// - Disparar o fluxo nativo de compra
// - Entregar o purchaseToken para o backend validar (server-side)
//
// IMPORTANTE:
// - Só funciona em build nativo (EAS/dev client). NÃO roda no Expo Go.
// - Em iOS/web cai em no-op; o fluxo de pagamento desses ambientes continua
//   sendo o Mercado Pago (compatibilidade mantida).
//
// Requer instalação: `react-native-iap` + prebuild (expo prebuild).
import { Platform } from 'react-native';

// SKU do produto de assinatura configurado no Google Play Console.
// Deve ser idêntico ao productId cadastrado lá.
export const PREMIUM_SKU = 'premium_monthly';

// Carrega o módulo de forma defensiva: se não estiver instalado (ex.: rodando
// no Expo Go) não quebra o app inteiro — apenas marca como indisponível.
let IAP = null;
let iapLoadError = null;
try {
  // eslint-disable-next-line global-require
  IAP = require('react-native-iap');
} catch (e) {
  iapLoadError = e;
}

let connected = false;

// Billing só é suportado no Android (Google Play) neste momento.
export function isBillingSupported() {
  return Platform.OS === 'android' && !!IAP && !iapLoadError;
}

// ── Conecta à loja (idempotente) ──────────────────────────────────────────────
export async function initBilling() {
  if (!isBillingSupported()) return false;
  if (connected) return true;
  try {
    await IAP.initConnection();
    // Android: limpa transações pendentes/fantasmas que travam novas compras.
    if (IAP.flushFailedPurchasesCachedAsPendingAndroid) {
      try { await IAP.flushFailedPurchasesCachedAsPendingAndroid(); } catch (_) {}
    }
    connected = true;
    return true;
  } catch (e) {
    console.warn('[Billing] Falha ao conectar:', e?.message);
    return false;
  }
}

export async function endBilling() {
  if (!isBillingSupported() || !connected) return;
  try {
    await IAP.endConnection();
  } catch (_) {} finally {
    connected = false;
  }
}

// ── Busca os produtos de assinatura ───────────────────────────────────────────
export async function getPremiumSubscription() {
  if (!isBillingSupported()) return null;
  await initBilling();
  try {
    const subs = await IAP.getSubscriptions({ skus: [PREMIUM_SKU] });
    return subs?.[0] || null;
  } catch (e) {
    console.warn('[Billing] getSubscriptions falhou:', e?.message);
    return null;
  }
}

// Extrai o offerToken da assinatura (necessário no Billing v5+ do Android).
function getAndroidOfferToken(subscription) {
  const offers = subscription?.subscriptionOfferDetails;
  if (Array.isArray(offers) && offers.length > 0) {
    return offers[0].offerToken;
  }
  return null;
}

// ── Dispara o fluxo de compra ─────────────────────────────────────────────────
// Retorna a Promise; o resultado real chega pelos listeners (registerPurchaseListeners).
export async function requestPremiumSubscription() {
  if (!isBillingSupported()) {
    throw new Error('Compras pela loja não são suportadas neste dispositivo.');
  }
  await initBilling();

  const subscription = await getPremiumSubscription();
  const offerToken = getAndroidOfferToken(subscription);

  // Billing v5+ exige subscriptionOffers com offerToken.
  if (offerToken) {
    return IAP.requestSubscription({
      sku: PREMIUM_SKU,
      subscriptionOffers: [{ sku: PREMIUM_SKU, offerToken }],
    });
  }
  // Fallback para versões/configurações sem offerToken.
  return IAP.requestSubscription({ sku: PREMIUM_SKU });
}

// ── Listeners de compra ───────────────────────────────────────────────────────
// Registra callbacks para sucesso e erro. Retorna uma função de cleanup.
// onPurchase(purchase) recebe { purchaseToken/purchaseTokenAndroid, productId, ... }
export function registerPurchaseListeners({ onPurchase, onError }) {
  if (!isBillingSupported()) return () => {};

  const purchaseSub = IAP.purchaseUpdatedListener(async (purchase) => {
    try {
      await onPurchase?.(purchase);
    } catch (e) {
      onError?.(e);
    }
  });

  const errorSub = IAP.purchaseErrorListener((err) => {
    onError?.(err);
  });

  return () => {
    try { purchaseSub?.remove?.(); } catch (_) {}
    try { errorSub?.remove?.(); } catch (_) {}
  };
}

// ── Finaliza a transação após o backend validar ───────────────────────────────
// Sem isto, o Google reembolsa a compra automaticamente em ~3 dias.
export async function finishPurchase(purchase) {
  if (!isBillingSupported()) return;
  try {
    await IAP.finishTransaction({ purchase, isConsumable: false });
  } catch (e) {
    console.warn('[Billing] finishTransaction falhou:', e?.message);
  }
}

// ── Helpers de extração ───────────────────────────────────────────────────────
export function extractPurchaseToken(purchase) {
  return purchase?.purchaseToken || purchase?.purchaseTokenAndroid || null;
}

export function extractProductId(purchase) {
  // Em assinaturas Android o productId pode vir em productIds[] ou productId.
  return (
    purchase?.productId ||
    (Array.isArray(purchase?.productIds) ? purchase.productIds[0] : null) ||
    PREMIUM_SKU
  );
}

export function extractOrderId(purchase) {
  return purchase?.transactionId || purchase?.orderId || null;
}

// ── Restaurar compras (ex.: reinstalação) ─────────────────────────────────────
export async function getActivePurchases() {
  if (!isBillingSupported()) return [];
  await initBilling();
  try {
    return await IAP.getAvailablePurchases();
  } catch (e) {
    console.warn('[Billing] getAvailablePurchases falhou:', e?.message);
    return [];
  }
}
