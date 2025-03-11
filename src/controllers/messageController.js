// controllers/messageController.js

const Message = require('../models/message');
const User = require('../models/user');

exports.getMessages = async (req, res) => {
  try {
    const userId  = req.params.userId;
    const currentUserId = req.params._id;
    
    // Verify the other user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get messages between current user and the other user
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId }
      ]
    }).sort({ timestamp: 1 });
    
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.params.userId;
    
    // Get all unique conversations the user has
    const sentMessages = await Message.find({ sender: currentUserId })
      .distinct('recipient');
    
    const receivedMessages = await Message.find({ recipient: currentUserId })
      .distinct('sender');
    
    // Combine and remove duplicates
    const conversationUserIds = [...new Set([...sentMessages, ...receivedMessages])];
    
    // Get last message and user info for each conversation
    const conversations = await Promise.all(conversationUserIds.map(async (userId) => {
      const otherUser = await User.findById(userId, 'username email avatar');
      
      const lastMessage = await Message.findOne({
        $or: [
          { sender: currentUserId, recipient: userId },
          { sender: userId, recipient: currentUserId }
        ]
      }).sort({ timestamp: -1 });
      
      // Count unread messages
      const unreadCount = await Message.countDocuments({
        sender: userId,
        recipient: currentUserId,
        read: false
      });
      
      return {
        user: otherUser,
        lastMessage,
        unreadCount
      };
    }));
    
    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.params.senderId;

    
    
    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    
    // Create new message
    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      content,
      timestamp: new Date()
    });
    
    await newMessage.save();
    
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;
    
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if user is the sender
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }
    
    await message.deleteOne();
    
    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};