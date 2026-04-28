// ─── SELETOR DE VELOCIDADE DE FALA ────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const TTS_RATES = { slow: 0.7, normal: 1.0, fast: 1.2 };

const OPTIONS = [
  { key: 'slow',   label: '🐢 Lento'  },
  { key: 'normal', label: '▶ Normal'  },
  { key: 'fast',   label: '⚡ Rápido' },
];

export default function SpeedSelector({ speed, onSelect, color = '#2563EB' }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Velocidade</Text>
      <View style={styles.row}>
        {OPTIONS.map((opt) => {
          const active = speed === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.btn, active && { backgroundColor: color, borderColor: color }]}
              onPress={() => onSelect(opt.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.btnText, active && styles.btnTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:        { alignItems: 'center', gap: 6 },
  label:       { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  row:         { flexDirection: 'row', gap: 8 },
  btn: {
    paddingVertical: 7, paddingHorizontal: 14,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  btnText:       { fontSize: 12, fontWeight: '700', color: '#64748B' },
  btnTextActive: { color: '#FFF' },
});
