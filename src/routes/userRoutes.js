const express = require("express");
const {
    registerAdmin,
    loginAdmin,
    getUserDetails,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/getUserInfo/:userId", getUserDetails);


module.exports = router;
