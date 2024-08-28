const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

router.post('/',userAuthMiddleware, postController.createPost);

router.get('/all',userAuthMiddleware, postController.getAllPosts);

router.get('/post/:postId',userAuthMiddleware, postController.getPostById);

router.put('/:postId', userAuthMiddleware, postController.updatePost);

router.delete('/:postId', userAuthMiddleware, postController.deletePost);

router.post('/comment', userAuthMiddleware, postController.addComment);

router.delete('/comment', userAuthMiddleware, postController.deleteComment);

router.post('/like/:postId', userAuthMiddleware, postController.likePost);

router.post('/unlike/:postId', userAuthMiddleware, postController.unlikePost);

module.exports = router;
