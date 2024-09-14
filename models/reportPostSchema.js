const mongoose = require('mongoose');
const reportReasons = [
  'Spam',
  'Harassment',
  'Inappropriate Content',
  'Violence',
  'Misinformation',
  'Others'
];

const reportPostSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    enum: reportReasons,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const ReportPostModel = mongoose.model('ReportPost', reportPostSchema);

module.exports = { ReportPostModel, reportReasons };
