const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    brief: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CreativeBrief',
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pitch: {
      type: String,
      required: [true, 'Please explain your approach and experience for this brief'],
      trim: true
    },
    proposedRate: {
      type: Number,
      required: [true, 'Please propose a project rate']
    },
    estimatedDeliveryDays: {
      type: Number,
      required: [true, 'Please estimate delivery duration in days'],
      default: 5
    },
    samplePortfolioUrls: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    aiMatchScore: {
      type: Number,
      default: 0
    },
    aiMatchReason: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
