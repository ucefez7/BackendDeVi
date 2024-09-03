const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

// Post-related routes
router.post('/posts/create-post', userAuthMiddleware, postController.createPost);
router.get('/posts/all', userAuthMiddleware, postController.getAllPosts);
router.get('/posts/:postId', userAuthMiddleware, postController.getPostById);
router.put('/posts/:postId', userAuthMiddleware, postController.updatePost);
router.delete('/posts/:postId', userAuthMiddleware, postController.deletePost);

// Comment and like/unlike routes
router.post('/posts/comment', userAuthMiddleware, postController.addComment);
router.delete('/posts/comment', userAuthMiddleware, postController.deleteComment);
router.post('/posts/like/:postId', userAuthMiddleware, postController.likePost);
router.post('/posts/unlike/:postId', userAuthMiddleware, postController.unlikePost);

module.exports = router;
