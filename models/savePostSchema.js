const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const savePostSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }], // Array of post IDs
}, { timestamps: true });

module.exports = model('SavePost', savePostSchema);
