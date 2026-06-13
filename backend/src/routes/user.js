// ─── User Routes ──────────────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const {
  getProfile,
  updateValidate, updateProfile,
} = require('../controllers/userController');

router.use(auth);

// GET /user/profile — perfil completo com XP, streak, conquistas
router.get('/profile', getProfile);

// PATCH /user/profile — atualiza name e/ou level
router.patch('/profile', updateValidate, updateProfile);

// NOTA: O upgrade de plano agora é feito via /subscription/checkout → webhook do MP.
// Não existe mais endpoint para alterar o plano manualmente (segurança).

module.exports = router;
