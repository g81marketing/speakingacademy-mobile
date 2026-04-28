// ─── Auth Service ─────────────────────────────────────────────────────────────
const bcrypt     = require('bcryptjs');
const userRepo   = require('../repositories/userRepository');
const { signToken } = require('../utils/jwt');

class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

async function register({ name, email, password, level = 'beginner' }) {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new AppError('E-mail já cadastrado.', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await userRepo.create({ name, email, passwordHash, level });

  const token = signToken({ sub: user.id, email: user.email });
  return { user, token };
}

async function login({ email, password }) {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new AppError('Credenciais inválidas.', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError('Credenciais inválidas.', 401);

  // Remove passwordHash before returning
  const { passwordHash, ...publicUser } = user;

  const token = signToken({ sub: user.id, email: user.email });
  return { user: publicUser, token };
}

module.exports = { register, login };
