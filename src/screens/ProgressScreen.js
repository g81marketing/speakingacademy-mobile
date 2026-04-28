import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import { ACHIEVEMENTS, XP_LEVEL_NAMES } from '../data/achievements';
import { MISSION_NAMES } from '../data/missions';

import { PURPLE, YELLOW, GREEN, BG, CARD, BORDER, GRAY } from '../theme/colors';
const BLUE = PURPLE;

const LEVEL_CONFIG = {
  beginner:     { color: PURPLE, label: 'Iniciante',     goal: 30 },
  basic:        { color: PURPLE, label: 'Básico',        goal: 40 },
  advanced:     { color: PURPLE, label: 'Avançado',      goal: 40 },
};

const TOTAL_DAYS = 110;

export default function ProgressScreen() {
  const {
    streak,
    totalPhrasesPracticed,
    levelProgress,
    currentDay,
    completedDays,
    lastTrainedDate,
    xp,
    xpInfo,
    achievements,
    missionStars,
    completedMissions,
  } = useApp();

  const totalMissions  = Object.keys(MISSION_NAMES).length;
  const doneMissions   = completedMissions.length;
  const threeStarCount = Object.values(missionStars).filter(s => s === 3).length;

  const trainedToday = lastTrainedDate === new Date().toDateString();
  const xpLevelName = XP_LEVEL_NAMES[(xpInfo?.level ?? 1) - 1] ?? 'Iniciante';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Cabeçalho ── */}
        <View style={styles.header}>
          <Text style={styles.title}>Progresso</Text>
          <Text style={styles.subtitle}>Acompanhe sua evolução</Text>
        </View>

        {/* ── Card de streak ── */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>🔥</Text>
          <Text style={styles.heroValue}>{streak}</Text>
          <Text style={styles.heroLabel}>Dias consecutivos</Text>
          <Text style={styles.heroSub}>
            {streak === 0
              ? 'Faça seu primeiro treino hoje!'
              : streak === 1
              ? 'Ótimo começo! Continue amanhã.'
              : `Incrível! ${streak} dias seguidos de prática.`}
          </Text>
        </View>

        {/* ── Grade de estatísticas ── */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: PURPLE + '22' }]}>
            <Text style={[styles.statValue, { color: PURPLE }]}>
              {currentDay}
            </Text>
            <Text style={styles.statLabel}>Dia atual</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: GREEN + '18' }]}>
            <Text style={[styles.statValue, { color: GREEN }]}>
              {completedDays.length}
            </Text>
            <Text style={styles.statLabel}>Dias concluídos</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: YELLOW + '18' }]}>
            <Text style={[styles.statValue, { color: YELLOW }]}>
              {trainedToday ? '✓' : '—'}
            </Text>
            <Text style={styles.statLabel}>Treinou hoje</Text>
          </View>
        </View>

        {/* ── Progresso no plano de 110 dias ── */}
        <Text style={styles.sectionTitle}>Plano de 110 dias</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalLabel}>Dias concluídos</Text>
            <Text style={styles.goalValue}>
              {completedDays.length} / {TOTAL_DAYS}
            </Text>
          </View>
          <ProgressBar
            progress={Math.min(completedDays.length / TOTAL_DAYS, 1)}
            color={BLUE}
            height={12}
          />
          <Text style={styles.goalSub}>
            {completedDays.length >= TOTAL_DAYS
              ? '� Plano concluído! Você é fluente!'
              : `Faltam ${TOTAL_DAYS - completedDays.length} dias para completar o plano`}
          </Text>
        </View>

        {/* ── Progresso por nível ── */}
        <Text style={styles.sectionTitle}>Treinos por nível</Text>
        {Object.entries(LEVEL_CONFIG).map(([key, cfg]) => {
          const count = levelProgress[key] || 0;
          const pct = Math.min(count / cfg.goal, 1);
          return (
            <View key={key} style={styles.levelRow}>
              <View style={styles.levelRowHeader}>
                <View style={styles.levelTitleRow}>
                  <View style={[styles.levelDot, { backgroundColor: cfg.color }]} />
                  <Text style={styles.levelName}>{cfg.label}</Text>
                </View>
                <Text style={styles.levelCount}>
                  {count} / {cfg.goal}
                </Text>
              </View>
              <ProgressBar progress={pct} color={cfg.color} height={10} />
              {count >= cfg.goal && (
                <Text style={styles.levelComplete}>🎉 Nível concluído!</Text>
              )}
            </View>
          );
        })}

        {/* ── Nível de XP ── */}
        <Text style={styles.sectionTitle}>Nível de XP</Text>
        <View style={styles.xpCard}>
          <View style={styles.xpTop}>
            <View>
              <Text style={styles.xpLevelName}>{xpLevelName}</Text>
              <Text style={styles.xpLevelNum}>Nível {xpInfo?.level ?? 1} · {xp} XP total</Text>
            </View>
            <Text style={styles.xpEmoji}>⚡</Text>
          </View>
          <ProgressBar progress={xpInfo?.progress ?? 0} color={PURPLE} height={10} />
          <Text style={styles.xpSub}>
            {xpInfo?.isMaxLevel
              ? '🏆 Nível máximo atingido!'
              : `${xpInfo?.xpNeeded - xpInfo?.xpInLevel ?? 0} XP para o próximo nível`}
          </Text>
        </View>

        {/* ── Missões ── */}
        <Text style={styles.sectionTitle}>
          Missões · {doneMissions}/{totalMissions}
        </Text>

        {/* Resumo de missões */}
        <View style={styles.missionSummaryRow}>
          <View style={[styles.missionSummaryChip, { backgroundColor: GREEN + '18' }]}>
            <Text style={[styles.missionSummaryNum, { color: GREEN }]}>{doneMissions}</Text>
            <Text style={styles.missionSummaryLbl}>Completas</Text>
          </View>
          <View style={[styles.missionSummaryChip, { backgroundColor: YELLOW + '18' }]}>
            <Text style={[styles.missionSummaryNum, { color: YELLOW }]}>{threeStarCount}</Text>
            <Text style={styles.missionSummaryLbl}>3 Estrelas ⭐</Text>
          </View>
          <View style={[styles.missionSummaryChip, { backgroundColor: PURPLE + '22' }]}>
            <Text style={[styles.missionSummaryNum, { color: PURPLE }]}>{totalMissions - doneMissions}</Text>
            <Text style={styles.missionSummaryLbl}>Restantes</Text>
          </View>
        </View>

        {/* Barra de progresso das missões */}
        <View style={styles.missionProgressCard}>
          <View style={styles.missionProgressHeader}>
            <Text style={styles.missionProgressLabel}>Mapa de Missões</Text>
            <Text style={styles.missionProgressValue}>{doneMissions}/{totalMissions}</Text>
          </View>
          <ProgressBar progress={doneMissions / totalMissions} color={GREEN} height={10} />
        </View>

        {/* Grade de missões com estrelas */}
        <View style={styles.missionGrid}>
          {Object.entries(MISSION_NAMES).map(([num, info]) => {
            const n      = parseInt(num);
            const stars  = missionStars[n] ?? 0;
            const done   = completedMissions.includes(n);
            const locked = !done && !completedMissions.includes(n - 1) && n > 1;
            return (
              <View
                key={n}
                style={[
                  styles.missionChip,
                  done  && { backgroundColor: GREEN + '18', borderColor: GREEN + '66' },
                  locked && { opacity: 0.45 },
                ]}
              >
                <Text style={styles.missionChipEmoji}>
                  {locked ? '🔒' : info.emoji}
                </Text>
                <Text style={styles.missionChipNum}>M{n}</Text>
                <View style={styles.missionChipStars}>
                  {[1,2,3].map(i => (
                    <Text key={i} style={{ fontSize: 9, opacity: i <= stars ? 1 : 0.2 }}>⭐</Text>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Conquistas ── */}
        <Text style={styles.sectionTitle}>
          Conquistas · {achievements.length}/{ACHIEVEMENTS.length}
        </Text>
        <View style={styles.achievementsGrid}>
          {ACHIEVEMENTS.map((a) => {
            const unlocked = achievements.includes(a.id);
            return (
              <View
                key={a.id}
                style={[styles.achievementCard, !unlocked && styles.achievementLocked]}
              >
                <Text style={[styles.achievementIcon, !unlocked && { opacity: 0.25 }]}>
                  {a.icon}
                </Text>
                <Text style={[styles.achievementLabel, !unlocked && styles.achievementLabelLocked]}>
                  {a.label}
                </Text>
                <Text style={[styles.achievementDesc, !unlocked && styles.achievementLabelLocked]}>
                  {a.description}
                </Text>
                {unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedText}>✓</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
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

  // Hero streak
  heroCard: {
    backgroundColor: CARD,
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    elevation: 3,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    marginBottom: 18,
    borderWidth: 1, borderColor: BORDER,
  },
  heroEmoji: { fontSize: 52, marginBottom: 6 },
  heroValue: {
    fontSize: 62,
    fontWeight: '900',
    color: YELLOW,
    lineHeight: 70,
  },
  heroLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  heroSub: {
    fontSize: 13,
    color: GRAY,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Grid
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 30,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 13,
    color: GRAY,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Níveis
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: GRAY,
    marginLeft: 20,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  levelRow: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  levelRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  levelName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelCount: {
    fontSize: 14,
    color: GRAY,
    fontWeight: '600',
  },
  levelComplete: {
    fontSize: 13,
    color: GREEN,
    fontWeight: '700',
    marginTop: 6,
  },

  // XP Card
  xpCard: {
    backgroundColor: PURPLE + '22',
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
    gap: 10,
    borderWidth: 1, borderColor: PURPLE + '44',
  },
  xpTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpLevelName: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  xpLevelNum: { fontSize: 12, color: GRAY, marginTop: 2, fontWeight: '500' },
  xpEmoji: { fontSize: 36 },
  xpSub: { fontSize: 12, color: YELLOW, fontWeight: '600', marginTop: 4 },

  // Grid de conquistas
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  achievementCard: {
    width: '47%',
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    elevation: 2,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  achievementLocked: { backgroundColor: CARD, borderColor: BORDER, opacity: 0.5 },
  achievementIcon: { fontSize: 30, marginBottom: 2 },
  achievementLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  achievementLabelLocked: { color: GRAY },
  achievementDesc: {
    fontSize: 10,
    color: GRAY,
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
  unlockedBadge: {
    marginTop: 4,
    backgroundColor: GREEN,
    borderRadius: 10,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedText: { color: '#FFF', fontWeight: '800', fontSize: 12 },

  // Meta geral
  goalCard: {
    backgroundColor: CARD,
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1, borderColor: BORDER,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  goalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: PURPLE,
  },
  goalSub: {
    fontSize: 13,
    color: GRAY,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },

  // ── Missões ────────────────────────────────────────────────────────────────
  missionSummaryRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 20, marginBottom: 14,
  },
  missionSummaryChip: {
    flex: 1, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', gap: 2,
  },
  missionSummaryNum: { fontSize: 26, fontWeight: '900' },
  missionSummaryLbl: { fontSize: 11, fontWeight: '700', color: GRAY, textAlign: 'center' },

  missionProgressCard: {
    backgroundColor: CARD, marginHorizontal: 20,
    borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: BORDER,
  },
  missionProgressHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  missionProgressLabel: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  missionProgressValue: { fontSize: 14, fontWeight: '800', color: PURPLE },

  missionGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 20, gap: 8, marginBottom: 28,
  },
  missionChip: {
    width: '21%', alignItems: 'center', gap: 3,
    backgroundColor: CARD, borderRadius: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: BORDER,
  },
  missionChipEmoji: { fontSize: 18 },
  missionChipNum:   { fontSize: 10, fontWeight: '800', color: GRAY },
  missionChipStars: { flexDirection: 'row', gap: 1 },
});
