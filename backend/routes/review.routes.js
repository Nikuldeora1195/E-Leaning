const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const {
  getCourseReviews,
  upsertCourseReview,
} = require("../controllers/review.controller");

router.get("/:courseId", protect, authorizeRoles("student", "teacher"), getCourseReviews);
router.post("/:courseId", protect, authorizeRoles("student"), upsertCourseReview);

module.exports = router;
