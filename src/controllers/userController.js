const jwt = require("jsonwebtoken");
const Admin = require("../models/user");
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
  const { firstName, email, password, phoneNumber, dateOfBirth, address, role } =
    req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const admin = await Admin.create({
    firstName,
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
        firstName: admin.firstName,
        email: admin.email,
        phone: admin.phoneNumber,
        dateOfBirth: admin.dateOfBirth,
        address: admin.address.street,
        role: admin.role,
        token: accessToken,
        refreshToken: refreshToken,
      },
    });
  } else {
    return res.status(400).json({ message: "Invalid admin data" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params; // User ID to update
  const { firstName, lastName, email, bio, profileImage, address, phoneNumber, alternatePhone, role, isActive } = req.body;

  // Find the user by ID
  const user = await Admin.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Prevent password updates here
  if (req.body.password) {
    return res.status(400).json({ message: "Use the password change endpoint to update password." });
  }

  // Update user fields
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.bio = bio || user.bio;
  user.profileImage = profileImage || user.profileImage;
  user.address = {
    street: address?.street || user.address.street,
    city: address?.city || user.address.city,
    state: address?.state || user.address.state,
    zipCode: address?.zipCode || user.address.zipCode,
    country: address?.country || user.address.country,
  };
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.alternatePhone = alternatePhone || user.alternatePhone;
  user.role = role || user.role;
  user.isActive = isActive !== undefined ? isActive : user.isActive;

  // Save the updated user
  await user.save();

  // Return the updated user data
  return res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
      address: user.address,
      phoneNumber: user.phoneNumber,
      alternatePhone: user.alternatePhone,
      role: user.role,
      isActive: user.isActive,
    }
  });
});

const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Admin.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "User details fetched successfully",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user?.bio,
        profileImage: user?.profileImage,
        address: user?.address,
        alternatePhone: user?.alternatePhone,
        phone: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Admin.find().select("-password"); // Exclude passwords

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: users.map(user => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user?.bio,
        profileImage: user?.profileImage,
        address: user?.address,
        alternatePhone: user?.alternatePhone,
        phone: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllUsers };


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
        firstName: admin.firstName,
        email: admin.email,
        role: admin.role,
        address: admin.address,
        phone: admin.phoneNumber,
        dob: admin.dateOfBirth,
        profileImage: admin.profileImage,
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
  registerAdmin,
  loginAdmin,
  refreshTokens,
  getUserDetails,
  getAllUsers,
  updateUser,
};