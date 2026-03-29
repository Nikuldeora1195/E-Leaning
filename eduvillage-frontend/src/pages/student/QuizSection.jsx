import { useState } from "react";
import { submitQuiz } from "../../api/courseApi";

const QuizSection = ({ quiz }) => {
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await submitQuiz({
        quizId: quiz._id,
        answers,
      });

      setResult(res.data);
    } catch {
      alert("Quiz submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#142C52]">
        📝 {quiz.title}
      </h2>

      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex} className="space-y-3">
          <p className="font-semibold text-[#071426]">
            {qIndex + 1}. {q.question}
          </p>

          {q.options.map((opt, oIndex) => (
            <label key={oIndex} className="block">
              <input
                type="radio"
                name={`question-${qIndex}`}
                value={oIndex}
                onChange={() =>
                  handleOptionSelect(qIndex, oIndex)
                }
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      {!result ? (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-linear-to-r from-[#1B9AAA] to-[#16808D] text-white px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Submitting..." : "Submit Quiz"}
        </button>
      ) : (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-700 font-bold">
            Score: {result.score} / {result.total}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizSection;
