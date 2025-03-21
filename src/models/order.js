// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  billingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    fullAddress: { type: String, required: true },
    lastName: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  },
  customer: {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    fullName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    category: { type: String, default: 'Other' },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, min: 0 }
  }],
  payment: {
    cardHolder: { type: String },
    cardType: { type: String },
    expiryMonth: { type: String },
    expiryYear: { type: String },
    lastFourDigits: { type: String },
    method: { type: String, required: true },
    status: { type: String, required: true, default: 'Pending' }
  },
  totals: {
    shipping: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  userId: {
    type: String,
    required: true,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);