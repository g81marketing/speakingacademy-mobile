import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { PURPLE, PINK, YELLOW, GREEN, BG, CARD, BORDER, GRAY } from '../theme/colors';

const { width } = Dimensions.get('window');

const LEVELS = [
  {
    id: 'beginner',
    icon: '🌱',
    label: 'Iniciante',
    tag: 'DO ZERO',
    color: '#00E5A0',
    glow: '#00E5A022',
    description: 'Perfeito para quem está começando do zero.',
    features: [
      { icon: 'calendar-outline',    text: 'Roteiro guiado de 30 dias' },
      { icon: 'volume-high-outline', text: 'Fonética em português' },
      { icon: 'text-outline',        text: 'Texto de apoio na gravação' },
      { icon: 'trending-up-outline', text: 'Progressão automática' },
    ],
  },
  {
    id: 'intermediate',
    icon: '🚀',
    label: 'Intermediário',
    tag: 'POPULAR',
    color: '#7B2FFF',
    glow: '#7B2FFF22',
    description: 'Base sólida? Avance por temas do dia a dia.',
    features: [
      { icon: 'grid-outline',        text: 'Escolha temas livremente' },
      { icon: 'briefcase-outline',   text: 'Trabalho, reuniões, e-mails' },
      { icon: 'chatbubbles-outline', text: 'Situações do dia a dia' },
      { icon: 'star-outline',        text: 'XP e conquistas' },
    ],
  },
  {
    id: 'advanced',
    icon: '🔥',
    label: 'Avançado',
    tag: 'DESAFIO',
    color: '#FF4D4D',
    glow: '#FF4D4D22',
    description: 'Soe como nativo. Sem texto. Sem moleza.',
    features: [
      { icon: 'flash-outline',   text: 'Modo Desafio com timer' },
      { icon: 'mic-outline',     text: 'Diálogos e simulações reais' },
      { icon: 'trophy-outline',  text: 'Todos os temas avançados' },
      { icon: 'ribbon-outline',  text: 'Avaliação rigorosa de pronúncia' },
    ],
  },
];

export default function LevelSelectionScreen() {
  const navigation   = useNavigation();
  const route        = useRoute();
  const fromOnboarding = route.params?.fromOnboarding ?? false;
  const { setUserLevel } = useApp();

  const handleSelect = (levelId) => {
    setUserLevel(levelId);
    if (fromOnboarding) {
      navigation.navigate('MicPermission');
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Cabeçalho ── */}
        <View style={styles.header}>
          <Text style={styles.appName}>Speaking Academy</Text>
          <Text style={styles.title}>Qual é o seu nível?</Text>
          <Text style={styles.subtitle}>
            Escolha com honestidade — isso define sua trilha de aprendizado.
          </Text>
        </View>

        {/* ── Cards de nível ── */}
        {LEVELS.map((level, index) => (
          <LevelCard
            key={level.id}
            level={level}
            delay={index * 100}
            onPress={() => handleSelect(level.id)}
          />
        ))}

        <Text style={styles.footer}>
          Você pode mudar de nível a qualquer momento no Perfil.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function LevelCard({ level, delay, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { borderColor: level.color + '55', backgroundColor: CARD }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[styles.cardStripe, { backgroundColor: level.color }]} />

        <View style={styles.cardBody}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.iconCircle, { backgroundColor: level.glow }]}>
              <Text style={styles.cardIcon}>{level.icon}</Text>
            </View>
            <View style={styles.cardTitleBlock}>
              <Text style={[styles.cardLabel, { color: level.color }]}>{level.label}</Text>
              <View style={[styles.tagBadge, { backgroundColor: level.color + '22' }]}>
                <Text style={[styles.tagText, { color: level.color }]}>{level.tag}</Text>
              </View>
            </View>
            <View style={[styles.chooseBadge, { backgroundColor: level.color }]}>
              <Text style={styles.chooseBadgeText}>Escolher</Text>
            </View>
          </View>

          <Text style={styles.cardDescription}>{level.description}</Text>

          <View style={styles.featureList}>
            {level.features.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Ionicons name={f.icon} size={16} color={level.color} />
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { padding: 20, paddingBottom: 40, gap: 16 },

  header: { alignItems: 'center', paddingVertical: 16, gap: 8 },
  appName: {
    fontSize: 11, fontWeight: '800', color: PURPLE,
    letterSpacing: 2.5, textTransform: 'uppercase',
  },
  title: {
    fontSize: 28, fontWeight: '900', color: '#FFFFFF',
    textAlign: 'center', lineHeight: 34,
  },
  subtitle: {
    fontSize: 14, color: GRAY, textAlign: 'center',
    lineHeight: 22, fontWeight: '400', maxWidth: 300,
  },

  card: {
    borderRadius: 22, borderWidth: 1.5, overflow: 'hidden',
    elevation: 8, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12,
  },
  cardStripe: { height: 4 },
  cardBody: { padding: 20, gap: 14 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 52, height: 52, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  cardIcon: { fontSize: 28 },
  cardTitleBlock: { flex: 1, gap: 4 },
  cardLabel: { fontSize: 20, fontWeight: '900' },
  tagBadge: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  chooseBadge: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 },
  chooseBadgeText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  cardDescription: { fontSize: 14, color: GRAY, lineHeight: 21, fontWeight: '400' },

  featureList: { gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 14, color: '#CCCCDD', fontWeight: '500', flex: 1 },

  footer: {
    textAlign: 'center', fontSize: 12,
    color: GRAY, fontWeight: '400', paddingVertical: 8,
  },
});
