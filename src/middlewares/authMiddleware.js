const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;

  let refreshToken = req.cookies?.refreshToken;

  if (!token && !refreshToken) {
    return res.status(401).json({ message: "Not authorized, no token or refresh token" });
  }

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
      req.admin = await Admin.findById(decoded.id).select("-password");
      return next();
    }
  } catch (accessTokenError) {
    console.log("Access token failed:", accessTokenError.message);

    if (refreshToken) {
      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET || "default_refresh_key"
        );

        const admin = await Admin.findById(decodedRefresh.id).select("-password");
        if (!admin) {
          throw new Error("Admin not found or refresh token is invalid");
        }

        const newAccessToken = jwt.sign(
          { id: admin._id },
          process.env.JWT_SECRET || "default_secret_key",
          { expiresIn: "1m" }
        );

        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        req.admin = admin;
        return next();
      } catch (refreshTokenError) {
        console.log("Refresh token failed:", refreshTokenError.message);
        return res.status(401).json({ message: "Not authorized, refresh token failed" });
      }
    }
  }

  res.status(401).json({ message: "Not authorized, token validation failed" });
});

module.exports = { protect };