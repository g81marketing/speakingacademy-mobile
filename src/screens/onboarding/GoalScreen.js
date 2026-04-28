import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';

import { PURPLE, PINK, YELLOW, BG, CARD, BORDER, GRAY } from '../../theme/colors';

const GOALS = [
  {
    id: 'trabalho',
    emoji: '💼',
    label: 'Trabalho',
    desc: 'Reuniões, apresentações e e-mails',
    color: '#7B2FFF',
    glow: '#7B2FFF33',
  },
  {
    id: 'viagem',
    emoji: '✈️',
    label: 'Viagem',
    desc: 'Aeroportos, hotéis e turismo',
    color: '#00C4FF',
    glow: '#00C4FF33',
  },
  {
    id: 'iniciante',
    emoji: '🏋️',
    label: 'Do zero',
    desc: 'Palavras e frases básicas',
    color: '#FFC629',
    glow: '#FFC62933',
  },
  {
    id: 'conversacao',
    emoji: '💬',
    label: 'Conversação',
    desc: 'Diálogos do dia a dia reais',
    color: '#FF6B6B',
    glow: '#FF6B6B33',
  },
];

export default function GoalScreen() {
  const navigation = useNavigation();
  const { setUserGoal } = useApp();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (!selected) return;
    setUserGoal(selected);
    navigation.navigate('OnboardingLevel');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Progresso */}
        <View style={styles.progressRow}>
          {[1, 2, 3, 4].map((s) => (
            <View key={s} style={[styles.progressDot, s <= 2 && styles.progressDotActive]} />
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.step}>Passo 2 de 4</Text>
          <Text style={styles.title}>Qual é o seu objetivo?</Text>
          <Text style={styles.subtitle}>
            Vamos personalizar sua experiência de aprendizado.
          </Text>
        </View>

        {/* Cards */}
        <View style={styles.grid}>
          {GOALS.map((g) => {
            const active = selected === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                style={[
                  styles.card,
                  { borderColor: active ? g.color : BORDER, backgroundColor: active ? g.glow : CARD },
                ]}
                onPress={() => setSelected(g.id)}
                activeOpacity={0.85}
              >
                {active && (
                  <View style={[styles.checkBadge, { backgroundColor: g.color }]}>
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                  </View>
                )}
                <View style={[styles.emojiCircle, { backgroundColor: g.glow }]}>
                  <Text style={styles.cardEmoji}>{g.emoji}</Text>
                </View>
                <Text style={[styles.cardLabel, { color: active ? g.color : '#FFFFFF' }]}>{g.label}</Text>
                <Text style={styles.cardDesc}>{g.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botão */}
        <TouchableOpacity
          style={[styles.btnPrimary, !selected && styles.btnDisabled]}
          onPress={handleContinue}
          activeOpacity={0.88}
          disabled={!selected}
        >
          <Text style={styles.btnText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll:    { padding: 24, gap: 24, paddingBottom: 48 },

  progressRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  progressDot: { width: 32, height: 5, borderRadius: 3, backgroundColor: BORDER },
  progressDotActive: { backgroundColor: PURPLE },

  header: { gap: 8, alignItems: 'center' },
  step:     { fontSize: 11, fontWeight: '800', color: PURPLE, textTransform: 'uppercase', letterSpacing: 2 },
  title:    { fontSize: 26, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  subtitle: { fontSize: 14, color: GRAY, textAlign: 'center', lineHeight: 21 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%', borderRadius: 20, borderWidth: 2,
    padding: 18, gap: 8, alignItems: 'flex-start',
  },
  checkBadge: {
    position: 'absolute', top: 12, right: 12,
    width: 22, height: 22, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
  },
  emojiCircle: {
    width: 48, height: 48, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  cardEmoji: { fontSize: 26 },
  cardLabel: { fontSize: 16, fontWeight: '800' },
  cardDesc:  { fontSize: 12, color: GRAY, lineHeight: 18, fontWeight: '400' },

  btnPrimary: {
    backgroundColor: PURPLE, borderRadius: 18,
    paddingVertical: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: PURPLE, shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 18, elevation: 10,
  },
  btnDisabled: { backgroundColor: BORDER, shadowOpacity: 0 },
  btnText: { fontSize: 16, fontWeight: '900', color: '#FFF' },
});
