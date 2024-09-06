const mongoose = require('mongoose');
const VisionFeedSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String, 
    required: true
  },
  mediaType: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); 

module.exports = mongoose.model('VisionFeed', VisionFeedSchema);
