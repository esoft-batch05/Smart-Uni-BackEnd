const express = require("express");
const {
    createEvent,
} = require("../controllers/eventController")

const router = express.Router();

router.post("/createEvent", createEvent);

module.exports = router;