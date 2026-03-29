const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");

// ===============================
// CREATE QUIZ (Teacher)
// ===============================
const createQuiz = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { courseId, title, questions } = req.body;

    const quiz = await Quiz.create({
      course: courseId,
      title,
      questions,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// GET QUIZ BY COURSE
// ===============================
const getQuizByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const quiz = await Quiz.findOne({ course: courseId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Get quiz error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// SUBMIT QUIZ (Student)
// ===============================
const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz)
      return res.status(404).json({ message: "Quiz not found" });

    let score = 0;

    quiz.questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) {
        score++;
      }
    });

    await QuizAttempt.create({
      student: req.user.id,
      quiz: quizId,
      score,
      total: quiz.questions.length,
    });

    res.json({
      message: "Quiz submitted",
      score,
      total: quiz.questions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ SINGLE EXPORT STYLE
module.exports = {
  createQuiz,
  getQuizByCourse,
  submitQuiz,
};
