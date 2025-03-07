const Resource = require("../models/resource");
const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");

// Controller to book a resource
const bookResource = asyncHandler(async (req, res) => {
    const { resourceId, userId, eventId } = req.body;

    // Find the resource
    const resource = await Resource.findById(resourceId);
    if (!resource) {
        return res.status(404).json({ status: "error", message: "Resource not found" });
    }

    // Check if already booked
    if (!resource.availability) {
        return res.status(400).json({ status: "error", message: "Resource is already booked" });
    }

    // Find the user role
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Determine status based on role
    let status = "Pending";
    if (user.role === "admin") {
        status = "Approved";
    }

    // Update resource booking details
    resource.bookedBy = userId;
    resource.event = eventId;
    resource.bookedAt = new Date();
    resource.availability = false;
    resource.status = status;
    await resource.save();

    return res.status(201).json({
        status: "success",
        message: "Resource booked successfully",
        data: {
            _id: resource._id,
            name: resource.name,
            type: resource.type,
            status: resource.status,
            availability: resource.availability,
            bookedBy: resource.bookedBy,
            event: resource.event,
            bookedAt: resource.bookedAt,
        }
    });
});

// Controller to get all resources
const getAllResources = asyncHandler(async (req, res) => {
    const resources = await Resource.find().populate("bookedBy event");
    return res.status(200).json({
        status: "success",
        message: "Resources retrieved successfully",
        data: resources
    });
});

const createResource = asyncHandler(async (req, res) => {
    const { name, type, description, images } = req.body;

    const resource = await Resource.create({
        name,
        type,
        description,
        images
    });

    return res.status(201).json({
        status: "success",
        message: "Resource created successfully",
        data: resource
    });
});

module.exports = { bookResource, getAllResources, createResource };