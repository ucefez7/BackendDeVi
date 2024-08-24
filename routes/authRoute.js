const express = require('express');
const { login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login',authMiddleware, login);

module.exports = router;
