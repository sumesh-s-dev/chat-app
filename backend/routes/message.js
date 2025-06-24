const express = require('express');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

const router = express.Router();

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { chatId, content, type } = req.body;
    if (!chatId || !content) {
      return res.status(400).json({ message: 'chatId and content are required' });
    }
    const message = new Message({
      chat: chatId,
      sender: req.user,
      content,
      type: type || 'text',
    });
    await message.save();
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all messages for a chat
router.get('/:chatId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'username email')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 