import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PURPLE, PINK, YELLOW } from '../theme/colors';

export default function PremiumBanner({ onPress, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <LinearGradient
        colors={[PURPLE, PINK]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.starBadge}>
              <Ionicons name="star" size={16} color={YELLOW} />
            </View>
            <Text style={styles.badgeText}>PREMIUM</Text>
          </View>

          <Text style={styles.title}>Desbloqueie todo o potencial!</Text>
          <Text style={styles.subtitle}>
            Acesso ilimitado ao Speak AI, todos os níveis e recursos exclusivos.
          </Text>

          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons name="sparkles" size={18} color={YELLOW} />
              <Text style={styles.featureText}>Speak AI</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="layers" size={18} color={YELLOW} />
              <Text style={styles.featureText}>Todos níveis</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="infinite" size={18} color={YELLOW} />
              <Text style={styles.featureText}>Sem limites</Text>
            </View>
          </View>

          <View style={styles.ctaRow}>
            <Text style={styles.price}>R$ 29,90/mês</Text>
            <View style={styles.ctaButton}>
              <Text style={styles.ctaText}>Assinar agora</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" />
            </View>
          </View>
        </View>

        {/* Decorative elements */}
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  gradient: {
    padding: 20,
    position: 'relative',
  },
  content: {
    zIndex: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorCircle1: {
    width: 120,
    height: 120,
    top: -40,
    right: -40,
  },
  decorCircle2: {
    width: 80,
    height: 80,
    bottom: 20,
    right: 60,
  },
});
