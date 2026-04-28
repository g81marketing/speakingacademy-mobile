// ─── Practice Service ─────────────────────────────────────────────────────────
const practiceRepo = require('../repositories/practiceRepository');
const missionRepo  = require('../repositories/missionRepository');

class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

/**
 * Feedback simples baseado em score (sem chamada externa a Whisper)
 * O app mobile faz a transcrição e envia score + userAnswer prontos.
 */
function buildFeedback(score) {
  if (score >= 90) return 'Pronúncia excelente! Continue assim.';
  if (score >= 70) return 'Muito bom! Foque na entonação para melhorar ainda mais.';
  if (score >= 50) return 'Bom esforço! Tente dividir a frase e praticar por partes.';
  return 'Continue praticando. Ouça o áudio várias vezes antes de gravar.';
}

async function recordPractice(userId, { missionId, phrase, userAnswer, score }) {
  if (missionId) {
    const mission = await missionRepo.findById(missionId);
    if (!mission) throw new AppError('Missão não encontrada.', 404);
  }

  const feedback = buildFeedback(score);

  const result = await practiceRepo.create({
    userId,
    missionId: missionId ?? null,
    phrase,
    userAnswer,
    score,
    feedback,
  });

  return { result, feedback };
}

async function getHistory(userId, options) {
  const [results, stats] = await Promise.all([
    practiceRepo.findByUser(userId, options),
    practiceRepo.avgScoreByUser(userId),
  ]);
  return { results, stats };
}

module.exports = { recordPractice, getHistory };
