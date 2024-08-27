const express = require('express');
const {
  getUsers,
  getUserById,
  createOrLoginUser,
  updateUser,
  deleteUser,
  searchUsersByName,
} = require('../controllers/userController');
const {
  sendFollowRequest,
  acceptFollowRequest,
  declineFollowRequest,
  unfollowUser,
  getFollowRequestsReceived,
  getFollowRequestsSent,
} = require('../controllers/networkController');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

const router = express.Router();

// User-related routes
router.post('/', createOrLoginUser);
router.get('/', getUsers);
router.get('/search', searchUsersByName);
router.get('/:id', getUserById);
// router.put('/:id', userAuthMiddleware, updateUser);
router.put('/:id', updateUser);
router.delete('/:id', userAuthMiddleware, deleteUser);



// Network-related routes (from networkController)

router.post('/follow/:id', userAuthMiddleware, sendFollowRequest);
router.post('/accept-follow/:id', userAuthMiddleware, acceptFollowRequest);
router.post('/decline-follow/:id', userAuthMiddleware, declineFollowRequest);
router.post('/unfollow/:id', userAuthMiddleware, unfollowUser);


// New routes for follow requests

router.post('/follow-requests-received', userAuthMiddleware, getFollowRequestsReceived);
router.post('/follow-requests-sent', userAuthMiddleware, getFollowRequestsSent);

module.exports = router;
