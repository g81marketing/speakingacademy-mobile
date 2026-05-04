// ─── Speaking Academy Logo Component ─────────────────────────────────────────
// Usa o PNG oficial em assets/images/logo.png
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const LOGO = require('../../assets/images/logo.png');

// Aspect ratio ~5:1 (1024x200). Altura define a escala.
const SIZES = {
  sm: 28,
  md: 44,
  lg: 60,
};

export default function LogoSpeaking({ size = 'md', style }) {
  const height = SIZES[size] ?? SIZES.md;
  return (
    <Image
      source={LOGO}
      resizeMode="contain"
      style={[styles.logo, { height }, style]}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    aspectRatio: 5,        // mantém proporção do PNG
    alignSelf: 'center',
  },
});
