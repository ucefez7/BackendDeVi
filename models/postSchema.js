const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
  },
  media: {
    type: [String],
    default: [],
    //required: [true, 'Media is required'],
  },
  coverPhoto: {
    type: String,
  },
  video: {
    type: String,
  },
  location: {
    type: String,
  },
  category: {
    type: [String],
    default: [],
  },
  subCategory: {
    type: [String],
    default: [],
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  shared: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
  isBlocked: {
    type: Boolean,
    default: false,
  },
  sensitive: {
    type: Boolean,
    default: false,
  },
  isBlog: {
    type: Boolean,
    // required: [true, 'isBlog field is required'],
  },
}, { timestamps: true });

module.exports = model('Post', postSchema);