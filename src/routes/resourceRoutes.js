const express = require("express");
const {
   bookResource,
   getAllResources,
   createResource,
} = require("../controllers/resourceController")
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/bookResource",protect, bookResource);
router.get("/getAllResources",protect, getAllResources);
router.post("/createResource",protect, createResource);


module.exports = router;