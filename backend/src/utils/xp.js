// ─── XP & Gamification Helpers ────────────────────────────────────────────────

// Thresholds de XP para cada nível (índice = nível)
const XP_LEVELS = [
  0,    // nível 1
  100,  // nível 2
  250,  // nível 3
  500,  // nível 4
  900,  // nível 5
  1400, // nível 6
  2000, // nível 7
  2800, // nível 8
  3800, // nível 9
  5000, // nível 10
];

/**
 * Calcula quantas estrelas (1–3) com base no score
 */
function calcStars(score) {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}

/**
 * Calcula XP ganho por missão concluída
 * @param {number} baseXp  - xpReward da missão
 * @param {number} stars   - estrelas obtidas
 */
function calcXpGained(baseXp, stars) {
  const bonuses = { 1: 0, 2: 5, 3: 15 };
  return baseXp + (bonuses[stars] ?? 0);
}

/**
 * Retorna o nível (1-based) para um valor total de XP
 */
function calcXpLevel(totalXp) {
  let level = 1;
  for (let i = 1; i < XP_LEVELS.length; i++) {
    if (totalXp >= XP_LEVELS[i]) level = i + 1;
    else break;
  }
  return level;
}

/**
 * Retorna XP necessário para o próximo nível (ou null se já no máximo)
 */
function xpForNextLevel(currentXpLevel) {
  const nextThreshold = XP_LEVELS[currentXpLevel]; // índice = currentXpLevel (0-based next)
  return nextThreshold ?? null;
}

/**
 * Verifica se o streak deve ser incrementado ou zerado.
 * @param {Date|null} lastTrainedAt
 * @param {number}    currentStreak
 * @returns {{ newStreak: number, shouldRecord: boolean }}
 */
function calcStreak(lastTrainedAt, currentStreak) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!lastTrainedAt) {
    return { newStreak: 1, shouldRecord: true };
  }

  const last = new Date(lastTrainedAt);
  last.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Já treinou hoje – não altera streak
    return { newStreak: currentStreak, shouldRecord: false };
  }
  if (diffDays === 1) {
    // Dia consecutivo – incrementa
    return { newStreak: currentStreak + 1, shouldRecord: true };
  }
  // Pulou pelo menos um dia – reseta
  return { newStreak: 1, shouldRecord: true };
}

module.exports = { calcStars, calcXpGained, calcXpLevel, xpForNextLevel, calcStreak, XP_LEVELS };
