const express = require('express');
//const { login } = require('../controllers/adminController');
const {login}= require('../controllers/adminController/adminController')
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/login', login);
// router.post('/login',authMiddleware, login);

module.exports = router;
