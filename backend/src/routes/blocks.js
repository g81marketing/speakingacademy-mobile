// ⚠️ DEPRECATED — Use /missions (src/routes/missions.js)
const express = require('express');
const router  = express.Router();
module.exports = router;
const { getBlocks, getBlockById, getNextBlock } = require('../controllers/blockController');

router.use(auth);

// GET /blocks?level=beginner&type=word&focus=work&page=1&limit=20
router.get('/', getBlocks);

// GET /blocks/next — próximo bloco do usuário autenticado
router.get('/next', getNextBlock);

// GET /blocks/:id — bloco por blockId numérico
router.get('/:id', getBlockById);

module.exports = router;
