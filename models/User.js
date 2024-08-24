const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  isUser: { type: Boolean, default: true },
  isCreator: { type: Boolean, required: false },
  isVerified: { type: Boolean, required: true },
  name: { type: String, required: true },
  profileId: { type: String, default: null },
  username: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  profession: { type: String, default: null },
  dob: { type: String, required: true },
  number: { type: String, required: true },
  mailAddress: { type: String, required: true, unique: true },
  bio: { type: String, default: null },
  website: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
