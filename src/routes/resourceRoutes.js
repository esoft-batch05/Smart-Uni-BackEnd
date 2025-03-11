const express = require("express");
const {
   bookResource,
   getAllResources,
   createResource,
   deleteResource,
   updateResource,
   approveResource,
   bookaResource,
   getAllPendingResources,
} = require("../controllers/resourceController")
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/bookResource",protect, bookResource);
router.get("/getAllResources",protect, getAllResources);
router.get("/getAllPendingResources",protect, getAllPendingResources);
router.post("/createResource",protect, createResource);
router.delete("/deleteResource/:resourceId",protect, deleteResource);
router.post("/updateResource/:resourceId",protect, updateResource);
router.post("/bookaResource/:resourceId",protect, bookaResource);
router.get("/approveResource/:resourceId",protect, approveResource);


module.exports = router;