const mongoose = require('mongoose');

const brandProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    industry: {
      type: String,
      default: 'E-Commerce & Digital Media'
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
      default: '11-50'
    },
    website: {
      type: String,
      default: 'https://example.com'
    },
    bio: {
      type: String,
      default: 'Pioneering brand leveraging generative AI for global campaigns and creative storytelling.'
    },
    location: {
      type: String,
      default: 'San Francisco, CA'
    },
    verified: {
      type: Boolean,
      default: true
    },
    totalBriefsPosted: {
      type: Number,
      default: 0
    },
    totalHired: {
      type: Number,
      default: 0
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BrandProfile', brandProfileSchema);
