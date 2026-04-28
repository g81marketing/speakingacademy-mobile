import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

import { PURPLE, PINK, YELLOW, GREEN, BG, CARD, BORDER, GRAY } from '../../theme/colors';

export default function MicPermissionScreen() {
  const navigation = useNavigation();
  const [status, setStatus] = useState('idle'); // 'idle' | 'granted' | 'denied'
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.15, useNativeDriver: true, friction: 4 }),
      Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, friction: 4 }),
    ]).start();
  };

  const handleRequest = async () => {
    pulse();
    const { status: s } = await Audio.requestPermissionsAsync();
    if (s === 'granted') {
      setStatus('granted');
      setTimeout(() => navigation.navigate('DemoLesson'), 800);
    } else {
      setStatus('denied');
    }
  };

  const handleSkip = () => navigation.navigate('DemoLesson');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Progresso */}
      <View style={styles.progressRow}>
        {[1, 2, 3, 4].map((s) => (
          <View key={s} style={[styles.progressDot, s <= 3 && styles.progressDotActive]} />
        ))}
      </View>

      <View style={styles.content}>
        {/* Ícone animado */}
        <Animated.View style={[styles.micCircleOuter, { transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.micCircle, status === 'granted' && { backgroundColor: GREEN }]}>
            <Ionicons
              name={status === 'granted' ? 'checkmark' : 'mic'}
              size={52}
              color="#FFF"
            />
          </View>
        </Animated.View>

        <View style={styles.textBlock}>
          <Text style={styles.step}>Passo 3 de 4</Text>
          <Text style={styles.title}>
            {status === 'granted' ? 'Microfone liberado! ✅' :
             status === 'denied'  ? 'Acesso negado 😔' :
             'Precisamos do seu microfone'}
          </Text>
          <Text style={styles.subtitle}>
            {status === 'granted'
              ? 'Agora você pode praticar sua pronúncia com avaliação por IA.'
              : status === 'denied'
              ? 'Sem o microfone você não conseguirá praticar. Ative nas configurações do celular.'
              : 'Para avaliar sua pronúncia e dar feedback em tempo real, o app precisa acessar o microfone.'}
          </Text>
        </View>

        {/* Bullets */}
        {status === 'idle' && (
          <View style={styles.bullets}>
            {[
              { icon: 'shield-checkmark', text: 'Áudio nunca é salvo ou enviado' },
              { icon: 'mic-off',          text: 'Você controla quando gravar' },
              { icon: 'lock-closed',      text: 'Sua privacidade é nossa prioridade' },
            ].map((b, i) => (
              <View key={i} style={styles.bulletRow}>
                <Ionicons name={b.icon} size={16} color={GREEN} />
                <Text style={styles.bulletText}>{b.text}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Botões */}
      <View style={styles.btnArea}>
        {status !== 'granted' && (
          <TouchableOpacity
            style={[styles.btnPrimary, status === 'denied' && { backgroundColor: '#EF4444' }]}
            onPress={handleRequest}
            activeOpacity={0.88}
          >
            <Ionicons name="mic" size={20} color="#FFF" />
            <Text style={styles.btnPrimaryText}>
              {status === 'denied' ? 'Tentar novamente' : 'Permitir microfone'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.btnGhost} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.btnGhostText}>
            {status === 'denied' ? 'Continuar sem microfone' : 'Pular por agora'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingHorizontal: 28, paddingVertical: 20 },

  progressRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 16 },
  progressDot: { width: 32, height: 5, borderRadius: 3, backgroundColor: BORDER },
  progressDotActive: { backgroundColor: PURPLE },

  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 36 },

  micCircleOuter: {
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: PURPLE + '18',
    justifyContent: 'center', alignItems: 'center',
  },
  micCircle: {
    width: 108, height: 108, borderRadius: 54,
    backgroundColor: PURPLE,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: PURPLE, shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 10 }, shadowRadius: 22, elevation: 14,
  },

  textBlock: { alignItems: 'center', gap: 10 },
  step:     { fontSize: 11, fontWeight: '800', color: PURPLE, textTransform: 'uppercase', letterSpacing: 2 },
  title:    { fontSize: 24, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  subtitle: { fontSize: 14, color: GRAY, textAlign: 'center', lineHeight: 22, maxWidth: 300 },

  bullets: { gap: 14, width: '100%', backgroundColor: CARD, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bulletText: { fontSize: 13, color: '#CCCCDD', fontWeight: '500', flex: 1 },

  btnArea: { gap: 12 },
  btnPrimary: {
    backgroundColor: PURPLE, borderRadius: 18,
    paddingVertical: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: PURPLE, shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 18, elevation: 10,
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '900', color: '#FFF' },
  btnGhost: { paddingVertical: 14, alignItems: 'center' },
  btnGhostText: { fontSize: 14, color: GRAY, fontWeight: '600' },
});
