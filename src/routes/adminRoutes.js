const express = require("express");
const {
    loginAdmin,
    getAdminProfile,
    refreshTokens,
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/profile", protect, getAdminProfile);
router.post("/refreshToken", refreshTokens);

module.exports = router;
