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
    description: {
        type: String,
        trim: true
    },
    availability: {
        type: Boolean,
        default: true // Indicates if the resource is available for booking
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User who booked it
        default: null
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', // References the event for which the resource is booked
        default: null
    },
    bookedAt: {
        type: Date,
        default: null
    },
    images: [{
        type: String, // Stores the file path or URL of the image
        default: []
    }],
    handoverDate: {
        type: Date,
        default: null // Date when the resource should be handed over
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
