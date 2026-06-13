// ─── LockedContent ────────────────────────────────────────────────────────────
// Wrapper que esconde o conteúdo se o usuário NÃO for premium e
// substitui por um card de upgrade. Para uso em qualquer tela:
//
//   <LockedContent feature="Speak AI">
//     <SpeakingAIScreen />
//   </LockedContent>
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import UpgradeModal from './UpgradeModal';
import { PURPLE, YELLOW, BG, CARD, BORDER, GRAY } from '../theme/colors';

export default function LockedContent({
  feature = 'este recurso',
  description,
  children,
}) {
  const { isPremium } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (isPremium) return <>{children}</>;

  return (
    <View style={styles.wrap}>
      <View style={styles.lockIcon}>
        <Ionicons name="lock-closed" size={32} color={YELLOW} />
      </View>
      <Text style={styles.title}>Recurso Premium</Text>
      <Text style={styles.subtitle}>
        {description || `Assine para desbloquear ${feature}.`}
      </Text>

      <TouchableOpacity
        style={styles.cta}
        onPress={() => setShowModal(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="star" size={16} color="#FFF" />
        <Text style={styles.ctaText}>Ver planos</Text>
      </TouchableOpacity>

      <UpgradeModal visible={showModal} onClose={() => setShowModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1, backgroundColor: BG,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, paddingVertical: 40,
  },
  lockIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: YELLOW + '22',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: YELLOW + '55',
    marginBottom: 18,
  },
  title:    { fontSize: 22, fontWeight: '900', color: '#FFF', textAlign: 'center' },
  subtitle: { fontSize: 14, color: GRAY, textAlign: 'center', lineHeight: 21, marginTop: 8 },
  cta: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: PURPLE, paddingHorizontal: 22, paddingVertical: 14,
    borderRadius: 14, marginTop: 22,
  },
  ctaText: { color: '#FFF', fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },
});
