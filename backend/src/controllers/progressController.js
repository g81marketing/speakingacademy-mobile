// ─── Progress Controller ──────────────────────────────────────────────────────
const { z }           = require('zod');
const progressService  = require('../services/progressService');
const validate         = require('../middleware/validate');

// ── Schema de validação ───────────────────────────────────────────────────────
const submitSchema = z.object({
  missionId: z.string().uuid('missionId inválido.'),
  score:     z.number().int().min(0).max(100),
});

// ── POST /progress ────────────────────────────────────────────────────────────
exports.submitValidate = validate(submitSchema);
exports.submit = async (req, res, next) => {
  try {
    const { missionId, score } = req.body;
    const result = await progressService.submitProgress(req.userId, missionId, score);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

// ── GET /progress/:userId ─────────────────────────────────────────────────────
exports.getByUser = async (req, res, next) => {
  try {
    // Permite admin ver progresso de outro usuário; usuário comum só vê o próprio
    const targetId = req.params.userId === 'me' ? req.userId : req.params.userId;
    const progress = await progressService.getUserProgress(targetId);
    res.json({ progress });
  } catch (err) { next(err); }
};
