const Message = require('../models/message');
const User = require('../models/user');

module.exports = function(io) {
  // Store online users
  const onlineUsers = new Map();

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Add user to online users
    socket.on('registerUser', async (userId) => {
      const user = await User.findById(userId);
      if (user) {
        socket.user = user;
        onlineUsers.set(user._id.toString(), socket.id);
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      }
    });

    // Handle new message
    socket.on('sendMessage', async (data) => {
      try {
        const { senderId, recipientId, content } = data;

        // Create new message in database
        const newMessage = new Message({
          sender: senderId,
          recipient: recipientId,
          content,
          timestamp: new Date(),
        });

        await newMessage.save();

        // Send to recipient if online
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('newMessage', {
            message: newMessage,
            sender: {
              _id: senderId,
              username: socket.user?.username || 'Unknown',
              avatar: socket.user?.avatar || '',
            },
          });
        }

        // Send confirmation to sender
        socket.emit('messageSent', newMessage);
      } catch (error) {
        socket.emit('messageError', { message: 'Failed to send message' });
      }
    });

    // Handle typing status
    socket.on('typing', (data) => {
      const { recipientId, userId } = data;
      const recipientSocketId = onlineUsers.get(recipientId);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('userTyping', { userId, username: socket.user?.username || 'Unknown' });
      }
    });

    // Handle stop typing
    socket.on('stopTyping', (data) => {
      const { recipientId, userId } = data;
      const recipientSocketId = onlineUsers.get(recipientId);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('userStoppedTyping', { userId });
      }
    });

    // Handle message read status
    socket.on('markAsRead', async (messageId) => {
      try {
        const message = await Message.findById(messageId);
        if (message) {
          message.read = true;
          await message.save();

          // Notify sender if online
          const senderSocketId = onlineUsers.get(message.sender.toString());
          if (senderSocketId) {
            io.to(senderSocketId).emit('messageRead', messageId);
          }
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to mark message as read' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.user) {
        console.log(`User disconnected: ${socket.user.username}`);
        onlineUsers.delete(socket.user._id.toString());
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      }
    });
  });
};
