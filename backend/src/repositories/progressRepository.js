// ─── Progress Repository ──────────────────────────────────────────────────────
const prisma = require('../lib/prisma');

async function findByUser(userId) {
  return prisma.userProgress.findMany({
    where: { userId },
    include: { mission: true },
    orderBy: [{ mission: { level: 'asc' } }, { mission: { order: 'asc' } }],
  });
}

async function findOne(userId, missionId) {
  return prisma.userProgress.findUnique({
    where: { userId_missionId: { userId, missionId } },
  });
}

async function upsert(userId, missionId, data) {
  return prisma.userProgress.upsert({
    where: { userId_missionId: { userId, missionId } },
    create: { userId, missionId, ...data },
    update: data,
  });
}

async function countCompletedByLevel(userId, level) {
  return prisma.userProgress.count({
    where: { userId, completed: true, mission: { level } },
  });
}

module.exports = { findByUser, findOne, upsert, countCompletedByLevel };
