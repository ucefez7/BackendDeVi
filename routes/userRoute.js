const express = require('express');
const {
  loginUser,
  signupUser,
  getUsers,
  getUserById,
  //createOrLoginUser,
  updateUser,
  deleteUser,
  searchUsersByName,
  signoutUser,
  getRelationshipStatus,
  getUserRelations,
  getUserNotifications
} = require('../controllers/userController');
const {
  sendFollowRequest,
  acceptFollowRequest,
  declineFollowRequest,
  unfollowUser,
  getFollowRequestsReceived,
  getFollowRequestsSent,
  getFollowers
} = require('../controllers/networkController');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

const router = express.Router();

// User-related routes
router.post('/users/login', loginUser);      // POST /api/users/login
router.post('/users/signup', signupUser);    // POST /api/users/signup
router.get('/users',userAuthMiddleware, getUsers);                     // GET /api/users
router.get('/users/search',userAuthMiddleware, searchUsersByName);     // GET /api/users/search
router.get('/users/:id',userAuthMiddleware, getUserById);              // GET /api/users/:id
router.post('/users/signout', userAuthMiddleware, signoutUser);
router.put('/users/:id',userAuthMiddleware, updateUser);               // PUT /api/users/:id
router.delete('/users/:id',userAuthMiddleware, deleteUser);            // DELETE /api/users/:id

// Get relationship status between two users
router.get('/users/relationship/:id', userAuthMiddleware, getRelationshipStatus);
router.get('/users/relations/:id', userAuthMiddleware, getUserRelations);

// Network-related routes
// router.post('/users/follow/:id', userAuthMiddleware, sendFollowRequest);         // POST /api/users/follow/:id
router.post('/users/follow/:id',userAuthMiddleware, sendFollowRequest);
router.post('/users/accept-follow/:id', userAuthMiddleware, acceptFollowRequest); // POST /api/users/accept-follow/:id
router.post('/users/decline-follow/:id', userAuthMiddleware, declineFollowRequest); // POST /api/users/decline-follow/:id
router.post('/users/unfollow/:id', userAuthMiddleware, unfollowUser);             // POST /api/users/unfollow/:id

// Follow requests
router.post('/users/follow-requests-received', userAuthMiddleware, getFollowRequestsReceived); // POST /api/users/follow-requests-received
router.post('/users/follow-requests-sent', userAuthMiddleware, getFollowRequestsSent);      // POST /api/users/follow-requests-sent
router.post('/users/get-notifications', userAuthMiddleware, getUserNotifications)

router.get('/users/followers/:id', userAuthMiddleware,getFollowers);

module.exports = router;
