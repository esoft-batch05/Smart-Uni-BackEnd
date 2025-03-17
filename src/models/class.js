const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming instructors are stored in the 'User' collection
    required: true,
  },
  schedule: {
    day: {
      type: String, // e.g., "Monday"
      required: true,
    },
    time: {
      type: String, // e.g., "10:00 AM - 11:30 AM"
      required: true,
    },
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming students are stored in the 'User' collection
    },
  ],
  venue: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Venue',
        
      },
  status: {
    type: String,
    enum: ["Active", "Completed", "Cancelled"],
    default: "Active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Class = mongoose.model("Class", classSchema);
module.exports = Class;
