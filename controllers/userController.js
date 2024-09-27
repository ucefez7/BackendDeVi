const User = require('../models/User');
const UserRelationship = require('../models/userRelationship');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');
const { signToken } = require('../utils/jwtUtils');
const TokenBlacklist = require('../models/TokenBlacklist');

// const { populateTrie } = require('../services/trie');
// let trie = null;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const uploadProfileImg = multer({ storage });



// controllers/userController.js
exports.getUsers = async function (req, res) {
  try {
    const users = await User.find();
    console.log("Users are here: " + users);

    
    const currentUser = await User.findById(req.user.id);
    const blockedUsers = currentUser ? currentUser.blockedUsers.map(id => id.toString()) : [];

    const userResponses = users
      .filter(user => !blockedUsers.includes(user._id.toString()))
      .map(user => ({
        userId: user._id,
        isUser: user.isUser,
        isCreator: user.isCreator,
        isVerified: user.isVerified,
        name: user.name,
        username: user.username,
        gender: user.gender,
        dob: user.dob,
        phoneNumber: user.phoneNumber,
        mailAddress: user.mailAddress,
        profession: user.profession,
        bio: user.bio,
        website: user.website,
        profileImg: user.profileImg,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));

    res.json(userResponses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getUserById = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    
    const currentUser = await User.findById(req.user.id);
    const isBlocked = currentUser && currentUser.blockedUsers.includes(user._id.toString());

    if (isBlocked) return res.status(403).json({ message: 'User is blocked' });

    const relationship = await UserRelationship.findOne({ userId: user._id })
      .populate('following', 'username name profileImg')
      .populate('followers', 'username name profileImg');

    const currentUserRelationship = await UserRelationship.findOne({ userId: req.user.id });

    let relationshipStatus = 'none';
    if (currentUserRelationship) {
      if (currentUserRelationship.following.includes(user._id)) {
        relationshipStatus = 'following';
      }
      if (currentUserRelationship.followers.includes(user._id)) {
        relationshipStatus = 'follower';
      }
      if (currentUserRelationship.followRequestsSent.includes(user._id)) {
        relationshipStatus = 'requested';
      }
    }

    const userResponse = {
      userId: user._id,
      isUser: user.isUser,
      isCreator: user.isCreator,
      isVerified: user.isVerified,
      name: user.name,
      username: user.username,
      gender: user.gender,
      dob: user.dob,
      phoneNumber: user.phoneNumber,
      mailAddress: user.mailAddress,
      profession: user.profession,
      bio: user.bio,
      website: user.website,
      profileImg: user.profileImg,
      followers: relationship ? relationship.followers : [],
      following: relationship ? relationship.following : [],
      relationshipStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.searchUsersByName = async function (req, res) {
  const searchTerm = req.query.name;
  if (!searchTerm) {
    return res.status(400).json({ message: 'Name query parameter is required' });
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: `^${searchTerm}`, $options: 'i' } }, 
        { username: { $regex: `^${searchTerm}`, $options: 'i' } } 
      ]
    });

    const currentUser = await User.findById(req.user.id);
    const blockedUsers = currentUser ? currentUser.blockedUsers.map(id => id.toString()) : [];

    const filteredUsers = users
      .filter(user => !blockedUsers.includes(user._id.toString()) && user._id.toString() !== req.user.id);

    if (filteredUsers.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const currentUserRelationship = await UserRelationship.findOne({ userId: req.user.id });

    const userResponses = filteredUsers.map(user => {
      let relationshipStatus = 'none';
      if (currentUserRelationship) {
        if (currentUserRelationship.following.includes(user._id)) {
          relationshipStatus = 'following';
        }
        if (currentUserRelationship.followers.includes(user._id)) {
          relationshipStatus = 'follower';
        }
        if (currentUserRelationship.followRequestsSent.includes(user._id)) {
          relationshipStatus = 'requested';
        }
      }

      return {
        userId: user._id,
        isUser: user.isUser,
        isCreator: user.isCreator,
        isVerified: user.isVerified,
        name: user.name,
        username: user.username,
        gender: user.gender,
        dob: user.dob,
        phoneNumber: user.phoneNumber,
        mailAddress: user.mailAddress,
        profession: user.profession,
        bio: user.bio,
        website: user.website,
        profileImg: user.profileImg,
        relationshipStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    });

    res.json(userResponses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




//logout
exports.signoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    await TokenBlacklist.create({ token });

    res.status(200).json({ message: 'Successfully signed out' });
  } catch (err) {
    console.error('Error signing out:', err);
    res.status(500).json({ message: 'Error signing out' });
  }
};



exports.loginUser = async function (req, res) {
  console.log("da mone working");
  
  const { phoneNumber } = req.body;

  console.log('Incoming request to loginUser:', req.body);

  try {
    let user = await User.findOne({ phoneNumber });

    if (user) {
      console.log("User logged in: ", user);
      const token = signToken(user._id);
      const userResponse = {
        token,
        userId: user._id,
        userExists: true,
        isUser: user.isUser,
        isCreator: user.isCreator,
        isVerified: user.isVerified,
        name: user.name,
        username: user.username,
        gender: user.gender,
        dob: user.dob,
        phoneNumber: user.phoneNumber,
        mailAddress: user.mailAddress,
        profession: user.profession,
        bio: user.bio,
        website: user.website,
        profileImg: user.profileImg,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    return res.status(200).send(userResponse);
    } else {
      console.log('User not found');
      return res.status(404).json({ userExists: false, phoneNumber });
    }
  } catch (err) {
    console.error('Error in loginUser:', err.message);
    return res.status(500).json({ message: err.message });
  }
};





exports.signupUser = async function (req, res) {
  console.log("da mone working sign up");
  const {
    phoneNumber,
    name,
    username,
    gender,
    dob,
    mailAddress,
    profession,
    bio,
    website,
    profileImg,
    isUser = false,
    isCreator = false,
    isVerified = false
  } = req.body;

  console.log('Incoming request to signupUser:', req.body);

  try {
    let existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    const user = new User({
      isUser,
      isCreator,
      isVerified,
      name,
      username,
      gender,
      dob,
      phoneNumber,
      mailAddress,
      profession,
      bio,
      website,
      profileImg
    });

    await user.save();
    console.log("User created: ", user);

    const token = signToken(user._id);

    const userResponse = {
      token,
      userId: user._id,
      userExists: false,
      isUser: user.isUser,
      isCreator: user.isCreator,
      isVerified: user.isVerified,
      name: user.name,
      username: user.username,
      gender: user.gender,
      dob: user.dob,
      phoneNumber: user.phoneNumber,
      mailAddress: user.mailAddress,
      profession: user.profession,
      bio: user.bio,
      website: user.website,
      profileImg: user.profileImg,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return res.status(201).send(userResponse);
  } catch (err) {
    console.error('Error in signupUser:', err.message);
    return res.status(500).json({ message: err.message });
  }
};




// // Update user by ID
// exports.updateUser = async function (req, res) {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const userResponse = {
//       userId: user._id,
//       isUser: user.isUser,
//       isCreator: user.isCreator,
//       isVerified: user.isVerified,
//       name: user.name,
//       username: user.username,
//       gender: user.gender,
//       dob: user.dob,
//       phoneNumber: user.phoneNumber,
//       mailAddress: user.mailAddress,
//       profession: user.profession,
//       bio: user.bio,
//       website: user.website,
//       profileImg: user.profileImg,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt
//     };

//     res.json(userResponse);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };




// Update user by ID (Excluding phoneNumber, username, mailAddress from update)
exports.updateUser = async function (req, res) {
  try {
    const { name, gender, dob, profession, bio, website, profileImg } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { name, gender, dob, profession, bio, website, profileImg, updatedAt: Date.now() },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    const userResponse = {
      userId: user._id,
      isUser: user.isUser,
      isCreator: user.isCreator,
      isVerified: user.isVerified,
      name: user.name,
      username: user.username, // Keep original username
      gender: user.gender,
      dob: user.dob,
      phoneNumber: user.phoneNumber, // Keep original phoneNumber
      mailAddress: user.mailAddress, // Keep original mailAddress
      profession: user.profession,
      bio: user.bio,
      website: user.website,
      profileImg: user.profileImg,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
console.log("ethalle response: " +userResponse);

    res.json(userResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// // Delete user
// exports.deleteUser = async function (req, res) {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json({ message: 'User deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// Delete current user (Authenticated User)
exports.deleteUser = async function (req, res) {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get Relationship Status
exports.getRelationshipStatus = async function(req, res) {
  try {
      const user = await User.findById(req.user.id);
      const targetUser = await User.findById(req.params.id);

      if (!user || !targetUser) {
          return res.status(404).json({ msg: 'User or Target User not found' });
      }

      const userRelationship = await UserRelationship.findOne({ userId: user._id });
      const targetUserRelationship = await UserRelationship.findOne({ userId: targetUser._id });

      if (!userRelationship || !targetUserRelationship) {
          return res.status(404).json({ msg: 'Relationship data not found' });
      }

      
      const status = {
          isFollowing: userRelationship.following.includes(targetUser._id),
          isFollowedBy: targetUserRelationship.following.includes(user._id),
          hasSentRequest: userRelationship.followRequestsSent.includes(targetUser._id),
          hasReceivedRequest: targetUserRelationship.followRequestsReceived.includes(user._id)
      };

      res.status(200).json({ status });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error', error: error.message });
  }
};



// Get followers and following for a user
exports.getUserRelations = async function(req, res) {
  try {
    const userId = req.params.id;

    const userRelationship = await UserRelationship.findOne({ userId });

    if (!userRelationship) {
      return res.status(404).json({ message: 'User relationships not found' });
    }

    const followers = await User.find({ _id: { $in: userRelationship.followers } });
    const following = await User.find({ _id: { $in: userRelationship.following } });

    res.status(200).json({
      followers: followers.map(user => ({
        userId: user._id,
        name: user.name,
        username: user.username,
        profileImg: user.profileImg
      })),
      following: following.map(user => ({
        userId: user._id,
        name: user.name,
        username: user.username,
        profileImg: user.profileImg
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




// exports.getUserNotifications = async function (req, res) {
//   try {
//     const userId = req.user.id;
//     console.log(`Fetching notifications for userId: ${userId}`);

//     const userRelationship = await UserRelationship.findOne({ userId });

//     console.log('UserRelationship:', userRelationship);

//     if (!userRelationship) {
//       return res.status(404).json({ message: 'User relationships not found' });
//     }

//     const followRequestsReceived = await User.find({
//       _id: { $in: userRelationship.followRequestsReceived },
//     }).select('name username profileImg isCreator');

//     console.log('Follow Requests Received Users:', followRequestsReceived);

//     const followers = await User.find({
//       _id: { $in: userRelationship.followers },
//     }).select('name username profileImg isCreator');

//     console.log('Followers:', followers);

//     const notifications = [];

//     followRequestsReceived.forEach((user) => {
//       notifications.push({
//         type: 'follow_request_received',
//         userId: user._id,
//         name: user.name,
//         username: user.username,
//         profileImg: user.profileImg,
//         message: `${user.username} has sent you a follow request.`,
//         createdAt: new Date(), 
//         followed: false,
//       });
//     });

//     followers.forEach((user) => {
//       const isAcceptedRequest = !userRelationship.followRequestsReceived.includes(
//         user._id.toString()
//       );

//       if (isAcceptedRequest) {
//         notifications.push({
//           type: 'follow_request_accepted',
//           userId: user._id,
//           name: user.name,
//           username: user.username,
//           profileImg: user.profileImg,
//           message: `${user.username} has accepted your follow request.`,
//           createdAt: new Date(), 
//           followed: user.isCreator,
//         });
//       }
//     });

//     notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
//     console.log('Notifications:', notifications);

//     res.status(200).json({ notifications });
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



exports.getUserNotifications = async function (req, res) {
  try {
    const userId = req.user.id;
    console.log(`Fetching notifications for userId: ${userId}`);

    const userRelationship = await UserRelationship.findOne({ userId });
    const blockedUsers = userRelationship ? userRelationship.blocked : [];

    if (!userRelationship) {
      return res.status(404).json({ message: 'User relationships not found' });
    }

    const followRequestsReceived = await User.find({
      _id: { $in: userRelationship.followRequestsReceived },
    }).select('name username profileImg isCreator');

    const followers = await User.find({
      _id: { $in: userRelationship.followers },
    }).select('name username profileImg isCreator');

    const notifications = [];

    followRequestsReceived.forEach((user) => {
      if (!blockedUsers.includes(user._id.toString())) {
        notifications.push({
          type: 'follow_request_received',
          userId: user._id,
          name: user.name,
          username: user.username,
          profileImg: user.profileImg,
          // message: `${user.username} has sent you a follow request.`,
          message: `Want to be your buddy...! 🤗`,
          createdAt: new Date(),
          followed: false,
        });
      }
    });

    followers.forEach((user) => {
      if (!blockedUsers.includes(user._id.toString())) {
        const isAcceptedRequest = !userRelationship.followRequestsReceived.includes(user._id.toString());

        if (isAcceptedRequest) {
          notifications.push({
            type: 'follow_request_accepted',
            userId: user._id,
            name: user.name,
            username: user.username,
            profileImg: user.profileImg,
            // message: `${user.username} has accepted your follow request.`,
            message: `Made you her buddy...! 🥳`,
            createdAt: new Date(),
            followed: user.isCreator,
          });
        }
      }
    });

    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log('Notifications:', notifications);

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




// Block a user
exports.blockUser = async function (req, res) {
  try {
    const userIdToBlock = await User.findById(req.params.id);
    //const userIdToBlock = req.params.id;
    const currentUserId = req.user.id;
    console.log("block chyanna user evana "+req.body);
    console.log("eth njaana "+req.user.id);
    
    

    if (userIdToBlock === currentUserId) {
      return res.status(400).json({ message: 'You cannot block yourself.' });
    }

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found.' });
    }

    if (!currentUser.blockedUsers.includes(userIdToBlock)) {
      currentUser.blockedUsers.push(userIdToBlock);
      await currentUser.save();
      return res.status(200).json({ message: 'User blocked successfully.' });
    }

    res.status(400).json({ message: 'User is already blocked.' });
  } catch (err) {
    console.error('Error blocking user:', err.message);
    res.status(500).json({ message: 'Error blocking user' });
  }
};



// Get blocked users
exports.getBlockedUsers = async function (req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId).populate('blockedUsers', 'username name profileImg');
    console.log("Evanmare alle ni block akkye "+currentUser);
    

    if (!currentUser || currentUser.blockedUsers.length === 0) {
      return res.status(404).json({ message: 'No blocked users found.' });
    }

    res.status(200).json(currentUser.blockedUsers);
  } catch (err) {
    console.error('Error getting blocked users:', err.message);
    res.status(500).json({ message: 'Error getting blocked users' });
  }
};






// Unblock a user
exports.unblockUser = async function (req, res) {
  try {
    //const userIdToUnblock = await User.findById(req.params.id);
    const userIdToUnblock = req.params.id;
    const currentUserId = req.user.id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser || !currentUser.blockedUsers.includes(userIdToUnblock)) {
      return res.status(404).json({ message: 'User is not blocked.' });
    }

    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      (blockedUserId) => blockedUserId && blockedUserId.toString() !== userIdToUnblock
    );

    await currentUser.save();
    res.status(200).json({ message: 'User unblocked successfully.' });
  } catch (err) {
    console.error('Error unblocking user:', err.message);
    res.status(500).json({ message: 'Error unblocking user' });
  }
};

