// controllers/messageController.js

const Message = require('../models/message');
const User = require('../models/user');

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    
    // Verify the other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Fetch messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    }).sort({ createdAt: 1 });
    
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all conversations of a user
exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get unique conversation users
    const sentMessages = await Message.find({ sender: userId }).distinct('recipient');
    const receivedMessages = await Message.find({ recipient: userId }).distinct('sender');
    
    const conversationUserIds = [...new Set([...sentMessages, ...receivedMessages])];
    
    const conversations = await Promise.all(conversationUserIds.map(async (otherUserId) => {
      const otherUser = await User.findById(otherUserId, 'username email avatar');
      const lastMessage = await Message.findOne({
        $or: [
          { sender: userId, recipient: otherUserId },
          { sender: otherUserId, recipient: userId }
        ]
      }).sort({ createdAt: -1 });
      
      return {
        user: otherUser,
        lastMessage
      };
    }));
    
    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, recipientId, content } = req.body;
    
    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    
    // Create and save the message
    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      content
    });
    
    await newMessage.save();
    
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }
    
    await message.deleteOne();
    
    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};