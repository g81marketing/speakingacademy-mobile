// ─── Streak Repository ────────────────────────────────────────────────────────
const prisma = require('../lib/prisma');

async function recordDay(userId, date) {
  return prisma.streakHistory.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, completed: true },
    update: { completed: true },
  });
}

async function findHistory(userId, { limit = 30 } = {}) {
  return prisma.streakHistory.findMany({
    where:   { userId },
    orderBy: { date: 'desc' },
    take:    limit,
  });
}

async function countConsecutive(userId) {
  const history = await prisma.streakHistory.findMany({
    where:   { userId, completed: true },
    orderBy: { date: 'desc' },
  });

  if (!history.length) return 0;

  let streak = 1;
  for (let i = 1; i < history.length; i++) {
    const prev    = new Date(history[i - 1].date);
    const current = new Date(history[i].date);
    const diffMs  = prev - current;
    const diffDay = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDay === 1) streak++;
    else break;
  }
  return streak;
}

module.exports = { recordDay, findHistory, countConsecutive };
