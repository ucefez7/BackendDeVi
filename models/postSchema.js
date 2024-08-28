const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  media: { type: String },
  mediaURL: [{ type: String }],
  location: { type: String },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }], // Array of comment IDs
  shared: [{ type: mongoose.Types.ObjectId, ref: 'SharedPost' }], // Array of shared post IDs
  isBlocked: { type: Boolean, default: false },
  sensitive: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = model('Post', postSchema);
