const express = require("express");
const router = express.Router();
const {
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder,
} = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").post(protect, createOrder).get(protect, getOrders);
router.route("/:id").patch(protect, updateOrder).delete(protect, deleteOrder);

module.exports = router;
