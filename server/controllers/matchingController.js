const CreativeBrief = require('../models/CreativeBrief');
const CreatorProfile = require('../models/CreatorProfile');
const PortfolioItem = require('../models/PortfolioItem');
const { evaluateCreatorMatch } = require('../services/aiMatcher');

// @desc    Get AI-ranked creator recommendations for a specific brief
// @route   GET /api/match/recommendations/:briefId
exports.getRecommendationsForBrief = async (req, res, next) => {
  try {
    const { briefId } = req.params;

    const brief = await CreativeBrief.findById(briefId);
    if (!brief) {
      return res.status(404).json({ success: false, message: 'Creative brief not found' });
    }

    // Fetch all creators and their profiles
    const profiles = await CreatorProfile.find()
      .populate('user', 'name email avatar role');

    const creatorUserIds = profiles.map(p => p.user?._id).filter(Boolean);
    const portfolioItems = await PortfolioItem.find({
      creator: { $in: creatorUserIds }
    });

    const evaluatedCreators = profiles
      .filter(p => p.user) // ensure user exists
      .map(profile => {
        const creatorPortfolios = portfolioItems.filter(
          item => item.creator.toString() === profile.user._id.toString()
        );

        const matchResult = evaluateCreatorMatch(
          brief,
          profile.user,
          profile,
          creatorPortfolios
        );

        return {
          creator: profile.user,
          profile,
          portfolioPreviews: creatorPortfolios.slice(0, 3),
          aiMatchScore: matchResult.score,
          aiMatchReason: matchResult.explanation,
          factors: matchResult.factors
        };
      })
      .sort((a, b) => b.aiMatchScore - a.aiMatchScore);

    res.json({
      success: true,
      briefTitle: brief.title,
      briefCategory: brief.category,
      requiredTools: brief.requiredAiTools,
      budgetRange: `$${brief.budgetMin} - $${brief.budgetMax}`,
      count: evaluatedCreators.length,
      recommendations: evaluatedCreators
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Instant AI Match preview for ad-hoc brief parameters
// @route   POST /api/match/evaluate
exports.evaluateAdHocMatch = async (req, res, next) => {
  try {
    const { brief, creatorId } = req.body;

    if (!brief || !creatorId) {
      return res.status(400).json({ success: false, message: 'Brief specs and creatorId are required' });
    }

    const profile = await CreatorProfile.findOne({
      $or: [{ _id: creatorId }, { user: creatorId }]
    }).populate('user', 'name email avatar');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }

    const portfolioItems = await PortfolioItem.find({ creator: profile.user._id });

    const matchResult = evaluateCreatorMatch(
      brief,
      profile.user,
      profile,
      portfolioItems
    );

    res.json({
      success: true,
      matchResult
    });
  } catch (err) {
    next(err);
  }
};
