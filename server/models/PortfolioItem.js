const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: true,
      default: 'Advertising & Commercials'
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'audio'],
      default: 'image'
    },
    mediaUrl: {
      type: String,
      required: true
    },
    thumbnailUrl: {
      type: String,
      default: ''
    },
    promptUsed: {
      type: String,
      default: ''
    },
    negativePrompt: {
      type: String,
      default: ''
    },
    aiToolsUsed: {
      type: [String],
      default: ['Midjourney']
    },
    aspectRatio: {
      type: String,
      default: '16:9'
    },
    generationParams: {
      model: { type: String, default: 'Midjourney v6.1' },
      seed: { type: String, default: '4829104' },
      steps: { type: Number, default: 30 },
      sampler: { type: String, default: 'Euler a' },
      cfgScale: { type: Number, default: 7 }
    },
    likesCount: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);
