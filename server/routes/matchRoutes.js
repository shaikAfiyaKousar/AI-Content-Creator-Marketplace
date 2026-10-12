const express = require('express');
const router = express.Router();
const {
  getRecommendationsForBrief,
  evaluateAdHocMatch
} = require('../controllers/matchingController');
const { protect } = require('../middleware/auth');

router.get('/recommendations/:briefId', getRecommendationsForBrief);
router.post('/evaluate', protect, evaluateAdHocMatch);

module.exports = router;
