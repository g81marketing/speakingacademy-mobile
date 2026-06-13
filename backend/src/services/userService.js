// ─── User Service ─────────────────────────────────────────────────────────────
const userRepo        = require('../repositories/userRepository');
const achievementRepo = require('../repositories/achievementRepository');
const streakRepo      = require('../repositories/streakRepository');
const { calcXpLevel, XP_LEVELS } = require('../utils/xp');

class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

async function getProfile(userId) {
  const user = await userRepo.findWithStats(userId);
  if (!user) throw new AppError('Usuário não encontrado.', 404);

  const achievements  = await achievementRepo.findUserAchievements(userId);
  const streakHistory = await streakRepo.findHistory(userId, { limit: 7 });

  const currentLevel = user.xpLevel ?? 1;
  const nextThreshold = XP_LEVELS[currentLevel] ?? null;
  const prevThreshold = XP_LEVELS[currentLevel - 1] ?? 0;
  const xpProgress = nextThreshold
    ? Math.round(((user.xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100)
    : 100;

  return {
    ...user,
    xpProgress,
    nextLevelXp:  nextThreshold,
    achievements,
    streakHistory,
  };
}

async function updateProfile(userId, { name, level }) {
  const data = {};
  if (name)  data.name  = name;
  if (level) data.level = level;

  if (!Object.keys(data).length) throw new AppError('Nenhum campo para atualizar.');

  return userRepo.update(userId, data);
}

module.exports = { getProfile, updateProfile };
