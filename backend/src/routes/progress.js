const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const {
  submitValidate, submit, getByUser,
} = require('../controllers/progressController');

router.use(auth);

// POST /progress  — submete resultado de missão
router.post('/', submitValidate, submit);

// GET /progress/:userId  — lista progresso do usuário (use 'me' para si mesmo)
router.get('/:userId', getByUser);

module.exports = router;
