// ⚠️ DEPRECATED — Use o novo seed Prisma: npm run db:seed
// Arquivo: backend/prisma/seed.js
// Este arquivo era para MongoDB e não é mais utilizado.

/**
 * Seed script ANTIGO — importa os 100 blocos de treino para o MongoDB.
 * Executar com: npm run seed
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Block    = require('./models/Block');
const blocks   = require('../../src/data/trainingBlocks.json');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB conectado');

  // Mapear id → blockId para o schema
  const docs = blocks.map((b) => ({
    blockId:   b.id,
    level:     b.level,
    type:      b.type,
    focus:     b.focus,
    sentences: b.sentences.map((s) => ({ en: s.en, pt: s.pt })),
  }));

  // Inserir ou atualizar cada bloco (upsert por blockId)
  let inserted = 0, updated = 0;
  for (const doc of docs) {
    const result = await Block.updateOne(
      { blockId: doc.blockId },
      { $set: doc },
      { upsert: true }
    );
    if (result.upsertedCount) inserted++;
    else updated++;
  }

  console.log(`📦 Seed concluído: ${inserted} inseridos, ${updated} atualizados.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err.message);
  process.exit(1);
});
