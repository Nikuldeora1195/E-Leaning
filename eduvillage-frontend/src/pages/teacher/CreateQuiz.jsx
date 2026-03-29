import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createQuiz } from "../../api/courseApi";
import toast from "react-hot-toast";
import TeacherLayout from "../../components/app/TeacherLayout";

const CreateQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !question || options.some((option) => !option)) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await createQuiz({
        courseId,
        title,
        questions: [
          {
            question,
            options,
            correctAnswer,
          },
        ],
      });

      toast.success("Quiz created successfully");
      navigate("/teacher/courses");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout title="">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Create Quiz
              </span>
              <h1 className="text-3xl font-semibold text-[#1f1637]">
                Add a quiz to your course
              </h1>
              <p className="max-w-2xl text-base text-[#6b6680]">
                Keep it simple for now. This page creates one question with four options.
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

        <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4f4864]">
                Quiz Title
              </label>
              <input
                type="text"
                placeholder="Enter quiz title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4f4864]">
                Question
              </label>
              <input
                type="text"
                placeholder="Enter question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#4f4864]">
                Options
              </label>
              {options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                />
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4f4864]">
                Correct Answer
              </label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
              >
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </select>
            </div>

            <div className="rounded-[24px] bg-[#faf8ff] p-5">
              <h2 className="text-lg font-semibold text-[#1f1637]">
                Simple quiz note
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#6b6680]">
                This version creates a basic one-question quiz. Later we can extend
                it to support multiple questions more cleanly.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Quiz"}
            </button>
          </form>
        </section>
      </div>
    </TeacherLayout>
  );
};

export default CreateQuiz;
