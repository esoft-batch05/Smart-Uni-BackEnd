// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require("../middlewares/authMiddleware");


// Get conversations list
router.get('/conversations/:userId', messageController.getConversations);

// Get messages between current user and another user
router.get('/:userId/:otherUserId', messageController.getMessages);

// Send a new message
router.post('/:senderId', messageController.sendMessage);

// Delete a message
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;