const express = require("express");
const { getWatchList, addTOWatchList, deleteFromWatchList } = require("../controllers/watchList");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();

router.get("/", protect, getWatchList);
router.post("/add", protect, addTOWatchList);
router.delete("/:id", protect, deleteFromWatchList);


module.exports = router;