const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const { generateCertificate } = require("../controllers/certificate.controller");

router.post(
  "/:enrollmentId",
  protect,
  authorizeRoles("student"),
  generateCertificate
);

module.exports = router;
