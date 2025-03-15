const express = require("express");
const {
    registerAdmin,
    loginAdmin,
    getUserDetails,
    updateUser,
    getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/getUserInfo/:userId", getUserDetails);
router.post("/updateUser/:userId", updateUser);
router.get("/getAllUsers", getAllUsers);


module.exports = router;
