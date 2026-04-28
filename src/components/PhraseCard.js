import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#2563EB';

// Cores e labels por nível
const LEVEL_COLORS = {
  beginner:     '#10B981',
  basic:        '#22C55E',
  intermediate: '#F59E0B',
  advanced:     '#EF4444',
};
const LEVEL_LABELS = {
  beginner:     'Iniciante',
  basic:        'Básico',
  intermediate: 'Intermediário',
  advanced:     'Avançado',
};
const CATEGORY_LABELS = {
  words: 'Palavras', daily: 'Cotidiano', negation: 'Negação',
  questions: 'Perguntas', work: 'Trabalho', meetings: 'Reuniões',
  emails: 'E-mails', conversations: 'Conversários',
};

// Card de frase exibido na Biblioteca
// onPress: função chamada ao tocar no card para iniciar treino
export default function PhraseCard({ phrase, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(phrase)}
      activeOpacity={0.75}
    >
      {/* Cabeçalho: nível, categoria e ícone de play */}
      <View style={styles.header}>
        <View
          style={[styles.levelDot, { backgroundColor: LEVEL_COLORS[phrase.level] }]}
        />
        <Text style={styles.levelText}>{LEVEL_LABELS[phrase.level]}</Text>
        <Text style={styles.separator}>·</Text>
        <Text style={styles.categoryText}>{CATEGORY_LABELS[phrase.category]}</Text>
        <View style={styles.spacer} />
        <Ionicons name="play-circle" size={26} color={BLUE} />
      </View>

      {/* Frase em inglês */}
      <Text style={styles.english}>{phrase.english}</Text>

      {/* Fonética (apenas iniciante) */}
      {phrase.phonetic && (
        <Text style={styles.phonetic}>/{phrase.phonetic}/</Text>
      )}

      {/* Tradução em português */}
      <Text style={styles.portuguese}>{phrase.portuguese}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  levelDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  separator: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  spacer: { flex: 1 },
  english: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 25,
    marginBottom: 7,
  },
  phonetic: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '700',
    marginBottom: 2,
  },
  portuguese: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
  },
});
