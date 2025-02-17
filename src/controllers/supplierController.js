const Supplier = require('../models/supplier');
const asyncHandler = require('../utils/asyncHandler');

exports.getSupplier = asyncHandler(async (req, res) => {
    try {
      // Fetch all suppliers and populate the products field with the actual product documents
      const suppliers = await Supplier.find({}); // Populate related products
  
      // Send the response back with the suppliers and their products
      res.status(200).json(suppliers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch suppliers', error });
    }
  });


exports.postSupplier = asyncHandler(async (req, res) => {
    const { name, contact, address} = req.body;
    const supplier = new Supplier({ name, contact, address });
    const createdSupplier = await supplier.save();
    res.status(201).json({
        message: "Supplier successfully added",
        supplier: createdSupplier,
    });
});