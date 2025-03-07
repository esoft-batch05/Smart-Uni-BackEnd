const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ["Technical", "Furniture", "Electronics", "Lighting", "Audio", "Visual", "Other"],
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
    },
    description: {
        type: String,
        trim: true
    },
    availability: {
        type: Boolean,
        default: true 
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', 
        default: null
    },
    bookedAt: {
        type: Date,
        default: null
    },
    images: [{
        type: String, 
        default: []
    }],
    handoverDate: {
        type: Date,
        default: null 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
