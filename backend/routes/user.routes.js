const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const { getProfile, updateProfile } = require("../controllers/user.controller");

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

module.exports = router;
