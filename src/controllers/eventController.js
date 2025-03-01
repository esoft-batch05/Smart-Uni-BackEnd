const Event = require("../models/event");
const asyncHandler = require("../utils/asyncHandler");


const createEvent = asyncHandler (async(req, res) =>{
    const { name, description, date, phoneNumber, location, organizer, attendees } =
      req.body;

      const event = await Event.create({
        name,
        description,
        date,
        phoneNumber,
        location,
        organizer,
        attendees,
      });

      if(event){
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
                organizer: event.organizer,
                attendees: event.attendees,
            }
        })
      }else{
        return res.status(400).json({ message: "Invalid Event data" });
      }

})

module.exports = {
    createEvent,
}