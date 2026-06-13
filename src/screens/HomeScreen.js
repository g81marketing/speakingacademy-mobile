import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getBlockForDay, getBlocksByCategory } from '../data/phrases';
import { BEGINNER_MISSIONS } from '../data/beginnerMissions';
import conversationBlocks from '../data/conversationBlocks.json';
import { getMissionInfo, isMissionUnlocked } from '../data/missions';
import LogoSpeaking from '../components/LogoSpeaking';
import { DumbbellIcon } from '../components/GymDecor';
import PremiumBanner from '../components/PremiumBanner';
import UpgradeModal from '../components/UpgradeModal';
import { PURPLE, PINK, YELLOW, GREEN, BG, CARD, BORDER, GRAY } from '../theme/colors';

const BLUE = PURPLE;

const LEVEL_COLORS = {
  beginner:     PURPLE,
  basic:        PURPLE,
  intermediate: PURPLE,
  advanced:     PURPLE,
};

const LEVEL_LABEL = {
  beginner:     '🌱 Iniciante',
  basic:        '📘 Básico',
  intermediate: '🚀 Intermediário',
  advanced:     '🎯 Avançado',
};

const TOPICS = [
  { id: 'work',          emoji: '💼', label: 'Trabalho',    color: PURPLE },
  { id: 'meetings',      emoji: '🗣️', label: 'Reuniões',    color: PURPLE },
  { id: 'conversations', emoji: '💬', label: 'Diálogos',    color: PURPLE },
  { id: 'daily',         emoji: '☀️', label: 'Cotidiano',   color: PURPLE },
  { id: 'questions',     emoji: '❓', label: 'Perguntas',   color: PURPLE },
  { id: 'negation',      emoji: '🚫', label: 'Negação',     color: PURPLE },
  { id: 'words',         emoji: '📝', label: 'Vocabulário', color: PURPLE },
  { id: 'all',           emoji: '📚', label: 'Todos',       color: PURPLE },
];

