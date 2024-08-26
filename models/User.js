const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  isUser: { type: Boolean, required: true },
  isCreator: { type: Boolean, required: true },
  isVerified: { type: Boolean, required: true },
  name: { type: String, required: true },
  profileImg: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  profession: { type: String, required: true },
  dob: { type: String, required: true },
  number: { type: String, required: true },
  mailAddress: { type: String, required: true, unique: true },
  bio: { type: String, required: true },  
  website: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
