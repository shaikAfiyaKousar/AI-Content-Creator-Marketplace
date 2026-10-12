const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get messages between logged-in user and another user
// @route   GET /api/messages/thread/:otherUserId
exports.getThread = async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    const { projectId } = req.query;

    const query = {
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id }
      ]
    };

    if (projectId) {
      query.project = projectId;
    }

    const messages = await Message.find(query)
      .populate('sender', 'name email avatar role')
      .populate('receiver', 'name email avatar role')
      .sort({ createdAt: 1 });

    // Mark unread messages sent to me as read
    await Message.updateMany(
      { sender: otherUserId, receiver: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({
      success: true,
      messages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a message
// @route   POST /api/messages
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, projectId, briefId } = req.body;

    if (!receiverId || !content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Receiver and message content are required' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      project: projectId || null,
      brief: briefId || null,
      content: content.trim()
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name email avatar role')
      .populate('receiver', 'name email avatar role');

    res.status(201).json({
      success: true,
      message: populated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all distinct conversations for current user
// @route   GET /api/messages/conversations
exports.getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    })
      .populate('sender', 'name email avatar role')
      .populate('receiver', 'name email avatar role')
      .populate('project', 'title stage')
      .sort({ createdAt: -1 });

    const contactMap = new Map();

    messages.forEach(msg => {
      const isSender = msg.sender._id.toString() === currentUserId.toString();
      const partner = isSender ? msg.receiver : msg.sender;
      if (!partner) return;

      const partnerId = partner._id.toString();

      if (!contactMap.has(partnerId)) {
        contactMap.set(partnerId, {
          user: partner,
          lastMessage: msg.content,
          lastDate: msg.createdAt,
          unreadCount: (!isSender && !msg.read) ? 1 : 0,
          project: msg.project
        });
      } else {
        const item = contactMap.get(partnerId);
        if (!isSender && !msg.read) {
          item.unreadCount += 1;
        }
      }
    });

    const conversations = Array.from(contactMap.values());

    res.json({
      success: true,
      conversations
    });
  } catch (err) {
    next(err);
  }
};
