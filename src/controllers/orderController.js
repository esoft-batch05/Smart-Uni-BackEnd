const Order = require("../models/order");

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { product, supplier, quantity } = req.body;
        const order = await Order.create({ product, supplier, quantity });
        res.sendResponse(201, "success", "Order created successfully", order);
    } catch (error) {
        res.status(500).json({ message: "Failed to create order", error });
    }
};

// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({ path: "product", select: "name _id category" }) 
            .populate({ path: "supplier", select: "name _id" }); 
            res.sendResponse(200, "success", "Orders retrieved successfully", orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
};

// Update order status
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(updatedOrder);
        
    } catch (error) {
        res.status(500).json({ message: "Failed to update order", error });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndDelete(id);
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete order", error });
    }
};

module.exports = { createOrder, getOrders, updateOrder, deleteOrder };
