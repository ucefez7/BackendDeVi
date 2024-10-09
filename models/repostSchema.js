const repostSchema = new mongoose.Schema({
    originalPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, 
    repostedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    repostedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Repost', repostSchema);
  