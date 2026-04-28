// ─── MISSÕES: nomes, emojis, sistema de estrelas e mensagens motivacionais ────

export const MISSION_NAMES = {
  1:  { name: 'Primeiros Passos',       emoji: '🌱', level: 'beginner' },
  2:  { name: 'Me Apresentando',        emoji: '👋', level: 'beginner' },
  3:  { name: 'Rotina Diária',          emoji: '☀️', level: 'beginner' },
  4:  { name: 'Família e Amigos',       emoji: '👨‍👩‍👧', level: 'beginner' },
  5:  { name: 'Perguntas Básicas',      emoji: '❓', level: 'beginner' },
  6:  { name: 'Iniciante: Fase Final',  emoji: '🎯', level: 'beginner' },
  7:  { name: 'No Escritório',          emoji: '💼', level: 'basic' },
  8:  { name: 'Reuniões',               emoji: '🗓️', level: 'basic' },
  9:  { name: 'E-mails',               emoji: '📧', level: 'basic' },
  10: { name: 'Negação e Confirmação',  emoji: '✅', level: 'basic' },
  11: { name: 'Pedindo Ajuda',          emoji: '🙏', level: 'basic' },
  12: { name: 'Situações do Dia a Dia', emoji: '🏙️', level: 'basic' },
  13: { name: 'Conversas Naturais',     emoji: '💬', level: 'basic' },
  14: { name: 'Básico: Fase Final',     emoji: '🏅', level: 'basic' },
  15: { name: 'Argumentando',           emoji: '🎤', level: 'advanced' },
  16: { name: 'Ambiente Profissional',  emoji: '👔', level: 'advanced' },
  17: { name: 'Apresentações',          emoji: '📊', level: 'advanced' },
  18: { name: 'Negociações',            emoji: '🤝', level: 'advanced' },
  19: { name: 'Liderança',              emoji: '👑', level: 'advanced' },
  20: { name: 'Conflitos e Soluções',   emoji: '⚖️', level: 'advanced' },
  21: { name: 'Fluência em Ação',       emoji: '🚀', level: 'advanced' },
  22: { name: 'Mestre do Inglês',       emoji: '🏆', level: 'advanced' },
};

// Retorna nome/emoji/level de uma missão
export function getMissionInfo(blockNumber) {
  return MISSION_NAMES[blockNumber] ?? {
    name: `Missão ${blockNumber}`,
    emoji: '📦',
    level: 'beginner',
  };
}

// Calcula 1–3 estrelas a partir do score médio
export function getStarsForScore(avgScore) {
  if (avgScore >= 85) return 3;
  if (avgScore >= 60) return 2;
  return 1;
}

// Retorna se a missão está desbloqueada
// Missão 1 sempre desbloqueada; as demais requerem a anterior concluída
export function isMissionUnlocked(blockNumber, completedMissions = []) {
  if (blockNumber <= 1) return true;
  return completedMissions.includes(blockNumber - 1);
}

// Mensagens motivacionais por número de estrelas
const MOTIVATIONAL = {
  3: [
    '🌟 Incrível! Pronúncia de nativo!',
    '🏆 Perfeito! Você dominou esta missão!',
    '🚀 Isso é fluência! Continue assim!',
    '💎 Excelente! 3 estrelas conquistadas!',
  ],
  2: [
    '👍 Muito bem! Está quase perfeito!',
    '📈 Ótimo progresso! Pratique mais uma vez.',
    '💪 Você está melhorando a cada treino!',
    '⭐ Bom trabalho! Repita para 3 estrelas.',
  ],
  1: [
    '💪 Continue praticando — você vai melhorar!',
    '🎯 Não desista! Cada tentativa te deixa mais forte.',
    '🔄 Revise e volte para conquistar mais estrelas!',
    '📚 Ouça mais vezes e tente novamente!',
  ],
};

export function getMotivationalMessage(stars) {
  const msgs = MOTIVATIONAL[stars] ?? MOTIVATIONAL[1];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

// Dicas de revisão baseadas em erros comuns
export const REVIEW_TIPS = [
  'Tente dividir a frase em partes menores e pratique cada trecho.',
  'Ouça o modelo 3 vezes antes de gravar.',
  'Foque no ritmo, não na perfeição de cada palavra.',
  'Grave em um ambiente mais silencioso.',
  'Imite a entonação do falante nativo.',
];

export function getReviewTip() {
  return REVIEW_TIPS[Math.floor(Math.random() * REVIEW_TIPS.length)];
}
