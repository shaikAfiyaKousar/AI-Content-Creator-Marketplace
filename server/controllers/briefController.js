const CreativeBrief = require('../models/CreativeBrief');
const Application = require('../models/Application');
const BrandProfile = require('../models/BrandProfile');

// @desc    Get all open creative briefs (with search and filters)
// @route   GET /api/briefs
exports.getBriefs = async (req, res, next) => {
  try {
    const { category, aiTool, search, status, brandId } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['open', 'in_progress'] };
    }

    if (category) {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    if (aiTool) {
      query.requiredAiTools = { $in: [new RegExp(aiTool, 'i')] };
    }

    if (brandId) {
      query.brand = brandId;
    }

    let briefs = await CreativeBrief.find(query)
      .populate('brand', 'name email avatar')
      .sort({ createdAt: -1 });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      briefs = briefs.filter(b => {
        return (
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          (b.category || '').toLowerCase().includes(q) ||
          (b.requiredAiTools || []).some(t => t.toLowerCase().includes(q))
        );
      });
    }

    // Attach brand profile details (companyName)
    const brandIds = briefs.map(b => b.brand?._id).filter(Boolean);
    const brandProfiles = await BrandProfile.find({ user: { $in: brandIds } });
    const profileMap = new Map();
    brandProfiles.forEach(p => profileMap.set(p.user.toString(), p));

    const enrichedBriefs = briefs.map(b => {
      const bObj = b.toObject();
      const bProfile = profileMap.get(b.brand?._id?.toString());
      bObj.brandProfile = bProfile || null;
      return bObj;
    });

    res.json({
      success: true,
      count: enrichedBriefs.length,
      briefs: enrichedBriefs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single creative brief by ID
// @route   GET /api/briefs/:id
exports.getBriefById = async (req, res, next) => {
  try {
    const brief = await CreativeBrief.findById(req.params.id)
      .populate('brand', 'name email avatar');

    if (!brief) {
      return res.status(404).json({ success: false, message: 'Creative brief not found' });
    }

    const brandProfile = await BrandProfile.findOne({ user: brief.brand._id });

    // Count applications
    const appsCount = await Application.countDocuments({ brief: brief._id });

    // Check if current user has already applied
    let hasApplied = false;
    let userApplication = null;
    if (req.user) {
      userApplication = await Application.findOne({
        brief: brief._id,
        creator: req.user._id
      });
      if (userApplication) hasApplied = true;
    }

    res.json({
      success: true,
      brief: {
        ...brief.toObject(),
        brandProfile,
        applicationsCount: appsCount
      },
      hasApplied,
      userApplication
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new creative brief (Brands only)
// @route   POST /api/briefs
exports.createBrief = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      budgetMin,
      budgetMax,
      currency,
      deliverables,
      requiredAiTools,
      promptGuidelines,
      targetAudience,
      deadline
    } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({ success: false, message: 'Title, description, and deadline are required' });
    }

    const brief = await CreativeBrief.create({
      brand: req.user._id,
      title,
      description,
      category: category || 'Advertising & Commercials',
      budgetMin: Number(budgetMin) || 500,
      budgetMax: Number(budgetMax) || 1500,
      currency: currency || 'USD',
      deliverables: deliverables && deliverables.length > 0 ? deliverables : ['3 High-res Renders'],
      requiredAiTools: requiredAiTools && requiredAiTools.length > 0 ? requiredAiTools : ['Midjourney'],
      promptGuidelines: promptGuidelines || '',
      targetAudience: targetAudience || '',
      deadline: new Date(deadline),
      status: 'open'
    });

    // Update brand profile total briefs posted
    await BrandProfile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { totalBriefsPosted: 1 } }
    );

    res.status(201).json({
      success: true,
      brief
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a creative brief
// @route   PUT /api/briefs/:id
exports.updateBrief = async (req, res, next) => {
  try {
    let brief = await CreativeBrief.findById(req.params.id);
    if (!brief) {
      return res.status(404).json({ success: false, message: 'Creative brief not found' });
    }

    if (brief.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this brief' });
    }

    brief = await CreativeBrief.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      brief
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete or close a creative brief
// @route   DELETE /api/briefs/:id
exports.deleteBrief = async (req, res, next) => {
  try {
    const brief = await CreativeBrief.findById(req.params.id);
    if (!brief) {
      return res.status(404).json({ success: false, message: 'Creative brief not found' });
    }

    if (brief.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this brief' });
    }

    brief.status = 'closed';
    await brief.save();

    res.json({
      success: true,
      message: 'Creative brief closed successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get briefs published by the authenticated brand
// @route   GET /api/briefs/brand/my-briefs
exports.getMyBrandBriefs = async (req, res, next) => {
  try {
    const briefs = await CreativeBrief.find({ brand: req.user._id }).sort({ createdAt: -1 });

    // Also get applications count for each brief
    const briefsWithStats = await Promise.all(
      briefs.map(async b => {
        const appCount = await Application.countDocuments({ brief: b._id });
        return {
          ...b.toObject(),
          applicationsCount: appCount
        };
      })
    );

    res.json({
      success: true,
      briefs: briefsWithStats
    });
  } catch (err) {
    next(err);
  }
};
