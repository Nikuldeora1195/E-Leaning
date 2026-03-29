const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// Student route
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  (req, res) => {
    res.json({ message: "Student access granted" });
  }
);

// Teacher route
router.get(
  "/teacher",
  protect,
  authorizeRoles("teacher"),
  (req, res) => {
    res.json({ message: "Teacher access granted" });
  }
);

// Admin route
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

module.exports = router;
