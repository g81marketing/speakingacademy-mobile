import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { ACHIEVEMENTS, XP_LEVEL_NAMES } from '../data/achievements';
import ProgressBar from '../components/ProgressBar';
import { PURPLE, PINK, YELLOW, GREEN, BG, CARD, BORDER, GRAY } from '../theme/colors';

const BLUE = PURPLE;

const LEVEL_LABELS_UI = {
  beginner:     '🌱 Iniciante',
  intermediate: '🚀 Intermediário',
  advanced:     '🎯 Avançado',
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {
    userName, streak, totalPhrasesPracticed,
    xp, xpInfo, achievements, currentDay, completedDays,
    challengeMode, toggleChallengeMode, updateProfile,
    userSelectedLevel, resetOnboarding,
  } = useApp();
  const { logout, user, isPremium, updatePlan } = useAuth();
  // Plano vindo do backend: 'free' | 'premium' → rótulo capitalizado
  const plan = isPremium ? 'Premium' : 'Free';
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = () => {
    if (isPremium) {
      Alert.alert('Premium ativo', 'Você já tem acesso a todos os recursos premium. 🎉');
      return;
    }
    Alert.alert(
      '✨ Upgrade para Premium',
      'Desbloqueie:\n\n• Níveis Intermediário e Avançado\n• Modo Speak AI (tradutor + tutor de pronúncia)\n• Todas as categorias e relatórios\n\nDeseja ativar agora?',
      [
        { text: 'Agora não', style: 'cancel' },
        {
          text: 'Ativar Premium',
          onPress: async () => {
            try {
              setUpgrading(true);
              await updatePlan('premium');
              Alert.alert('🎉 Bem-vindo ao Premium!', 'Todos os recursos foram desbloqueados.');
            } catch (e) {
              Alert.alert('Erro', e.message || 'Não foi possível atualizar o plano.');
            } finally {
              setUpgrading(false);
            }
          },
        },
      ],
    );
  };
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        }},
      ]
    );
  };
  const xpLevelName = XP_LEVEL_NAMES[(xpInfo?.level ?? 1) - 1] ?? 'Iniciante';

  // Salva o novo nome e sai do modo de edição
  const handleSave = () => {
    const trimmed = tempName.trim();
    if (trimmed.length > 0) {
      updateProfile(trimmed);
    } else {
      setTempName(userName); // Reverte se vazio
    }
    setEditing(false);
  };

  // Inicia edição sincronizando o campo com o nome atual
  const handleEdit = () => {
    setTempName(userName);
    setEditing(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Cabeçalho ── */}
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        {/* ── Card do usuário ── */}
        <View style={styles.profileCard}>
          {/* Avatar com inicial do nome */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>

          {/* Nome editável */}
          {editing ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.nameInput}
                value={tempName}
                onChangeText={setTempName}
                autoFocus
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <Ionicons name="checkmark" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEditing(false)}
                style={styles.cancelBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.nameRow} onPress={handleEdit}>
              <Text style={styles.userName}>{userName}</Text>
              <Ionicons name="pencil-outline" size={17} color="#94A3B8" />
            </TouchableOpacity>
          )}

          {/* Badge do plano */}
          <View style={[styles.planBadge, plan === 'Premium' && styles.planBadgePremium]}>
            <Ionicons
              name={plan === 'Premium' ? 'star' : 'star-outline'}
              size={14}
              color={plan === 'Premium' ? PURPLE : GRAY}
            />
            <Text style={[styles.planText, plan === 'Premium' && styles.planTextPremium]}>
              Plano {plan}
            </Text>
          </View>
        </View>

        {/* ── Card de XP ── */}
        <View style={styles.xpCard}>
          <View style={styles.xpTop}>
            <View>
              <Text style={styles.xpLevelName}>⚡ {xpLevelName}</Text>
              <Text style={styles.xpLevelNum}>Nível {xpInfo?.level ?? 1} · {xp} XP total</Text>
            </View>
            <Text style={styles.xpLevelBadge}>Nível {xpInfo?.level ?? 1}</Text>
          </View>
          <ProgressBar progress={xpInfo?.progress ?? 0} color={PURPLE} height={8} />
          <Text style={styles.xpSub}>
            {xpInfo?.isMaxLevel ? '🏆 Nível máximo!' : `+${(xpInfo?.xpNeeded ?? 100) - (xpInfo?.xpInLevel ?? 0)} XP para o próximo nível`}
          </Text>
        </View>

        {/* ── Estatísticas resumidas ── */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>📝</Text>
            <Text style={styles.statValue}>{totalPhrasesPracticed}</Text>
            <Text style={styles.statLabel}>Frases</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🏅</Text>
            <Text style={styles.statValue}>{achievements.length}/{ACHIEVEMENTS.length}</Text>
            <Text style={styles.statLabel}>Conquistas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>📅</Text>
            <Text style={styles.statValue}>{completedDays.length}</Text>
            <Text style={styles.statLabel}>Dias</Text>
          </View>
        </View>

        {/* ── Nível atual + trocar ── */}
        <View style={styles.levelCard}>
          <View style={styles.levelCardLeft}>
            <Text style={styles.levelCardIcon}>
              {userSelectedLevel === 'beginner' ? '🌱' : userSelectedLevel === 'intermediate' ? '🚀' : '🎯'}
            </Text>
            <View>
              <Text style={styles.levelCardLabel}>Trilha atual</Text>
              <Text style={styles.levelCardValue}>
                {LEVEL_LABELS_UI[userSelectedLevel] ?? 'Não definido'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.levelChangeBtn}
            onPress={() => navigation.navigate('LevelSelection')}
          >
            <Ionicons name="swap-horizontal-outline" size={16} color="#FFF" />
            <Text style={styles.levelChangeBtnText}>Trocar</Text>
          </TouchableOpacity>
        </View>

        {/* ── Menu de opções ── */}
        <View style={styles.menuCard}>
          {/* Modo Desafio toggle */}
          <View style={[styles.menuItem, styles.menuItemToggle]}>
            <View style={[styles.menuIcon, { backgroundColor: PURPLE + '22' }]}>
              <Ionicons name="timer-outline" size={20} color={PURPLE} />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={styles.menuLabel}>Modo Desafio</Text>
              <Text style={styles.menuDesc}>Tempo limitado para nível Avançado</Text>
            </View>
            <Switch
              value={challengeMode}
              onValueChange={toggleChallengeMode}
              trackColor={{ false: BORDER, true: PURPLE }}
              thumbColor="#FFFFFF"
            />
          </View>

          <MenuItem
            icon={isPremium ? 'star' : 'diamond-outline'}
            label={isPremium ? 'Premium ativo ✨' : (upgrading ? 'Ativando...' : 'Upgrade para Premium')}
            description={isPremium
              ? 'Você tem acesso a todos os recursos'
              : 'Desbloqueia Speak AI, Intermediário e Avançado'}
            blue
            onPress={handleUpgrade}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notificações"
            description="Lembretes diários de prática"
            onPress={() =>
              Alert.alert(
                '🔔 Notificações',
                'Ative os lembretes para praticar inglês todos os dias e manter seu streak!'
              )
            }
          />
          <MenuItem
            icon="refresh-circle-outline"
            label="Resetar progresso"
            description="Apaga todo o seu histórico"
            danger
            onPress={() =>
              Alert.alert(
                'Resetar progresso',
                'Tem certeza? Todo o seu histórico será apagado.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Resetar',
                    style: 'destructive',
                    onPress: () => Alert.alert('Progresso resetado!'),
                  },
                ]
              )
            }
          />
          <MenuItem
            icon="play-circle-outline"
            label="Ver introdução"
            description="Rever o tutorial do app do início"
            onPress={() => {
              resetOnboarding();
              navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
            }}
          />
          <MenuItem
            icon="information-circle-outline"
            label="Sobre o app"
            description="Speaking Academy v2.0 · Gamificado"
            onPress={() =>
              Alert.alert(
                'Speaking Academy',
                'Versão 2.0\nInglês Automático\n\nPlano de 110 dias, XP, Conquistas e Modo Desafio.'
              )
            }
          />
          <MenuItem
            icon="log-out-outline"
            label="Sair da conta"
            description="Deslogar e voltar para a tela de login"
            danger
            last
            onPress={handleLogout}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Componente de item de menu ────────────────────────────────────────────────
