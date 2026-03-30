import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createSection } from "../../api/contentApi";
import TeacherLayout from "../../components/app/TeacherLayout";

const AddSection = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const toastId = toast.loading("Creating section...");

    try {
      await createSection({
        title,
        courseId,
      });

      toast.success("Section created successfully", { id: toastId });
      navigate(`/courses/${courseId}/content`);
    } catch (error) {
      console.error("Failed to create section:", error);
      toast.error("Failed to create section", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout title="">
      <div className="mx-auto max-w-3xl space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Add Section
              </span>
              <h1 className="text-3xl font-semibold text-[#1f1637]">
                Create a new section
              </h1>
              <p className="max-w-2xl text-base text-[#6b6680]">
                Add a section first, then you can start creating lessons inside it.
              </p>
            </div>

            <button
              onClick={() => navigate(`/courses/${courseId}/content`)}
              className="rounded-full border border-[#d9cff6] px-4 py-2 text-sm font-medium text-[#6d28d9] transition hover:bg-[#f7f3ff]"
            >
              Back to Content
            </button>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4f4864]">
                Section Title
              </label>
              <input
                className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                placeholder="Enter section title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-[#7a7392]">{title.length}/100 characters</p>
            </div>

            <div className="rounded-3xl bg-[#faf8ff] p-5">
              <h2 className="text-lg font-semibold text-[#1f1637]">
                Good section examples
              </h2>
              <div className="mt-3 space-y-2 text-sm text-[#6b6680]">
                <p>Introduction</p>
                <p>HTML Basics</p>
                <p>Building the First Project</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex-1 rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Section"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/courses/${courseId}/content`)}
                className="rounded-full border border-[#ddd6f3] px-5 py-3 text-sm font-semibold text-[#4f4864] transition hover:bg-[#f7f3ff]"
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

export default AddSection;
