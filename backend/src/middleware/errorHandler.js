// ─── Global Error Handler ─────────────────────────────────────────────────────

module.exports = function errorHandler(err, req, res, next) {
  const status  = err.status ?? 500;
  const message = err.message ?? 'Erro interno no servidor.';

  if (status === 500) {
    console.error('[ERROR]', err);
  }

  res.status(status).json({ error: message });
};
