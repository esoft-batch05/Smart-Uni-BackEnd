const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoute');
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const errorHandler = require('./middlewares/errorHandler');
const responseMiddleware = require("./middlewares/responseMiddleware");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(responseMiddleware); 
app.use(errorHandler);



app.use('/api/products', productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
