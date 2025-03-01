const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require('./middlewares/errorHandler');
const responseMiddleware = require("./middlewares/responseMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(responseMiddleware);
app.use(errorHandler);



app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
