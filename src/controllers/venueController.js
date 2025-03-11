const Venue = require('../models/venue');
const asyncHandler = require("../utils/asyncHandler");
const Event = require('../models/event');


exports.getClasses = async (req, res) => {
    try {
        const venues = await Venue.find().lean();
        
        const venuesWithEvents = await Promise.all(venues.map(async (venue) => {
            const events = await Event.find({ venue: venue._id });
            return { ...venue, events };
        }));

        return res.status(200).json({
            status: "success",
            message: "Venues retrieved successfully with assigned events",
            data: venuesWithEvents
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new class (venue)
exports.createClass = async (req, res) => {
    try {
        const { name, type, capacity, location, facilities } = req.body;

        const newVenue = new Venue({
            name,
            type,
            capacity,
            location,
            facilities
        });

        await newVenue.save();
        return res.status(201).json({
            status: "success",
            message: "Class registered successfully",
            data: {
                _id: newVenue._id,
                name: newVenue.name,
                type: newVenue.type,
                capacity: newVenue.capacity,
                available: newVenue.available,

            },
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};