export default function HomeScreen() {
  const navigation    = useNavigation();
  const { isPremium } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const {
    userName,
    streak,
    totalPhrasesPracticed,
    currentDay,
    completedDays,
    userSelectedLevel,
    missionStars,
    completedMissions,
    xpInfo,
    lastTrainedDate,
    challengeMode,
    toggleChallengeMode,
  } = useApp();

  const today = new Date().toDateString();
  const isStreakAtRisk = streak > 0 && lastTrainedDate !== today;

  const [selectedTopic, setSelectedTopic] = useState(null);

  const pathColor      = LEVEL_COLORS[userSelectedLevel] ?? BLUE;
  const isBeginnerPath = userSelectedLevel === 'beginner';
  const currentBlock   = isBeginnerPath
    ? (BEGINNER_MISSIONS.find(b => !completedMissions.includes(b.blockNumber)) ?? BEGINNER_MISSIONS[0])
    : getBlockForDay(currentDay);

  // ── Blocos do tópico selecionado (apenas não-iniciante) ──────────────────
  const topicBlocks = selectedTopic
    ? getBlocksByCategory(selectedTopic, userSelectedLevel)
    : [];

  const topicMeta = TOPICS.find((t) => t.id === selectedTopic);

  const handleStartBlock = (block) => {
    navigation.navigate('Block', { block });
  };

  const handleStartConversation = (block) => {
    navigation.navigate('Conversation', { block });
  };

  const conversationsForLevel = conversationBlocks.filter(
    (b) => b.level === (userSelectedLevel === 'beginner' ? 'beginner' : userSelectedLevel === 'advanced' ? 'advanced' : 'intermediate')
  );

  // ─── Shared header + banner + stats ───────────────────────────────────────
  const renderTopBar = () => (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LogoSpeaking size="sm" showTagline={false} />
          <Text style={styles.greeting}>Olá, {userName || 'aluno'}! 👋</Text>
        </View>
        <TouchableOpacity
          style={styles.streakBadge}
          onPress={() => navigation.navigate('LevelSelection')}
          activeOpacity={0.8}
        >
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakCount}>{streak}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.levelBanner, { backgroundColor: pathColor }]}
        onPress={() => navigation.navigate('LevelSelection')}
        activeOpacity={0.85}
      >
        <Text style={styles.levelBannerText}>
          {LEVEL_LABEL[userSelectedLevel] ?? '📚 Nível'}
        </Text>
        <View style={styles.levelBannerChange}>
          <Ionicons name="swap-horizontal-outline" size={14} color="#FFF" />
          <Text style={styles.levelBannerChangeText}>Trocar</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Text style={styles.statNum}>{totalPhrasesPracticed}</Text>
          <Text style={styles.statLbl}>Treinadas</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statNum}>{streak}</Text>
          <Text style={styles.statLbl}>Sequência 🔥</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statNum}>{completedDays?.length ?? 0}</Text>
          <Text style={styles.statLbl}>Dias feitos</Text>
        </View>
      </View>
    </>
  );

  // ─── MODO INICIANTE ────────────────────────────────────────────────────────
  if (isBeginnerPath) {
    const allMissions = BEGINNER_MISSIONS;
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {renderTopBar()}

          {/* Alerta de streak em risco */}
          {isStreakAtRisk && (
            <TouchableOpacity style={styles.streakAlert} activeOpacity={0.85}
              onPress={() => handleStartBlock(currentBlock)}>
              <Text style={styles.streakAlertIcon}>⚠️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.streakAlertTitle}>Sequência em risco!</Text>
                <Text style={styles.streakAlertSub}>Treine hoje para manter {streak} dias 🔥</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={PURPLE} />
            </TouchableOpacity>
          )}

          {/* Barra XP */}
          {xpInfo && <XpBar xpInfo={xpInfo} color={pathColor} />}

          {/* Modo Desafio toggle */}
          <TouchableOpacity
            style={[styles.challengeToggle, challengeMode && { backgroundColor: PURPLE + '22', borderColor: PURPLE }]}
            onPress={toggleChallengeMode}
            activeOpacity={0.8}
          >
            <Ionicons name="flash" size={18} color={challengeMode ? PURPLE : GRAY} />
            <Text style={[styles.challengeToggleText, challengeMode && { color: PURPLE }]}>
              Modo Desafio {challengeMode ? '(ATIVO)' : '(desativado)'}
            </Text>
            <View style={[styles.toggleSwitch, challengeMode && { backgroundColor: PURPLE }]}>
              <View style={[styles.toggleKnob, challengeMode && styles.toggleKnobOn]} />
            </View>
          </TouchableOpacity>

          {/* Mapa de Missões */}
          <Text style={styles.sectionLabel}>🗺️ Mapa de Missões</Text>
          {allMissions.map((blk) => {
            const info      = blk.missionInfo ?? getMissionInfo(blk.blockNumber);
            const stars     = missionStars[blk.blockNumber] ?? 0;
            const isDone    = completedMissions.includes(blk.blockNumber);
            const unlocked  = isMissionUnlocked(blk.blockNumber, completedMissions);
            const isCurrent = blk.blockNumber === currentBlock.blockNumber;
            return (
              <MissionCard
                key={blk.blockNumber}
                block={blk}
                info={info}
                stars={stars}
                isDone={isDone}
                unlocked={unlocked}
                isCurrent={isCurrent}
                color={pathColor}
                onStart={() => unlocked && handleStartBlock(blk)}
              />
            );
          })}

          {/* Banner Premium para usuários Free */}
          {!isPremium && (
            <PremiumBanner
              onPress={() => setShowUpgrade(true)}
              style={{ marginTop: 16 }}
            />
          )}

        </ScrollView>

        <UpgradeModal
          visible={showUpgrade}
          onClose={() => setShowUpgrade(false)}
        />
      </SafeAreaView>
    );
  }

  // ─── MODO NÃO-INICIANTE — lista de tópicos ─────────────────────────────────
  if (!selectedTopic) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {renderTopBar()}

          {/* Alerta de streak */}
          {isStreakAtRisk && (
            <View style={styles.streakAlert}>
              <Text style={styles.streakAlertIcon}>⚠️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.streakAlertTitle}>Sequência em risco!</Text>
                <Text style={styles.streakAlertSub}>Treine hoje para manter {streak} dias 🔥</Text>
              </View>
            </View>
          )}

          {/* Barra XP */}
          {xpInfo && <XpBar xpInfo={xpInfo} color={pathColor} />}

          <Text style={styles.sectionLabel}>🎯 Escolha o Assunto</Text>
          <View style={styles.topicGrid}>
            {TOPICS.map((t) => {
              const blocks = getBlocksByCategory(t.id, userSelectedLevel);
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.topicCard, { borderColor: t.color + '44' }]}
                  onPress={() => setSelectedTopic(t.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.topicIconCircle, { backgroundColor: t.color + '18' }]}>
                    <Text style={styles.topicEmoji}>{t.emoji}</Text>
                  </View>
                  <Text style={styles.topicLabel}>{t.label}</Text>
                  <View style={[styles.topicBlockBadge, { backgroundColor: t.color }]}>
                    <Text style={styles.topicBlockCount}>{blocks.length}</Text>
                    <Text style={styles.topicBlockWord}>blocos</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Banner Premium para usuários Free */}
          {!isPremium && (
            <PremiumBanner
              onPress={() => setShowUpgrade(true)}
              style={{ marginTop: 8 }}
            />
          )}

          <UpgradeModal
            visible={showUpgrade}
            onClose={() => setShowUpgrade(false)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── MODO NÃO-INICIANTE — blocos do tópico selecionado ────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {renderTopBar()}

        {/* Cabeçalho do tópico + botão voltar */}
        <View style={styles.topicHeader}>
          <TouchableOpacity
            style={styles.backTopicBtn}
            onPress={() => setSelectedTopic(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={topicMeta?.color ?? pathColor} />
          </TouchableOpacity>
          <View style={[styles.topicHeaderIcon, { backgroundColor: (topicMeta?.color ?? pathColor) + '18' }]}>
            <Text style={{ fontSize: 22 }}>{topicMeta?.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.topicHeaderTitle}>{topicMeta?.label}</Text>
            <Text style={styles.topicHeaderSub}>{topicBlocks.length} blocos · 5 frases cada</Text>
          </View>
        </View>

        {/* Lista de blocos do tópico */}
        {topicBlocks.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhuma frase disponível neste assunto para o seu nível.</Text>
          </View>
        ) : (
          topicBlocks.map((blk) => (
            <BlockCard
              key={blk.blockNumber}
              block={blk}
              color={topicMeta?.color ?? pathColor}
              onStart={() => handleStartBlock(blk)}
              compact
            />
          ))
        )}

        {/* Banner Premium para usuários Free */}
        {!isPremium && (
          <PremiumBanner
            onPress={() => setShowUpgrade(true)}
            style={{ marginTop: 16 }}
          />
        )}
      </ScrollView>

      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
      />
    </SafeAreaView>
  );
}

