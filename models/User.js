const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  isUser: { type: Boolean, default: true },
  isCreator: { type: Boolean, default: false }, // Updated to have a default value of false
  isVerified: { type: Boolean, required: true },
  name: { type: String, required: true },
  profileId: { type: String, default: null },
  username: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  profession: { type: String, required: true }, // Required field
  dob: { type: String, required: true },
  number: { type: String, required: true },
  mailAddress: { type: String, required: true, unique: true },
  bio: { type: String, required: true },        // Required field
  website: { type: String, required: true },    // Required field
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
