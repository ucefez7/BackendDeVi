const express = require('express');
const { sendFollowRequest, acceptFollowRequest, declineFollowRequest, unfollowUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Import your authentication middleware if needed

const router = express.Router();

router.post('/follow/:id', authMiddleware, sendFollowRequest);
router.post('/accept-follow/:id', authMiddleware, acceptFollowRequest);
router.post('/decline-follow/:id', authMiddleware, declineFollowRequest);
router.post('/unfollow/:id', authMiddleware, unfollowUser);

module.exports = router;