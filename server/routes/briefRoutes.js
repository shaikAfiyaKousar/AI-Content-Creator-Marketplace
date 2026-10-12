const express = require('express');
const router = express.Router();
const {
  getBriefs,
  getBriefById,
  createBrief,
  updateBrief,
  deleteBrief,
  getMyBrandBriefs
} = require('../controllers/briefController');
const { protect, authorize } = require('../middleware/auth');

// Optional protect middleware helper
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', getBriefs);
router.get('/brand/my-briefs', protect, authorize('brand'), getMyBrandBriefs);
router.get('/:id', optionalProtect, getBriefById);
router.post('/', protect, authorize('brand'), createBrief);
router.put('/:id', protect, authorize('brand'), updateBrief);
router.delete('/:id', protect, authorize('brand'), deleteBrief);

module.exports = router;
