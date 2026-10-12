const express = require('express');
const router = express.Router();
const {
  getCreators,
  getCreatorById,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} = require('../controllers/creatorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCreators);
router.get('/:id', getCreatorById);
router.post('/portfolio', protect, authorize('creator'), addPortfolioItem);
router.put('/portfolio/:id', protect, authorize('creator'), updatePortfolioItem);
router.delete('/portfolio/:id', protect, authorize('creator'), deletePortfolioItem);

module.exports = router;
