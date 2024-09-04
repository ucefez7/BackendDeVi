const PostModel = require('../models/postSchema');
const UserModel = require('../models/User');
const CommentModel = require('../models/commentSchema');
const SavePostModel = require('../models/savePostSchema');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');
const createHttpError = require('http-errors');

// Setting up Cloudinary storage for posts
const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'post_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const uploadPostImg = multer({ storage: postStorage });




// Create a new post with image upload
exports.createPost = [
  uploadPostImg.single('media'),
  async (req, res, next) => {
    const userId = req.user.id;
    const { title, description, location, category, subCategory } = req.body;
    const mediaURL = req.file ? req.file.path : null;

    try {
      if (!title || !category || !subCategory) {
        throw createHttpError(400, 'Parameters Missing');
      }

      const newPost = await PostModel.create({
        userId,
        title,
        description,
        media: mediaURL,
        location,
        category,
        subCategory,
        likes: [],
        comments: [],
        shared: [],
        isBlocked: false,
        sensitive: false,
      });

      res.status(201).json({ newPost });
    } catch (error) {
      next(error);
    }
  },
];




// Get all posts
exports.getAllPosts = async (req, res, next) => {
  console.log("All post loading...");
  
  try {
    const posts = await PostModel.find({ isBlocked: false })
      .populate({
        path: 'userId',
        select: 'username name',
      })
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'username' },
      })
      .sort({ createdAt: -1 });

    if (!posts.length) {
      return res.status(404).json({ message: 'No posts found' });
    }

    const postsWithUserDetails = posts.map(post => {
      const user = post.userId;
      return {
        ...post.toObject(),
        userId: {
          ...user.toObject(),
          followingCount: user.following ? user.following.length : 0,
          followersCount: user.followers ? user.followers.length : 0,
        },
      };
    });

    res.status(200).json(postsWithUserDetails);
  } catch (error) {
    next(error);
  }
};




// Get a single post by ID
exports.getPostById = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await PostModel.findById(postId)
      .populate({
        path: 'userId',
        select: 'username name',
      })
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'username' },
      });

    if (!post) {
      throw createHttpError(404, 'No Post found with this ID');
    }

    const user = post.userId;
    const postWithUserDetails = {
      ...post.toObject(),
      userId: {
        ...user.toObject(),
        followingCount: user.following ? user.following.length : 0,
        followersCount: user.followers ? user.followers.length : 0,
      },
    };

    res.status(200).json(postWithUserDetails);
  } catch (error) {
    next(error);
  }
};




// Update a post
exports.updatePost = async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;
  const { title, description, location, category, subCategory } = req.body;
  const mediaURL = req.file ? req.file.path : null;

  try {
    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      throw createHttpError(404, 'Post not found');
    }

    if (post.userId.toString() !== userId) {
      throw createHttpError(401, "This post doesn't belong to this user");
    }

    const updatedPost = await PostModel.findByIdAndUpdate(postId, {
      title,
      description,
      media: mediaURL || post.media,
      location,
      category,
      subCategory,
    }, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};




// Delete a post
exports.deletePost = async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      throw createHttpError(404, 'Post not found');
    }

    if (post.userId.toString() !== userId) {
      throw createHttpError(401, "This post doesn't belong to this user");
    }

    await PostModel.deleteOne({ _id: postId });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};







// Add Comment To Post
exports.addComment = async (req, res, next) => {
  const userId = req.user.id;
  const { postId, comment } = req.body;

  try {
    if (!comment || !postId) {
      throw createHttpError(400, 'Parameters Missing');
    }

    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      throw createHttpError(404, 'No Post found with this ID');
    }

    const newComment = await CommentModel.create({ userId, postId, comment });

    await PostModel.updateOne({ _id: postId }, { $push: { comments: newComment._id } });

    res.status(200).json({ status: 'success', data: newComment });
  } catch (error) {
    next(error);
  }
};

