import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCourses, publishCourse } from "../../api/teacherCourseApi";
import toast from "react-hot-toast";
import TeacherLayout from "../../components/app/TeacherLayout";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadCourses = () => {
    getMyCourses()
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load courses");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handlePublish = async (id) => {
    const toastId = toast.loading("Publishing...");
    try {
      await publishCourse(id);
      toast.success("Course published successfully", { id: toastId });
      loadCourses();
    } catch {
      toast.error("Failed to publish course", { id: toastId });
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (filter === "published") return course.isPublished;
    if (filter === "draft") return !course.isPublished;
    return true;
  });

  const totalCourses = courses.length;
  const publishedCourses = courses.filter((course) => course.isPublished).length;
  const draftCourses = totalCourses - publishedCourses;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7fb] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
      </div>
    );
  }

  return (
    <TeacherLayout title="">
      <div className="space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                My Courses
              </span>
              <h1 className="text-3xl font-semibold text-[#1f1637] sm:text-4xl">
                Manage your teaching content
              </h1>
              <p className="max-w-2xl text-base text-[#6b6680]">
                Create, edit, publish, and organize all your courses from one place.
              </p>
            </div>

            <Link
              to="/teacher/courses/create"
              className="inline-flex rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
            >
              Create Course
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Total Courses</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {totalCourses}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Published</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {publishedCourses}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Drafts</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {draftCourses}
            </p>
          </div>
        </section>

        <section className="flex flex-wrap gap-3">
          {[
            { key: "all", label: `All (${totalCourses})` },
            { key: "published", label: `Published (${publishedCourses})` },
            { key: "draft", label: `Drafts (${draftCourses})` },
          ].map((item) => (
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
        </section>

        {filteredCourses.length === 0 ? (
          <section className="rounded-[28px] border border-dashed border-[#ddd6f3] bg-white px-6 py-16 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-[#1f1637]">
              {filter === "all"
                ? "No courses created yet"
                : filter === "published"
                ? "No published courses yet"
                : "No draft courses yet"}
            </h3>
            <p className="mt-2 text-sm text-[#6b6680]">
              Create a course to start building your teaching space.
            </p>
            <Link
              to="/teacher/courses/create"
              className="mt-5 inline-flex rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
            >
              Create Course
            </Link>
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
                      <h3 className="text-xl font-semibold text-[#1f1637]">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#6b6680]">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-3 p-6">
                  <Link
                    to={`/courses/${course._id}/content`}
                    className="block rounded-full bg-[#6d28d9] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                  >
                    Manage Content
                  </Link>

                  <Link
                    to={`/teacher/courses/${course._id}/edit`}
                    className="block rounded-full border border-[#d9cff6] px-5 py-3 text-center text-sm font-semibold text-[#6d28d9] transition hover:bg-[#f7f3ff]"
                  >
                    Edit Details
                  </Link>

                  <Link
                    to={`/teacher/course/${course._id}/quiz/create`}
                    className="block rounded-full border border-[#d9cff6] px-5 py-3 text-center text-sm font-semibold text-[#6d28d9] transition hover:bg-[#f7f3ff]"
                  >
                    Create Quiz
                  </Link>

                  {!course.isPublished && (
                    <button
                      onClick={() => handlePublish(course._id)}
                      className="w-full rounded-full border border-[#cde8d7] bg-[#f4fcf6] px-5 py-3 text-sm font-semibold text-[#18794e] transition hover:bg-white"
                    >
                      Publish Course
                    </button>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </TeacherLayout>
  );
};

export default MyCourses;
