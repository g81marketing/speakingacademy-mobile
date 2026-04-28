import React from 'react';
import { View, StyleSheet } from 'react-native';

// Barra de progresso reutilizável
// progress: valor entre 0 e 1 (ex: 0.75 = 75%)
// color: cor do preenchimento
// height: espessura da barra
export default function ProgressBar({ progress = 0, color = '#2563EB', height = 8 }) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: color,
            height,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  fill: {
    minWidth: 0,
  },
});
