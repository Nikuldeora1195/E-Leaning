import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../api/teacherCourseApi";
import toast from "react-hot-toast";
import TeacherLayout from "../../components/app/TeacherLayout";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating course...");
    try {
      const response = await createCourse(form);
      toast.success("Course created successfully", { id: toastId });
      setForm({ title: "", description: "" });

      if (response.data?.course?._id) {
        setTimeout(() => {
          navigate(`/teacher/courses/${response.data.course._id}/edit`);
        }, 800);
      }
    } catch (error) {
      console.error("Failed to create course:", error);
      const message =
        error.response?.data?.message || "Failed to create course";
      toast.error(message, { id: toastId });
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
                Create Course
              </span>
              <h1 className="text-3xl font-semibold text-[#1f1637]">
                Start a new course
              </h1>
              <p className="max-w-2xl text-base text-[#6b6680]">
                Add the basic course details first. You can manage sections,
                lessons, and quizzes after creation.
              </p>
            </div>

            <button
              onClick={() => navigate("/teacher/courses")}
              className="rounded-full border border-[#d9cff6] px-4 py-2 text-sm font-medium text-[#6d28d9] transition hover:bg-[#f7f3ff]"
            >
              Back to Courses
            </button>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4f4864]">
                Course Title
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                placeholder="Enter course title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                maxLength={100}
              />
              <p className="text-xs text-[#7a7392]">{form.title.length}/100 characters</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4f4864]">
                Course Description
              </label>
              <textarea
                className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9] resize-none"
                rows={8}
                placeholder="Describe what students will learn in this course"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                maxLength={500}
              />
              <p className="text-xs text-[#7a7392]">
                {form.description.length}/500 characters
              </p>
            </div>

            <div className="rounded-[24px] bg-[#faf8ff] p-5">
              <h2 className="text-lg font-semibold text-[#1f1637]">
                What happens next?
              </h2>
              <div className="mt-3 space-y-2 text-sm text-[#6b6680]">
                <p>1. Save the course details.</p>
                <p>2. Add sections and lessons.</p>
                <p>3. Create a quiz if needed.</p>
                <p>4. Publish when the course is ready.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading || !form.title.trim() || !form.description.trim()}
                className="flex-1 rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Course"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/teacher/courses")}
                disabled={loading}
                className="rounded-full border border-[#ddd6f3] px-5 py-3 text-sm font-semibold text-[#4f4864] transition hover:bg-[#f7f3ff] disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </TeacherLayout>
  );
};

export default CreateCourse;
