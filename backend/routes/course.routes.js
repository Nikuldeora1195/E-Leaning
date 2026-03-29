const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const {
  createCourse,
  getCourses,
  publishCourse,
  getCourseStudents,
  getMyCourses,
  togglePublish,
   getCourseById,
   updateCourse
} = require("../controllers/course.controller");

// Get all published courses (Student + Teacher + Admin)
router.get(
  "/",
  protect,
  authorizeRoles("student", "teacher", "admin"),
  getCourses
);

// Teacher creates course
router.post(
  "/",
  protect,
  authorizeRoles("teacher"),
  createCourse
);

// Publish course
router.put(
  "/:id/publish",
  protect,
  authorizeRoles("teacher"),
  publishCourse
);

// Teacher dashboard - students in a course
router.get(
  "/:courseId/students",
  protect,
  authorizeRoles("teacher"),
  getCourseStudents
);



// Teacher dashboard - my courses
router.get(
  "/my",
  protect,
  authorizeRoles("teacher"),
  getMyCourses
);


// Course details (Student + Teacher)
router.get(
  "/:id",
  protect,
  authorizeRoles("student", "teacher"),
  getCourseById
);

// Edit course
router.put(
  "/:id",
  protect,
  authorizeRoles("teacher"),
  updateCourse
);




router.patch(
  "/:id/toggle",
  protect,
  authorizeRoles("teacher"),
  togglePublish
);



module.exports = router;
