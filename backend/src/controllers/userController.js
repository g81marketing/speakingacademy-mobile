// ─── User Controller ──────────────────────────────────────────────────────
const { z }      = require('zod');
const userService = require('../services/userService');
const validate    = require('../middleware/validate');

const updateSchema = z.object({
  name:  z.string().min(2).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
}).refine(d => d.name || d.level, { message: 'Informe ao menos name ou level.' });

// ── GET /user/profile ─────────────────────────────────────────────────────
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req.userId);
    res.json({ profile });
  } catch (err) { next(err); }
};

// ── PATCH /user/profile ───────────────────────────────────────────────────
exports.updateValidate = validate(updateSchema);
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.userId, req.body);
    res.json({ user });
  } catch (err) { next(err); }
};