function MenuItem({ icon, label, description, onPress, blue, danger, last }) {
  const labelColor = blue ? PURPLE : danger ? '#FF4D4D' : '#FFFFFF';
  const iconColor   = blue ? PURPLE : danger ? '#FF4D4D' : '#888899';

  return (
    <TouchableOpacity
      style={[styles.menuItem, last && styles.menuItemLast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, blue && styles.menuIconBlue, danger && styles.menuIconRed]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.menuTextBlock}>
        <Text style={[styles.menuLabel, { color: labelColor }]}>{label}</Text>
        {description && <Text style={styles.menuDesc}>{description}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={17} color="#444455" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll:    { paddingBottom: 40 },
  header:    { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14 },
  title:     { fontSize: 26, fontWeight: '800', color: '#FFFFFF' },

  profileCard: {
    backgroundColor: CARD, marginHorizontal: 20,
    borderRadius: 22, padding: 28, alignItems: 'center',
    marginBottom: 16, gap: 12,
    borderWidth: 1, borderColor: BORDER,
  },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: PURPLE,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: PURPLE, shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 6 }, shadowRadius: 16, elevation: 8,
  },
  avatarText:  { fontSize: 34, fontWeight: '800', color: '#FFFFFF' },
  nameRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userName:    { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  editRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nameInput: {
    fontSize: 18, fontWeight: '700', color: '#FFFFFF',
    borderBottomWidth: 2, borderBottomColor: PURPLE,
    paddingVertical: 4, paddingHorizontal: 4, minWidth: 150,
  },
  saveBtn: {
    backgroundColor: PURPLE, borderRadius: 10,
    width: 38, height: 38, justifyContent: 'center', alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: BORDER, borderRadius: 10,
    width: 38, height: 38, justifyContent: 'center', alignItems: 'center',
  },
  planBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: BORDER, borderRadius: 22,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  planBadgePremium: { backgroundColor: YELLOW + '22' },
  planText:        { fontSize: 13, fontWeight: '700', color: GRAY },
  planTextPremium: { color: YELLOW },

  levelCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: CARD, marginHorizontal: 20, marginBottom: 16,
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER,
  },
  levelCardLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelCardIcon:  { fontSize: 28 },
  levelCardLabel: { fontSize: 11, color: GRAY, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  levelCardValue: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  levelChangeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: PURPLE, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
    shadowColor: PURPLE, shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 5,
  },
  levelChangeBtnText: { fontSize: 13, fontWeight: '800', color: '#FFF' },

  xpCard: {
    backgroundColor: PURPLE + '22', marginHorizontal: 20,
    borderRadius: 18, padding: 18, marginBottom: 16, gap: 8,
    borderWidth: 1, borderColor: PURPLE + '44',
  },
  xpTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  xpLevelName: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  xpLevelNum:  { fontSize: 11, color: GRAY, fontWeight: '500', marginTop: 2 },
  xpLevelBadge: {
    backgroundColor: PURPLE, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 5,
    fontSize: 13, fontWeight: '800', color: '#FFF',
  },
  xpSub: { fontSize: 11, color: GRAY, fontWeight: '600', marginTop: 2 },

  statsRow: {
    flexDirection: 'row', backgroundColor: CARD,
    marginHorizontal: 20, borderRadius: 18, paddingVertical: 18, marginBottom: 20,
    borderWidth: 1, borderColor: BORDER,
  },
  statItem:   { flex: 1, alignItems: 'center', gap: 4 },
  statEmoji:  { fontSize: 20 },
  statValue:  { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  statLabel:  { fontSize: 12, color: GRAY, fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: BORDER, marginVertical: 8 },

  menuCard: {
    backgroundColor: CARD, marginHorizontal: 20,
    borderRadius: 18, overflow: 'hidden',
    borderWidth: 1, borderColor: BORDER,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: BORDER, gap: 14,
  },
  menuItemToggle: { borderBottomWidth: 1, borderBottomColor: BORDER },
  menuItemLast:   { borderBottomWidth: 0 },
  menuIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: BORDER,
    justifyContent: 'center', alignItems: 'center',
  },
  menuIconBlue: { backgroundColor: PURPLE + '22' },
  menuIconRed:  { backgroundColor: '#FF4D4D22' },
  menuTextBlock: { flex: 1 },
  menuLabel:    { fontSize: 15, fontWeight: '700' },
  menuDesc:     { fontSize: 12, color: GRAY, marginTop: 2, fontWeight: '400' },
});
