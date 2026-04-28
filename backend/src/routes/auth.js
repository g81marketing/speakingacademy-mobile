const express = require('express');
const router  = express.Router();
const {
  registerValidate, register,
  loginValidate,    login,
} = require('../controllers/authController');

// POST /auth/register
router.post('/register', registerValidate, register);

// POST /auth/login
router.post('/login', loginValidate, login);

module.exports = router;
