import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const BARS = 7;
const BAR_WIDTH = 5;
const BAR_GAP = 5;
const MAX_HEIGHT = 44;
const MIN_HEIGHT = 5;

// Animação de forma de onda sonora
// active: boolean — se true, as barras animam; se false, ficam paradas
// color: cor das barras
export default function WaveformAnimation({ active = false, color = '#2563EB' }) {
  // Cria um valor animado por barra, com fase aleatória para parecer natural
  const animations = useRef(
    Array.from({ length: BARS }, () => new Animated.Value(0))
  ).current;

  const loopsRef = useRef([]);

  useEffect(() => {
    if (active) {
      // Anima cada barra com uma duração e delay levemente diferentes
      loopsRef.current = animations.map((anim, i) => {
        const duration = 250 + i * 60;
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration,
              useNativeDriver: false, // height não suporta native driver
            }),
            Animated.timing(anim, {
              toValue: 0.15,
              duration,
              useNativeDriver: false,
            }),
          ])
        );
      });
      loopsRef.current.forEach((loop) => loop.start());
    } else {
      // Para todas as animações e reseta
      loopsRef.current.forEach((loop) => loop.stop());
      animations.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => {
      loopsRef.current.forEach((loop) => loop.stop());
    };
  }, [active]);

  return (
    <View style={styles.container}>
      {animations.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            { backgroundColor: color },
            {
              height: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [MIN_HEIGHT, MAX_HEIGHT],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: MAX_HEIGHT + 10,
    gap: BAR_GAP,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
  },
});
