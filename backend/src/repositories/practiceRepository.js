// ─── Practice Repository ──────────────────────────────────────────────────────
const prisma = require('../lib/prisma');

async function create(data) {
  return prisma.practiceResult.create({ data });
}

async function findByUser(userId, { limit = 20, offset = 0 } = {}) {
  return prisma.practiceResult.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: { mission: { select: { title: true, level: true } } },
  });
}

async function avgScoreByUser(userId) {
  const result = await prisma.practiceResult.aggregate({
    where: { userId },
    _avg: { score: true },
    _count: { id: true },
  });
  return { avgScore: Math.round(result._avg.score ?? 0), total: result._count.id };
}

async function countToday(userId) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return prisma.practiceResult.count({
    where: { userId, createdAt: { gte: start } },
  });
}

module.exports = { create, findByUser, avgScoreByUser, countToday };
