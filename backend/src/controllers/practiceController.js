// ─── Practice Controller ──────────────────────────────────────────────────────
const { z }          = require('zod');
const practiceService = require('../services/practiceService');
const validate        = require('../middleware/validate');

// ── Schema de validação ───────────────────────────────────────────────────────
const practiceSchema = z.object({
  missionId:  z.string().uuid().optional().nullable(),
  phrase:     z.string().min(1, 'Frase obrigatória.'),
  userAnswer: z.string().min(1, 'Resposta do usuário obrigatória.'),
  score:      z.number().int().min(0).max(100),
});

// ── POST /practice ────────────────────────────────────────────────────────────
exports.recordValidate = validate(practiceSchema);
exports.record = async (req, res, next) => {
  try {
    const result = await practiceService.recordPractice(req.userId, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

// ── GET /practice/history ─────────────────────────────────────────────────────
exports.history = async (req, res, next) => {
  try {
    const limit  = parseInt(req.query.limit  ?? '20', 10);
    const offset = parseInt(req.query.offset ?? '0',  10);
    const data   = await practiceService.getHistory(req.userId, { limit, offset });
    res.json(data);
  } catch (err) { next(err); }
};
