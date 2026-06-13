// ─── User Repository ──────────────────────────────────────────────────────────
const prisma = require('../lib/prisma');

const SELECT_PUBLIC = {
  id: true, name: true, email: true,
  level: true, plan: true, xp: true, xpLevel: true,
  streak: true, lastTrainedAt: true, createdAt: true,
  subscriptionStatus: true, subscriptionExpiresAt: true,
  paymentProvider: true,
  paymentSubscriptionId: true, paymentCustomerId: true,
  googlePurchaseToken: true, googleProductId: true, googleOrderId: true,
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

async function findByPaymentSubscriptionId(preapprovalId) {
  return prisma.user.findFirst({
    where: { paymentSubscriptionId: preapprovalId },
    select: SELECT_PUBLIC,
  });
}

// Usado pelas notificações do Google Play (RTDN) para localizar o usuário
// dono de um purchaseToken.
async function findByGooglePurchaseToken(purchaseToken) {
  return prisma.user.findFirst({
    where: { googlePurchaseToken: purchaseToken },
    select: SELECT_PUBLIC,
  });
}

module.exports = {
  findById, findByEmail, create, update, findWithStats,
  findByPaymentSubscriptionId,
  findByGooglePurchaseToken,
};