// Delete Comment From Post
exports.deleteComment = async (req, res, next) => {
  const userId = req.user.id;
  const { postId, commentId } = req.body;

  try {
    if (!commentId || !postId) {
      throw createHttpError(400, 'Parameters Missing');
    }

    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      throw createHttpError(404, 'No Post found with this ID');
    }

    const comment = await CommentModel.findOne({ _id: commentId });

    if (!comment) {
      throw createHttpError(404, 'Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw createHttpError(401, "This comment doesn't belong to this user");
    }

    await CommentModel.deleteOne({ _id: commentId });
    await PostModel.updateOne({ _id: postId }, { $pull: { comments: commentId } });

    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};



// Like Post
exports.likePost = async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      throw createHttpError(404, 'No Post found with this ID');
    }

    if (post.likes.includes(userId)) {
      throw createHttpError(400, 'User has already liked the post');
    }

    await PostModel.updateOne({ _id: postId }, { $push: { likes: userId } });

    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};



// Unlike Post
exports.unlikePost = async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      throw createHttpError(404, 'No Post found with this ID');
    }

    if (!post.likes.includes(userId)) {
      throw createHttpError(400, 'User has not liked the post');
    }

    await PostModel.updateOne({ _id: postId }, { $pull: { likes: userId } });

    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};



// Save a Post
exports.savePost = async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const post = await PostModel.findById(postId);
    
    if (!post) {
      throw createHttpError(404, 'Post not found');
    }

    let savePost = await SavePostModel.findOne({ userId });

    if (!savePost) {
      savePost = await SavePostModel.create({ userId, posts: [postId] });
    } else {
      if (savePost.posts.includes(postId)) {
        throw createHttpError(400, 'Post is already saved');
      }
      savePost.posts.push(postId);
      await savePost.save();
    }

    res.status(200).json({ status: 'success', data: savePost });
  } catch (error) {
    next(error);
  }
};

// Remove a Post from Saved Posts
exports.removeSavedPost = async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const savePost = await SavePostModel.findOne({ userId });

    if (!savePost) {
      throw createHttpError(404, 'No saved posts found for this user');
    }

    if (!savePost.posts.includes(postId)) {
      throw createHttpError(404, 'Post not found in saved posts');
    }

    savePost.posts = savePost.posts.filter(id => id.toString() !== postId.toString());
    await savePost.save();

    res.status(200).json({ status: 'success', data: savePost });
  } catch (error) {
    next(error);
  }
};

// // Get Saved Posts
// exports.getSavedPosts = async (req, res, next) => {
//   const userId = req.user.id;

//   try {
//     const savePost = await SavePostModel.findOne({ userId }).populate('posts');

//     if (!savePost) {
//       return res.status(404).json({ message: 'No saved posts found for this user' });
//     }

//     res.status(200).json({ status: 'success', data: savePost.posts });
//   } catch (error) {
//     next(error);
//   }
// };


// Save a Post
exports.savePost = async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const post = await PostModel.findById(postId);
    
    if (!post) {
      throw createHttpError(404, 'Post not found');
    }

    let savePost = await SavePostModel.findOne({ userId });

    if (!savePost) {
      savePost = await SavePostModel.create({ userId, posts: [postId] });
    } else {
      if (savePost.posts.includes(postId)) {
        throw createHttpError(400, 'Post is already saved');
      }
      savePost.posts.push(postId);
      await savePost.save();
    }

    res.status(200).json({ status: 'success', data: savePost });
  } catch (error) {
    next(error);
  }
};

// Remove a Post from Saved Posts
exports.removeSavedPost = async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const savePost = await SavePostModel.findOne({ userId });

    if (!savePost) {
      throw createHttpError(404, 'No saved posts found for this user');
    }

    if (!savePost.posts.includes(postId)) {
      throw createHttpError(404, 'Post not found in saved posts');
    }

    savePost.posts = savePost.posts.filter(id => id.toString() !== postId.toString());
    await savePost.save();

    res.status(200).json({ status: 'success', data: savePost });
  } catch (error) {
    next(error);
  }
};



// Get Saved Posts
exports.getSavedPosts = async (req, res, next) => {
  console.log("working anno");
  
  const userId = req.user.id;
  console.log("ethannn user id: "+userId);

  try {
    const savePost = await SavePostModel.findOne({ userId }).populate('posts');

    if (!savePost) {
      return res.status(404).json({ message: 'No saved posts found for this user' });
    }

    res.status(200).json({ status: 'success', data: savePost.posts });
  } catch (error) {
    next(error);
  }
};
