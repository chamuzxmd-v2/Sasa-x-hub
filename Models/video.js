const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },
  duration: Number,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  tags: [String],
  category: { type: String, enum: ['amateur', 'professional', 'asian', 'ebony', 'lesbian', 'gay', 'milf'] },
  thumbnail: String,
  videoId: { type: String, required: true }, // GridFS file ID
  thumbnailId: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPremium: { type: Boolean, default: false },
  ageVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'processing', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
