const QuizSection = ({ quiz }) => {
  if (!quiz) return null;

  return (
    <div className="space-y-6 rounded-[28px] bg-[#fcfbff] p-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-[#1f1637]">{quiz.title}</h3>
        <p className="text-sm text-[#6b6680]">
          Passing score: {quiz.passingScore || 60}% • {quiz.questions.length}{" "}
          question{quiz.questions.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((question, questionIndex) => (
          <div
            key={questionIndex}
            className="rounded-3xl border border-[#ece8f7] bg-white p-5"
          >
            <p className="text-sm font-medium text-[#7a7392]">
              Question {questionIndex + 1}
            </p>
            <p className="mt-2 text-base font-semibold text-[#1f1637]">
              {question.question}
            </p>

            <div className="mt-4 space-y-2">
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    question.correctAnswer === optionIndex
                      ? "border-[#d9cff6] bg-[#f4f0ff] text-[#5b21b6]"
                      : "border-[#ece8f7] bg-white text-[#4f4864]"
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizSection;
