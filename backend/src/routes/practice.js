// ─── Practice Routes ──────────────────────────────────────────────────────────
const express  = require('express');
const router   = express.Router();
const auth     = require('../middleware/auth');
const { recordValidate, record, history } = require('../controllers/practiceController');

router.use(auth);

// POST /practice  — registra resultado de uma prática
router.post('/', recordValidate, record);

// GET /practice/history?limit=20&offset=0
router.get('/history', history);

module.exports = router;
