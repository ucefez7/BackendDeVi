const mongoose = require('mongoose');
const { Schema } = mongoose;

const notInterestedSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  reason: {
    type: String,
    enum: ['Spam', 'Not relevant', 'Offensive', 'Other'],
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NotInterestedModel = mongoose.model('NotInterested', notInterestedSchema);
module.exports = NotInterestedModel;
