const Class = require("../models/class");
const { findById } = require("../models/message");
const asyncHandler = require("../utils/asyncHandler");

// Get all classes
exports.getClasses = asyncHandler(async (req, res) => {
    try {
        const classes = await Class.find().populate("instructor students venue").lean();
        return res.status(200).json({
            status: "success",
            message: "Classes retrieved successfully",
            data: classes,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get a single class by ID
exports.getClassById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const classData = await Class.findById(id)
            .populate({
                path: "instructor",
                select: "-password", // Exclude password
            })
            .populate("students")
            .lean();

        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Class retrieved successfully",
            data: classData,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Create a new class
exports.createClass = asyncHandler(async (req, res) => {
    try {
        const { name, instructor, schedule, students, status, venue } = req.body;

        

        const newClass = new Class({
            name,
            instructor,
            schedule,
            students,
            status,
            venue,
        });

        await newClass.save();
        return res.status(201).json({
            status: "success",
            message: "Class created successfully",
            data: newClass,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update a class
exports.updateClass = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updatedClass = await Class.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Class updated successfully",
            data: updatedClass,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete a class
exports.deleteClass = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClass = await Class.findByIdAndDelete(id);

        if (!deletedClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Class deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});
