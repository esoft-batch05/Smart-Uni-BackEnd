const Event = require("../models/event");
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

const updateResource = asyncHandler(async (req, res) => {
  const { resourceId } = req.params; // Event ID to update
  const { name, type, description, image, inStock } = req.body; // New data to update

  const resource = await Resource.findById(resourceId);

  if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
  }

  resource.name = name || resource.name;
  resource.type = type || resource.type;
  resource.description = description || resource.description;
  resource.image = image || resource.image;
  resource.inStock = inStock || resource.inStock;


  await resource.save();

  return res.status(200).json({
      status: "success",
      message: "Resource updated successfully",
      data: {
          _id: resource._id,
          name: resource.name,
          type: resource.type,
          description: resource.description,
          image: resource.image,
          inStock: resource.inStock,
         
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

const getAllPendingResources = asyncHandler(async (req, res) => {
    const pendingResources = await Resource.find({ status: "pending" }).populate("bookedBy event");
    return res.status(200).json({
        status: "success",
        message: "Pending resources retrieved successfully",
        data: pendingResources
    });
});

const createResource = asyncHandler(async (req, res) => {
    const { name, type, description, image, inStock } = req.body;
console.log(image);

    const resource = await Resource.create({
        name,
        type,
        description,
        image,
        inStock
    });

    return res.status(201).json({
        status: "success",
        message: "Resource created successfully",
        data: resource
    });
});

const deleteResource = asyncHandler(async (req, res) => {
    const { resourceId } = req.params;

    // Find and delete the resource
    const resource = await Resource.findByIdAndDelete(resourceId);
    if (!resource) {
        return res.status(404).json({ status: "error", message: "Resource not found" });
    }

    return res.status(200).json({
        status: "success",
        message: "Resource deleted successfully",
        data: resource
    });
});

const bookaResource = asyncHandler(async (req, res) => {
    const { resourceId } = req.params;
    const { userId, eventId, handoverDate } = req.body;

  

    const resource = await Resource.findById(resourceId);
    if (!resource) {
        return res.status(500).json({ message: "Resource not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(500).json({ message:user });
    }

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(500).json({ message: "Event not found" });
    }

    if (!resource.availability || parseInt(resource.inStock) === 0) {
        return res.status(400).json({ message: "Resource is not available for booking" });
    }

    let status = "pending";
    if (user.role === "admin") {
        status = "approved";
    }


    // Update resource details
    resource.bookedBy = userId;
    resource.event = eventId;
    resource.status = status;
    resource.handoverDate = handoverDate;
    resource.bookedAt = new Date();
    resource.inStock = (parseInt(resource.inStock) - 1).toString();
    resource.availability = parseInt(resource.inStock) > 0;

    await resource.save();

    return res.status(200).json({
        status: "success",
        message: "Resource booked successfully",
        data: {
            _id: resource._id,
            name: resource.name,
            type: resource.type,
            description: resource.description,
            image: resource.image,
            status : resource.status,
            inStock: resource.inStock,
            availability: resource.availability,
            bookedBy: user,
            event: event,
            handoverDate: resource.handoverDate,
            bookedAt: resource.bookedAt
        }
    });
});

const approveResource = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;

  const resource = await Resource.findById(resourceId);

  if (!resource) {
    return res.status(404).json({ message: "Resource not found" });
  }

  if (resource.status === "approved") {
    return res.status(400).json({ message: "Resource is already approved" });
  }

  resource.status = "approved";
  await resource.save();

  return res.status(200).json({
    status: "success",
    message: "Resource approved successfully",
    data: resource,
  });
});

module.exports = { bookResource, approveResource, getAllResources, getAllPendingResources, createResource, deleteResource, updateResource, bookaResource };

