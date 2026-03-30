import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getMyQuizAttempts,
  getQuizByCourse,
  submitQuiz,
} from "../../api/courseApi";
import StudentLayout from "../../components/app/StudentLayout";

const QuizPage = () => {
  const { courseId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadQuizPage = async () => {
    try {
      setLoading(true);

      const [quizRes, attemptsRes] = await Promise.all([
        getQuizByCourse(courseId),
        getMyQuizAttempts(courseId),
      ]);

      setQuiz(quizRes.data);
      setAnswers(new Array(quizRes.data.questions.length).fill(null));
      setAttempts(attemptsRes.data);
      setResult(attemptsRes.data[0] || null);
      setError("");
    } catch (err) {
      const message =
        err.response?.data?.message || "No quiz found for this course";
      setError(message);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizPage();
  }, [courseId]);

  const handleAnswer = (questionIndex, optionIndex) => {
    setAnswers((prev) =>
      prev.map((answer, currentIndex) =>
        currentIndex === questionIndex ? optionIndex : answer
      )
    );
  };

  const handleSubmit = async () => {
    if (answers.some((answer) => answer === null)) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitQuiz({
        quizId: quiz._id,
        answers,
      });

      const latestResult = res.data.attempt || {
        _id: `attempt-${Date.now()}`,
        score: res.data.score,
        total: res.data.total,
        percentage: res.data.percentage,
        passed: res.data.passed,
        createdAt: new Date().toISOString(),
      };
      setResult(latestResult);
      setAttempts((prev) => [latestResult, ...prev]);
      toast.success(
        latestResult.passed
          ? `Passed with ${latestResult.percentage}%`
          : `Scored ${latestResult.percentage}%`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout title="">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
        </div>
      </StudentLayout>
    );
  }

  if (!quiz) {
    return (
      <StudentLayout title="">
        <div className="rounded-[28px] border border-dashed border-[#ddd6f3] bg-white px-6 py-16 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-[#1f1637]">
            Quiz not available
          </h2>
          <p className="mt-2 text-sm text-[#6b6680]">
            {error || "This course does not have a quiz yet."}
          </p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
              Quiz
            </span>
            <h1 className="text-3xl font-semibold text-[#1f1637]">
              {quiz.title}
            </h1>
            <p className="text-sm text-[#6b6680]">
              Answer each question carefully. You need {quiz.passingScore}% to
              pass this quiz.
            </p>
          </div>
        </section>

        {result && (
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-[#ece8f7] bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-[#7a7392]">Latest Score</p>
              <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
                {result.percentage}%
              </p>
            </div>
            <div className="rounded-3xl border border-[#ece8f7] bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-[#7a7392]">Status</p>
              <p
                className={`mt-3 text-2xl font-semibold ${
                  result.passed ? "text-[#18794e]" : "text-[#b42318]"
                }`}
              >
                {result.passed ? "Passed" : "Needs Retry"}
              </p>
            </div>
            <div className="rounded-3xl border border-[#ece8f7] bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-[#7a7392]">Attempts</p>
              <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
                {attempts.length}
              </p>
            </div>
          </section>
        )}

        {quiz.questions.map((question, questionIndex) => (
          <section
            key={questionIndex}
            className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-[#1f1637]">
              {questionIndex + 1}. {question.question}
            </h2>

            <div className="mt-5 space-y-3">
              {question.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswer(questionIndex, optionIndex)}
                  className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    answers[questionIndex] === optionIndex
                      ? "border-[#6d28d9] bg-[#f4f0ff] text-[#1f1637]"
                      : "border-[#ece8f7] bg-white text-[#4f4864] hover:bg-[#faf8ff]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>
        ))}

        <section className="flex flex-col gap-4 rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1f1637]">
              Ready to submit?
            </h2>
            <p className="mt-1 text-sm text-[#6b6680]">
              Your latest attempt will be saved and shown in your quiz history.
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-full bg-[#6d28d9] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </section>

        {attempts.length > 0 && (
          <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[#1f1637]">
                Attempt History
              </h2>
              <p className="text-sm text-[#6b6680]">
                Review your previous scores and see how your performance is
                improving over time.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {attempts.map((attempt) => (
                <div
                  key={attempt._id}
                  className="flex flex-col gap-3 rounded-3xl border border-[#ece8f7] bg-[#fcfbff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-[#1f1637]">
                      {attempt.score}/{attempt.total} correct
                    </p>
                    <p className="mt-1 text-sm text-[#6b6680]">
                      {new Date(attempt.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#f4f0ff] px-3 py-1 text-sm font-semibold text-[#6d28d9]">
                      {attempt.percentage}%
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        attempt.passed
                          ? "bg-[#e8fbef] text-[#18794e]"
                          : "bg-[#fff1f1] text-[#b42318]"
                      }`}
                    >
                      {attempt.passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </StudentLayout>
  );
};

export default QuizPage;
