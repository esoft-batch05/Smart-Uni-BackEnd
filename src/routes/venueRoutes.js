// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const {
    getClasses,
    createClass,
} = require('../controllers/venueController');
const { protect } = require("../middlewares/authMiddleware");


router.get("/getVenue",protect, getClasses);
router.post("/createVenue",protect, createClass);



module.exports = router;