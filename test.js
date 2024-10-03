const uploadMedia = multer({ storage: postStorage }).fields([
  { name: 'video', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 }
]);


exports.uploadVideo = [
  uploadMedia,
  async (req, res, next) => {
    const userId = req.user.id;
    const { title, description, location, category, subCategory, isBlog } = req.body;
    
   
    const videoURL = req.files['video'] ? req.files['video'][0].path : null;
    const coverPhotoURL = req.files['coverPhoto'] ? req.files['coverPhoto'][0].path : null;

    try {
     
      if (!title || !videoURL) {
        return res.status(400).json({ error: 'Title and video are required' });
      }

      
      const newPost = await PostModel.create({
        userId,
        title,
        description,
        video: videoURL,
        coverPhoto: coverPhotoURL,
        location,
        category: Array.isArray(category) ? category : [category],
        subCategory: Array.isArray(subCategory) ? subCategory : [subCategory],
        likes: [],
        comments: [],
        shared: [],
        isBlocked: false,
        sensitive: false,
        isBlog,
      });

      
      const user = await UserModel.findById(userId).select('name username following followers profession');
      res.status(201).json({
        ...newPost.toObject(),
        userId: {
          ...user.toObject(),
          followingCount: user.following ? user.following.length : 0,
          followersCount: user.followers ? user.followers.length : 0,
        },
      });
    } catch (error) {
      console.error('Internal Server Error:', error);
      return res.status(500).json({ error: 'Internal Server Error. Please try again later.', details: error.message });
    }
  },
];



// New route for uploading videos
router.post('/posts/upload-video', userAuthMiddleware, postController.uploadVideo);