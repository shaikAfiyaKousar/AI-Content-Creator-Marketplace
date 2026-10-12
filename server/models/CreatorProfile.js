const mongoose = require('mongoose');

const creatorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    tagline: {
      type: String,
      default: 'AI Visual Artist & Generative Media Specialist',
      trim: true
    },
    bio: {
      type: String,
      default: 'Passionate AI creator leveraging cutting-edge generative tools to craft next-generation commercial content.',
      trim: true
    },
    skills: {
      type: [String],
      default: ['Prompt Engineering', 'LoRA Fine-Tuning', 'Upscaling & Inpainting', 'Visual Storytelling']
    },
    aiTools: {
      type: [String],
      default: ['Midjourney', 'Stable Diffusion', 'Runway', 'Flux', 'ChatGPT']
    },
    categories: {
      type: [String],
      default: ['Advertising & Commercials', 'Photorealistic Renders', 'Concept Art']
    },
    pricing: {
      hourlyRate: { type: Number, default: 75 },
      projectMin: { type: Number, default: 500 },
      currency: { type: String, default: 'USD' }
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'booked'],
      default: 'available'
    },
    experienceYears: {
      type: Number,
      default: 2
    },
    location: {
      type: String,
      default: 'Remote'
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 12
    },
    completedProjects: {
      type: Number,
      default: 18
    },
    badges: {
      type: [String],
      default: ['Verified Creator', 'Top Rated']
    },
    socialLinks: {
      portfolioUrl: { type: String, default: '' },
      x: { type: String, default: '' },
      instagram: { type: String, default: '' },
      artstation: { type: String, default: '' },
      github: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CreatorProfile', creatorProfileSchema);
