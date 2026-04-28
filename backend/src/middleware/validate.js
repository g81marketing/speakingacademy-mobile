// ─── Zod Validation Middleware ────────────────────────────────────────────────
const { ZodError } = require('zod');

/**
 * Retorna um middleware Express que valida req.body contra um schema Zod.
 * Em caso de erro, responde 422 com lista de problemas detalhada.
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map(e => ({
          field:   e.path.join('.'),
          message: e.message,
        }));
        return res.status(422).json({ error: 'Dados inválidos.', details: errors });
      }
      next(err);
    }
  };
}

module.exports = validate;
