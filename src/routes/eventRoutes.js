const express = require("express");
const {
    createEvent,
    getAllEvents,
    attendEvent,
    deleteEvent,
    getPendingEvents,
    approveEvent,
    updateEvent,
    getAprovedEvents,
    deAttendEvent,
    getApprovedClassesAndEvents,
} = require("../controllers/eventController")
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/createEvent", createEvent);
router.get("/getAllEvents",protect, getAllEvents);
router.post("/attendEvent", attendEvent);
router.get("/pendingEvents", getPendingEvents);
router.get("/events-and-classes", getApprovedClassesAndEvents);
router.get("/approveEvents/:eventId", approveEvent);
router.get("/getAprovedEvents", getAprovedEvents);
router.post("/deAttendEvent/:eventId", deAttendEvent);
router.post("/updateEvent/:eventId", updateEvent);
router.delete("/deleteEvent/:eventId", deleteEvent);

module.exports = router;