const Application = require('../models/Application');
const CreativeBrief = require('../models/CreativeBrief');
const Project = require('../models/Project');
const CreatorProfile = require('../models/CreatorProfile');
const PortfolioItem = require('../models/PortfolioItem');
const { evaluateCreatorMatch } = require('../services/aiMatcher');

// @desc    Apply to a creative brief (Creators only)
// @route   POST /api/applications/:briefId
exports.applyToBrief = async (req, res, next) => {
  try {
    const { briefId } = req.params;
    const { pitch, proposedRate, estimatedDeliveryDays, samplePortfolioUrls } = req.body;

    const brief = await CreativeBrief.findById(briefId);
    if (!brief) {
      return res.status(404).json({ success: false, message: 'Creative brief not found' });
    }

    if (brief.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This brief is no longer open for applications' });
    }

    const existingApp = await Application.findOne({
      brief: briefId,
      creator: req.user._id
    });

    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied to this brief' });
    }

    // Retrieve creator profile and portfolio to calculate AI match score
    const creatorProfile = await CreatorProfile.findOne({ user: req.user._id });
    const portfolioItems = await PortfolioItem.find({ creator: req.user._id });

    const matchResult = evaluateCreatorMatch(
      brief,
      req.user,
      creatorProfile || {},
      portfolioItems,
      Number(proposedRate) || brief.budgetMin
    );

    const application = await Application.create({
      brief: briefId,
      creator: req.user._id,
      pitch,
      proposedRate: Number(proposedRate) || brief.budgetMin,
      estimatedDeliveryDays: Number(estimatedDeliveryDays) || 5,
      samplePortfolioUrls: samplePortfolioUrls || [],
      aiMatchScore: matchResult.score,
      aiMatchReason: matchResult.explanation,
      status: 'pending'
    });

    // Increment brief applications count
    await CreativeBrief.findByIdAndUpdate(briefId, { $inc: { applicationsCount: 1 } });

    res.status(201).json({
      success: true,
      application,
      aiMatchResult: matchResult
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get applications for a brief (Brand only)
// @route   GET /api/applications/brief/:briefId
exports.getApplicationsForBrief = async (req, res, next) => {
  try {
    const { briefId } = req.params;

    const brief = await CreativeBrief.findById(briefId);
    if (!brief) {
      return res.status(404).json({ success: false, message: 'Creative brief not found' });
    }

    if (brief.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view applications for this brief' });
    }

    const applications = await Application.find({ brief: briefId })
      .populate('creator', 'name email avatar')
      .sort({ aiMatchScore: -1, createdAt: -1 });

    // Populate creator profiles
    const creatorUserIds = applications.map(a => a.creator._id);
    const profiles = await CreatorProfile.find({ user: { $in: creatorUserIds } });
    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.user.toString(), p));

    const enrichedApps = applications.map(app => {
      const appObj = app.toObject();
      appObj.creatorProfile = profileMap.get(app.creator._id.toString()) || null;
      return appObj;
    });

    res.json({
      success: true,
      count: enrichedApps.length,
      applications: enrichedApps
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current creator's applications
// @route   GET /api/applications/creator/my-applications
exports.getMyCreatorApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ creator: req.user._id })
      .populate({
        path: 'brief',
        populate: { path: 'brand', select: 'name email avatar' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status (accept or reject)
// @route   PUT /api/applications/:id/status
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be accepted or rejected' });
    }

    const application = await Application.findById(req.params.id).populate('brief');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const brief = application.brief;
    if (brief.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    if (
      status === 'accepted' &&
      brief.status !== 'open' &&
      brief.selectedCreator?.toString() !== application.creator.toString()
    ) {
      return res.status(409).json({ success: false, message: 'This brief already has a selected creator' });
    }

    application.status = status;
    await application.save();

    let project = null;

    if (status === 'accepted') {
      // 1. Update brief status & creator
      brief.status = 'in_progress';
      brief.selectedCreator = application.creator;
      await brief.save();

      // 2. Reject other applications or mark them
      await Application.updateMany(
        { brief: brief._id, _id: { $ne: application._id }, status: 'pending' },
        { status: 'rejected' }
      );

      // 3. Create or find corresponding Project
      project = await Project.findOne({ brief: brief._id, application: application._id });
      if (!project) {
        project = await Project.create({
          brief: brief._id,
          brand: req.user._id,
          creator: application.creator,
          application: application._id,
          title: brief.title,
          budget: application.proposedRate || brief.budgetMax,
          deadline: brief.deadline,
          stage: 'In Progress'
        });
      }
    }

    res.json({
      success: true,
      application,
      project
    });
  } catch (err) {
    next(err);
  }
};
