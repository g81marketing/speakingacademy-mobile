// ─── Progress Service ─────────────────────────────────────────────────────────
const progressRepo    = require('../repositories/progressRepository');
const missionRepo     = require('../repositories/missionRepository');
const userRepo        = require('../repositories/userRepository');
const achievementRepo = require('../repositories/achievementRepository');
const streakRepo      = require('../repositories/streakRepository');
const { calcStars, calcXpGained, calcXpLevel, calcStreak } = require('../utils/xp');

const PASS_SCORE = 70; // score mínimo para concluir missão

class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

async function submitProgress(userId, missionId, score) {
  const mission = await missionRepo.findById(missionId);
  if (!mission) throw new AppError('Missão não encontrada.', 404);
  if (mission.isLocked) throw new AppError('Missão bloqueada.', 403);

  const existing = await progressRepo.findOne(userId, missionId);
  const attempts = (existing?.attempts ?? 0) + 1;
  const stars     = calcStars(score);
  const completed = score >= PASS_SCORE;
  const now       = new Date();

  // Mantém maior score histórico
  const bestScore = Math.max(score, existing?.score ?? 0);
  const bestStars = Math.max(stars, existing?.stars ?? 0);

  const progress = await progressRepo.upsert(userId, missionId, {
    completed,
    score:         bestScore,
    stars:         bestStars,
    attempts,
    lastAttemptAt: now,
    completedAt:   completed && !existing?.completedAt ? now : existing?.completedAt,
  });

  const newlyUnlocked = [];
  let xpGained = 0;
  const newAchievements = [];

  if (completed) {
    // Desbloqueia próxima missão do mesmo nível
    await missionRepo.unlockNext(mission.level, mission.order);

    // XP ganho
    xpGained = calcXpGained(mission.xpReward, bestStars);

    // Atualiza streak
    const user = await userRepo.findById(userId);
    const { newStreak, shouldRecord } = calcStreak(user.lastTrainedAt, user.streak);

    if (shouldRecord) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      await streakRepo.recordDay(userId, today);
    }

    // Calcula novo nível de XP
    const newTotalXp  = (user.xp ?? 0) + xpGained;
    const newXpLevel  = calcXpLevel(newTotalXp);
    const leveledUp   = newXpLevel > (user.xpLevel ?? 1);

    await userRepo.update(userId, {
      xp:            newTotalXp,
      xpLevel:       newXpLevel,
      streak:        newStreak,
      lastTrainedAt: new Date(),
    });

    // ── Verifica conquistas ───────────────────────────────────────────────────
    const checks = [
      { key: 'first_mission',  condition: attempts === 1 && completed },
      { key: 'perfect_score',  condition: score === 100 },
      { key: 'streak_3',       condition: newStreak >= 3 },
      { key: 'streak_7',       condition: newStreak >= 7 },
      { key: 'streak_30',      condition: newStreak >= 30 },
      { key: 'level_up',       condition: leveledUp },
    ];

    for (const { key, condition } of checks) {
      if (!condition) continue;
      const ach = await achievementRepo.findByKey(key);
      if (!ach) continue;
      const already = await achievementRepo.hasAchievement(userId, ach.id);
      if (already) continue;
      const unlocked = await achievementRepo.unlock(userId, ach.id);
      newAchievements.push(unlocked.achievement);
      // Aplica bônus de XP da conquista
      if (ach.xpBonus > 0) {
        await userRepo.update(userId, { xp: { increment: ach.xpBonus } });
      }
    }

    // Verifica conclusão completa de nível
    const totalInLevel = (await missionRepo.findAll(mission.level)).length;
    const doneInLevel  = await progressRepo.countCompletedByLevel(userId, mission.level);

    if (doneInLevel >= totalInLevel) {
      const levelKeys = { beginner: 'beginner_done', intermediate: 'inter_done', advanced: 'advanced_done' };
      const levelKey  = levelKeys[mission.level];
      if (levelKey) {
        const ach = await achievementRepo.findByKey(levelKey);
        if (ach) {
          const already = await achievementRepo.hasAchievement(userId, ach.id);
          if (!already) {
            const unlocked = await achievementRepo.unlock(userId, ach.id);
            newAchievements.push(unlocked.achievement);
          }
        }
      }
    }
  }

  return { progress, xpGained, newAchievements };
}

async function getUserProgress(userId) {
  return progressRepo.findByUser(userId);
}

module.exports = { submitProgress, getUserProgress };
