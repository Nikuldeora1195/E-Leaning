const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const {
  createNotification,
  getNotifications
} = require("../controllers/notification.controller");

// Teacher/Admin creates announcement
router.post(
  "/",
  protect,
  authorizeRoles("teacher", "admin"),
  createNotification
);

// Student views announcements
router.get(
  "/",
  protect,
  authorizeRoles("student", "teacher", "admin"),
  getNotifications
);

module.exports = router;
