// ─── PAYWALL SCREEN ───────────────────────────────────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import {
  PURPLE, PURPLE_DARK, YELLOW, BG, CARD, CARD2, BORDER, BORDER2,
  WHITE, GRAY, GRAY2, DARK,
} from '../theme/colors';

const { width } = Dimensions.get('window');

// ─── Dados ────────────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: 'mic',            text: 'Treino guiado de fala todos os dias' },
  { icon: 'analytics',      text: 'Avaliação de pronúncia com IA' },
  { icon: 'trophy',         text: 'Missões e evolução diária' },
  { icon: 'flash',          text: 'Método prático — sem teoria chata' },
];

const PLANS = [
  {
    id: 'monthly',
    label: 'Mensal',
    price: 'R$14,90',
    priceOld: 'R$29,90',
    period: '/mês',
    tag: null,
    highlight: false,
  },
  {
    id: 'annual',
    label: 'Anual',
    price: 'R$197',
    priceOld: null,
    period: '/ano',
    tag: 'MELHOR OPÇÃO',
    highlight: true,
    perMonth: 'R$16,41/mês',
  },
];

const TRUST = [
  { icon: 'close-circle-outline', text: 'Cancele quando quiser' },
  { icon: 'shield-checkmark-outline', text: 'Sem compromisso' },
  { icon: 'flash-outline', text: 'Acesso imediato' },
];

// ─── Componente ───────────────────────────────────────────────────────────────
export default function PaywallScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('annual');

  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(30)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* Botão fechar */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <Ionicons name="close" size={22} color={GRAY} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Badge */}
          <View style={styles.badge}>
            <Ionicons name="mic" size={12} color={PURPLE} />
            <Text style={styles.badgeText}>SPEAKING ACADEMY PRO</Text>
          </View>

          <Text style={styles.headline}>
            Fale inglês com{'\n'}
            <Text style={styles.headlineAccent}>confiança</Text>
            {'\n'}em poucos minutos por dia
          </Text>

          <Text style={styles.subheadline}>
            Treine sua fala todos os dias com feedback inteligente e evolução real
          </Text>
        </Animated.View>

        {/* ── Benefícios ───────────────────────────────────────────── */}
        <Animated.View style={[styles.benefitsCard, { opacity: fadeAnim }]}>
          {BENEFITS.map((b, i) => (
            <View key={i} style={[styles.benefitRow, i < BENEFITS.length - 1 && styles.benefitBorder]}>
              <View style={styles.benefitIconWrap}>
                <Ionicons name={b.icon} size={17} color={PURPLE} />
              </View>
              <Text style={styles.benefitText}>{b.text}</Text>
              <Ionicons name="checkmark" size={16} color={YELLOW} />
            </View>
          ))}
        </Animated.View>

        {/* ── Planos ───────────────────────────────────────────────── */}
        <View style={styles.plansSection}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardSelected,
                  plan.highlight && isSelected && styles.planCardHighlight,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.85}
              >
                {/* Tag "Melhor Opção" */}
                {plan.tag && (
                  <View style={styles.planTag}>
                    <Text style={styles.planTagText}>{plan.tag}</Text>
                  </View>
                )}

                <View style={styles.planContent}>
                  {/* Rádio */}
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>

                  {/* Info */}
                  <View style={styles.planInfo}>
                    <Text style={[styles.planLabel, isSelected && { color: WHITE }]}>{plan.label}</Text>
                    {plan.perMonth && (
                      <Text style={styles.planPerMonth}>{plan.perMonth}</Text>
                    )}
                  </View>

                  {/* Preço */}
                  <View style={styles.planPriceWrap}>
                    {plan.priceOld && (
                      <Text style={styles.planPriceOld}>{plan.priceOld}</Text>
                    )}
                    <View style={styles.planPriceRow}>
                      <Text style={[styles.planPrice, isSelected && plan.highlight && { color: YELLOW }]}>
                        {plan.price}
                      </Text>
                      <Text style={styles.planPeriod}>{plan.period}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.88}>
            <Ionicons name="flash" size={18} color={DARK} style={{ marginRight: 8 }} />
            <Text style={styles.ctaText}>Começar meu treino agora</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Trust ────────────────────────────────────────────────── */}
        <View style={styles.trustRow}>
          {TRUST.map((t, i) => (
            <View key={i} style={styles.trustItem}>
              <Ionicons name={t.icon} size={13} color={GRAY} />
              <Text style={styles.trustText}>{t.text}</Text>
            </View>
          ))}
        </View>

        {/* ── Rodapé ───────────────────────────────────────────────── */}
        <Text style={styles.footer}>
          Ao assinar você concorda com os Termos de Uso e Política de Privacidade.{'\n'}
          Renovação automática. Cancele a qualquer momento.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 20,
    zIndex: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: CARD2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 56,
    paddingBottom: 36,
  },

  // ── Hero
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PURPLE + '22',
    borderWidth: 1,
    borderColor: PURPLE + '55',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: PURPLE,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: WHITE,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 14,
  },
  headlineAccent: {
    color: YELLOW,
  },
  subheadline: {
    fontSize: 14,
    color: GRAY,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: width * 0.8,
  },

  // ── Benefícios
  benefitsCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    marginBottom: 24,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
  },
  benefitBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  benefitIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: PURPLE + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    flex: 1,
    color: WHITE,
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Planos
  plansSection: {
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    overflow: 'visible',
  },
  planCardSelected: {
    borderColor: PURPLE,
    backgroundColor: CARD2,
  },
  planCardHighlight: {
    borderColor: YELLOW,
    backgroundColor: CARD2,
  },
  planTag: {
    position: 'absolute',
    top: -11,
    alignSelf: 'center',
    backgroundColor: YELLOW,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
    zIndex: 2,
  },
  planTagText: {
    color: DARK,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  planContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 14,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BORDER2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: PURPLE,
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: PURPLE,
  },
  planInfo: {
    flex: 1,
  },
  planLabel: {
    color: GRAY,
    fontSize: 15,
    fontWeight: '700',
  },
  planPerMonth: {
    color: GRAY,
    fontSize: 11,
    marginTop: 2,
  },
  planPriceWrap: {
    alignItems: 'flex-end',
  },
  planPriceOld: {
    color: GRAY2,
    fontSize: 11,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  planPrice: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '800',
  },
  planPeriod: {
    color: GRAY,
    fontSize: 12,
    marginBottom: 2,
  },

  // ── CTA
  ctaBtn: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // ── Trust
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 28,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trustText: {
    color: GRAY2,
    fontSize: 11,
    fontWeight: '500',
  },

  // ── Footer
  footer: {
    color: GRAY2,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 15,
  },
});
