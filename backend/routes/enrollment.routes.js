const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");


const {
  enrollInCourse,
  getMyCourses,
  updateProgress,
  completeLesson, // ✅ IMPORT FIX
} = require("../controllers/enrollment.controller");

// Student enrolls in course
router.post(
  "/:courseId",
  protect,
  authorizeRoles("student"),
  enrollInCourse
);

// Student dashboard - my courses
router.get(
  "/my-courses",
  protect,
  authorizeRoles("student"),
  getMyCourses
);

// Update learning progress
router.put(
  "/progress/:enrollmentId",
  protect,
  authorizeRoles("student"),
  updateProgress
);

// ✅ COMPLETE LESSON (FIXED)
router.put(
  "/lesson/:lessonId/complete",
  protect,
  authorizeRoles("student"),
  completeLesson
);

module.exports = router;
