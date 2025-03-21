const Order = require('../models/order'); 
const mongoose = require('mongoose');

class OrderController {
  /**
   * Create a new order
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createOrder(req, res) {
    try {
      const {
        billingAddress,
        customer,
        items,
        payment,
        totals,
        userId
      } = req.body;

      // Validate required fields
      if (!items || !items.length || !customer || !customer.email || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      // Generate orderId with timestamp
      const orderDate = new Date();
      const orderId = `ORD-${orderDate.getTime()}`;

      const newOrder = new Order({
        orderId,
        orderDate,
        orderStatus: 'Pending',
        billingAddress,
        customer,
        items,
        payment,
        totals,
        userId
      });

      const savedOrder = await newOrder.save();
      
      return res.status(201).json({
        success: true,
        data: savedOrder
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating order',
        error: error.message
      });
    }
  }

  /**
   * Get all orders
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllOrders(req, res) {
    try {
      const { page = 1, limit = 10, status, userId } = req.query;
      
      const query = {};
      
      // Filter by status if provided
      if (status) {
        query.orderStatus = status;
      }
      
      // Filter by userId if provided
      if (userId) {
        query.userId = userId;
      }

      const options = {
        sort: { orderDate: -1 }, // Sort by most recent
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit)
      };

      const orders = await Order.find(query, null, options);
      const totalOrders = await Order.countDocuments(query);

      return res.status(200).json({
        success: true,
        count: orders.length,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: parseInt(page),
        data: orders
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching orders',
        error: error.message
      });
    }
  }

  /**
   * Get order by orderId
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getOrderById(req, res) {
    try {
      const { orderId } = req.params;
      
      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      const order = await Order.findOne({ orderId });
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching order',
        error: error.message
      });
    }
  }
  
  /**
   * Get orders by user ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getOrdersByUser(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, status } = req.query;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const query = { userId };
      
      // Filter by status if provided
      if (status) {
        query.orderStatus = status;
      }

      const options = {
        sort: { orderDate: -1 }, // Sort by most recent
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit)
      };

      const orders = await Order.find(query, null, options);
      const totalOrders = await Order.countDocuments(query);

      return res.status(200).json({
        success: true,
        count: orders.length,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: parseInt(page),
        data: orders
      });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching user orders',
        error: error.message
      });
    }
  }

  /**
   * Update order status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { orderStatus } = req.body;
      
      if (!orderId || !orderStatus) {
        return res.status(400).json({
          success: false,
          message: 'Order ID and status are required'
        });
      }

      // Validate status
      const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        { orderStatus },
        { new: true, runValidators: true }
      );
      
      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedOrder
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating order status',
        error: error.message
      });
    }
  }

  /**
   * Update order details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateOrder(req, res) {
    try {
      const { orderId } = req.params;
      const updates = req.body;
      
      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      // Prevent updating sensitive fields
      const restrictedFields = ['orderId', 'orderDate', 'userId'];
      restrictedFields.forEach(field => {
        delete updates[field];
      });

      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        updates,
        { new: true, runValidators: true }
      );
      
      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedOrder
      });
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating order',
        error: error.message
      });
    }
  }

  /**
   * Delete order by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteOrder(req, res) {
    try {
      const { orderId } = req.params;
      
      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      const deletedOrder = await Order.findOneAndDelete({ orderId });
      
      if (!deletedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting order',
        error: error.message
      });
    }
  }
}

module.exports = new OrderController();