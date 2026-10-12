const express = require('express');
const router = express.Router();
const {
  applyToBrief,
  getApplicationsForBrief,
  getMyCreatorApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:briefId', protect, authorize('creator'), applyToBrief);
router.get('/brief/:briefId', protect, authorize('brand'), getApplicationsForBrief);
router.get('/creator/my-applications', protect, authorize('creator'), getMyCreatorApplications);
router.put('/:id/status', protect, authorize('brand'), updateApplicationStatus);

module.exports = router;
