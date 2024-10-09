const rewriteSchema = new mongoose.Schema({
    originalPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    revisedContent: { type: String, required: true },
    revisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    revisedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Rewrite', rewriteSchema);
  