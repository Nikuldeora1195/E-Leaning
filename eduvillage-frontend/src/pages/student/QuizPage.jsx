import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getQuizByCourse, submitQuiz } from "../../api/courseApi";
import StudentLayout from "../../components/app/StudentLayout";

const QuizPage = () => {
  const { courseId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    getQuizByCourse(courseId)
      .then((res) => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
      })
      .catch(() => {
        toast.error("No quiz found for this course");
      });
  }, [courseId]);

  const handleAnswer = (questionIndex, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    try {
      const res = await submitQuiz({
        quizId: quiz._id,
        answers,
      });

      toast.success(`Score: ${res.data.score}/${res.data.total}`);
    } catch {
      toast.error("Failed to submit quiz");
    }
  };

  if (!quiz) {
    return (
      <StudentLayout title="">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
            Quiz
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-[#1f1637]">
            {quiz.title}
          </h1>
          <p className="mt-2 text-sm text-[#6b6680]">
            Answer each question and submit when you are done.
          </p>
        </section>

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

        <button
          onClick={handleSubmit}
          className="rounded-full bg-[#6d28d9] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
        >
          Submit Quiz
        </button>
      </div>
    </StudentLayout>
  );
};

export default QuizPage;
