const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  mediaType: {
    type: String,
    enum: ['Image', 'Video'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    enum: [
      'DeVi',
      'Instagram',
      'Facebook',
      'Youtube',
      'LinkedIn',
      'X', 
    ],
    required: true,
  },
  usernameOrName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false, 
  },
  categories: {
    type: [String], 
    required: true,
  },
  subCategories: {
    type: [String], 
    required: false, 
  },
}, {
  timestamps: true, 
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
