require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const rateLimit    = require('express-rate-limit');
const prisma       = require('./lib/prisma');
const errorHandler = require('./middleware/errorHandler');

// ── Rotas ─────────────────────────────────────────────────────────────────────
const authRoutes     = require('./routes/auth');
const missionRoutes  = require('./routes/missions');
const progressRoutes = require('./routes/progress');
const practiceRoutes = require('./routes/practice');
const userRoutes     = require('./routes/user');
const speechRoutes   = require('./routes/speech');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em alguns minutos.' },
});

// ── Middlewares globais ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Speaking Academy API v2 🎙️', db: 'PostgreSQL' });
});

// ── Rotas da aplicação ────────────────────────────────────────────────────────
app.use('/auth',     authRoutes);
app.use('/missions', missionRoutes);
app.use('/progress', progressRoutes);
app.use('/practice', practiceRoutes);
app.use('/user',     userRoutes);
app.use('/speech',   speechRoutes);

// ── Error handler global ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Inicialização ─────────────────────────────────────────────────────────────
async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL conectado via Prisma');
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error('❌ Falha ao conectar no banco:', err.message);
    process.exit(1);
  }
}

bootstrap();
