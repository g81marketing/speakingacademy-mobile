// ─── User Routes ──────────────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const {
  getProfile,
  updateValidate, updateProfile,
  updatePlanValidate, updatePlan,
} = require('../controllers/userController');

router.use(auth);

// GET /user/profile — perfil completo com XP, streak, conquistas
router.get('/profile', getProfile);

// PATCH /user/profile — atualiza name e/ou level
router.patch('/profile', updateValidate, updateProfile);

// PATCH /user/plan — atualiza plano (free | premium)
router.patch('/plan', updatePlanValidate, updatePlan);

module.exports = router;
