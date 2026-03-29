const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

const {
  createSection,
  createLesson,
  getCourseContent,
  updateSection,
  deleteSection,
  updateLesson,
  deleteLesson,
  uploadMedia,
} = require("../controllers/content.controller");

// Teacher creates section
router.post(
  "/sections",
  protect,
  authorizeRoles("teacher"),
  createSection
);

// Teacher creates lesson
router.post(
  "/lessons",
  protect,
  authorizeRoles("teacher"),
  createLesson
);

router.put(
  "/sections/:sectionId",
  protect,
  authorizeRoles("teacher"),
  updateSection
);

router.delete(
  "/sections/:sectionId",
  protect,
  authorizeRoles("teacher"),
  deleteSection
);

router.put(
  "/lessons/:lessonId",
  protect,
  authorizeRoles("teacher"),
  updateLesson
);

router.delete(
  "/lessons/:lessonId",
  protect,
  authorizeRoles("teacher"),
  deleteLesson
);

router.post(
  "/upload",
  protect,
  authorizeRoles("teacher"),
  upload.single("file"),
  uploadMedia
);

// Student + Teacher view course content
router.get(
  "/course/:courseId",
  protect,
  authorizeRoles("student", "teacher"),
  getCourseContent
);

module.exports = router;
