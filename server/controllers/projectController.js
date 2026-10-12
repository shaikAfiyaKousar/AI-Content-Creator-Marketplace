const Project = require('../models/Project');
const CreativeBrief = require('../models/CreativeBrief');
const CreatorProfile = require('../models/CreatorProfile');

// @desc    Get all projects for the current user (brand or creator)
// @route   GET /api/projects
exports.getMyProjects = async (req, res, next) => {
  try {
    const isBrand = req.user.role === 'brand';
    const query = isBrand ? { brand: req.user._id } : { creator: req.user._id };

    const projects = await Project.find(query)
      .populate('brand', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('brief', 'title category budgetMin budgetMax deliverables deadline status')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('brand', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('brief');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Verify authorized user
    const isBrand = project.brand._id.toString() === req.user._id.toString();
    const isCreator = project.creator._id.toString() === req.user._id.toString();

    if (!isBrand && !isCreator && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
    }

    res.json({
      success: true,
      project
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update project stage directly
// @route   PUT /api/projects/:id/stage
exports.updateProjectStage = async (req, res, next) => {
  try {
    const { stage } = req.body;
    const validStages = ['Pending', 'In Progress', 'Submitted', 'Revision Requested', 'Completed'];

    if (!validStages.includes(stage)) {
      return res.status(400).json({ success: false, message: `Invalid stage. Must be one of: ${validStages.join(', ')}` });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isBrand = project.brand.toString() === req.user._id.toString();
    const isCreator = project.creator.toString() === req.user._id.toString();

    if (!isBrand && !isCreator) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this project' });
    }

    project.stage = stage;
    if (stage === 'Completed') {
      // Mark associated brief as completed
      await CreativeBrief.findByIdAndUpdate(project.brief, { status: 'completed' });
    }

    await project.save();

    res.json({
      success: true,
      project
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit a deliverable (Creator only)
// @route   POST /api/projects/:id/deliverables
exports.submitDeliverable = async (req, res, next) => {
  try {
    const { title, url, notes, promptUsed, aiToolsUsed } = req.body;

    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Deliverable title and URL are required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the assigned creator can submit deliverables' });
    }

    project.deliverables.push({
      title,
      url,
      notes: notes || '',
      promptUsed: promptUsed || '',
      aiToolsUsed: aiToolsUsed || [],
      submittedAt: new Date()
    });

    // Automatically transition to 'Submitted' stage
    project.stage = 'Submitted';
    await project.save();

    res.status(201).json({
      success: true,
      project
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Request revision (Brand only)
// @route   POST /api/projects/:id/revisions
exports.requestRevision = async (req, res, next) => {
  try {
    const { feedback } = req.body;

    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ success: false, message: 'Revision feedback notes are required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the project brand can request revisions' });
    }

    project.revisions.push({
      feedback,
      requestedAt: new Date()
    });

    project.stage = 'Revision Requested';
    await project.save();

    res.json({
      success: true,
      project
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve deliverables & complete project (Brand only)
// @route   PUT /api/projects/:id/complete
exports.completeProject = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the project brand can approve and complete this project' });
    }

    project.stage = 'Completed';
    if (rating) {
      project.review = {
        rating: Math.min(5, Math.max(1, Number(rating))),
        comment: feedback || '',
        createdAt: new Date()
      };

      // Recalculate creator average rating and increment completedProjects
      const creatorProfile = await CreatorProfile.findOne({ user: project.creator });
      if (creatorProfile) {
        const currentTotalScore = (creatorProfile.rating || 5) * (creatorProfile.reviewsCount || 1);
        const newCount = (creatorProfile.reviewsCount || 0) + 1;
        const newRating = Number(((currentTotalScore + Number(rating)) / newCount).toFixed(1));

        creatorProfile.rating = newRating;
        creatorProfile.reviewsCount = newCount;
        creatorProfile.completedProjects = (creatorProfile.completedProjects || 0) + 1;
        await creatorProfile.save();
      }
    }

    await CreativeBrief.findByIdAndUpdate(project.brief, { status: 'completed' });
    await project.save();

    res.json({
      success: true,
      project
    });
  } catch (err) {
    next(err);
  }
};
