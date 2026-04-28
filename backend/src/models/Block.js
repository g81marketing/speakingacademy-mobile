// ⚠️ DEPRECATED — substituído pelo Prisma schema: model Mission
// Consulte: backend/prisma/schema.prisma
module.exports = null;

const sentenceSchema = new mongoose.Schema(
  {
    en: { type: String, required: true },
    pt: { type: String, required: true },
  },
  { _id: false }
);

const blockSchema = new mongoose.Schema(
  {
    blockId: {
      type: Number,
      required: true,
      unique: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'basic', 'intermediate', 'advanced'],
      required: true,
    },
    type: {
      type: String,
      enum: ['word', 'sentence', 'expansion', 'review', 'negative', 'question', 'real', 'fluency'],
      required: true,
    },
    focus: {
      type: String,
      required: true,
    },
    sentences: {
      type: [sentenceSchema],
      validate: {
        validator: (v) => v.length === 5,
        message: 'Cada bloco deve ter exatamente 5 frases.',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Block', blockSchema);
