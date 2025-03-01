const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const asyncHandler = require("../utils/asyncHandler");

// Generate access token (expires in 15 minutes)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret_key", {
    expiresIn: "1h",
  });
};

// Generate refresh token (expires in 7 days)
const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET || "default_refresh_key",
    { expiresIn: "7d" }
  );
};


// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    const accessToken = generateToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      status: "success",
      message: "Admin logged in successfully",
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        address: admin.address,
        phone: admin.phoneNumber,
        dob: admin.dateOfBirth,
        token: accessToken,
        refreshToken: refreshToken,
      },
    });
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
});

// Refresh Tokens
const refreshTokens = asyncHandler(async (req, res) => {
  try {
    // Extract refresh token from the request body
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "default_refresh_key",
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        // Find the admin user
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }

        // Generate new tokens
        const newAccessToken = generateToken(admin._id);
        const newRefreshToken = generateRefreshToken(admin._id);

        // Send response with new tokens
        return res.status(200).json({
          status: "success",
          message: "Tokens refreshed successfully",
          data: {
            accessToken: newAccessToken,
            newRefreshToken: newRefreshToken,
          },
        });
      }
    );
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



// Get Admin Profile
const getAdminProfile = asyncHandler(async (req, res) => {
  res.json(req.admin);
});

module.exports = {
  loginAdmin,
  refreshTokens,
  getAdminProfile,
};