// ─── Componente reutilizável de card de bloco ─────────────────────────────────
function BlockCard({ block, color, onStart, compact = false }) {
  return (
    <View style={[styles.blockCard, { borderColor: color + '33' }, compact && styles.blockCardCompact]}>
      <View style={styles.blockCardHeader}>
        <View style={[styles.blockIconCircle, { backgroundColor: color + '18' }]}>
          <Text style={styles.blockEmoji}>{compact ? '📦' : '📦'}</Text>
        </View>
        <View style={styles.blockCardHeaderTexts}>
          <Text style={styles.blockCardTitle}>
            {compact ? `Missão ${block.blockNumber}` : 'Próxima Missão'}
          </Text>
          <Text style={styles.blockCardSub}>
            {compact
              ? `${block.phrases.length} frases`
              : `Missão ${block.blockNumber} de ${block.totalBlocks} · ${block.phrases.length} frases`}
          </Text>
        </View>
        <View style={[styles.blockNumBadge, { backgroundColor: color }]}>
          <Text style={styles.blockNumText}>#{block.blockNumber}</Text>
        </View>
      </View>

      <View style={styles.phraseList}>
        {block.phrases.map((p, i) => (
          <View key={p.id ?? i} style={styles.phraseRow}>
            <View style={[styles.phraseNum, { backgroundColor: color }]}>
              <Text style={styles.phraseNumText}>{i + 1}</Text>
            </View>
            <View style={styles.phraseTexts}>
              <Text style={styles.phraseEn}>{p.english}</Text>
              <Text style={styles.phrasePt}>{p.portuguese}</Text>
            </View>
          </View>
        ))}
      </View>

      {!compact && (
        <View style={styles.flowRow}>
          <View style={styles.flowStep}>
            <View style={[styles.flowIconCircle, { backgroundColor: BLUE + '18' }]}>
              <Text style={styles.flowEmoji}>📖</Text>
            </View>
            <Text style={styles.flowLabel}>Treino</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color="#CBD5E1" style={styles.flowArrow} />
          <View style={styles.flowStep}>
            <View style={[styles.flowIconCircle, { backgroundColor: PURPLE + '18' }]}>
              <Text style={styles.flowEmoji}>🧪</Text>
            </View>
            <Text style={styles.flowLabel}>Teste</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color="#CBD5E1" style={styles.flowArrow} />
          <View style={styles.flowStep}>
            <View style={[styles.flowIconCircle, { backgroundColor: PURPLE + '18' }]}>
              <Text style={styles.flowEmoji}>📊</Text>
            </View>
            <Text style={styles.flowLabel}>Resultado</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.startBtn, { backgroundColor: color }]}
        onPress={onStart}
        activeOpacity={0.85}
      >
        <Ionicons name="rocket-outline" size={20} color="#FFF" />
        <Text style={styles.startBtnText}>Iniciar Missão {block.blockNumber}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Barra de XP ─────────────────────────────────────────────────────────────
function XpBar({ xpInfo, color }) {
  return (
    <View style={styles.xpBarWrap}>
      <View style={styles.xpBarTop}>
        <View style={styles.xpBarLeft}>
          <Text style={styles.xpBarLevel}>⚡ Nível {xpInfo.level}</Text>
          <Text style={styles.xpBarName}>
            {['Iniciante','Aprendiz','Praticante','Intermediário','Avançado','Especialista','Mestre','Expert','Elite','Lenda'][xpInfo.level - 1] ?? ''}
          </Text>
        </View>
        <Text style={styles.xpBarPoints}>{xpInfo.xpInLevel} / {xpInfo.xpNeeded} XP</Text>
      </View>
      <View style={styles.xpBarTrack}>
        <View style={[styles.xpBarFill, { width: `${Math.round(xpInfo.progress * 100)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

// ─── Fileira de estrelas ──────────────────────────────────────────────────────
function StarRow({ stars, size = 16 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3].map((i) => (
        <Text key={i} style={{ fontSize: size, opacity: i <= stars ? 1 : 0.25 }}>⭐</Text>
      ))}
    </View>
  );
}

// ─── Card de missão ───────────────────────────────────────────────────────────
function MissionCard({ block, info, stars, isDone, unlocked, isCurrent, color, onStart }) {
  if (!unlocked) {
    return (
      <View style={[styles.missionCard, styles.missionCardLocked]}>
        <View style={styles.missionIconLocked}>
          <Ionicons name="lock-closed" size={20} color="#94A3B8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.missionNameLocked}>Missão {block.blockNumber}</Text>
          <Text style={styles.missionSubLocked}>Complete a missão anterior para desbloquear</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.missionCard,
        isCurrent && !isDone && { borderColor: color, borderWidth: 2 },
        isDone && styles.missionCardDone,
      ]}
      onPress={onStart}
      activeOpacity={0.85}
    >
      {/* Linha conectora (exceto primeiro) */}
      {block.blockNumber > 1 && <View style={[styles.missionConnector, { backgroundColor: isDone ? PURPLE + '44' : BORDER }]} />}

      <View style={[styles.missionIconCircle, { backgroundColor: isDone ? color + '25' : color + '14' }]}>
        <Text style={{ fontSize: 22 }}>{info.emoji}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.missionName, isDone && { color: PURPLE }]}>{info.name}</Text>
        <Text style={styles.missionSub}>
          {block.conversationNumber
            ? `💬 ${block.missionGroup} · Conversa ${block.conversationNumber}/${block.totalConversations}`
            : block.dialogueMode
              ? `💬 Diálogo · ${block.phrases.length} linhas`
              : `Missão ${block.blockNumber} · ${block.phrases.length} frases`}
        </Text>
        {isDone && stars > 0 && <StarRow stars={stars} size={14} />}
      </View>

      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        {isCurrent && !isDone && (
          <View style={[styles.missionCurrentBadge, { backgroundColor: color }]}>
            <Text style={styles.missionCurrentText}>ATUAL</Text>
          </View>
        )}
        {isDone ? (
          <Ionicons name="checkmark-circle" size={24} color={color} />
        ) : (
          <Ionicons name="play-circle-outline" size={24} color={color} />
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Card de conversa ────────────────────────────────────────────────────────
function ConversationCard({ block, color, onStart }) {
  const firstA = block.dialogue.find(l => l.speaker === 'A');
  const firstB = block.dialogue.find(l => l.speaker === 'B');
  const totalLines = block.dialogue.length;
  const bCount = block.dialogue.filter(l => l.speaker === 'B').length;
  return (
    <View style={[styles.convCard, { borderColor: color + '33' }]}>
      <View style={styles.convHeader}>
        <View style={[styles.convIconCircle, { backgroundColor: color + '18' }]}>
          <Text style={styles.convEmoji}>💬</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.convTitle}>{block.focus}</Text>
          <Text style={styles.convSub}>{totalLines} falas · {bCount} sua vez</Text>
        </View>
        <View style={[styles.convLevelBadge, { backgroundColor: color + '18' }]}>
          <Text style={[styles.convLevelText, { color }]}>#{block.id}</Text>
        </View>
      </View>
      <View style={styles.convPreview}>
        {firstA && (
          <View style={styles.convLine}>
            <View style={[styles.convSpeaker, { backgroundColor: '#64748B' }]}><Text style={styles.convSpeakerText}>A</Text></View>
            <Text style={styles.convLineText} numberOfLines={1}>{firstA.en}</Text>
          </View>
        )}
        {firstB && (
          <View style={styles.convLine}>
            <View style={[styles.convSpeaker, { backgroundColor: color }]}><Text style={styles.convSpeakerText}>B</Text></View>
            <Text style={styles.convLineText} numberOfLines={1}>{firstB.en}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={[styles.convBtn, { backgroundColor: color }]} onPress={onStart} activeOpacity={0.85}>
        <Ionicons name="mic-outline" size={18} color="#FFF" />
        <Text style={styles.convBtnText}>Praticar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll:    { paddingBottom: 48 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12,
  },
  headerLeft: { gap: 4 },
  greeting: { fontSize: 15, fontWeight: '700', color: '#CCCCDD', marginTop: 2 },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: YELLOW + '22', borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 8, gap: 4,
    borderWidth: 1, borderColor: YELLOW + '44',
  },
  streakFire:  { fontSize: 16 },
  streakCount: { fontSize: 18, fontWeight: '800', color: YELLOW },

  levelBanner: {
    marginHorizontal: 20, marginBottom: 16, borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 13,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  levelBannerText: { fontSize: 14, fontWeight: '700', color: '#FFF', flex: 1 },
  levelBannerChange: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8,
  },
  levelBannerChangeText: { fontSize: 12, fontWeight: '800', color: '#FFF' },

  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  statChip: {
    flex: 1, backgroundColor: CARD, borderRadius: 14,
    paddingVertical: 13, alignItems: 'center', gap: 3,
    borderWidth: 1, borderColor: BORDER,
  },
  statNum: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  statLbl: { fontSize: 11, fontWeight: '600', color: GRAY },

  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: GRAY,
    textTransform: 'uppercase', letterSpacing: 1.5,
    marginHorizontal: 20, marginBottom: 12,
  },

  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  topicCard: {
    width: '47%', backgroundColor: CARD,
    borderRadius: 18, padding: 16,
    alignItems: 'center', gap: 8, borderWidth: 1.5,
  },
  topicIconCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  topicEmoji:       { fontSize: 26 },
  topicLabel:       { fontSize: 14, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' },
  topicBlockBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  topicBlockCount:  { fontSize: 14, fontWeight: '900', color: '#FFF' },
  topicBlockWord:   { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },

  topicHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: CARD, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: BORDER,
  },
  backTopicBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: BORDER, justifyContent: 'center', alignItems: 'center',
  },
  topicHeaderIcon:  { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  topicHeaderTitle: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
  topicHeaderSub:   { fontSize: 12, color: GRAY, fontWeight: '600', marginTop: 1 },

  emptyBox:  { marginHorizontal: 20, backgroundColor: CARD, borderRadius: 14, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: BORDER },
  emptyText: { fontSize: 14, color: GRAY, textAlign: 'center', fontWeight: '500' },

  blockCard: {
    backgroundColor: CARD, marginHorizontal: 20,
    borderRadius: 24, padding: 20, borderWidth: 1.5, borderColor: BORDER,
    gap: 18, elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 10,
  },
  blockCardCompact: { borderRadius: 18, padding: 16, gap: 12, marginBottom: 10 },
  blockCardHeader:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  blockIconCircle:      { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  blockEmoji:           { fontSize: 28 },
  blockCardHeaderTexts: { flex: 1 },
  blockCardTitle:       { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  blockCardSub:         { fontSize: 12, color: GRAY, fontWeight: '600', marginTop: 2 },
  blockNumBadge:        { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  blockNumText:         { fontSize: 13, fontWeight: '900', color: '#FFF' },

  phraseList: { gap: 8 },
  phraseRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: BG, borderRadius: 12, padding: 11 },
  phraseNum:     { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  phraseNumText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  phraseTexts:   { flex: 1, gap: 1 },
  phraseEn:      { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  phrasePt:      { fontSize: 12, color: GRAY },

  flowRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: BG, borderRadius: 14, paddingVertical: 14,
  },
  flowStep:       { alignItems: 'center', gap: 4, flex: 1 },
  flowIconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  flowEmoji:      { fontSize: 20 },
  flowLabel:      { fontSize: 11, fontWeight: '700', color: GRAY },
  flowArrow:      { marginBottom: 10 },

  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 18, paddingVertical: 16, gap: 10,
    elevation: 6, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 12,
  },
  startBtnText: { fontSize: 16, fontWeight: '900', color: '#FFF' },

  convCard: {
    backgroundColor: CARD, marginHorizontal: 20, marginBottom: 12,
    borderRadius: 20, padding: 16, borderWidth: 1.5, borderColor: BORDER, gap: 12,
  },
  convHeader:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  convIconCircle:  { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  convEmoji:       { fontSize: 24 },
  convTitle:       { fontSize: 15, fontWeight: '800', color: '#FFFFFF', textTransform: 'capitalize' },
  convSub:         { fontSize: 12, color: GRAY, marginTop: 2 },
  convLevelBadge:  { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  convLevelText:   { fontSize: 12, fontWeight: '700' },
  convPreview:     { gap: 6, backgroundColor: BG, borderRadius: 12, padding: 10 },
  convLine:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  convSpeaker:     { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  convSpeakerText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  convLineText:    { flex: 1, fontSize: 13, color: '#CCCCDD', fontWeight: '500' },
  convBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 14, paddingVertical: 12, gap: 8 },
  convBtnText:     { fontSize: 14, fontWeight: '700', color: '#FFF' },

  streakAlert: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 20, marginBottom: 14,
    backgroundColor: YELLOW + '18', borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: YELLOW + '44',
  },
  streakAlertIcon:  { fontSize: 22 },
  streakAlertTitle: { fontSize: 14, fontWeight: '800', color: YELLOW },
  streakAlertSub:   { fontSize: 12, color: YELLOW + 'CC', fontWeight: '500', marginTop: 1 },

  xpBarWrap: {
    marginHorizontal: 20, marginBottom: 14,
    backgroundColor: CARD, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: BORDER,
  },
  xpBarTop:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  xpBarLeft:   { gap: 2 },
  xpBarLevel:  { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  xpBarName:   { fontSize: 11, color: GRAY, fontWeight: '600' },
  xpBarPoints: { fontSize: 12, fontWeight: '700', color: YELLOW },
  xpBarTrack:  { height: 8, backgroundColor: BORDER, borderRadius: 4, overflow: 'hidden' },
  xpBarFill:   { height: 8, borderRadius: 4 },

  challengeToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: CARD, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: BORDER,
  },
  challengeToggleText: { flex: 1, fontSize: 13, fontWeight: '700', color: GRAY },
  toggleSwitch: {
    width: 40, height: 22, borderRadius: 11,
    backgroundColor: BORDER, justifyContent: 'center', paddingHorizontal: 2,
  },
  toggleKnob:   { width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFF', elevation: 2 },
  toggleKnobOn: { alignSelf: 'flex-end' },

  missionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 20, marginBottom: 8,
    backgroundColor: CARD, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: BORDER,
    position: 'relative',
  },
  missionCardDone:   { backgroundColor: GREEN + '11', borderColor: GREEN + '44' },
  missionCardLocked: { backgroundColor: CARD, borderColor: BORDER, opacity: 0.5 },
  missionIconCircle: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  missionIconLocked: { width: 46, height: 46, borderRadius: 23, backgroundColor: BORDER, justifyContent: 'center', alignItems: 'center' },
  missionName:       { fontSize: 15, fontWeight: '800', color: '#FFFFFF', marginBottom: 2 },
  missionNameLocked: { fontSize: 14, fontWeight: '700', color: GRAY },
  missionSub:        { fontSize: 12, color: GRAY, fontWeight: '500' },
  missionSubLocked:  { fontSize: 11, color: GRAY + '88', marginTop: 2 },
  missionConnector:  { position: 'absolute', top: -8, left: 38, width: 2, height: 10, borderRadius: 1 },
  missionCurrentBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  missionCurrentText:  { fontSize: 9, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 },
});
