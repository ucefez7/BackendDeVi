const User = require('../models/User');
const UserRelationship = require('../models/userRelationship');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');
const { signToken } = require('../utils/jwtUtils');
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

// Get all users
exports.getUsers = async function (req, res) {
  try {
    const users = await User.find();
    console.log("Users are here: " + users);

    const userResponses = users.map(user => ({
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

// // Get user by ID
// exports.getUserById = async function (req, res) {
//   try {
//     const user = await User.findById(req.params.id);
//     console.log("User: ", user);

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
//     res.status(500).json({ message: err.message });
//   }
// };


// Get user profile by ID including followers and following
exports.getUserById = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch the relationship data
    const relationship = await UserRelationship.findOne({ userId: user._id })
      .populate('following', 'username name profileImg')
      .populate('followers', 'username name profileImg');

    const currentUserRelationship = await UserRelationship.findOne({ userId: req.user.id });

    // Determine relationship status between current user and the fetched user
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

// Check relationship while searching users
exports.searchUsersByName = async function (req, res) {
  const searchTerm = req.query.name;
  if (!searchTerm) {
    return res.status(400).json({ message: 'Name query parameter is required' });
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { username: { $regex: searchTerm, $options: 'i' } }
      ]
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Fetch the current user's relationships
    const currentUserRelationship = await UserRelationship.findOne({ userId: req.user.id });

    const userResponses = users.map(user => {
      // Determine relationship status
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

// User sign-out
exports.signoutUser = async function (req, res) {
  try {
    // Logic to invalidate the user session or token (implementation depends on how tokens are managed)
    req.logout(); // Example if using passport.js
    res.status(200).json({ message: 'Successfully signed out' });
  } catch (err) {
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




// Update user by ID
exports.updateUser = async function (req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json(userResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async function (req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// // Get relationship between two users
// exports.getRelationshipStatus = async function(req, res) {
//   try {
//     const userId = req.user.id;
//     const targetUserId = req.params.id;

//     const userRelationship = await UserRelationship.findOne({ userId });
//     const targetUserRelationship = await UserRelationship.findOne({ userId: targetUserId });

//     if (!userRelationship || !targetUserRelationship) {
//       return res.status(404).json({ message: 'Relationship data not found' });
//     }

//     const isFollowing = userRelationship.following.includes(targetUserId);
//     const isFollowedBy = targetUserRelationship.followers.includes(userId);

//     res.status(200).json({ isFollowing, isFollowedBy });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// Get Relationship Status
exports.getRelationshipStatus = async function(req, res) {
  try {
      // Fetch the current user and the target user
      const user = await User.findById(req.user.id);
      const targetUser = await User.findById(req.params.id);

      if (!user || !targetUser) {
          return res.status(404).json({ msg: 'User or Target User not found' });
      }

      // Fetch the relationship documents for both users
      const userRelationship = await UserRelationship.findOne({ userId: user._id });
      const targetUserRelationship = await UserRelationship.findOne({ userId: targetUser._id });

      if (!userRelationship || !targetUserRelationship) {
          return res.status(404).json({ msg: 'Relationship data not found' });
      }

      // Determine the relationship status
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




// // Search users by name
// exports.searchUsersByName = async function (req, res) {
//   const searchTerm = req.query.name;

//   if (!searchTerm) {
//     return res.status(400).json({ message: 'Name query parameter is required' });
//   }

//   try {
//     const users = await User.find({
//       $or: [
//         { name: { $regex: searchTerm, $options: 'i' } },
//         { username: { $regex: searchTerm, $options: 'i' } }
//       ]
//     });

//     if (users.length === 0) {
//       return res.status(404).json({ message: 'No users found' });
//     }

//      const userResponses = users.map(user => ({
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
//     }));

//     res.json(userResponses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// Search users by name
// exports.searchUsersByName = async function (req, res) {
//   const searchTerm = req.query.name;

//   if (!searchTerm) {
//     return res.status(400).json({ message: 'Name query parameter is required' });
//   }

//   try {
//     if (!trie) {
//       trie = await populateTrie();
//     }

//     const suggestedUsernames = trie.search(searchTerm);

//     if (suggestedUsernames.length === 0) {
//       return res.status(404).json({ message: 'No users found' });
//     }

//     const users = await User.find({
//       username: { $in: suggestedUsernames }
//     });

//     if (users.length === 0) {
//       return res.status(404).json({ message: 'No users found' });
//     }

//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };