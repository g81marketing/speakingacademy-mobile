import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import UpgradeModal from '../components/UpgradeModal';
import { PURPLE, PINK, YELLOW, GREEN, BG, CARD, BORDER, GRAY } from '../theme/colors';

const BLUE = PURPLE;

const FREE_FEATURES = [
  { icon: 'checkmark', text: 'Nível Iniciante completo', included: true },
  { icon: 'checkmark', text: 'Frases básicas diárias', included: true },
  { icon: 'checkmark', text: 'Treino de conversação', included: true },
  { icon: 'close', text: 'Speak AI (IA de conversação)', included: false },
  { icon: 'close', text: 'Níveis Intermediário e Avançado', included: false },
  { icon: 'close', text: 'Acesso ilimitado', included: false },
];

const PREMIUM_FEATURES = [
  { icon: 'checkmark', text: 'Todos os níveis (Iniciante a Avançado)', included: true },
  { icon: 'checkmark', text: 'Speak AI com IA avançada', included: true },
  { icon: 'checkmark', text: 'Acesso ilimitado 24/7', included: true },
  { icon: 'checkmark', text: 'Frases personalizadas com IA', included: true },
  { icon: 'checkmark', text: 'Análise de pronúncia detalhada', included: true },
  { icon: 'checkmark', text: 'Suporte prioritário', included: true },
];

export default function PlansScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { isPremium } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Se vier do cadastro, mostra opção de continuar grátis
  const fromRegister = route.params?.fromRegister ?? false;

  const handleSelectFree = () => {
    if (fromRegister) {
      // Continua o onboarding normal (Goal -> Nível -> etc)
      navigation.navigate('Goal');
    } else {
      navigation.goBack();
    }
  };

  const handleSelectPremium = () => {
    setSelectedPlan('premium');
    setShowUpgrade(true);
  };

  const handleUpgradeComplete = () => {
    setShowUpgrade(false);
    if (fromRegister) {
      // Premium ativado! Pode pular onboarding e ir direto para Home
      navigation.navigate('Home');
    } else {
      navigation.goBack();
    }
  };

  const FeatureItem = ({ icon, text, included }) => (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, included ? styles.featureIconIncluded : styles.featureIconExcluded]}>
        <Ionicons name={icon} size={14} color={included ? GREEN : GRAY} />
      </View>
      <Text style={[styles.featureText, !included && styles.featureTextExcluded]}>
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Escolha seu plano</Text>
          <Text style={styles.subtitle}>
            Comece grátis ou desbloqueie todo o potencial com Premium
          </Text>
        </View>

        {/* Premium Card */}
        <View style={styles.premiumCard}>
          <LinearGradient
            colors={[PURPLE + '20', PINK + '15']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumGradient}
          >
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={14} color={YELLOW} />
              <Text style={styles.premiumBadgeText}>RECOMENDADO</Text>
            </View>

            <View style={styles.planHeader}>
              <Text style={styles.planName}>Premium</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>R$ 29,90</Text>
                <Text style={styles.pricePeriod}>/mês</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.featuresList}>
              {PREMIUM_FEATURES.map((feature, idx) => (
                <FeatureItem key={idx} {...feature} />
              ))}
            </View>

            <TouchableOpacity
              style={styles.premiumButton}
              activeOpacity={0.85}
              onPress={handleSelectPremium}
              disabled={isPremium}
            >
              <LinearGradient
                colors={[PURPLE, PINK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.premiumButtonGradient}
              >
                <Text style={styles.premiumButtonText}>
                  {isPremium ? 'Você já é Premium' : 'Assinar Premium'}
                </Text>
                {!isPremium && <Ionicons name="arrow-forward" size={18} color="#FFF" />}
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Free Card */}
        <View style={styles.freeCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Grátis</Text>
            <Text style={styles.freePrice}>R$ 0,00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.featuresList}>
            {FREE_FEATURES.map((feature, idx) => (
              <FeatureItem key={idx} {...feature} />
            ))}
          </View>

          <TouchableOpacity
            style={styles.freeButton}
            activeOpacity={0.85}
            onPress={handleSelectFree}
          >
            <Text style={styles.freeButtonText}>
              {fromRegister ? 'Começar grátis' : 'Continuar com grátis'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={PURPLE} />
          <Text style={styles.infoText}>
            Você pode começar grátis e fazer upgrade para Premium a qualquer momento no seu perfil.
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <UpgradeModal
        visible={showUpgrade}
        onClose={handleUpgradeComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: GRAY,
    lineHeight: 22,
  },
  premiumCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: PURPLE,
  },
  premiumGradient: {
    padding: 20,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PURPLE + '25',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  premiumBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: YELLOW,
    letterSpacing: 0.5,
  },
  freeCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
  },
  planHeader: {
    marginBottom: 4,
  },
  planName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
  },
  pricePeriod: {
    fontSize: 16,
    color: GRAY,
    marginLeft: 4,
  },
  freePrice: {
    fontSize: 24,
    fontWeight: '900',
    color: GRAY,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconIncluded: {
    backgroundColor: GREEN + '20',
  },
  featureIconExcluded: {
    backgroundColor: BORDER,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
  },
  featureTextExcluded: {
    color: GRAY,
  },
  premiumButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 20,
  },
  premiumButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
  },
  freeButton: {
    backgroundColor: BORDER,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  freeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: PURPLE + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PURPLE + '30',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: GRAY,
    lineHeight: 18,
  },
  bottomSpace: {
    height: 40,
  },
});
