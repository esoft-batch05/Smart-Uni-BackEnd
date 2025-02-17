const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const asyncHandler = require("../utils/asyncHandler");

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret_key", { expiresIn: "30d" });
};

// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
        res.status(400).json({ message: "Admin already exists" });
        return;
    }

    const admin = await Admin.create({ name, email, password });
    if (admin) {
        res.status(201).json({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin.id),
        });
    } else {
        res.status(400).json({ message: "Invalid admin data" });
    }
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
        // Generate access token
        const accessToken = generateToken(admin.id);

        // Generate refresh token
        const refreshToken = jwt.sign(
            { id: admin.id },
            process.env.REFRESH_TOKEN_SECRET || "default_refresh_key",
            { expiresIn: "7d" } // Set longer expiry for refresh token
        );

        // Send both tokens in the response
        res.status(200).json({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            token: accessToken, // Access token
            refreshToken: refreshToken, // Refresh token
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});

// Get Admin Profile
const getAdminProfile = asyncHandler(async (req, res) => {
    res.json(req.admin);
});

module.exports = {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
};
