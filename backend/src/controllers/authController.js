// ─── Auth Controller ──────────────────────────────────────────────────────────
const { z }      = require('zod');
const authService = require('../services/authService');
const validate    = require('../middleware/validate');

// ── Schemas Zod ───────────────────────────────────────────────────────────────
const registerSchema = z.object({
  name:     z.string().min(2,  'Nome deve ter pelo menos 2 caracteres.'),
  email:    z.string().email('E-mail inválido.'),
  password: z.string().min(6,  'Senha deve ter pelo menos 6 caracteres.'),
  level:    z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

const loginSchema = z.object({
  email:    z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'Senha obrigatória.'),
});

// ── POST /auth/register ───────────────────────────────────────────────────────
exports.registerValidate = validate(registerSchema);
exports.register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

// ── POST /auth/login ──────────────────────────────────────────────────────────
exports.loginValidate = validate(loginSchema);
exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) { next(err); }
};
