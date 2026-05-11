import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import LogoSpeaking from '../../components/LogoSpeaking';
import { PURPLE, BG, GRAY } from '../../theme/colors';

const MOBILE_IMG = require('../../../assets/images/mobile.png');

const FEATURES = [
  {
    icon: 'calendar-outline',
    title: 'Treino diário guiado',
    desc: 'Aulas rápidas e práticas para você evoluir todo dia.',
  },
  {
    icon: 'mic-outline',
    title: 'Correção de pronúncia com IA',
    desc: 'Fale, receba feedback e melhore sua pronúncia.',
  },
  {
    icon: 'trending-up-outline',
    title: 'Progresso com metas reais',
    desc: 'Acompanhe seu desempenho e conquiste resultados reais.',
  },
];

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo centralizado */}
        <View style={styles.logoWrap}>
          <LogoSpeaking size="md" style={{ alignSelf: 'center' }} />
          <Text style={styles.tagline}>A ACADEMIA DO INGLÊS</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroBlock}>
          <Text style={styles.heroTitle}>
            Fale inglês{'\n'}
            <Text style={styles.heroTitleAccent}>todos os dias.</Text>
          </Text>
          <Text style={styles.heroSub}>5 minutos por dia. Resultado real.</Text>
        </View>

        {/* Lista de features */}
        <View style={styles.features}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIconBox}>
                <Ionicons name={f.icon} size={22} color={PURPLE} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Imagem mockup */}
        <View style={styles.heroImageWrap}>
          <Image source={MOBILE_IMG} style={styles.heroImage} resizeMode="contain" />
        </View>
      </ScrollView>

      {/* Botões fixos */}
      <View style={styles.btnArea}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Auth')}
          activeOpacity={0.88}
        >
          <Text style={styles.btnPrimaryText}>Começar treino  →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnGhost}
          onPress={() => navigation.navigate('Auth', { returning: true })}
          activeOpacity={0.7}
        >
          <Text style={styles.btnGhostText}>Já tenho conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },

  logoWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  tagline: {
    fontSize: 11,
    color: PURPLE,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 6,
  },

  heroBlock: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 46,
    marginBottom: 14,
  },
  heroTitleAccent: {
    color: PURPLE,
  },
  heroSub: {
    fontSize: 15,
    color: GRAY,
    lineHeight: 22,
  },

  features: {
    gap: 18,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(123, 47, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(123, 47, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: '#9999AA',
    lineHeight: 18,
  },

  heroImageWrap: {
    alignItems: 'center',
    marginTop: 8,
  },
  heroImage: {
    width: '100%',
    height: 320,
  },

  btnArea: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    gap: 10,
    backgroundColor: BG,
  },
  btnPrimary: {
    backgroundColor: PURPLE,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PURPLE,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 10,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  btnGhost: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#2A2438',
  },
  btnGhostText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
