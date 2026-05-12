// ─── ROTA: /speech ────────────────────────────────────────────────────────────
// Proxy para o Whisper da OpenAI. A chave fica segura no servidor.
const express = require('express');
const multer  = require('multer');
const auth    = require('../middleware/auth');
const speechController = require('../controllers/speechController');

// Áudio em memória (limite de 10 MB) — não persiste em disco
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = express.Router();
router.post('/evaluate',  auth, upload.single('audio'), speechController.evaluate);
router.post('/translate', auth, express.json(), speechController.translate);

module.exports = router;
