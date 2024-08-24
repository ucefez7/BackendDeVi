const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to create a new post
router.post('/', userController.createPost);

router.get('/all', userController.getAllPosts);

router.get('/user/:userId', userController.getPostsByUserId);

module.exports = router;
