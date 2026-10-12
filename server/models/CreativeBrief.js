const mongoose = require('mongoose');

const creativeBriefSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide project details and requirements'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      default: 'Advertising & Commercials'
    },
    budgetMin: {
      type: Number,
      required: true,
      default: 500
    },
    budgetMax: {
      type: Number,
      required: true,
      default: 1500
    },
    currency: {
      type: String,
      default: 'USD'
    },
    deliverables: {
      type: [String],
      default: ['3 High-Resolution Hero Images (4K)', '1 Animated Social Short (9:16)']
    },
    requiredAiTools: {
      type: [String],
      default: ['Midjourney', 'Runway']
    },
    promptGuidelines: {
      type: String,
      default: 'Clean cinematic lighting, hyper-realistic textures, studio setting.'
    },
    targetAudience: {
      type: String,
      default: 'Gen-Z and tech-forward consumers'
    },
    deadline: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'closed'],
      default: 'open'
    },
    applicationsCount: {
      type: Number,
      default: 0
    },
    selectedCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CreativeBrief', creativeBriefSchema);
