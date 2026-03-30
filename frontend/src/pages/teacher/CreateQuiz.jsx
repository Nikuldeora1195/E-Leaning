import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createQuiz, getQuizByCourse } from "../../api/courseApi";
import toast from "react-hot-toast";
import TeacherLayout from "../../components/app/TeacherLayout";

const createEmptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
});

const CreateQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [passingScore, setPassingScore] = useState(60);
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);

  useEffect(() => {
    const loadExistingQuiz = async () => {
      try {
        const res = await getQuizByCourse(courseId);
        const quiz = res.data;
        setTitle(quiz.title || "");
        setPassingScore(quiz.passingScore || 60);
        setQuestions(
          quiz.questions?.length
            ? quiz.questions.map((question) => ({
                question: question.question || "",
                options:
                  question.options?.length === 4
                    ? question.options
                    : [
                        question.options?.[0] || "",
                        question.options?.[1] || "",
                        question.options?.[2] || "",
                        question.options?.[3] || "",
                      ],
                correctAnswer: Number(question.correctAnswer) || 0,
              }))
            : [createEmptyQuestion()]
        );
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error(
            error.response?.data?.message || "Failed to load existing quiz"
          );
        }
      } finally {
        setLoadingExisting(false);
      }
    };

    loadExistingQuiz();
  }, [courseId]);

  const updateQuestionField = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question
      )
    );
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) return question;

        const nextOptions = question.options.map((option, currentOptionIndex) =>
          currentOptionIndex === optionIndex ? value : option
        );

        return { ...question, options: nextOptions };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, questionIndex) => questionIndex !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasInvalidQuestion = questions.some(
      (question) =>
        !question.question.trim() ||
        question.options.some((option) => !option.trim())
    );

    if (!title.trim() || hasInvalidQuestion) {
      toast.error("Please complete the title and every question.");
      return;
    }

    const parsedPassingScore = Number(passingScore);
    if (parsedPassingScore < 0 || parsedPassingScore > 100) {
      toast.error("Passing score must be between 0 and 100.");
      return;
    }

    setLoading(true);

    try {
      await createQuiz({
        courseId,
        title: title.trim(),
        passingScore: parsedPassingScore,
        questions: questions.map((question) => ({
          question: question.question.trim(),
          options: question.options.map((option) => option.trim()),
          correctAnswer: question.correctAnswer,
        })),
      });

      toast.success("Quiz saved successfully");
      navigate("/teacher/courses");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save quiz");
    } finally {
      setLoading(false);
    }
  };

  if (loadingExisting) {
    return (
      <TeacherLayout title="">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Quiz Builder
              </span>
              <h1 className="text-3xl font-semibold text-[#1f1637]">
                Create or update your quiz
              </h1>
              <p className="max-w-2xl text-base text-[#6b6680]">
                Add multiple questions, choose correct answers, and preview the
                quiz exactly how the structure will look.
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="rounded-full border border-[#d9cff6] px-4 py-2 text-sm font-medium text-[#6d28d9] transition hover:bg-[#f7f3ff]"
            >
              Back
            </button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-5 md:grid-cols-[1fr_220px]">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#4f4864]">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    placeholder="Course final quiz"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#4f4864]">
                    Passing Score
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={passingScore}
                      onChange={(e) => setPassingScore(e.target.value)}
                      className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                    />
                    <span className="text-sm text-[#7a7392]">%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="rounded-[28px] border border-[#ece8f7] bg-[#fcfbff] p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#7a7392]">
                          Question {questionIndex + 1}
                        </p>
                        <h2 className="text-xl font-semibold text-[#1f1637]">
                          Quiz item
                        </h2>
                      </div>

                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="rounded-full border border-[#f5d0d0] px-4 py-2 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff5f5]"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="mt-5 space-y-5">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#4f4864]">
                          Question Text
                        </label>
                        <input
                          type="text"
                          placeholder="What should the learner answer here?"
                          value={question.question}
                          onChange={(e) =>
                            updateQuestionField(
                              questionIndex,
                              "question",
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="space-y-2">
                            <label className="block text-sm font-medium text-[#4f4864]">
                              Option {optionIndex + 1}
                            </label>
                            <input
                              type="text"
                              placeholder={`Enter option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#4f4864]">
                          Correct Answer
                        </label>
                        <select
                          value={question.correctAnswer}
                          onChange={(e) =>
                            updateQuestionField(
                              questionIndex,
                              "correctAnswer",
                              Number(e.target.value)
                            )
                          }
                          className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                        >
                          {question.options.map((_, optionIndex) => (
                            <option key={optionIndex} value={optionIndex}>
                              Option {optionIndex + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 rounded-3xl bg-[#faf8ff] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#1f1637]">
                    Add more questions
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#6b6680]">
                    Build a stronger quiz by adding as many questions as you
                    need.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="rounded-full border border-[#d9cff6] px-5 py-3 text-sm font-semibold text-[#6d28d9] transition hover:bg-white"
                >
                  Add Question
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Quiz"}
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Live Preview
              </span>
              <h2 className="mt-3 text-2xl font-semibold text-[#1f1637]">
                {title.trim() || "Untitled quiz"}
              </h2>
              <p className="mt-2 text-sm text-[#6b6680]">
                Passing score: {Number(passingScore) || 0}% • {questions.length}{" "}
                question{questions.length > 1 ? "s" : ""}
              </p>

              <div className="mt-5 space-y-4">
                {questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="rounded-3xl border border-[#ece8f7] bg-[#fcfbff] p-4"
                  >
                    <p className="text-sm font-medium text-[#7a7392]">
                      Question {questionIndex + 1}
                    </p>
                    <p className="mt-2 text-base font-semibold text-[#1f1637]">
                      {question.question.trim() || "Question text preview"}
                    </p>
                    <div className="mt-3 space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`rounded-2xl border px-3 py-2 text-sm ${
                            question.correctAnswer === optionIndex
                              ? "border-[#cdb7ff] bg-[#f4f0ff] text-[#5b21b6]"
                              : "border-[#ece8f7] bg-white text-[#6b6680]"
                          }`}
                        >
                          {option.trim() || `Option ${optionIndex + 1}`}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] bg-[#faf8ff] p-6">
              <h2 className="text-xl font-semibold text-[#1f1637]">
                Quiz Tips
              </h2>
              <div className="mt-4 space-y-2 text-sm leading-6 text-[#6b6680]">
                <p>Keep question wording short and easy to understand.</p>
                <p>Use options that are distinct so the correct answer is clear.</p>
                <p>Set a passing score that matches the course difficulty.</p>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </TeacherLayout>
  );
};

export default CreateQuiz;
