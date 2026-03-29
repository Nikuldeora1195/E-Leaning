import { useState } from "react";
import { createAnnouncement } from "../../api/announcementApi";
import toast from "react-hot-toast";
import TeacherLayout from "../../components/app/TeacherLayout";

const CreateAnnouncement = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Posting announcement...");

    try {
      await createAnnouncement(form);
      toast.success("Announcement posted successfully", { id: toastId });
      setForm({ title: "", message: "" });
    } catch {
      toast.error("Failed to create announcement", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout title="">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
              Announcement
            </span>
            <h1 className="text-3xl font-semibold text-[#1f1637]">
              Post an update for students
            </h1>
            <p className="max-w-2xl text-base text-[#6b6680]">
              Share important information clearly and keep the message easy to read.
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4f4864]">
                Title
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                placeholder="Enter announcement title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                maxLength={100}
              />
              <p className="text-xs text-[#7a7392]">{form.title.length}/100 characters</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#4f4864]">
                Message
              </label>
              <textarea
                className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9] resize-none"
                rows={8}
                placeholder="Write your announcement message here"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                required
                maxLength={1000}
              />
              <p className="text-xs text-[#7a7392]">
                {form.message.length}/1000 characters
              </p>
            </div>

            {(form.title || form.message) && (
              <div className="rounded-[24px] bg-[#faf8ff] p-5">
                <h2 className="text-lg font-semibold text-[#1f1637]">Preview</h2>
                {form.title && (
                  <h3 className="mt-4 text-xl font-semibold text-[#1f1637]">
                    {form.title}
                  </h3>
                )}
                {form.message && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#5e5872]">
                    {form.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading || !form.title.trim() || !form.message.trim()}
                className="flex-1 rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Posting..." : "Post Announcement"}
              </button>

              <button
                type="button"
                onClick={() => setForm({ title: "", message: "" })}
                disabled={loading}
                className="rounded-full border border-[#ddd6f3] px-5 py-3 text-sm font-semibold text-[#4f4864] transition hover:bg-[#f7f3ff] disabled:opacity-60"
              >
                Clear
              </button>
            </div>
          </form>
        </section>
      </div>
    </TeacherLayout>
  );
};

export default CreateAnnouncement;
