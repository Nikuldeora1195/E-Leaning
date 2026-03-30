const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  createQuiz,
  getQuizByCourse,
  submitQuiz,
  getMyQuizAttempts,
} = require("../controllers/quiz.controller");

// Teacher creates quiz
router.post(
  "/",
  protect,
  authorizeRoles("teacher"),
  createQuiz
);

// Student gets quiz by course
router.get(
  "/course/:courseId",
  protect,
  getQuizByCourse
);

router.get(
  "/course/:courseId/attempts/me",
  protect,
  authorizeRoles("student"),
  getMyQuizAttempts
);

// Student submits quiz
router.post(
  "/submit",
  protect,
  authorizeRoles("student"),
  submitQuiz
);

module.exports = router;
