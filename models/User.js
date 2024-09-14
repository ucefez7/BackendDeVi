const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  isUser: Boolean,
  isCreator: Boolean,
  isVerified: Boolean,
  name: String,
  username: String,
  gender: String,
  dob: Date,
  phoneNumber: String,
  mailAddress: String,
  profession: String,
  bio: String,
  website: String,
  profileImg: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', UserSchema);
