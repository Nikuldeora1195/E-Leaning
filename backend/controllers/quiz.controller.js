const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");

// ===============================
// CREATE QUIZ (Teacher)
// ===============================
const createQuiz = async (req, res) => {
  try {
    const { courseId, title, questions, passingScore } = req.body;

    if (!courseId || !title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Course, title, and questions are required" });
    }

    const normalizedQuestions = questions.map((question) => ({
      question: question.question?.trim(),
      options: question.options?.map((option) => option.trim()),
      correctAnswer: Number(question.correctAnswer),
    }));

    const hasInvalidQuestion = normalizedQuestions.some(
      (question) =>
        !question.question ||
        !Array.isArray(question.options) ||
        question.options.length < 2 ||
        question.options.some((option) => !option) ||
        question.correctAnswer < 0 ||
        question.correctAnswer >= question.options.length
    );

    if (hasInvalidQuestion) {
      return res.status(400).json({ message: "Each question must be complete and valid" });
    }

    const quiz = await Quiz.findOneAndUpdate(
      { course: courseId },
      {
        course: courseId,
        title: title.trim(),
        questions: normalizedQuestions,
        passingScore: Number(passingScore) || 60,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

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

    const total = quiz.questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = percentage >= (quiz.passingScore || 60);

    const attempt = await QuizAttempt.create({
      student: req.user.id,
      quiz: quizId,
      answers,
      score,
      total,
      percentage,
      passed,
    });

    res.json({
      message: "Quiz submitted",
      attempt,
      score,
      total,
      percentage,
      passed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyQuizAttempts = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quiz = await Quiz.findOne({ course: courseId });

    if (!quiz) {
      return res.json([]);
    }

    const attempts = await QuizAttempt.find({
      student: req.user.id,
      quiz: quiz._id,
    }).sort({ createdAt: -1 });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ SINGLE EXPORT STYLE
module.exports = {
  createQuiz,
  getQuizByCourse,
  submitQuiz,
  getMyQuizAttempts,
};
