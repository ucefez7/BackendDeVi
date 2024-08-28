const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const sharedPostSchema = new Schema({
  postId: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  sharedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = model('SharedPost', sharedPostSchema);
