// ─── User Repository ──────────────────────────────────────────────────────────
const prisma = require('../lib/prisma');

const SELECT_PUBLIC = {
  id: true, name: true, email: true,
  level: true, plan: true, xp: true, xpLevel: true,
  streak: true, lastTrainedAt: true, createdAt: true,
};

async function findById(id) {
  return prisma.user.findUnique({ where: { id }, select: SELECT_PUBLIC });
}

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function create(data) {
  return prisma.user.create({ data, select: SELECT_PUBLIC });
}

async function update(id, data) {
  return prisma.user.update({ where: { id }, data, select: SELECT_PUBLIC });
}

async function findWithStats(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      ...SELECT_PUBLIC,
      _count: {
        select: {
          progress:       { where: { completed: true } },
          practiceResults: true,
          achievements:   true,
        },
      },
    },
  });
}

module.exports = { findById, findByEmail, create, update, findWithStats };
