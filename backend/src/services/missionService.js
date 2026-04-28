// ─── Mission Service ──────────────────────────────────────────────────────────
const missionRepo  = require('../repositories/missionRepository');
const progressRepo = require('../repositories/progressRepository');

class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

async function listMissions(userId, level) {
  const missions  = await missionRepo.findAll(level);
  const progress  = await progressRepo.findByUser(userId);
  const progressMap = Object.fromEntries(progress.map(p => [p.missionId, p]));

  return missions.map(m => ({
    ...m,
    progress: progressMap[m.id] ?? null,
  }));
}

async function getMission(id, userId) {
  const mission = await missionRepo.findById(id);
  if (!mission) throw new AppError('Missão não encontrada.', 404);

  const progress = await progressRepo.findOne(userId, id);
  return { ...mission, progress: progress ?? null };
}

module.exports = { listMissions, getMission };
