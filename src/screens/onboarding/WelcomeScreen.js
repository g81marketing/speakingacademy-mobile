import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LogoSpeaking from '../../components/LogoSpeaking';
import { PURPLE, BG, GRAY } from '../../theme/colors';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* Conteúdo principal */}
      <View style={styles.content}>

        {/* Logo */}
        <View style={styles.logoWrap}>
          <LogoSpeaking size="md" style={{ alignSelf: 'flex-start' }} />
        </View>

        {/* Hero */}
        <View style={styles.heroBlock}>
          <Text style={styles.heroTitle}>Fale inglês{'\n'}todos os dias.</Text>
          <Text style={styles.heroSub}>5 minutos por dia. Resultado real.</Text>
        </View>

        {/* Benefícios */}
        <View style={styles.bullets}>
          <Text style={styles.bullet}>• Treino diário guiado</Text>
          <Text style={styles.bullet}>• Correção de pronúncia com IA</Text>
          <Text style={styles.bullet}>• Progresso com metas reais</Text>
        </View>
      </View>

      {/* Botões */}
      <View style={styles.btnArea}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Auth')}
          activeOpacity={0.88}
        >
          <Text style={styles.btnPrimaryText}>Começar treino →</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },

  content: {
    justifyContent: 'flex-start',
  },

  logoWrap: {
    alignItems: 'flex-start',
    marginBottom: 44,
  },

  heroBlock: {
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 46,
    marginBottom: 14,
  },
  heroSub: {
    fontSize: 16,
    color: GRAY,
    lineHeight: 24,
  },

  bullets: {
    gap: 12,
  },
  bullet: {
    fontSize: 15,
    color: '#BBBBCC',
    lineHeight: 22,
  },

  btnArea: {
    gap: 14,
  },
  btnPrimary: {
    backgroundColor: PURPLE,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  btnGhost: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnGhostText: {
    fontSize: 15,
    color: GRAY,
  },
});
