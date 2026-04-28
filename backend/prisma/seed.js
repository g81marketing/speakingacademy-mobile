// ─── Prisma Seed – Speaking Academy ───────────────────────────────────────────
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MISSIONS = [
  // ── Beginner ────────────────────────────────────────────────────────────────
  { title: 'Apresentação Básica',        level: 'beginner',     order: 1,  xpReward: 10, isLocked: false },
  { title: 'Cumprimentos do Dia a Dia',  level: 'beginner',     order: 2,  xpReward: 10 },
  { title: 'Números e Contagem',         level: 'beginner',     order: 3,  xpReward: 10 },
  { title: 'Cores e Formas',             level: 'beginner',     order: 4,  xpReward: 15 },
  { title: 'Família e Relações',         level: 'beginner',     order: 5,  xpReward: 15 },
  // ── Intermediate ────────────────────────────────────────────────────────────
  { title: 'No Trabalho',                level: 'intermediate', order: 1,  xpReward: 20, isLocked: false },
  { title: 'Reuniões em Inglês',         level: 'intermediate', order: 2,  xpReward: 20 },
  { title: 'E-mails Profissionais',      level: 'intermediate', order: 3,  xpReward: 25 },
  { title: 'Negociações',                level: 'intermediate', order: 4,  xpReward: 25 },
  { title: 'Viagens e Hotéis',           level: 'intermediate', order: 5,  xpReward: 20 },
  // ── Advanced ────────────────────────────────────────────────────────────────
  { title: 'Debates e Opiniões',         level: 'advanced',     order: 1,  xpReward: 30, isLocked: false },
  { title: 'Apresentações Executivas',   level: 'advanced',     order: 2,  xpReward: 35 },
  { title: 'Linguagem Idiomática',       level: 'advanced',     order: 3,  xpReward: 35 },
  { title: 'Entrevistas de Emprego',     level: 'advanced',     order: 4,  xpReward: 40 },
  { title: 'Conversas Técnicas',         level: 'advanced',     order: 5,  xpReward: 40 },
];

const ACHIEVEMENTS = [
  { key: 'first_mission',  title: 'Primeira Missão!',      description: 'Completou sua primeira missão.',          icon: '🎯', xpBonus: 20  },
  { key: 'streak_3',       title: 'Trio Perfeito',         description: '3 dias consecutivos de prática.',         icon: '🔥', xpBonus: 30  },
  { key: 'streak_7',       title: 'Uma Semana Forte',      description: '7 dias consecutivos de prática.',         icon: '💪', xpBonus: 70  },
  { key: 'streak_30',      title: 'Mês Campeão',           description: '30 dias consecutivos de prática.',        icon: '🏆', xpBonus: 300 },
  { key: 'perfect_score',  title: 'Pronúncia Perfeita',    description: 'Pontuação 100 em uma missão.',            icon: '⭐', xpBonus: 50  },
  { key: 'level_up',       title: 'Subiu de Nível!',       description: 'Atingiu o próximo nível de XP.',          icon: '🚀', xpBonus: 25  },
  { key: 'beginner_done',  title: 'Iniciante Completo',    description: 'Concluiu todas as missões iniciante.',    icon: '🌱', xpBonus: 100 },
  { key: 'inter_done',     title: 'Intermediário Completo',description: 'Concluiu todas as missões intermediário.',icon: '⚡', xpBonus: 200 },
  { key: 'advanced_done',  title: 'Mestre do Speaking',    description: 'Concluiu todas as missões avançado.',     icon: '👑', xpBonus: 500 },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Missions
  for (const m of MISSIONS) {
    await prisma.mission.upsert({
      where: { level_order: { level: m.level, order: m.order } },
      update: { title: m.title, xpReward: m.xpReward },
      create: { ...m, isLocked: m.isLocked ?? true },
    });
  }
  console.log(`✅ ${MISSIONS.length} missions seeded`);

  // Achievements
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: { title: a.title, description: a.description, icon: a.icon, xpBonus: a.xpBonus },
      create: a,
    });
  }
  console.log(`✅ ${ACHIEVEMENTS.length} achievements seeded`);

  console.log('🎉 Seed concluído!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
