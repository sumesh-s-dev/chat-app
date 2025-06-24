const express = require('express');
const Chat = require('../models/Chat');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create chat (1:1 or group)
router.post('/', auth, async (req, res) => {
  try {
    const { userIds, name, isGroup } = req.body;
    if (!Array.isArray(userIds) || userIds.length < (isGroup ? 2 : 1)) {
      return res.status(400).json({ message: 'Invalid user list' });
    }
    const users = [...userIds, req.user];
    const chat = new Chat({
      name: isGroup ? name : undefined,
      isGroup: !!isGroup,
      users,
      admins: isGroup ? [req.user] : [],
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all chats for current user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user })
      .populate('users', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 