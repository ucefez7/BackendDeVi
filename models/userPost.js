const mongoose = require('mongoose');

const userPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, 
  description: { type: String }, 
  media: { type: String }, 
  location: { type: String },
  category: { type: String, required: true },
  subCategory: { type: String, required: true }, 
  claps: { type: Number, default: 0 },
  remarks: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
      content: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  saved: { type: Boolean, default: false },
  shared: { type: Boolean, default: false },
  terminated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('UserPost', userPostSchema);
