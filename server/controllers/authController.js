const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CreatorProfile = require('../models/CreatorProfile');
const BrandProfile = require('../models/BrandProfile');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hackxlerate_ai_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, tagline, bio, aiTools, categories } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const userRole = role === 'brand' ? 'brand' : 'creator';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });

    let profile = null;

    if (userRole === 'creator') {
      profile = await CreatorProfile.create({
        user: user._id,
        tagline: tagline || 'AI Visual Artist & Generative Media Specialist',
        bio: bio || 'Passionate about crafting cinematic AI media, prompt engineering, and visual stories.',
        aiTools: aiTools && aiTools.length > 0 ? aiTools : ['Midjourney', 'Flux', 'Runway', 'ChatGPT'],
        categories: categories && categories.length > 0 ? categories : ['Advertising & Commercials', 'Photorealistic Renders']
      });
    } else {
      profile = await BrandProfile.create({
        user: user._id,
        companyName: companyName || `${name}'s Agency`,
        bio: bio || 'Creative brand collaborating with innovative AI creators worldwide.'
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    let profile = null;
    if (user.role === 'creator') {
      profile = await CreatorProfile.findOne({ user: user._id });
    } else if (user.role === 'brand') {
      profile = await BrandProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;

    if (user.role === 'creator') {
      profile = await CreatorProfile.findOne({ user: user._id });
    } else if (user.role === 'brand') {
      profile = await BrandProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user and profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, ...profileFields } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    await user.save();

    let updatedProfile = null;
    if (user.role === 'creator') {
      updatedProfile = await CreatorProfile.findOneAndUpdate(
        { user: user._id },
        { $set: profileFields },
        { new: true, runValidators: true }
      );
    } else if (user.role === 'brand') {
      updatedProfile = await BrandProfile.findOneAndUpdate(
        { user: user._id },
        { $set: profileFields },
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      profile: updatedProfile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get list of demo accounts for quick testing
// @route   GET /api/auth/demo-accounts
exports.getDemoAccounts = async (req, res, next) => {
  try {
    const creators = await User.find({ role: 'creator' }).limit(3).select('name email role avatar');
    const brands = await User.find({ role: 'brand' }).limit(3).select('name email role avatar');
    
    res.json({
      success: true,
      demoAccounts: {
        creators,
        brands,
        defaultPassword: 'password123'
      }
    });
  } catch (err) {
    next(err);
  }
};
