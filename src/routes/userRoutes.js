const express = require("express");
const {
    registerAdmin,

} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerAdmin);


module.exports = router;
