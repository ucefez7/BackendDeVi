const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  postId: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

module.exports = model('Comment', commentSchema);
