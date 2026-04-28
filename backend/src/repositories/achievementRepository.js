// ─── Achievement Repository ───────────────────────────────────────────────────
const prisma = require('../lib/prisma');

async function findAll() {
  return prisma.achievement.findMany({ orderBy: { key: 'asc' } });
}

async function findByKey(key) {
  return prisma.achievement.findUnique({ where: { key } });
}

async function findUserAchievements(userId) {
  return prisma.userAchievement.findMany({
    where:   { userId },
    include: { achievement: true },
    orderBy: { unlockedAt: 'desc' },
  });
}

async function hasAchievement(userId, achievementId) {
  const row = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId } },
  });
  return !!row;
}

async function unlock(userId, achievementId) {
  return prisma.userAchievement.upsert({
    where:  { userId_achievementId: { userId, achievementId } },
    create: { userId, achievementId },
    update: {},
    include: { achievement: true },
  });
}

module.exports = { findAll, findByKey, findUserAchievements, hasAchievement, unlock };
