// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require("../middlewares/authMiddleware");


// Get conversations list
router.get('/conversations/:currentUserId',protect, messageController.getConversations);

// Get messages between current user and another user
router.get('/:userId',protect, messageController.getMessages);

// Send a new message
router.post('/:senderId',protect, messageController.sendMessage);

// Delete a message
router.delete('/:messageId',protect, messageController.deleteMessage);

module.exports = router;