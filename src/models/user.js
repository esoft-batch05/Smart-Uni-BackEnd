const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    // Profile Tab
    firstName: { type: String, required: true },
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    profileImage: { type: String },
    
    // Address Tab
    address: {
        street: { type: String,},
        city: { type: String,},
        state: { type: String,},
        zipCode: { type: String,},
        country: { type: String, default: 'Sri Lanka' }
    },
    
    // Contact Tab
    phoneNumber: { type: String, required: true, unique: true },
    alternatePhone: { type: String },
    
    // Security Tab
    password: { type: String, required: true },
    
    // System fields (already in your original schema)
    role: { type: String, enum: ['admin', 'lecturer', 'student'], default: 'user', required: true },
    joinedDate: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true },
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Get full name virtual
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);