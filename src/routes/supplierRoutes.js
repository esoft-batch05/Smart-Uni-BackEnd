const express = require("express");
const {
    getSupplier,
    postSupplier
} = require("../controllers/supplierController");
const {protect} = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
    .get(protect, getSupplier)
    .post(protect, postSupplier);


module.exports = router;

