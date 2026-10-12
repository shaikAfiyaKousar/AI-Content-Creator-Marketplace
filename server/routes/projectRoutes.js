const express = require('express');
const router = express.Router();
const {
  getMyProjects,
  getProjectById,
  updateProjectStage,
  submitDeliverable,
  requestRevision,
  completeProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id/stage', protect, updateProjectStage);
router.post('/:id/deliverables', protect, submitDeliverable);
router.post('/:id/revisions', protect, requestRevision);
router.put('/:id/complete', protect, completeProject);

module.exports = router;
