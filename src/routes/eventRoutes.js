const express = require("express");
const {
    createEvent,
    getAllEvents,
    attendEvent,
    deleteEvent,
    updateEvent,
    deAttendEvent,
} = require("../controllers/eventController")
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/createEvent", createEvent);
router.get("/getAllEvents",protect, getAllEvents);
router.post("/attendEvent", attendEvent);
router.post("/deAttendEvent/:eventId", deAttendEvent);
router.post("/updateEvent/:eventId", updateEvent);
router.delete("/deleteEvent/:eventId", deleteEvent);

module.exports = router;