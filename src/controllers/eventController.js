const Event = require("../models/event");
const asyncHandler = require("../utils/asyncHandler");
const Class = require("../models/class");



const createEvent = asyncHandler(async (req, res) => {
  try {
    // Extract role from request body
    const { name, description, date, phoneNumber, image, location, organizer, attendees, eventType, role, proposal, venue } = req.body;

    // Validate role before proceeding
    if (!role || !["admin", "lecturer", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // Set event status based on role
    const status = role === "admin" ? "approved" : "pending";

    // Create event
    const event = await Event.create({
      name,
      description,
      date,
      phoneNumber,
      location,
      proposal,
      image,
      eventType,
      status, 
      organizer,
      attendees,
      venue,
    });

    if (event) {
      return res.status(201).json({
        status: "success",
        message: "Event registered successfully",
        data: {
          _id: event._id,
          name: event.name,
          description: event.description,
          date: event.date,
          phoneNumber: event.phoneNumber,
          location: event.location,
          image: event.image,
          proposal : event.proposal,
          status: event.status, 
          eventType: event.eventType,
          organizer: event.organizer,
          attendees: event.attendees,
          venue: event.venue,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid event data" });
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Server error" });
  }
});



const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params; // Event ID to update
  const { name, description, date, location, organizer, attendees, image, venue } = req.body; // New data to update

  // Find the event by its ID
  const event = await Event.findById(eventId);

  if (!event) {
      return res.status(404).json({ message: "Event not found" });
  }

  // Update the event with new data
  event.name = name || event.name;
  event.description = description || event.description;
  event.date = date || event.date;
  event.location = location || event.location;
  event.organizer = organizer || event.organizer;
  event.attendees = attendees || event.attendees;
  event.image = image || event.image;
  event.venue = venue || event.venue;

  // Save the updated event
  await event.save();

  // Return the updated event data
  return res.status(200).json({
      status: "success",
      message: "Event updated successfully",
      data: {
          _id: event._id,
          name: event.name,
          description: event.description,
          date: event.date,
          phoneNumber: event.phoneNumber,
          location: event.location,
          organizer: event.organizer,
          attendees: event.attendees,
          venue: event.venue,
      }
  });
});

const deAttendEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;  // Get event ID from URL
  const { userId } = req.body;     // Get user ID from request body

  // Find the event
  const event = await Event.findById(eventId);
  if (!event) {
      return res.status(404).json({ message: "Event not found" });
  }

  // Check if the user is actually attending
  if (!event.attendees.includes(userId)) {
      return res.status(400).json({ message: "User is not attending this event" });
  }

  // Remove the user from the attendees array
  event.attendees = event.attendees.filter(id => id.toString() !== userId);

  // Save the updated event
  await event.save();

  // Return the updated event details
  return res.status(200).json({
      status: "success",
      message: "User removed from attendees list",
      data: event
  });
});



const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: "approved" })
    .populate({
      path: "attendees",
      select: "-password -__v -dateOfBirth -joinedDate -isActive"
    })
    .populate("venue"); // Populating venue details

  if (events.length > 0) {
    return res.status(200).json({
      status: "success",
      message: "Approved events retrieved successfully",
      data: events
    });
  } else {
    return res.status(404).json({ message: "No approved events found" });
  }
});


const getPendingEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: "pending" }).populate({
    path: "attendees",
    select: "-password -__v -dateOfBirth -joinedDate -isActive"
  });

  if (events.length > 0) {
    return res.status(200).json({
      status: "success",
      message: "pending events retrieved successfully",
      data: events
    });
  } else {
    return res.status(404).json({ message: "No approved events found" });
  }
});

const getAprovedEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: "approved" }).populate({
    path: "attendees",
    select: "-password -__v -dateOfBirth -joinedDate -isActive"
  });

  if (events.length > 0) {
    return res.status(200).json({
      status: "success",
      message: "Approved events retrieved successfully",
      data: events
    });
  } else {
    return res.status(404).json({ message: "No approved events found" });
  }
});

const approveEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.status === "approved") {
    return res.status(400).json({ message: "Event is already approved" });
  }

  event.status = "approved";
  await event.save();

  return res.status(200).json({
    status: "success",
    message: "Event approved successfully",
    data: event,
  });
});



const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params; // Extract eventId from URL params

  // Find and delete the event by ID
  const event = await Event.findByIdAndDelete(eventId);

  // If event doesn't exist, return a 404 response
  if (!event) {
      return res.status(404).json({ message: "Event not found" });
  }

  // Respond with a success message
  return res.status(200).json({
      status: "success",
      message: "Event deleted successfully"
  });
});

const attendEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }


  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }


  if (event.attendees.includes(userId)) {
    return res.status(400).json({ message: "User already attending this event" });
  }


  event.attendees.push(userId);
  await event.save();


  const updatedEvent = await Event.findById(eventId)
    .populate({
      path: "attendees",
      select: "-password -__v -dateOfBirth -joinedDate -isActive"
    });

  return res.status(200).json({
    status: "success",
    message: "User successfully attended the event",
    data: updatedEvent
  });
});

const getApprovedClassesAndEvents = asyncHandler(async (req, res) => {
  try {
    // Get all approved events
    const events = await Event.find({ status: "approved" })
      .populate({
        path: "attendees",
        select: "-password -__v -dateOfBirth -joinedDate -isActive"
      })
      .populate("venue");

    // Get all approved classes
    const classes = await Class.find()
      .populate("instructor", "-password")
      .populate("students")
      .populate("venue")
      .lean();

    // Combine the results
    const result = {
      events: events || [],
      classes: classes || []
    };

    if (events.length > 0 || classes.length > 0) {
      return res.status(200).json({
        status: "success",
        message: "Approved classes and events retrieved successfully",
        data: result
      });
    } else {
      return res.status(404).json({ message: "No approved classes or events found" });
    }
  } catch (error) {
    console.error("Error retrieving approved classes and events:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = {
  createEvent,
  getAllEvents,
  attendEvent,
  updateEvent,
  getPendingEvents,
  getAprovedEvents,
  approveEvent,
  deleteEvent,
  deAttendEvent,
  getApprovedClassesAndEvents,
}