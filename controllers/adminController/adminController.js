const Admin = require('../../models/adminModel');
const Media = require('../../models/visioFeed');
const { signToken } = require('../../utils/jwtUtils');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinaryConfig');
const multer = require('multer');

// Login function
exports.login = async function(req, res) {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    const admin = await Admin.findOne({ username });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid user' });
    }
    

    const token = signToken(admin._id);
    console.log("varanille data:" +admin._id);
    
    res.json({ token,
      adminId: admin._id,
      username: admin.username
     });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};






// Configure Cloudinary storage for media uploads (images/videos)
const mediaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'admin_post_media';
    if (file.mimetype.startsWith('video')) {
      folder = 'admin_post_videos';
    }

    return {
      folder: folder,
      resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov'],
    };
  },
});

// Multer middleware for handling media uploads
const uploadMedia = multer({ storage: mediaStorage });




// Create post (Admin)
exports.createPost = [
  
  uploadMedia.fields([
    { name: 'mediaUrl', maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const {description, platform, usernameOrName, location, categories, subCategories } = req.body;

      const mediaURLs = req.files['mediaUrl'] ? req.files['mediaUrl'].map(file => file.path) : [];

      if (!description || !platform || !usernameOrName || !mediaURLs.length) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

     
      const newPost = new Media({
        mediaUrl: mediaURLs[0],
        description,
        platform,
        usernameOrName,
        location,
        categories,
        //categories: Array.isArray(categories) ? categories : [categories],
        subCategories: Array.isArray(subCategories) ? subCategories : [subCategories],
      });

     
      await newPost.save();

     
      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ message: 'Error creating post', error: error.message });
    }
  },
];




exports.updatePost = [
  uploadMedia.fields([{ name: 'mediaUrl', maxCount: 5 }]),
  async (req, res) => {
    const postId = req.params.id;

    try {
      const { description, platform, usernameOrName, location, categories, subCategories } = req.body;

    
      const mediaURLs = req.files && req.files['mediaUrl'] ? req.files['mediaUrl'].map(file => file.path) : null;

      const updateData = {
        description,
        platform,
        usernameOrName,
        location,
        categories,
        //categories: Array.isArray(categories) ? categories : [categories],
        subCategories: Array.isArray(subCategories) ? subCategories : [subCategories],
      };

      if (mediaURLs) {
        updateData.mediaUrl = mediaURLs[0];
      }

      const updatedPost = await Media.findByIdAndUpdate(postId, updateData, { new: true });

      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.json(updatedPost);
    } catch (err) {
      res.status(500).json({ message: 'Error updating post', error: err.message });
    }
  }
];


// Delete a post by ID
exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  console.log("id ethann: " +postId)
  try {
    const deletedPost = await Media.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post', error: err.message });
  }
};




const getMediaType = (url) => {
  const videoExtensions = ['.mp4', '.mov'];
  const imageExtensions = ['.jpg', '.jpeg', '.png'];

  // Extract the file extension from the URL
  const extension = url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();

  if (videoExtensions.includes(`.${extension}`)) {
    return 'video';
  } else if (imageExtensions.includes(`.${extension}`)) {
    return 'image';
  } else {
    return 'unknown';
  }
};



exports.getAllFeeds = async (req, res) => {
  try {
    const feeds = await Media.find({});

    // Add mediaType to each feed
    const feedsWithMediaType = feeds.map(feed => {
      const mediaType = getMediaType(feed.mediaUrl[0]); // Assuming the first media URL determines the type
      return {
        ...feed.toObject(),
        mediaType
      };
    });

    res.json(feedsWithMediaType);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feeds', error: err.message });
  }
};


exports.getFeedById = async (req, res) => {
  const postId = req.params.id;
  try {
    const feed = await Media.findById(postId);
    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }

    // Add mediaType to the feed
    const mediaType = getMediaType(feed.mediaUrl[0]); // Assuming the first media URL determines the type
    const feedWithMediaType = {
      ...feed.toObject(),
      mediaType
    };

    res.json(feedWithMediaType);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feed', error: err.message });
  }
};

