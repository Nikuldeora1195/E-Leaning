import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, updateCourse } from "../../api/teacherCourseApi";
import toast from "react-hot-toast";
import TeacherLayout from "../../components/app/TeacherLayout";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCourseById(id)
      .then((res) => {
        setForm({
          title: res.data.title,
          description: res.data.description,
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load course");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const toastId = toast.loading("Updating course...");
    try {
      await updateCourse(id, form);
      toast.success("Course updated successfully", { id: toastId });
      navigate("/teacher/courses");
    } catch {
      toast.error("Failed to update course", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7fb] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
      </div>
    );
  }

  return (
    <TeacherLayout title="">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Edit Course
              </span>
              <h1 className="text-3xl font-semibold text-[#1f1637]">
                Update course details
              </h1>
              <p className="max-w-2xl text-base text-[#6b6680]">
                Edit the main course information and continue managing its content.
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

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4f4864]">
                  Course Title
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
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
                  rows={7}
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

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/teacher/courses")}
                  disabled={saving}
                  className="rounded-full border border-[#ddd6f3] px-5 py-3 text-sm font-semibold text-[#4f4864] transition hover:bg-[#f7f3ff] disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1f1637]">
                Course Actions
              </h2>
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => navigate(`/courses/${id}/content`)}
                  className="w-full rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                >
                  Manage Content
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/courses/${id}/add-section`)}
                  className="w-full rounded-full border border-[#d9cff6] px-5 py-3 text-sm font-semibold text-[#6d28d9] transition hover:bg-[#f7f3ff]"
                >
                  Add Section
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/teacher/course/${id}/quiz/create`)}
                  className="w-full rounded-full border border-[#d9cff6] px-5 py-3 text-sm font-semibold text-[#6d28d9] transition hover:bg-[#f7f3ff]"
                >
                  Create Quiz
                </button>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#faf8ff] p-6">
              <h2 className="text-xl font-semibold text-[#1f1637]">
                Quick Tips
              </h2>
              <div className="mt-4 space-y-2 text-sm text-[#6b6680]">
                <p>Use a clear title so students understand the topic quickly.</p>
                <p>Keep the description focused on outcomes and course value.</p>
                <p>Add sections and lessons in a simple learning order.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </TeacherLayout>
  );
};

export default EditCourse;
