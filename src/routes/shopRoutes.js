const express = require('express');
const productController = require('../controllers/shopController');

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();


router.get('/products', productController.getProducts);
router.get('/products/categories', productController.getCategories);
// router.post('/products/upload-image', productController.uploadProductImage);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;