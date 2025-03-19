const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

// Get all classes
router.get("/getClasses", classController.getClasses);

// Get a single class by ID
router.get("/:id", classController.getClassById);

// Create a new class
router.post("/createClass", classController.createClass);

// Update an existing class
router.post("/updateClass/:id", classController.updateClass);

// Delete a class
router.delete("/:id", classController.deleteClass);

module.exports = router;
