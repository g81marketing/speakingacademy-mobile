import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import ScoreRing from '../components/ScoreRing';
import { getFeedback } from '../utils/similarity';
import { phrases, LEVEL_LABELS } from '../data/phrases';
import { useApp } from '../context/AppContext';
import { calcXpGained, getScoreRating } from '../data/achievements';
import { TTS_RATES } from '../components/SpeedSelector';

import { PURPLE, PINK, YELLOW, GREEN, BG, CARD, BORDER, GRAY } from '../theme/colors';
const BLUE = PURPLE;

const CATEGORY_LABELS = {
  words: 'Palavras', daily: 'Cotidiano', negation: 'Negação',
  questions: 'Perguntas', work: 'Trabalho', meetings: 'Reuniões',
  emails: 'E-mails', conversations: 'Conversários',
};

export default function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { phrase, score, transcribed, productionScore, productionTranscribed } = route.params;
  const { advanceDay, newAchievements, clearNewAchievements, xpInfo, ttsSpeed } = useApp();

  const hasProduction = productionScore != null;
  const avgScore = hasProduction ? Math.round((score + productionScore) / 2) : score;
  const feedback = getFeedback(avgScore);
  const rating = getScoreRating(avgScore);
  const xpGained = calcXpGained(avgScore, false);
  const prodRating = hasProduction ? getScoreRating(productionScore) : null;

  // Animação de entrada do card de XP
  const xpAnim = useRef(new Animated.Value(0)).current;
  // Animação de entrada do toast de conquista
  const toastAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(xpAnim, { toValue: 1, useNativeDriver: true, delay: 300 }).start();
  }, []);

  useEffect(() => {
    if (newAchievements.length > 0) {
      Animated.sequence([
        Animated.spring(toastAnim, { toValue: 0, useNativeDriver: true }),
        Animated.delay(3000),
        Animated.timing(toastAnim, { toValue: -120, duration: 300, useNativeDriver: true }),
      ]).start(() => clearNewAchievements());
    }
  }, [newAchievements]);

  const playCorrect = () => {
    Speech.speak(phrase.english, { language: 'en-US', rate: TTS_RATES[ttsSpeed] ?? 1.0 });
  };

  const handleRetry = () => {
    Speech.stop();
    navigation.replace('Training', { phrase });
  };

  const handleNext = () => {
    Speech.stop();
    if (phrase.day != null) advanceDay();
    const pool = phrases.filter((p) => p.id !== phrase.id && p.level === phrase.level);
    const next = pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : phrases.find((p) => p.id !== phrase.id) || phrases[0];
    navigation.replace('Training', { phrase: next });
  };

  const handleHome = () => {
    Speech.stop();
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* ── Toast de conquista ── */}
      {newAchievements.length > 0 && (
        <Animated.View style={[styles.toast, { transform: [{ translateY: toastAnim }] }]}>
          <Text style={styles.toastIcon}>{newAchievements[0].icon}</Text>
          <View style={styles.toastText}>
            <Text style={styles.toastTitle}>Conquista desbloqueada!</Text>
            <Text style={styles.toastLabel}>{newAchievements[0].label}</Text>
          </View>
        </Animated.View>
      )}

      {/* ── Cabeçalho ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleHome} style={styles.closeBtn}>
          <Ionicons name="close" size={26} color={GRAY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultado</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Score ring + classificação ── */}
        <View style={styles.scoreSection}>
          {hasProduction ? (
            <View style={styles.dualScoreRow}>
              <View style={styles.dualScoreItem}>
                <ScoreRing score={score} size={110} />
                <Text style={styles.dualScoreLabel}>Repetição</Text>
              </View>
              <View style={styles.dualScoreDivider} />
              <View style={styles.dualScoreItem}>
                <ScoreRing score={productionScore} size={110} />
                <Text style={styles.dualScoreLabel}>PT→EN</Text>
              </View>
            </View>
          ) : (
            <ScoreRing score={score} size={160} />
          )}

          <View style={[styles.ratingBadge, { backgroundColor: rating.color + '18' }]}>
            <Text style={styles.ratingEmoji}>{rating.emoji}</Text>
            <Text style={[styles.ratingLabel, { color: rating.color }]}>{rating.label}</Text>
          </View>

          <Text style={styles.feedbackMessage}>{feedback.message}</Text>
        </View>

        {/* ── Card de XP ganho ── */}
        <Animated.View style={[
          styles.xpCard,
          { opacity: xpAnim, transform: [{ scale: xpAnim }] },
        ]}>
          <View style={styles.xpLeft}>
            <Text style={styles.xpIcon}>⚡</Text>
            <View>
              <Text style={styles.xpGained}>+{xpGained} XP</Text>
              <Text style={styles.xpTotal}>Total: {(xpInfo?.xpInLevel ?? 0) + xpGained} / {xpInfo?.xpNeeded ?? 100} XP</Text>
            </View>
          </View>
          <View style={styles.xpLevelBadge}>
            <Text style={styles.xpLevelText}>Nível {xpInfo?.level ?? 1}</Text>
          </View>
        </Animated.View>

        {/* ── Frase correta ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="checkmark-circle" size={18} color={GREEN} />
            <Text style={styles.cardHeaderText}>Frase correta</Text>
            <TouchableOpacity onPress={playCorrect} style={styles.playBtn}>
              <Ionicons name="volume-high" size={18} color={BLUE} />
            </TouchableOpacity>
          </View>
          <Text style={styles.englishText}>{phrase.english}</Text>
          {phrase.phonetic && (
            <Text style={styles.phoneticText}>/{phrase.phonetic}/</Text>
          )}
          <View style={styles.divider} />
          <Text style={styles.portugueseText}>{phrase.portuguese}</Text>
          <View style={styles.tagRow}>
            <View style={styles.levelTag}>
              <Text style={styles.levelTagText}>
                {LEVEL_LABELS[phrase.level] ?? phrase.level} · {CATEGORY_LABELS[phrase.category] ?? phrase.category}
              </Text>
            </View>
            {phrase.sound && (
              <View style={styles.soundTag}>
                <Ionicons name="musical-notes-outline" size={12} color="#7C3AED" />
                <Text style={styles.soundTagText}>{phrase.sound}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── O que você disse ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="mic-outline" size={18} color="#64748B" />
            <Text style={styles.cardHeaderText}>Repetição — o que o app entendeu</Text>
          </View>
          {transcribed ? (
            <Text style={styles.transcribedText}>"{transcribed}"</Text>
          ) : (
            <Text style={styles.transcribedEmpty}>
              Não foi possível identificar a fala. Tente em um ambiente mais silencioso.
            </Text>
          )}
        </View>

        {/* ── Resultado PT→EN ── */}
        {hasProduction && (
          <View style={[styles.card, styles.ptEnCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.ptEnHeaderIcon}>🇧🇷→🇺🇸</Text>
              <Text style={[styles.cardHeaderText, { color: PURPLE }]}>Produção PT→EN</Text>
              <View style={[styles.ratingBadge, { backgroundColor: prodRating.color + '18', paddingHorizontal: 10, paddingVertical: 4 }]}>
                <Text style={[styles.ratingLabel, { color: prodRating.color, fontSize: 12 }]}>
                  {prodRating.emoji} {productionScore}pts
                </Text>
              </View>
            </View>
            {productionTranscribed ? (
              <Text style={styles.transcribedText}>"{productionTranscribed}"</Text>
            ) : (
              <Text style={styles.transcribedEmpty}>Nenhuma fala detectada.</Text>
            )}
            <View style={styles.ptEnExpected}>
              <Text style={styles.ptEnExpectedLabel}>Resposta esperada</Text>
              <Text style={styles.ptEnExpectedText}>{phrase.english}</Text>
            </View>
          </View>
        )}

        {/* Skipped badge */}
        {!hasProduction && (
          <View style={styles.skippedCard}>
            <Ionicons name="arrow-forward-circle-outline" size={20} color="#94A3B8" />
            <Text style={styles.skippedText}>Etapa PT→EN pulada — pratique na próxima sessão!</Text>
          </View>
        )}

        {/* ── Dica de pronúncia ── */}
        <View style={[styles.tipCard, { borderLeftColor: phrase.sound ? '#7C3AED' : rating.color }]}>
          <Text style={[styles.tipTitle, { color: phrase.sound ? '#7C3AED' : rating.color }]}>
            🎯 {phrase.sound ? `Som: ${phrase.sound}` : 'Dica de pronúncia'}
          </Text>
          <Text style={styles.tipText}>{phrase.hint ?? getTip(score)}</Text>
        </View>

        {/* ── Botões de ação ── */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnRetry} onPress={handleRetry}>
            <Ionicons name="refresh" size={20} color={BLUE} />
            <Text style={styles.btnRetryText}>Repetir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
            <Text style={styles.btnNextText}>Próxima</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnHome} onPress={handleHome}>
          <Text style={styles.btnHomeText}>Voltar para o início</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function getTip(score) {
  if (score >= 90) return 'Pronúncia excelente! Continue praticando para manter a fluência.';
  if (score >= 70) return 'Foque na entonação. Ouça mais uma vez e preste atenção no ritmo natural.';
  if (score >= 50) return 'Divida a frase em partes menores e pratique cada trecho separadamente.';
  return 'Ouça várias vezes antes de gravar. Imitar o ritmo é mais importante que a perfeição de cada palavra.';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  toast: {
    position: 'absolute', top: 0, left: 20, right: 20, zIndex: 100,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CARD, borderRadius: 16, padding: 16, gap: 12,
    elevation: 12, shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12,
    marginTop: 8, borderWidth: 1, borderColor: PURPLE + '44',
  },
  toastIcon:  { fontSize: 28 },
  toastText:  { flex: 1 },
  toastTitle: { fontSize: 11, color: GRAY, fontWeight: '700', textTransform: 'uppercase' },
  toastLabel: { fontSize: 15, color: '#FFFFFF', fontWeight: '800', marginTop: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: CARD,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  closeBtn:    { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },

  scroll: { padding: 20, gap: 14, paddingBottom: 32 },

  scoreSection: {
    alignItems: 'center',
    backgroundColor: CARD, borderRadius: 24, padding: 24, gap: 12,
    borderWidth: 1, borderColor: BORDER,
  },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 24,
  },
  ratingEmoji:     { fontSize: 20 },
  ratingLabel:     { fontSize: 17, fontWeight: '800' },
  feedbackMessage: { fontSize: 13, color: GRAY, textAlign: 'center', lineHeight: 20, fontWeight: '500' },

  xpCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: PURPLE + '22', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: PURPLE + '44',
  },
  xpLeft:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  xpIcon:   { fontSize: 28 },
  xpGained: { fontSize: 20, fontWeight: '900', color: YELLOW },
  xpTotal:  { fontSize: 11, color: GRAY, fontWeight: '500', marginTop: 1 },
  xpLevelBadge: {
    backgroundColor: PURPLE, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  xpLevelText: { fontSize: 13, fontWeight: '800', color: '#FFF' },

  card: {
    backgroundColor: CARD,
    borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: BORDER,
    gap: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardHeaderText: {
    flex: 1, fontSize: 12, fontWeight: '700', color: GRAY,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  playBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: PURPLE + '22', justifyContent: 'center', alignItems: 'center',
  },
  englishText:    { fontSize: 20, fontWeight: '700', color: '#FFFFFF', lineHeight: 28 },
  phoneticText:   { fontSize: 14, color: PURPLE, fontWeight: '700' },
  divider:        { height: 1, backgroundColor: BORDER },
  portugueseText: { fontSize: 15, color: GRAY, lineHeight: 22 },
  tagRow:  { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  levelTag: {
    backgroundColor: PURPLE + '22', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start',
  },
  levelTagText: { fontSize: 12, color: PURPLE, fontWeight: '700' },
  soundTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: YELLOW + '22', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start',
  },
  soundTagText:     { fontSize: 12, color: YELLOW, fontWeight: '700' },
  transcribedText:  { fontSize: 17, color: '#BBBBCC', fontStyle: 'italic', lineHeight: 26 },
  transcribedEmpty: { fontSize: 14, color: GRAY, lineHeight: 22 },

  tipCard: {
    backgroundColor: CARD, borderRadius: 14, padding: 16, borderLeftWidth: 4,
    borderColor: BORDER,
  },
  tipTitle: { fontSize: 13, fontWeight: '800', marginBottom: 6 },
  tipText:  { fontSize: 13, color: GRAY, lineHeight: 21 },

  actions: { flexDirection: 'row', gap: 12 },
  btnRetry: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: CARD, borderRadius: 18, paddingVertical: 17,
    gap: 8, borderWidth: 1.5, borderColor: BORDER,
  },
  btnRetryText: { fontSize: 15, fontWeight: '700', color: GRAY },
  btnNext: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: PURPLE, borderRadius: 18, paddingVertical: 17, gap: 8,
    elevation: 6, shadowColor: PURPLE, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 14,
  },
  btnNextText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  btnHome:     { alignItems: 'center', paddingVertical: 12 },
  btnHomeText: { fontSize: 14, color: GRAY, fontWeight: '500' },

  dualScoreRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 12, width: '100%',
  },
  dualScoreItem:    { alignItems: 'center', gap: 8, flex: 1 },
  dualScoreDivider: { width: 1, height: 90, backgroundColor: BORDER },
  dualScoreLabel:   { fontSize: 12, fontWeight: '800', color: GRAY, textTransform: 'uppercase', letterSpacing: 0.6 },

  ptEnCard:        { borderLeftWidth: 3, borderLeftColor: PURPLE },
  ptEnHeaderIcon:  { fontSize: 18, marginRight: 4 },
  ptEnExpected:    { backgroundColor: PURPLE + '18', borderRadius: 10, padding: 12, gap: 4 },
  ptEnExpectedLabel: { fontSize: 11, fontWeight: '800', color: PURPLE, textTransform: 'uppercase', letterSpacing: 0.6 },
  ptEnExpectedText:  { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  skippedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: CARD, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: BORDER,
  },
  skippedText: { fontSize: 13, color: GRAY, fontWeight: '500', flex: 1 },
});
