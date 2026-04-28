// ─── Gym Decorative Elements ──────────────────────────────────────────────────
// Halteres e elementos de academia em estilo monocromático roxo
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PURPLE, PURPLE_DARK, BORDER } from '../theme/colors';

// Halter simples (dumbbell) desenhado com Views
export function DumbbellIcon({ size = 32, color = PURPLE, style }) {
  const s = size / 32;
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {/* Placa esquerda */}
      <View style={{
        width: 10 * s, height: 22 * s, borderRadius: 3 * s,
        backgroundColor: color, opacity: 0.9,
      }} />
      <View style={{
        width: 5 * s, height: 14 * s, borderRadius: 2 * s,
        backgroundColor: color, marginHorizontal: 1 * s,
      }} />
      {/* Barra central */}
      <View style={{
        width: 18 * s, height: 7 * s, borderRadius: 3 * s,
        backgroundColor: color,
      }} />
      {/* Placa direita */}
      <View style={{
        width: 5 * s, height: 14 * s, borderRadius: 2 * s,
        backgroundColor: color, marginHorizontal: 1 * s,
      }} />
      <View style={{
        width: 10 * s, height: 22 * s, borderRadius: 3 * s,
        backgroundColor: color, opacity: 0.9,
      }} />
    </View>
  );
}

// Badge "XP" com estilo musculação
export function XpBadge({ value, style }) {
  return (
    <View style={[styles.xpBadge, style]}>
      <Text style={styles.xpValue}>+{value}</Text>
      <Text style={styles.xpLabel}>XP</Text>
    </View>
  );
}

// Tag de nível estilo academia
export function LevelTag({ label, color = PURPLE, style }) {
  return (
    <View style={[styles.levelTag, { borderColor: color + '66', backgroundColor: color + '22' }, style]}>
      <Text style={[styles.levelText, { color }]}>{label}</Text>
    </View>
  );
}

// Decoração de fundo com halteres flutuantes (uso em telas de boas-vindas)
export function GymBgDecor({ style }) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.bgDecor, style]} pointerEvents="none">
      <View style={[styles.decorItem, { top: 40, right: -20, opacity: 0.06, transform: [{ rotate: '20deg' }] }]}>
        <DumbbellIcon size={80} color="#FFFFFF" />
      </View>
      <View style={[styles.decorItem, { bottom: 120, left: -30, opacity: 0.05, transform: [{ rotate: '-15deg' }] }]}>
        <DumbbellIcon size={100} color="#FFFFFF" />
      </View>
      <View style={[styles.decorItem, { top: '40%', right: 10, opacity: 0.04, transform: [{ rotate: '35deg' }] }]}>
        <DumbbellIcon size={60} color="#FFFFFF" />
      </View>
    </View>
  );
}

// Linha divisória "REP" estilo academia
export function RepDivider({ label = '●', style }) {
  return (
    <View style={[styles.divider, style]}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerLabel}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  bgDecor: { overflow: 'hidden' },
  decorItem: { position: 'absolute' },

  xpBadge: {
    flexDirection: 'row', alignItems: 'baseline', gap: 2,
    backgroundColor: PURPLE + '22', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: PURPLE + '44',
  },
  xpValue: { fontSize: 16, fontWeight: '900', color: PURPLE },
  xpLabel: { fontSize: 10, fontWeight: '700', color: PURPLE, letterSpacing: 1 },

  levelTag: {
    borderRadius: 6, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  levelText: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },

  divider: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginVertical: 8,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
  dividerLabel: { fontSize: 10, color: PURPLE, fontWeight: '700', letterSpacing: 2 },
});
