const express = require("express");
const {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
    .get(protect, getProducts)    // Secured GET /api/products
    .post(protect, addProduct);   // Secured POST /api/products

router.route("/:id")
    .put(protect, updateProduct)  // Secured PUT /api/products/:id
    .delete(protect, deleteProduct); // Secured DELETE /api/products/:id

module.exports = router;
