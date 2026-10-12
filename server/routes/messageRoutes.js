const express = require('express');
const router = express.Router();
const {
  getThread,
  sendMessage,
  getConversations
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.get('/thread/:otherUserId', protect, getThread);
router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);

module.exports = router;
