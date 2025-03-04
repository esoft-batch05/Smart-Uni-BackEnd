const express = require("express");
const {
    createEvent,
    getAllEvents,
    attendEvent,
    deleteEvent,
    updateEvent,
} = require("../controllers/eventController")

const router = express.Router();

router.post("/createEvent", createEvent);
router.get("/getAllEvents", getAllEvents);
router.post("/attendEvent", attendEvent);
router.post("/updateEvent/:eventId", updateEvent);
router.delete("/deleteEvent/:eventId", deleteEvent);

module.exports = router;