// ⚠️  DEPRECATED — substituído pelo Prisma schema em prisma/schema.prisma
// Este arquivo não é mais utilizado na v2 da API.
// Consulte: backend/prisma/schema.prisma > model User
throw new Error('User model MongoDB foi removido. Use Prisma (src/repositories/userRepository.js).');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'basic', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    xp: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastTrainedDate: {
      type: String, // formato 'YYYY-MM-DD'
      default: null,
    },
    currentBlock: {
      type: Number,
      default: 1,
    },
    completedBlocks: {
      type: [Number],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
