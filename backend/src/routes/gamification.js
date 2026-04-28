// ⚠️ DEPRECATED — XP/streak/achievements são processados automaticamente em POST /progress
const express = require('express');
const router  = express.Router();
module.exports = router;
const {
  addXp,
  getStreak,
  updateStreak,
  getAchievements,
} = require('../controllers/gamificationController');

router.use(auth);

// POST /gamification/xp — adiciona XP ao usuário
router.post('/xp', addXp);

// GET /gamification/streak — retorna streak atual
router.get('/streak', getStreak);

// POST /gamification/streak/update — atualiza streak ao iniciar treino
router.post('/streak/update', updateStreak);

// GET /gamification/achievements — lista conquistas
router.get('/achievements', getAchievements);

module.exports = router;
