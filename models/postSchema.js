const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  media: [{ type: String, required:true }],
  location: { type: String },
  category: [{ type: String, required: true }],
  subCategory: [{ type: String, required: true }],
  likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  shared: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  isBlocked: { type: Boolean, default: false },
  sensitive: { type: Boolean, default: false },
  isDiary: { type: Boolean, required: true, default: false},
}, { timestamps: true });

module.exports = model('Post', postSchema);
