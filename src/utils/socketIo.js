const socketIo = require('socket.io');
const Message = require('../models/message');

function setupSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5000", // Your React app's URL
      methods: ["GET", "POST"]
    }
  });

  // Store active users
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected');

    // User authentication and connection
    socket.on('register', (userId) => {
      activeUsers.set(userId, socket.id);
      console.log(`User ${userId} connected`);
    });

    // Send message
    socket.on('send_message', async (messageData) => {
      try {
        // Create and save message
        const newMessage = new Message({
          sender: messageData.senderId,
          receiver: messageData.receiverId,
          content: messageData.content
        });
        await newMessage.save();

        // Find receiver's socket
        const receiverSocketId = activeUsers.get(messageData.receiverId);
        
        if (receiverSocketId) {
          // Send message to receiver if online
          io.to(receiverSocketId).emit('receive_message', newMessage);
        }

        // Broadcast to sender
        socket.emit('message_sent', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      for (let [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
}

module.exports = setupSocket;