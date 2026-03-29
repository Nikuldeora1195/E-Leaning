const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getAllCourses,
  deleteCourse,
  getAdminStats
} = require("../controllers/admin.controller");

// Users
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/users/:id/role", protect, authorizeRoles("admin"), updateUserRole);
router.put("/users/:id/status", protect, authorizeRoles("admin"), toggleUserStatus);

// Courses
router.get("/courses", protect, authorizeRoles("admin"), getAllCourses);
router.delete("/courses/:id", protect, authorizeRoles("admin"), deleteCourse);

// Stats
router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

module.exports = router;
