const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate('supplier');
    res.status(200).json(products);
});

// @desc    Add a new product
// @route   POST /api/products
// @access  Public
exports.addProduct = asyncHandler(async (req, res) => {
    const { name, category, quantity, price, supplier } = req.body;
    const product = new Product({ name, category, quantity, price, supplier });
    const createdProduct = await product.save();
    res.status(201).json({
        message: "Product successfully added",  
        product: createdProduct 
    });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
exports.updateProduct = asyncHandler(async (req, res) => {
    const { name, category, quantity, price, supplier } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.category = category || product.category;
        product.quantity = quantity || product.quantity;
        product.price = price || product.price;
        product.supplier = supplier || product.supplier;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.remove();
        res.status(200).json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});
