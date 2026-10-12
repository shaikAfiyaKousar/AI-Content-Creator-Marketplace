const User = require('../models/User');
const CreatorProfile = require('../models/CreatorProfile');
const PortfolioItem = require('../models/PortfolioItem');

// @desc    Get all creators with advanced search & filters
// @route   GET /api/creators
exports.getCreators = async (req, res, next) => {
  try {
    const {
      search,
      category,
      aiTool,
      availability,
      minRate,
      maxRate,
      minExperience,
      minRating,
      sortBy
    } = req.query;

    const profileQuery = {};

    if (category) {
      profileQuery.categories = { $in: [new RegExp(category, 'i')] };
    }

    if (aiTool) {
      profileQuery.aiTools = { $in: [new RegExp(aiTool, 'i')] };
    }

    if (availability && availability !== 'all') {
      profileQuery.availability = availability;
    }

    if (minRate || maxRate) {
      profileQuery['pricing.hourlyRate'] = {};
      if (minRate) profileQuery['pricing.hourlyRate'].$gte = Number(minRate);
      if (maxRate) profileQuery['pricing.hourlyRate'].$lte = Number(maxRate);
    }

    if (minExperience) {
      profileQuery.experienceYears = { $gte: Number(minExperience) };
    }

    if (minRating) {
      profileQuery.rating = { $gte: Number(minRating) };
    }

    // Sort options
    let sortOptions = { rating: -1, completedProjects: -1 };
    if (sortBy === 'rate_asc') sortOptions = { 'pricing.hourlyRate': 1 };
    if (sortBy === 'rate_desc') sortOptions = { 'pricing.hourlyRate': -1 };
    if (sortBy === 'experience') sortOptions = { experienceYears: -1 };
    if (sortBy === 'projects') sortOptions = { completedProjects: -1 };
    if (sortBy === 'rating') sortOptions = { rating: -1 };

    // Fetch profiles and populate user
    let profiles = await CreatorProfile.find(profileQuery)
      .populate('user', 'name email avatar role')
      .sort(sortOptions);

    // If search term is provided, filter across user name, bio, tagline, skills, aiTools
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      profiles = profiles.filter(p => {
        const userName = p.user?.name?.toLowerCase() || '';
        const tagline = p.tagline?.toLowerCase() || '';
        const bio = p.bio?.toLowerCase() || '';
        const skills = (p.skills || []).map(s => s.toLowerCase());
        const tools = (p.aiTools || []).map(t => t.toLowerCase());

        return (
          userName.includes(q) ||
          tagline.includes(q) ||
          bio.includes(q) ||
          skills.some(s => s.includes(q)) ||
          tools.some(t => t.includes(q))
        );
      });
    }

    // Attach up to 3 recent portfolio previews for each creator
    const creatorUserIds = profiles.map(p => p.user?._id).filter(Boolean);
    const portfolioItems = await PortfolioItem.find({
      creator: { $in: creatorUserIds }
    }).sort({ featured: -1, createdAt: -1 });

    const creatorsWithPortfolio = profiles.map(profile => {
      const pObj = profile.toObject();
      pObj.portfolioPreviews = portfolioItems
        .filter(item => item.creator.toString() === profile.user?._id.toString())
        .slice(0, 4);
      return pObj;
    });

    res.json({
      success: true,
      count: creatorsWithPortfolio.length,
      creators: creatorsWithPortfolio
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single creator profile by userId or profileId
// @route   GET /api/creators/:id
exports.getCreatorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let profile = await CreatorProfile.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { user: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    }).populate('user', 'name email avatar role');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Creator profile not found' });
    }

    // Fetch full portfolio items
    const portfolio = await PortfolioItem.find({ creator: profile.user._id }).sort({
      featured: -1,
      createdAt: -1
    });

    res.json({
      success: true,
      creator: profile,
      portfolio
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a portfolio item
// @route   POST /api/creators/portfolio
exports.addPortfolioItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      mediaType,
      mediaUrl,
      thumbnailUrl,
      promptUsed,
      negativePrompt,
      aiToolsUsed,
      aspectRatio,
      generationParams,
      featured
    } = req.body;

    if (!title || !mediaUrl) {
      return res.status(400).json({ success: false, message: 'Title and Media URL are required' });
    }

    const item = await PortfolioItem.create({
      creator: req.user._id,
      title,
      description,
      category: category || 'Advertising & Commercials',
      mediaType: mediaType || 'image',
      mediaUrl,
      thumbnailUrl: thumbnailUrl || mediaUrl,
      promptUsed,
      negativePrompt,
      aiToolsUsed: aiToolsUsed && aiToolsUsed.length > 0 ? aiToolsUsed : ['Midjourney'],
      aspectRatio: aspectRatio || '16:9',
      generationParams: generationParams || {},
      featured: !!featured
    });

    res.status(201).json({
      success: true,
      portfolioItem: item
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a portfolio item
// @route   PUT /api/creators/portfolio/:id
exports.updatePortfolioItem = async (req, res, next) => {
  try {
    let item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    if (item.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this portfolio item' });
    }

    item = await PortfolioItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      portfolioItem: item
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a portfolio item
// @route   DELETE /api/creators/portfolio/:id
exports.deletePortfolioItem = async (req, res, next) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    if (item.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this portfolio item' });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Portfolio item removed successfully'
    });
  } catch (err) {
    next(err);
  }
};
