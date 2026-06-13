// ─── requirePremium middleware ────────────────────────────────────────────────
// Use depois de `auth` para proteger rotas que exigem plano premium ativo.
// Ex: router.post('/speech/translate', auth, requirePremium, controller.translate)
const userRepo = require('../repositories/userRepository');

module.exports = async function requirePremium(req, res, next) {
  try {
    if (!req.userId) return res.status(401).json({ error: 'Não autenticado.' });
    const user = await userRepo.findById(req.userId);
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado.' });

    const expired =
      user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < new Date();

    if (user.plan !== 'premium' || user.subscriptionStatus !== 'active' || expired) {
      return res.status(403).json({
        error: 'Recurso exclusivo para assinantes Premium.',
        code: 'PREMIUM_REQUIRED',
      });
    }
    next();
  } catch (err) { next(err); }
};
