const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
    },
    eventType: {
        type: String,
        enum: ["free", "ticket"],
    },
    image: {
        type: String, 

    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    organizer: {
        type: String,
        required: true,
        trim: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;