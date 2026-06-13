// ─── UpgradeModal ─────────────────────────────────────────────────────────────
// Modal único para assinar o Premium. Estratégia por plataforma:
// - Android  → Google Play Billing (exigência da Play Store p/ conteúdo digital)
//              Compra nativa → envia purchaseToken ao backend → valida → Premium
// - Demais   → Mercado Pago (init_point no WebBrowser) — mantém compatibilidade
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';
import { createSubscriptionCheckout, verifyGooglePurchase } from '../services/api';
import {
  isBillingSupported, initBilling, endBilling,
  registerPurchaseListeners, requestPremiumSubscription, finishPurchase,
  extractPurchaseToken, extractProductId, extractOrderId,
} from '../services/billing';
import { PURPLE, YELLOW, BG, CARD, BORDER, GRAY } from '../theme/colors';

const BENEFITS = [
  { icon: 'mic',          text: 'Speak AI — tradutor e tutor de pronúncia' },
  { icon: 'rocket',       text: 'Trilhas Intermediário e Avançado' },
  { icon: 'library',      text: 'Todas as categorias e missões' },
  { icon: 'stats-chart',  text: 'Relatórios e gráficos detalhados' },
  { icon: 'infinite',     text: 'Frases ilimitadas no Speak AI' },
];

export default function UpgradeModal({ visible, onClose }) {
  const { refreshSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const cleanupRef = useRef(null);

  const useGooglePlay = isBillingSupported();

  // ── Listeners do Google Play Billing (só no Android) ────────────────────────
  // Registrados enquanto o modal está visível. Quando uma compra chega,
  // valida no backend, finaliza a transação e atualiza o status local.
  useEffect(() => {
    if (!visible || !useGooglePlay) return undefined;

    let active = true;
    initBilling();

    cleanupRef.current = registerPurchaseListeners({
      onPurchase: async (purchase) => {
        try {
          const purchaseToken = extractPurchaseToken(purchase);
          if (!purchaseToken) throw new Error('Token de compra ausente.');

          // 1) Backend valida server-side com a API do Google.
          await verifyGooglePurchase({
            purchaseToken,
            productId: extractProductId(purchase),
            orderId:   extractOrderId(purchase),
          });

          // 2) Finaliza a transação (obrigatório — senão é reembolsada).
          await finishPurchase(purchase);

          // 3) Reflete o novo plano no app.
          await refreshSubscription();

          if (active) {
            setLoading(false);
            Alert.alert('Premium ativado! 🎉', 'Aproveite todos os recursos.');
            onClose?.();
          }
        } catch (e) {
          if (active) setLoading(false);
          Alert.alert('Erro', e.message || 'Não foi possível confirmar a compra.');
        }
      },
      onError: (err) => {
        if (active) setLoading(false);
        // Usuário cancelar a compra não é erro a ser alertado.
        const code = err?.code || '';
        if (code !== 'E_USER_CANCELLED' && code !== 'E_ALREADY_OWNED') {
          Alert.alert('Erro', err?.message || 'Falha ao processar a compra.');
        }
      },
    });

    return () => {
      active = false;
      try { cleanupRef.current?.(); } catch (_) {}
      endBilling();
    };
  }, [visible, useGooglePlay]);

  // ── Fluxo Google Play (Android) ─────────────────────────────────────────────
  const subscribeWithGooglePlay = async () => {
    try {
      setLoading(true);
      await requestPremiumSubscription();
      // O resultado chega via purchaseUpdatedListener (acima).
      // Mantém loading até a validação concluir.
    } catch (e) {
      setLoading(false);
      Alert.alert('Erro', e.message || 'Não foi possível iniciar a compra.');
    }
  };

  // ── Fluxo Mercado Pago (web/iOS — compatibilidade) ──────────────────────────
  const subscribeWithMercadoPago = async () => {
    try {
      setLoading(true);
      const { initPoint } = await createSubscriptionCheckout();
      if (!initPoint) throw new Error('Checkout indisponível');
      // Abre o checkout do Mercado Pago no navegador interno.
      const result = await WebBrowser.openBrowserAsync(initPoint);
      // Quando o usuário fecha o browser, atualizamos a assinatura.
      // O webhook do MP normalmente já marcou como active.
      await refreshSubscription();
      onClose?.(result);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Não foi possível iniciar a assinatura.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = () =>
    useGooglePlay ? subscribeWithGooglePlay() : subscribeWithMercadoPago();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Ionicons name="star" size={28} color={YELLOW} />
            </View>
            <Text style={styles.title}>Speaking Academy Premium</Text>
            <Text style={styles.subtitle}>
              Desbloqueie todo o potencial do app
            </Text>
          </View>

          <View style={styles.benefits}>
            {BENEFITS.map((b, i) => (
              <View key={i} style={styles.benefitRow}>
                <View style={styles.benefitIcon}>
                  <Ionicons name={b.icon} size={16} color={PURPLE} />
                </View>
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Apenas</Text>
            <Text style={styles.price}>R$ 19,90</Text>
            <Text style={styles.priceSub}>/mês · cancele quando quiser</Text>
          </View>

          <TouchableOpacity
            style={[styles.cta, loading && { opacity: 0.6 }]}
            onPress={handleSubscribe}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : (
                <>
                  <Ionicons name="lock-open" size={18} color="#FFF" />
                  <Text style={styles.ctaText}>Assinar Premium</Text>
                </>
              )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Agora não</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: BG, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30,
    borderTopWidth: 1, borderColor: BORDER,
  },
  handle: {
    width: 40, height: 4, borderRadius: 4, backgroundColor: BORDER,
    alignSelf: 'center', marginBottom: 18,
  },
  header: { alignItems: 'center', marginBottom: 18 },
  iconWrap: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: YELLOW + '22',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    borderWidth: 1, borderColor: YELLOW + '55',
  },
  title: { fontSize: 22, fontWeight: '900', color: '#FFF', textAlign: 'center' },
  subtitle: { fontSize: 13, color: GRAY, marginTop: 4, textAlign: 'center' },

  benefits: { gap: 10, marginBottom: 18 },
  benefitRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: CARD, borderWidth: 1, borderColor: BORDER,
    borderRadius: 12, padding: 12,
  },
  benefitIcon: {
    width: 30, height: 30, borderRadius: 9, backgroundColor: PURPLE + '22',
    alignItems: 'center', justifyContent: 'center',
  },
  benefitText: { flex: 1, color: '#FFF', fontSize: 13, fontWeight: '600' },

  priceBox: {
    alignItems: 'center', marginVertical: 8, paddingVertical: 10,
    backgroundColor: PURPLE + '12', borderRadius: 14,
    borderWidth: 1, borderColor: PURPLE + '44',
  },
  priceLabel: { color: GRAY, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  price:      { color: '#FFF', fontSize: 30, fontWeight: '900', marginTop: 2 },
  priceSub:   { color: GRAY, fontSize: 11, marginTop: 2 },

  cta: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 10, backgroundColor: PURPLE, borderRadius: 16,
    paddingVertical: 16, marginTop: 14,
    shadowColor: PURPLE, shadowOpacity: 0.5, shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16, elevation: 8,
  },
  ctaText: { color: '#FFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },

  closeBtn: { alignItems: 'center', paddingVertical: 12, marginTop: 4 },
  closeText: { color: GRAY, fontSize: 13, fontWeight: '600' },
});
