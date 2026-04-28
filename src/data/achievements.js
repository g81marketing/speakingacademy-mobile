// Definições de conquistas e sistema de XP
// Cada conquista tem: id, icon, label, description, e uma função check(state) -> boolean

export const ACHIEVEMENTS = [
  {
    id: 'first_phrase',
    icon: '🎯',
    label: 'Primeira Frase',
    description: 'Complete seu primeiro treino',
    check: (s) => s.totalPhrasesPracticed >= 1,
  },
  {
    id: 'phrases_10',
    icon: '📚',
    label: 'Leitor Dedicado',
    description: 'Pratique 10 frases',
    check: (s) => s.totalPhrasesPracticed >= 10,
  },
  {
    id: 'phrases_50',
    icon: '🗣️',
    label: 'Falante Ativo',
    description: 'Pratique 50 frases',
    check: (s) => s.totalPhrasesPracticed >= 50,
  },
  {
    id: 'phrases_100',
    icon: '🏅',
    label: 'Centenário',
    description: 'Pratique 100 frases',
    check: (s) => s.totalPhrasesPracticed >= 100,
  },
  {
    id: 'streak_3',
    icon: '🔥',
    label: '3 Dias Seguidos',
    description: 'Treine 3 dias consecutivos',
    check: (s) => s.streak >= 3,
  },
  {
    id: 'streak_7',
    icon: '🔥🔥',
    label: 'Semana Perfeita',
    description: 'Treine 7 dias consecutivos',
    check: (s) => s.streak >= 7,
  },
  {
    id: 'streak_30',
    icon: '👑',
    label: 'Mês Completo',
    description: 'Treine 30 dias consecutivos',
    check: (s) => s.streak >= 30,
  },
  {
    id: 'perfect_score',
    icon: '⭐',
    label: 'Quase Perfeito',
    description: 'Obtenha nota 90+ em um treino',
    check: (s) => s.bestScore >= 90,
  },
  {
    id: 'perfect_100',
    icon: '💎',
    label: 'Perfeccionista',
    description: 'Obtenha nota 100 em um treino',
    check: (s) => s.bestScore >= 100,
  },
  {
    id: 'day_10',
    icon: '📅',
    label: 'Dez Dias',
    description: 'Chegue ao Dia 10 do plano',
    check: (s) => s.currentDay >= 10,
  },
  {
    id: 'day_30',
    icon: '🏆',
    label: 'Trilha Concluída',
    description: 'Conclua os 30 dias do plano iniciante',
    check: (s) => s.completedDays.length >= 30,
  },
  {
    id: 'xp_100',
    icon: '⚡',
    label: 'Energizado',
    description: 'Acumule 100 XP',
    check: (s) => s.xp >= 100,
  },
  {
    id: 'xp_500',
    icon: '💥',
    label: 'Poderoso',
    description: 'Acumule 500 XP',
    check: (s) => s.xp >= 500,
  },
  {
    id: 'xp_1000',
    icon: '🌟',
    label: 'Lenda',
    description: 'Acumule 1000 XP',
    check: (s) => s.xp >= 1000,
  },
];

// Limiares de XP para cada nível de experiência (1–10)
export const XP_THRESHOLDS = [
  0,     // Nível 1
  100,   // Nível 2
  250,   // Nível 3
  500,   // Nível 4
  1000,  // Nível 5
  2000,  // Nível 6
  3500,  // Nível 7
  5500,  // Nível 8
  8000,  // Nível 9
  12000, // Nível 10
];

export const XP_LEVEL_NAMES = [
  'Iniciante',    // 1
  'Aprendiz',     // 2
  'Praticante',   // 3
  'Intermediário', // 4
  'Avançado',     // 5
  'Especialista', // 6
  'Mestre',       // 7
  'Expert',       // 8
  'Elite',        // 9
  'Lenda',        // 10
];

// Retorna o nível XP (1-based) para uma quantidade de XP
export const getXpLevel = (xp) => {
  let level = 1;
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return Math.min(level, XP_THRESHOLDS.length);
};

// Retorna XP necessário para o próximo nível, e XP atual dentro do nível
export const getXpProgress = (xp) => {
  const level = getXpLevel(xp);
  const currentFloor = XP_THRESHOLDS[level - 1] ?? 0;
  const nextFloor = XP_THRESHOLDS[level] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
  const xpInLevel = xp - currentFloor;
  const xpNeeded = nextFloor - currentFloor;
  const progress = level >= XP_THRESHOLDS.length ? 1 : xpInLevel / xpNeeded;
  return { level, xpInLevel, xpNeeded, progress: Math.min(progress, 1), isMaxLevel: level >= XP_THRESHOLDS.length };
};

// Calcula XP ganho por uma sessão de treino
// score: 0-100 | isRepeat: boolean
export const calcXpGained = (score, isRepeat = false) => {
  if (isRepeat) return 5;
  let xp = 10; // base
  if (score >= 90) xp += 10; // bônus excelente
  else if (score >= 70) xp += 5; // bônus bom
  return xp;
};

// Retorna classificação textual do score
export const getScoreRating = (score) => {
  if (score >= 90) return { label: 'Excelente! 🌟', color: '#16A34A', emoji: '🏆' };
  if (score >= 70) return { label: 'Muito bom! 👏', color: '#2563EB', emoji: '⭐' };
  if (score >= 50) return { label: 'Ok, continue!', color: '#D97706', emoji: '💪' };
  return { label: 'Tente novamente', color: '#DC2626', emoji: '🔄' };
};
