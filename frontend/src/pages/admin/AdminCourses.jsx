import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/app/AdminLayout";
import { deleteAdminCourse, getAdminCourses } from "../../api/adminApi";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await getAdminCourses();
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to load courses:", error);
      toast.error(error.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "published" && course.isPublished) ||
        (filter === "draft" && !course.isPublished);

      const query = search.toLowerCase();
      const matchesSearch =
        course.title?.toLowerCase().includes(query) ||
        course.createdBy?.name?.toLowerCase().includes(query) ||
        course.createdBy?.email?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [courses, filter, search]);

  const stats = {
    total: courses.length,
    published: courses.filter((course) => course.isPublished).length,
    drafts: courses.filter((course) => !course.isPublished).length,
  };

  const filters = [
    { key: "all", label: `All (${stats.total})` },
    { key: "published", label: `Published (${stats.published})` },
    { key: "draft", label: `Drafts (${stats.drafts})` },
  ];

  const handleDeleteCourse = async (courseId, title) => {
    const confirmed = window.confirm(
      `Delete "${title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    const toastId = toast.loading("Deleting course...");
    setDeletingId(courseId);

    try {
      await deleteAdminCourse(courseId);
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      toast.success("Course deleted", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course", {
        id: toastId,
      });
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7fb]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="">
      <div className="space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
              Admin Courses
            </span>
            <h1 className="text-3xl font-semibold text-[#1f1637] sm:text-4xl">
              Review and manage all courses
            </h1>
            <p className="max-w-2xl text-base text-[#6b6680]">
              Monitor course records, review who created them, and remove test or unwanted content.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Total Courses</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">{stats.total}</p>
          </div>
          <div className="rounded-3xl border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Published</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">{stats.published}</p>
          </div>
          <div className="rounded-3xl border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Drafts</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">{stats.drafts}</p>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              {filters.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    filter === item.key
                      ? "bg-[#6d28d9] text-white"
                      : "border border-[#ddd6f3] bg-white text-[#4f4864] hover:bg-[#f7f3ff]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search by course or teacher"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9] md:w-72"
            />
          </div>
        </section>

        {filteredCourses.length === 0 ? (
          <section className="rounded-[28px] border border-dashed border-[#ddd6f3] bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1f1637]">
              No courses found
            </h2>
            <p className="mt-2 text-sm text-[#6b6680]">
              Try another filter or search term.
            </p>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course._id}
                className="rounded-[28px] border border-[#ece8f7] bg-white shadow-sm"
              >
                <div className="border-b border-[#f1edfb] bg-[#faf8ff] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          course.isPublished
                            ? "bg-[#e8fbef] text-[#18794e]"
                            : "bg-[#f4f0ff] text-[#6d28d9]"
                        }`}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                      <h2 className="text-xl font-semibold text-[#1f1637]">
                        {course.title}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#6b6680]">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-4 p-6">
                  <div className="rounded-[22px] bg-[#faf8ff] p-4">
                    <p className="text-xs uppercase tracking-wide text-[#8c84a3]">
                      Created By
                    </p>
                    <p className="mt-2 font-medium text-[#1f1637]">
                      {course.createdBy?.name || "Unknown"}
                    </p>
                    <p className="mt-1 text-sm text-[#6b6680]">
                      {course.createdBy?.email || "No email"}
                    </p>
                  </div>

                  <div className="rounded-[22px] bg-[#faf8ff] p-4">
                    <p className="text-xs uppercase tracking-wide text-[#8c84a3]">
                      Course ID
                    </p>
                    <p className="mt-2 break-all text-sm font-medium text-[#1f1637]">
                      {course._id}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteCourse(course._id, course.title)}
                    disabled={deletingId === course._id}
                    className="w-full rounded-full border border-[#f2c5c5] px-5 py-3 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff5f5] disabled:opacity-60"
                  >
                    {deletingId === course._id ? "Deleting..." : "Delete Course"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
