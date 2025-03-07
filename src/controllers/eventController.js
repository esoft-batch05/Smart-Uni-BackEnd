const Event = require("../models/event");
const asyncHandler = require("../utils/asyncHandler");


const createEvent = asyncHandler(async (req, res) => {
  const { name, description, date, phoneNumber, image, location, organizer, attendees,status, eventType } =
    req.body;

  const event = await Event.create({
    name,
    description,
    date,
    phoneNumber,
    location,
    image,
    eventType,
    status,
    organizer,
    attendees,
  });

  if (event) {
    return res.status(201).json({
      status: "success",
      message: "Event registerd successfully",
      data: {
        _id: event._id,
        name: event.name,
        description: event.description,
        date: event.date,
        phoneNumber: event.phoneNumber,
        location: event.location,
        image: event.image,
        status: event.status,
        eventType: event.eventType,
        organizer: event.organizer,
        attendees: event.attendees,
      }
    })
  } else {
    return res.status(400).json({ message: "Invalid Event data" });
  }

})

const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params; // Event ID to update
  const { name, description, date, phoneNumber, location, organizer, attendees } = req.body; // New data to update

  // Find the event by its ID
  const event = await Event.findById(eventId);

  if (!event) {
      return res.status(404).json({ message: "Event not found" });
  }

  // Update the event with new data
  event.name = name || event.name;
  event.description = description || event.description;
  event.date = date || event.date;
  event.phoneNumber = phoneNumber || event.phoneNumber;
  event.location = location || event.location;
  event.organizer = organizer || event.organizer;
  event.attendees = attendees || event.attendees;

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
  const events = await Event.find().populate({
    path: "attendees",
    select: "-password -__v -dateOfBirth -joinedDate -isActive"
  });

  if (events.length > 0) {
    return res.status(200).json({
      status: "success",
      message: "Events retrieved successfully",
      data: events
    });
  } else {
    return res.status(404).json({ message: "No events found" });
  }
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

module.exports = {
  createEvent,
  getAllEvents,
  attendEvent,
  updateEvent,
  deleteEvent,
  deAttendEvent,
}