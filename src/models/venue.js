const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Venue', venueSchema);