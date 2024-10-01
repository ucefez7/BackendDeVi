const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

// Post-related routes
router.post('/posts/create-post', userAuthMiddleware, postController.createPost);
router.get('/posts/all',userAuthMiddleware, postController.getAllPosts);
router.get('/posts/:postId',userAuthMiddleware, postController.getPostById);
router.put('/posts/:postId', userAuthMiddleware, postController.updatePost);
router.delete('/posts/:postId', userAuthMiddleware, postController.deletePost);
router.get('/posts/user/:userId',userAuthMiddleware, postController.getPostsByUser);
router.get('/posts/category/:category',userAuthMiddleware, postController.getPostsByCategory);

// Comment and like/unlike routes
router.post('/posts/comment', userAuthMiddleware, postController.addComment);
router.delete('/posts/comment', userAuthMiddleware, postController.deleteComment);
router.post('/posts/like/:postId', userAuthMiddleware, postController.likePost);
router.post('/posts/unlike/:postId', userAuthMiddleware, postController.unlikePost);


// Save/Remove Saved Post routes
router.post('/posts/save/:postId', userAuthMiddleware, postController.savePost);
router.delete('/posts/save/:postId', userAuthMiddleware, postController.removeSavedPost);
router.post('/posts/saved', userAuthMiddleware, postController.getSavedPosts);
// router.post('/posts/saved/:postId',userAuthMiddleware, postController.getSavedPost);


//Report
router.post('/posts/report/:postId', userAuthMiddleware, postController.reportPost);
router.delete('/posts/report/:postId', userAuthMiddleware, postController.unreportPost);
router.post('/posts/reported-posts', userAuthMiddleware, postController.getReportedPosts);


// Routes for Not Interested functionality
router.post('/posts/not-interested/:postId', userAuthMiddleware, postController.markAsNotInterested);
router.post('/posts/not-interested', userAuthMiddleware, postController.getNotInterestedPosts);
router.delete('/posts/not-interested/:postId', userAuthMiddleware, postController.removeNotInterested);

//Archieve posts
router.post('/archive/:postId',userAuthMiddleware, postController.archivePost);
router.post('/unarchive/:postId', userAuthMiddleware, postController.unarchivePost);
router.get('/archived', userAuthMiddleware, postController.getArchivedPosts);
router.get('/archived/:postId', userAuthMiddleware, postController.getArchivedPostById);


//Pin a post
router.post('/posts/pin/:postId', userAuthMiddleware, postController.pinPost);
router.post('/posts/unpin/:postId', userAuthMiddleware, postController.unpinPost);

module.exports = router;
