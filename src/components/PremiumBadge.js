// ─── PremiumBadge ─────────────────────────────────────────────────────────────
// Pequeno selo "PREMIUM" para usar em listas, cards ou ao lado de títulos.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const YELLOW = '#FFCC4D';

export default function PremiumBadge({ size = 'sm', style }) {
  const isSm = size === 'sm';
  return (
    <View style={[styles.wrap, isSm ? styles.sm : styles.md, style]}>
      <Ionicons name="star" size={isSm ? 10 : 12} color={YELLOW} />
      <Text style={[styles.text, !isSm && { fontSize: 11 }]}>PREMIUM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: YELLOW + '22',
    borderWidth: 1, borderColor: YELLOW + '55',
    alignSelf: 'flex-start',
  },
  sm: { borderRadius: 6,  paddingHorizontal: 6, paddingVertical: 2 },
  md: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  text: {
    color: YELLOW, fontSize: 9, fontWeight: '900', letterSpacing: 1,
  },
});
