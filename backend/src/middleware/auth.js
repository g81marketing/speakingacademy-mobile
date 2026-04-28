const { verifyToken } = require('../utils/jwt');

/**
 * Middleware que verifica o JWT enviado no header Authorization.
 * Injeta req.userId (= token.sub) para uso nos controllers.
 */
module.exports = function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Token não fornecido.' });

  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};
