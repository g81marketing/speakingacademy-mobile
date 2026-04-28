// ⚠️ DEPRECATED — substituído pelo Prisma schema: model UserProgress + PracticeResult
// Consulte: backend/prisma/schema.prisma
module.exports = null;

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blockId: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    // Detalhe das frases avaliadas neste bloco
    sentences: [
      {
        en:           { type: String },
        transcript:   { type: String },
        score:        { type: Number },
      },
    ],
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Índice composto para buscas rápidas por usuário
progressSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('Progress', progressSchema);
