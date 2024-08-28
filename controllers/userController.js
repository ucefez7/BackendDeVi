const User = require('../models/User');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');
const { signToken } = require('../utils/jwtUtils');

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
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID
exports.getUserById = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    console.log("User: ", user);

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Create or Login User
// exports.createOrLoginUser = [
//   uploadProfileImg.single('profileImg'),
//   async function (req, res) {
//     const {
//       phoneNumber,
//       name,
//       username,
//       gender,
//       dob,
//       mailAddress,
//       profession,
//       bio,
//       website,
//       isUser = false,
//       isCreator = false,
//       isVerified = false
//     } = req.body;

//     try {
//       // Find user by phone number
//       let user = await User.findOne({ number: phoneNumber });

//       if (!user) {
//         // Create a new user if not found
//         user = new User({
//           isUser,
//           isCreator,
//           isVerified,
//           name,
//           username,
//           gender,
//           dob,
//           number: phoneNumber,
//           mailAddress,
//           profession,
//           bio,
//           website,
//           profileImg: req.file ? req.file.path : null
//         });

//         await user.save();
//         console.log("User created: ", user);
//       } else {
//         console.log("User logged in: ", user);
//       }

//       // Generate JWT token
//       const token = signToken(user._id);

//       // Create a common response object
//       const userResponse = {
//         token,
//         userId: user._id,
//         isUser: user.isUser,
//         isCreator: user.isCreator,
//         isVerified: user.isVerified,
//         name: user.name,
//         username: user.username,
//         gender: user.gender,
//         dob: user.dob,
//         number: user.number,
//         mailAddress: user.mailAddress,
//         profession: user.profession,
//         bio: user.bio,
//         website: user.website,
//         profileImg: user.profileImg,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       };

//       // Return user response for both creation and login scenarios
//       return res.status(user.isNew ? 201 : 200).json(userResponse);

//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   }
// ];



exports.createOrLoginUser = [
  async function (req, res) {
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
      isUser = false,
      isCreator = false,
      isVerified = false
    } = req.body;

    try {
      // Find user by phone number
      let user = await User.findOne({ number: phoneNumber });

      if (!user) {
        // Create a new user if not found
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
        });

        await user.save();
        console.log("User created: ", user);
      } else {
        console.log("User logged in: ", user);
      }

      // Generate JWT token
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
      return res.status(user.isNew ? 201 : 200).json(userResponse);

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];




// Update user by ID
exports.updateUser = async function (req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
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

// Search users by name
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

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
