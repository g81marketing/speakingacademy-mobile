import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { phrases, LEVEL_LABELS } from '../data/phrases';
import PhraseCard from '../components/PhraseCard';

import { PURPLE, BG, CARD, BORDER, GRAY } from '../theme/colors';
const BLUE = PURPLE;

const LEVELS = ['all', 'beginner', 'basic', 'intermediate', 'advanced'];
const CATEGORIES = ['all', 'words', 'daily', 'negation', 'questions', 'work', 'meetings', 'conversations'];

const LEVEL_LABELS_UI = {
  all: 'Todos',
  ...LEVEL_LABELS,
};
const CATEGORY_LABELS = {
  all: 'Todas',
  words: 'Palavras',
  daily: 'Cotidiano',
  negation: 'Negação',
  questions: 'Perguntas',
  work: 'Trabalho',
  meetings: 'Reuniões',
  emails: 'E-mails',
  conversations: 'Conversários',
};

export default function LibraryScreen() {
  const navigation = useNavigation();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filtra as frases conforme os chips selecionados
  const filtered = phrases.filter((p) => {
    const matchLevel = selectedLevel === 'all' || p.level === selectedLevel;
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchLevel && matchCat;
  });

  // Inicia o treino com a frase tocada
  const handlePractice = (phrase) => {
    navigation.navigate('Training', { phrase });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Cabeçalho ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Biblioteca</Text>
        <Text style={styles.subtitle}>{filtered.length} frases disponíveis</Text>
      </View>

      {/* ── Filtro por nível ── */}
      <Text style={styles.filterLabel}>NÍVEL</Text>
      <View style={styles.filterRow}>
        {LEVELS.map((l) => (
          <TouchableOpacity
            key={l}
            style={[styles.chip, selectedLevel === l && styles.chipActive]}
            onPress={() => setSelectedLevel(l)}
          >
            <Text style={[styles.chipText, selectedLevel === l && styles.chipTextActive]}>
              {LEVEL_LABELS_UI[l]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Filtro por categoria ── */}
      <Text style={styles.filterLabel}>CATEGORIA</Text>
      <View style={styles.filterRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, selectedCategory === c && styles.chipActive]}
            onPress={() => setSelectedCategory(c)}
          >
            <Text style={[styles.chipText, selectedCategory === c && styles.chipTextActive]}>
              {CATEGORY_LABELS[c]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Lista de frases ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PhraseCard phrase={item} onPress={handlePractice} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>Nenhuma frase encontrada</Text>
            <Text style={styles.emptySubtext}>Tente outro filtro</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: GRAY,
    marginTop: 3,
    fontWeight: '500',
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: GRAY,
    letterSpacing: 1.2,
    marginLeft: 20,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  chipActive: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  chipText: {
    fontSize: 13,
    color: GRAY,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 12,
  },
  emptyBox: {
    paddingTop: 60,
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: { fontSize: 40 },
  emptyText: {
    fontSize: 17,
    fontWeight: '700',
    color: GRAY,
  },
  emptySubtext: {
    fontSize: 14,
    color: GRAY,
  },
});
