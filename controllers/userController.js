const User = require('../models/User');
const UserPost = require('../models/userPost');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');
const { signToken } = require('../utils/jwtUtils');
const admin = require('../config/firebaseAdmin');

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_posts',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

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



exports.createOrLoginUser = async function(req, res) {
  const { phoneNumber, name, username, gender, dob, mailAddress, firebaseIdToken, profession, bio, website, isCreator } = req.body;

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
      // If the user does not exist, create a new user with required fields
      user = new User({
        isUser: true,
        isCreator: typeof isCreator === 'boolean' ? isCreator : false, // Set isCreator based on input, default to false if not provided
        isVerified: true,
        name,
        username,
        gender,
        dob,
        number: phoneNumber,
        mailAddress,
        profession,
        bio,
        website
      });

      await user.save();
      console.log("User created: ", user);
      const token = signToken(user._id);
      return res.status(201).json({ token, userId: user._id });
    } else {
      // If user exists, log in and return the user profile
      console.log("User logged in: ", user);
      const token = signToken(user._id);
      return res.status(200).json({ token, userId: user._id });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



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


exports.deleteUser = async function(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.createPost = [
  upload.single('image'),
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

