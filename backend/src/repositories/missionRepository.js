// ─── Mission Repository ───────────────────────────────────────────────────────
const prisma = require('../lib/prisma');

async function findAll(level) {
  return prisma.mission.findMany({
    where: level ? { level } : undefined,
    orderBy: [{ level: 'asc' }, { order: 'asc' }],
  });
}

async function findById(id) {
  return prisma.mission.findUnique({ where: { id } });
}

async function findFirstLocked(level, afterOrder) {
  return prisma.mission.findFirst({
    where: { level, order: afterOrder, isLocked: true },
  });
}

async function unlockNext(level, order) {
  return prisma.mission.updateMany({
    where: { level, order: order + 1 },
    data:  { isLocked: false },
  });
}

async function countCompleted(level, userId) {
  return prisma.userProgress.count({
    where: {
      userId,
      completed: true,
      mission:   { level },
    },
  });
}

module.exports = { findAll, findById, findFirstLocked, unlockNext, countCompleted };
