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
router.post('/users', createOrLoginUser);           // POST /api/users
router.get('/users', getUsers);                     // GET /api/users
router.get('/users/search', searchUsersByName);     // GET /api/users/search
router.get('/users/:id', getUserById);              // GET /api/users/:id
router.put('/users/:id', updateUser);               // PUT /api/users/:id
router.delete('/users/:id', deleteUser);            // DELETE /api/users/:id

// Network-related routes
router.post('/users/follow/:id', userAuthMiddleware, sendFollowRequest);         // POST /api/users/follow/:id
router.post('/users/accept-follow/:id', userAuthMiddleware, acceptFollowRequest); // POST /api/users/accept-follow/:id
router.post('/users/decline-follow/:id', userAuthMiddleware, declineFollowRequest); // POST /api/users/decline-follow/:id
router.post('/users/unfollow/:id', userAuthMiddleware, unfollowUser);             // POST /api/users/unfollow/:id

// Follow requests
router.post('/users/follow-requests-received', userAuthMiddleware, getFollowRequestsReceived); // POST /api/users/follow-requests-received
router.post('/users/follow-requests-sent', userAuthMiddleware, getFollowRequestsSent);         // POST /api/users/follow-requests-sent

module.exports = router;
