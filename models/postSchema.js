const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String
  },
  media: {
    type: [String], // Array of strings for media URLs
    validate: {
      validator: function(arr) {
        return arr.length > 0; // Ensure media array is not empty
      },
      message: 'At least one media file is required'
    },
    required: [true, 'Media is required'] // Ensure media field is present
  },
  location: {
    type: String
  },
  category: {
    type: [String],
    required: [true, 'Category is required']
  },
  subCategory: {
    type: [String],
    required: [true, 'SubCategory is required']
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Types.ObjectId,
    ref: 'Comment'
  }],
  shared: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }],
  isBlocked: {
    type: Boolean,
    default: false
  },
  sensitive: {
    type: Boolean,
    default: false
  },
  isBlog: {
    type: Boolean,
    required: [true, 'isBlog field is required']
  }
}, { timestamps: true });

module.exports = model('Post', postSchema);
