const express = require('express');
const orderController = require('../controllers/orderController');

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();


router.get('/order', orderController.getAllOrders);
// router.post('/products/upload-image', productController.uploadProductImage);
router.get('/order/:id', orderController.getOrderById);
router.post('/saveOrder', orderController.createOrder);
router.put('/order/:id', orderController.updateOrder);
router.delete('/order/:id', orderController.deleteOrder);

module.exports = router;