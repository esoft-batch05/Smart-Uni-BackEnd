const express = require("express");
const {
   bookResource,
   getAllResources,
   createResource,
   deleteResource,
   updateResource,
} = require("../controllers/resourceController")
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/bookResource",protect, bookResource);
router.get("/getAllResources",protect, getAllResources);
router.post("/createResource",protect, createResource);
router.delete("/deleteResource/:resourceId",protect, deleteResource);
router.post("/updateResource/:resourceId",protect, updateResource);


module.exports = router;