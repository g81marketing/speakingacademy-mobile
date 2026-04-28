// ─── Mission Controller ───────────────────────────────────────────────────────
const missionService = require('../services/missionService');

// ── GET /missions ─────────────────────────────────────────────────────────────
exports.list = async (req, res, next) => {
  try {
    const level = req.query.level ?? undefined;
    const missions = await missionService.listMissions(req.userId, level);
    res.json({ missions });
  } catch (err) { next(err); }
};

// ── GET /missions/:id ─────────────────────────────────────────────────────────
exports.getOne = async (req, res, next) => {
  try {
    const mission = await missionService.getMission(req.params.id, req.userId);
    res.json({ mission });
  } catch (err) { next(err); }
};
