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
  getUserNotifications,
  blockUser,
  unblockUser,
  getBlockedUsers
} = require('../controllers/userController');
const {
  sendFollowRequest,
  acceptFollowRequest,
  declineFollowRequest,
  unfollowUser,
  getFollowRequestsReceived,
  getFollowRequestsSent,
  getFollowers,
  getFollowing,
  cancelFollowRequest
} = require('../controllers/networkController');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

const router = express.Router();

// User-related routes
router.post('/users/login', loginUser);      
router.post('/users/signup', signupUser);   
router.get('/users',userAuthMiddleware, getUsers);                     
router.get('/users/search',userAuthMiddleware, searchUsersByName);  
router.get('/users/:id',userAuthMiddleware, getUserById);            
router.post('/users/signout', userAuthMiddleware, signoutUser);
router.put('/users/update',userAuthMiddleware, updateUser);              
router.delete('/users/delete',userAuthMiddleware, deleteUser);            

// Get relationship status between two users
router.get('/users/relationship/:id', userAuthMiddleware, getRelationshipStatus);
router.get('/users/relations/:id', userAuthMiddleware, getUserRelations);

// Network-related routes
// router.post('/users/follow/:id', userAuthMiddleware, sendFollowRequest);         
router.post('/users/follow/:id',userAuthMiddleware, sendFollowRequest);
router.post('/users/accept-follow/:id', userAuthMiddleware, acceptFollowRequest); 
router.post('/users/decline-follow/:id', userAuthMiddleware, declineFollowRequest);
router.post('/users/unfollow/:id', userAuthMiddleware, unfollowUser);         

// Follow requests
router.post('/users/follow-requests-received', userAuthMiddleware, getFollowRequestsReceived);
router.post('/users/follow-requests-sent', userAuthMiddleware, getFollowRequestsSent);    
router.post('/users/get-notifications', userAuthMiddleware, getUserNotifications)

router.get('/users/followers/:id', userAuthMiddleware,getFollowers);
router.get('/users/following/:id', userAuthMiddleware, getFollowing);
router.post('/users/cancel-follow/:id', userAuthMiddleware, cancelFollowRequest);


//blocked status
router.post('/users/block/:id', userAuthMiddleware, blockUser);
router.post('/users/unblock/:id', userAuthMiddleware, unblockUser);
router.post('/users/blocked', userAuthMiddleware, getBlockedUsers);

module.exports = router;
