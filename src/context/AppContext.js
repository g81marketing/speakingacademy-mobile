import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLevelForDay, getPhaseForDay } from '../data/phrases';
import { ACHIEVEMENTS, calcXpGained, getXpProgress } from '../data/achievements';
import { getStarsForScore } from '../data/missions';
import * as apiService from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const STORAGE_PREFIX = '@speaking_academy_v4';
// Chave do storage varia por usuário — evita que o progresso de um seja visto por outro
const keyForUser = (userId) => (userId ? `${STORAGE_PREFIX}_${userId}` : `${STORAGE_PREFIX}_guest`);

const defaultState = {
  userName: 'Estudante',
  plan: 'Free',

  // ── Progresso ────────────────────────────────────────────────
  streak: 0,
  lastTrainedDate: null,
  totalPhrasesPracticed: 0,
  bestScore: 0,
  currentDay: 1,           // dia atual no plano (1–110)
  completedDays: [],        // dias já concluídos
  levelProgress: {
    beginner: 0,
    basic: 0,
    intermediate: 0,
    advanced: 0,
  },

  // ── XP & Conquistas ──────────────────────────────────────────
  xp: 0,
  achievements: [],         // IDs das conquistas desbloqueadas

  // ── Missão Diária ────────────────────────────────────────────
  dailyMission: { completed: false, date: null },

  // ── Gamificação ────────────────────────────
  missionStars: {},         // { blockNumber: 1|2|3 }
  completedMissions: [],    // [blockNumber, ...]

  // ── Preferências ────────────────────────────────────────────
  currentCategory: 'work',
  challengeMode: false,     // Modo Desafio (avançado)
  userSelectedLevel: null,  // null = não escolheu ainda | 'beginner'|'intermediate'|'advanced'
  ttsSpeed: 'normal',       // 'slow' | 'normal' | 'fast'

  // ── Onboarding ───────────────────────────────────────────────
  onboardingComplete: false,
  userGoal: null,           // 'trabalho' | 'viagem' | 'iniciante' | 'conversacao'
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [state, setState] = useState(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  // Conquistas recém-desbloqueadas para mostrar toast
  const [newAchievements, setNewAchievements] = useState([]);

  // Carrega estado sempre que o usuário muda (login/logout)
  useEffect(() => {
    let cancelled = false;
    // Só reseta isLoaded se ainda não carregou antes (evita crash no login)
    const needsInitialLoad = !isLoaded;
    if (needsInitialLoad) setIsLoaded(false);

    const load = async () => {
      try {
        const userKey  = keyForUser(userId);
        const guestKey = keyForUser(null);
        let stored = await AsyncStorage.getItem(userKey);

        // Se acabou de fazer login (userId existe) e não tem dados próprios,
        // migra o estado do guest (onboarding já concluído) para a chave do usuário
        if (!stored && userId) {
          const guestStored = await AsyncStorage.getItem(guestKey);
          if (guestStored) {
            stored = guestStored;
            await AsyncStorage.setItem(userKey, guestStored);
            await AsyncStorage.removeItem(guestKey);
          }
        }

        if (cancelled) return;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.userSelectedLevel && parsed.onboardingComplete === undefined) {
            parsed.onboardingComplete = true;
          }
          setState({ ...defaultState, ...parsed });
        } else {
          // Novo usuário: reseta para o estado padrão
          setState(defaultState);
        }
      } catch (e) {
        console.log('Erro ao carregar dados:', e);
        setState(defaultState);
      } finally {
        if (!cancelled && needsInitialLoad) setIsLoaded(true);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [userId]);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(keyForUser(userId), JSON.stringify(state)).catch((e) =>
        console.log('Erro ao salvar dados:', e)
      );
    }
  }, [state, isLoaded, userId]);

  // Verifica se alguma conquista nova foi desbloqueada e retorna as novas
  const checkAchievements = (nextState) => {
    const locked = ACHIEVEMENTS.filter((a) => !nextState.achievements.includes(a.id));
    const unlocked = locked.filter((a) => a.check(nextState));
    return unlocked;
  };

  // Chamado ao concluir uma frase do plano ou da biblioteca
  // score: 0-100, day: número do dia do plano (null para biblioteca), isRepeat: boolean
  const completePhrase = (level, day = null, score = 0, isRepeat = false) => {
    let unlockedAchievements = [];

    setState((prev) => {
      const today = new Date().toDateString();
      const lastDate = prev.lastTrainedDate;

      // ── Streak ───────────────────────────────────────────────
      let newStreak = prev.streak;
      if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        newStreak = lastDate === yesterday.toDateString()
          ? prev.streak + 1
          : 1;
      }

      // ── Dias concluídos ───────────────────────────────────────
      const completedDays = day != null && !prev.completedDays.includes(day)
        ? [...prev.completedDays, day]
        : prev.completedDays;

      // ── XP ───────────────────────────────────────────────────
      const xpGained = calcXpGained(score, isRepeat);
      const newXp = prev.xp + xpGained;

      // ── Missão Diária ─────────────────────────────────────────
      const dailyMission = prev.dailyMission.date === today
        ? prev.dailyMission
        : { completed: true, date: today };

      // ── Melhor Nota ───────────────────────────────────────────
      const bestScore = Math.max(prev.bestScore, score);

      const nextState = {
        ...prev,
        totalPhrasesPracticed: prev.totalPhrasesPracticed + 1,
        lastTrainedDate: today,
        streak: newStreak,
        completedDays,
        xp: newXp,
        bestScore,
        dailyMission,
        levelProgress: {
          ...prev.levelProgress,
          [level]: (prev.levelProgress[level] || 0) + 1,
        },
      };

      // ── Conquistas ───────────────────────────────────────────
      const newlyUnlocked = checkAchievements({ ...nextState, streak: newStreak });
      if (newlyUnlocked.length > 0) {
        const newIds = newlyUnlocked.map((a) => a.id);
        unlockedAchievements = newlyUnlocked;
        nextState.achievements = [...prev.achievements, ...newIds];
      }

      return nextState;
    });

    // Expõe as conquistas desbloqueadas para a UI mostrar toast
    if (unlockedAchievements.length > 0) {
      setNewAchievements(unlockedAchievements);
    }

    return { xpGained: calcXpGained(score, isRepeat) };
  };

  // Limpa o array de novas conquistas após exibição do toast
  const clearNewAchievements = () => setNewAchievements([]);

  // Avança para o próximo dia do plano
  const advanceDay = () => {
    setState((prev) => ({
      ...prev,
      currentDay: Math.min(prev.currentDay + 1, 110),
    }));
  };

  // Vai direto para um dia específico
  const goToDay = (day) => {
    setState((prev) => ({ ...prev, currentDay: day }));
  };

  const updateProfile = (name) => {
    setState((prev) => ({ ...prev, userName: name }));
  };

  const setCategory = (category) => {
    setState((prev) => ({ ...prev, currentCategory: category }));
  };

  const toggleChallengeMode = () => {
    setState((prev) => ({ ...prev, challengeMode: !prev.challengeMode }));
  };

  // Registra conclusão de missão e atualiza estrelas (retorna stars: 1|2|3)
  const completeMission = (blockNumber, avgScore) => {
    const stars = getStarsForScore(avgScore);
    setState((prev) => {
      const existing = prev.missionStars[blockNumber] ?? 0;
      const newStars = Math.max(existing, stars);
      const completed = prev.completedMissions.includes(blockNumber)
        ? prev.completedMissions
        : [...prev.completedMissions, blockNumber];
      return {
        ...prev,
        missionStars: { ...prev.missionStars, [blockNumber]: newStars },
        completedMissions: completed,
      };
    });

    // Sync ao backend (fire-and-forget — não bloqueia a UX)
    apiService.saveProgress(String(blockNumber), avgScore)
      .catch(() => { /* falha silenciosa, progresso local já salvo */ });

    return stars;
  };

  // Define o nível escolhido pelo aluno na tela de seleção
  const setUserLevel = (level) => {
    setState((prev) => ({ ...prev, userSelectedLevel: level }));
  };

  const setTtsSpeed = (speed) => {
    setState((prev) => ({ ...prev, ttsSpeed: speed }));
  };

  const completeOnboarding = () => {
    setState((prev) => ({ ...prev, onboardingComplete: true }));
  };

  const resetOnboarding = () => {
    setState((prev) => ({ ...prev, onboardingComplete: false }));
  };

  const setUserGoal = (goal) => {
    setState((prev) => ({ ...prev, userGoal: goal }));
  };

  // Valores computados
  const currentLevel = getLevelForDay(state.currentDay);
  const currentPhase = getPhaseForDay(state.currentDay);
  const xpInfo = getXpProgress(state.xp);
  const isDailyMissionDone = state.dailyMission.date === new Date().toDateString();

  return (
    <AppContext.Provider
      value={{
        ...state,
        isLoaded,
        currentLevel,
        currentPhase,
        xpInfo,
        isDailyMissionDone,
        newAchievements,
        completePhrase,
        clearNewAchievements,
        advanceDay,
        goToDay,
        updateProfile,
        setCategory,
        toggleChallengeMode,
        setUserLevel,
        setTtsSpeed,
        completeMission,
        completeOnboarding,
        resetOnboarding,
        setUserGoal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
