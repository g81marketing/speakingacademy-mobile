import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

// Retorna a cor correspondente à faixa do score
function getScoreColor(score) {
  if (score >= 92) return '#16A34A'; // verde
  if (score >= 78) return '#2563EB'; // azul
  if (score >= 62) return '#D97706'; // amarelo
  if (score >= 40) return '#EA580C'; // laranja
  return '#EF4444';                  // vermelho
}

// Anel circular com score no centro
// score: 0–100
// size: diâmetro do anel em px (padrão 180)
export default function ScoreRing({ score, size = 180 }) {
  const color = getScoreColor(score);
  const borderWidth = Math.round(size / 10);

  // Animação de entrada do número
  const anim = useRef(new Animated.Value(0)).current;
  const displayScore = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, score],
  });

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor: color,
          shadowColor: color,
        },
      ]}
    >
      {/* Score animado */}
      <Animated.Text
        style={[styles.score, { color, fontSize: size * 0.32 }]}
      >
        {/* AnimatedText não suporta interpolação numérica diretamente, usamos um Text normal */}
        {score}
      </Animated.Text>
      <Text style={styles.label}>pontos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  score: {
    fontWeight: '900',
    lineHeight: undefined,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
});
