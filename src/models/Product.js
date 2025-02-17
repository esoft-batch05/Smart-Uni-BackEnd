const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    price: { type: Number, required: true },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true,
    },
    addedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
