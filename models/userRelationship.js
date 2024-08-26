const mongoose = require('mongoose');

const userRelationshipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('UserRelationship', userRelationshipSchema);