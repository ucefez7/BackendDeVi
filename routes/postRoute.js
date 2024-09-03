const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

// Post-related routes
router.post('/posts/create-post', userAuthMiddleware, postController.createPost);
router.get('/posts/all', postController.getAllPosts);
router.get('/posts/:postId', postController.getPostById);
router.put('/posts/:postId', userAuthMiddleware, postController.updatePost);
router.delete('/posts/:postId', userAuthMiddleware, postController.deletePost);

// Comment and like/unlike routes
router.post('/posts/comment', userAuthMiddleware, postController.addComment);
router.delete('/posts/comment', userAuthMiddleware, postController.deleteComment);
router.post('/posts/like/:postId', userAuthMiddleware, postController.likePost);
router.post('/posts/unlike/:postId', userAuthMiddleware, postController.unlikePost);


// Save/Remove Saved Post routes
router.post('/posts/save/:postId', userAuthMiddleware, postController.savePost);
router.delete('/posts/save/:postId', userAuthMiddleware, postController.removeSavedPost);
router.get('/posts/saved', ()=>{
    console.log("evde ok ann, data verind");
});
// router.get('/posts/saved', userAuthMiddleware, postController.getSavedPosts);

module.exports = router;
