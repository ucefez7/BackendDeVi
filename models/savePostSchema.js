const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const savePostSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }], 
}, { timestamps: true });

module.exports = model('SavePost', savePostSchema);
