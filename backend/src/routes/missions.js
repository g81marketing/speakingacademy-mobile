// ─── Mission Routes ───────────────────────────────────────────────────────────
const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth');
const { list, getOne } = require('../controllers/missionController');

// Todas as rotas requerem autenticação
router.use(auth);

// GET /missions?level=beginner
router.get('/', list);

// GET /missions/:id
router.get('/:id', getOne);

module.exports = router;
