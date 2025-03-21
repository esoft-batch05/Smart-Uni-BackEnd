const Product = require('../models/shop');
const fs = require('fs');
const path = require('path');

const productController = {
  // Get all products with pagination and filtering
  getProducts: async (req, res) => {
    try {
      const { search, category, page = 1, limit = 5 } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;
      
      // Build query based on filters
      let query = {};
      
      if (search) {
        query.$text = { $search: search };
      }
      
      if (category) {
        query.category = category;
      }
      
      // Execute query with pagination
      const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
      
      // Get total count for pagination
      const total = await Product.countDocuments(query);
      
      res.status(200).json({
        data: products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
  },
  
  // Get a single product by ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("id", id);
      
      const product = await Product.findById(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error('Error getting product by ID:', error);
      res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
  },
  
  // Create a new product
  createProduct: async (req, res) => {
    try {
      const productData = req.body;
      // Frontend will send the image URL directly
      const product = new Product(productData);
      await product.save();
      
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(400).json({ message: 'Error creating product', error: error.message });
    }
  },
  
  // Update an existing product
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Add updated timestamp
      updates.updatedAt = Date.now();
      
      const product = await Product.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(400).json({ message: 'Error updating product', error: error.message });
    }
  },
  
  // Delete a product
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);      
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
  },
  
  // Get all unique categories
  getCategories: async (req, res) => {
    try {
      const categories = await Product.distinct('category');
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
  }
};

module.exports = productController;