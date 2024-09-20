const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  isUser: { type: Boolean, default: false },
  isCreator: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  name: { type: String, required: true },
  profileImg: { type: String},
  username: { type: String, required: true},
  gender: { type: String, required: true },
  profession: { type: String},
  dob: { type: String, required: true },
  phoneNumber: { type: Number, required: true, unique: true },
  mailAddress: { type: String, required: true},
  bio: { type: String},
  website: { type: String},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', UserSchema);