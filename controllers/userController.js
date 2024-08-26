const User = require('../models/User');
const UserPost = require('../models/userPost');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');
const { signToken } = require('../utils/jwtUtils');
const admin = require('../config/firebaseAdmin');


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'post_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const uploadProfileImg = multer({ storage });
const uploadPostImg = multer({ storage: postStorage });

// Get all users
exports.getUsers = async function(req, res) {
  try {
    const users = await User.find();
    console.log("Users are here: " + users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID
exports.getUserById = async function(req, res) {
  try {
    const user = await User.findById(req.params.id);
    console.log("User: ", user);

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.createOrLoginUser = [
  uploadProfileImg.single('profileImg'),
  async function(req, res) {
    const { 
      phoneNumber, 
      name, 
      username, 
      gender, 
      dob, 
      mailAddress, 
      firebaseIdToken, 
      profession, 
      bio, 
      website,
      isUser = false,    // Default values
      isCreator = false,
      isVerified = false 
    } = req.body;

    try {
      // Verify Firebase ID Token
      const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
      const firebasePhoneNumber = decodedToken.phone_number;

      // Ensure the phone number from Firebase matches the one provided
      if (firebasePhoneNumber !== phoneNumber) {
        return res.status(401).json({ message: 'Phone number mismatch' });
      }

      let user = await User.findOne({ number: phoneNumber });

      if (!user) {
        // Create a new user with all fields manually set by the user
        user = new User({
          isUser,
          isCreator,
          isVerified,
          name,
          username,
          gender,
          dob,
          number: phoneNumber,
          mailAddress,
          profession,
          bio,
          website,
          profileImg: req.file ? req.file.path : null  // Save image URL
        });

        await user.save();
        console.log("User created: ", user);
      } else {
        console.log("User logged in: ", user);
      }

      const token = signToken(user._id);

      // Create a common response object
      const userResponse = {
        token, 
        userId: user._id,
        isUser: user.isUser,
        isCreator: user.isCreator,
        isVerified: user.isVerified,
        name: user.name,
        username: user.username,
        gender: user.gender,
        dob: user.dob,
        number: user.number,
        mailAddress: user.mailAddress,
        profession: user.profession,
        bio: user.bio,
        website: user.website,
        profileImg: user.profileImg,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      // Return user response for both creation and login scenarios
      return res.status(user.isNew ? 201 : 200).json(userResponse);

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];




// Update user by ID
exports.updateUser = async function(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async function(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Post with Image Upload
exports.createPost = [
  uploadPostImg.single('image'),
  async function(req, res) {
    try {
      console.log("Creating post...");

      const newPost = new UserPost({
        userId: req.body.userId,
        content: req.body.content,
        image: req.file ? req.file.path : null
      });

      await newPost.save();
      res.status(201).json(newPost);
      console.log("Post created.");

    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

// Get posts by User ID
exports.getPostsByUserId = async function(req, res) {
  try {
    const posts = await UserPost.find({ userId: req.params.userId })
      .populate({
        path: 'userId',
        select: 'isCreator isVerified username name mailAddress following followers',
        populate: [
          { path: 'following', select: '_id' },
          { path: 'followers', select: '_id' }
        ]
      });

    if (!posts.length) return res.status(404).json({ message: 'No posts found for this user' });

    const postsWithUserDetails = posts.map(post => {
      const user = post.userId;
      return {
        ...post.toObject(),
        userId: {
          ...user.toObject(),
          followingCount: user.following.length,
          followersCount: user.followers.length,
        }
      };
    });

    res.json(postsWithUserDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all posts
exports.getAllPosts = async function(req, res) {
  console.log("Retrieving all posts...");

  try {
    const posts = await UserPost.find({})
      .populate({
        path: 'userId',
        select: 'isCreator isVerified username name mailAddress following followers',
        populate: [
          { path: 'following', select: '_id' },
          { path: 'followers', select: '_id' }
        ]
      });

    if (!posts.length) return res.status(404).json({ message: 'No posts found' });

    const postsWithUserDetails = posts.map(post => {
      const user = post.userId;
      return {
        ...post.toObject(),
        userId: {
          ...user.toObject(),
          followingCount: user.following.length,
          followersCount: user.followers.length,
        }
      };
    });

    res.json(postsWithUserDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single post by ID
exports.getPostById = async function(req, res) {
  try {
    const post = await UserPost.findById(req.params.postId)
      .populate({
        path: 'userId',
        select: 'isCreator isVerified username name mailAddress following followers',
        populate: [
          { path: 'following', select: '_id' },
          { path: 'followers', select: '_id' }
        ]
      });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = post.userId;
    const postWithUserDetails = {
      ...post.toObject(),
      userId: {
        ...user.toObject(),
        followingCount: user.following.length,
        followersCount: user.followers.length,
      }
    };

    res.json(postWithUserDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.searchUsersByName = async function(req, res) {
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

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


