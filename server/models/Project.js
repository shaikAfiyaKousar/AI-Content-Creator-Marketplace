const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    notes: { type: String, default: '' },
    promptUsed: { type: String, default: '' },
    aiToolsUsed: { type: [String], default: [] },
    submittedAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const revisionSchema = new mongoose.Schema(
  {
    feedback: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    brief: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CreativeBrief',
      required: true
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    title: {
      type: String,
      required: true
    },
    budget: {
      type: Number,
      required: true
    },
    deadline: {
      type: Date
    },
    stage: {
      type: String,
      enum: ['Pending', 'In Progress', 'Submitted', 'Revision Requested', 'Completed'],
      default: 'In Progress'
    },
    deliverables: [deliverableSchema],
    revisions: [revisionSchema],
    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, default: '' },
      createdAt: { type: Date }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
