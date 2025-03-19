const express = require("express");
const {
    registerAdmin,
    loginAdmin,
    getUserDetails,
    updateUser,
    getAllUsers,
    getAllLecturers,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/getUserInfo/:userId", getUserDetails);
router.post("/updateUser/:userId", updateUser);
router.get("/getAllLecturers", getAllLecturers);
router.get("/getAllUsers", getAllUsers);


module.exports = router;
