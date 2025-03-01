const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const asyncHandler = require("../utils/asyncHandler");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret_key", {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET || "default_refresh_key",
    { expiresIn: "7d" }
  );
};


const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, phoneNumber, dateOfBirth, address, role } =
      req.body;
  
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }
  
    const admin = await Admin.create({
      name,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      address,
      role,
    });
  
    if (admin) {
      const accessToken = generateToken(admin._id);
      const refreshToken = generateRefreshToken(admin._id);
  
      
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      return res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phoneNumber,
          dateOfBirth: admin.dateOfBirth,
          address: admin.address,
          role: admin.role,
          token: accessToken,
          refreshToken: refreshToken,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid admin data" });
    }
  });

  module.exports = {
    registerAdmin,
  };