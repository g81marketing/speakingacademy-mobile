// ─── Speaking Academy Logo Component ─────────────────────────────────────────
// Logo desenhado em código — funciona em qualquer fundo (dark/light)
// Quando tiver um PNG com fundo transparente, substitua por <Image source={require(...)} />
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SIZES = {
  sm: { bubble: 28, title: 13, sub: 6.5, gap: 7 },
  md: { bubble: 38, title: 18, sub: 9,   gap: 10 },
  lg: { bubble: 52, title: 24, sub: 12,  gap: 13 },
};

export default function LogoSpeaking({ size = 'md', style }) {
  const s = SIZES[size] ?? SIZES.md;
  const b = s.bubble;

  return (
    <View style={[styles.row, { gap: s.gap }, style]}>
      {/* Balão de fala */}
      <View style={{ width: b, height: b * 1.05, justifyContent: 'flex-end' }}>
        {/* Corpo do balão */}
        <View style={[styles.bubble, {
          width: b, height: b * 0.82,
          borderRadius: b * 0.18,
        }]} />
        {/* Cauda do balão */}
        <View style={[styles.tail, {
          width: b * 0.32, height: b * 0.26,
          bottom: 0, left: b * 0.08,
          borderBottomRightRadius: b * 0.22,
        }]} />
      </View>

      {/* Texto */}
      <View style={styles.textCol}>
        <Text style={[styles.title, { fontSize: s.title }]} numberOfLines={1}>
          SPEAKING ACADEMY
        </Text>
        <Text style={[styles.sub, { fontSize: s.sub }]} numberOfLines={1}>
          A ACADEMIA DO INGLÊS
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textCol: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '900',
    color: '#7B2FFF',
    letterSpacing: 1.2,
    lineHeight: undefined,
  },
  sub: {
    fontWeight: '700',
    color: '#9B6FFF',
    letterSpacing: 2.5,
    marginTop: 2,
  },
  bubble: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#7B2FFF',
  },
  tail: {
    position: 'absolute',
    backgroundColor: '#5B1FBF',
  },
});
