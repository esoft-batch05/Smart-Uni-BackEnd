const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const connectDB = require('./config/db');
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const fileUploadRoutes = require("./routes/fileUploadRoutes");
const emailRoutes = require("./routes/emailRoutes");
const messageRoutes = require("./routes/messageRoutes");
const venueRoutes = require("./routes/venueRoutes");
const classRoutes = require("./routes/classRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const shopRoutes = require("./routes/shopRoutes");

const errorHandler = require('./middlewares/errorHandler');
const responseMiddleware = require("./middlewares/responseMiddleware");

dotenv.config();
connectDB();



const app = express();
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseMiddleware);
app.use(errorHandler);
app.get("/", (req, res) => res.send("Express on Vercel"));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next) => {
    if (err && err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false, 
                message: 'File too large. Maximum size is 5MB' 
            });
        }
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }
    next(err);
});

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/file", fileUploadRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/resource", resourceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/venue', venueRoutes);
app.use('/api/class', classRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/shop', shopRoutes);


require('../src/Services/socketService')(io);

module.exports = { app, server };