const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {
  createQuiz,
  getQuizByCourse,
  submitQuiz,
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

// Student submits quiz
router.post(
  "/submit",
  protect,
  authorizeRoles("student"),
  submitQuiz
);

module.exports = router;
