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
const userRoutes         = require('./routes/user');
const speechRoutes       = require('./routes/speech');
const subscriptionRoutes = require('./routes/subscription');

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
app.use('/auth',         authRoutes);
app.use('/missions',     missionRoutes);
app.use('/progress',     progressRoutes);
app.use('/practice',     practiceRoutes);
app.use('/user',         userRoutes);
app.use('/speech',       speechRoutes);
app.use('/subscription', subscriptionRoutes);

// Página simples de retorno após o checkout do MP (back_url)
app.get('/subscription/return', (req, res) => {
  res.send(`
    <html><head><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Pagamento recebido</title></head>
    <body style="font-family:sans-serif;background:#0A0815;color:#fff;text-align:center;padding:40px">
      <h1>✅ Tudo certo!</h1>
      <p>Volte para o app Speaking Academy para acessar seus recursos premium.</p>
    </body></html>
  `);
});

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
