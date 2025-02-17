const express = require("express");
const {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", protect, getAdminProfile);

module.exports = router;
