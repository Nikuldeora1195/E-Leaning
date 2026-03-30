import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEnrollments, updateProgress } from "../../api/courseApi";
import usePageTitle from "../../utils/usePageTitle";
import StudentLayout from "../../components/app/StudentLayout";
import { AuthContext } from "../../context/AuthContext";

const MyCourses = () => {
  usePageTitle("My Learning | LearnMax");

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyEnrollments();
      setCourses(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your session expired. Please log in again.");
      } else if (!err.response) {
        setError("Backend is not reachable. Make sure the local server is running.");
      } else {
        setError(err.response?.data?.message || "Failed to load enrolled courses");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleProgressChange = async (id, value) => {
    const progress = Number(value);
    if (progress < 0 || progress > 100 || Number.isNaN(progress)) return;

    try {
      await updateProgress(id, progress);
      loadCourses();
    } catch (err) {
      console.error("Progress update failed", err);
      setError(
        err.response?.data?.message ||
          "Failed to update progress. Please try again."
      );
    }
  };

  const filteredCourses = courses.filter((item) => {
    if (filter === "completed") return item.isCompleted;
    if (filter === "in-progress") return !item.isCompleted;
    return true;
  });

  const totalCourses = courses.length;
  const completedCourses = courses.filter((item) => item.isCompleted).length;
  const inProgressCourses = totalCourses - completedCourses;
  const avgProgress =
    totalCourses > 0
      ? Math.round(
          courses.reduce((sum, item) => sum + (item.progress || 0), 0) /
            totalCourses
        )
      : 0;

  const filters = [
    { key: "all", label: `All (${totalCourses})` },
    { key: "in-progress", label: `In Progress (${inProgressCourses})` },
    { key: "completed", label: `Completed (${completedCourses})` },
  ];

  if (loading) {
    return (
      <StudentLayout title="My Learning">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="">
      <div className="space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
              My Learning
            </span>
            <h1 className="text-3xl font-semibold text-[#1f1637] sm:text-4xl">
              Keep going, {user?.name || "Student"}
            </h1>
            <p className="max-w-2xl text-base text-[#6b6680]">
              Track your enrolled courses, update progress, and continue from
              where you left off.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Total Enrolled</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {totalCourses}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">In Progress</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {inProgressCourses}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Completed</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {completedCourses}
            </p>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-[#f8caca] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-[#b42318]">
            {error}
          </div>
        )}

        <section className="flex flex-wrap gap-3">
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
        </section>

        {filteredCourses.length === 0 ? (
          <section className="rounded-[28px] border border-dashed border-[#ddd6f3] bg-white px-6 py-16 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-[#1f1637]">
              {filter === "all"
                ? "No enrolled courses yet"
                : filter === "completed"
                ? "No completed courses yet"
                : "No courses in progress"}
            </h3>
            <p className="mt-2 text-sm text-[#6b6680]">
              {filter === "all"
                ? "Start by enrolling in a course."
                : "Try another filter or continue learning from your courses."}
            </p>
            {filter === "all" && (
              <button
                onClick={() => navigate("/courses")}
                className="mt-5 rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
              >
                Browse Courses
              </button>
            )}
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-2">
            {filteredCourses.map((item) => {
              const course = item.course;
              const progress = item.progress || 0;

              return (
                <article
                  key={item._id}
                  className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.isCompleted
                            ? "bg-[#e8fbef] text-[#18794e]"
                            : "bg-[#f4f0ff] text-[#6d28d9]"
                        }`}
                      >
                        {item.isCompleted ? "Completed" : "In Progress"}
                      </span>
                      <h2 className="text-xl font-semibold text-[#1f1637]">
                        {course?.title}
                      </h2>
                      <p className="text-sm leading-6 text-[#6b6680]">
                        {course?.description}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#faf8ff] px-4 py-3 text-center">
                      <p className="text-xs uppercase tracking-wide text-[#8c84a3]">
                        Progress
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[#1f1637]">
                        {progress}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#7a7392]">Course progress</span>
                      <span className="font-medium text-[#1f1637]">{progress}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#ece8f7]">
                      <div
                        className="h-2.5 rounded-full bg-[#6d28d9]"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#4f4864]">
                        Update progress
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={progress}
                          onChange={(e) =>
                            handleProgressChange(item._id, e.target.value)
                          }
                          className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                        />
                        <span className="text-sm text-[#7a7392]">%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/courses/${course?._id}/content`)}
                      className="rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                    >
                      {item.isCompleted ? "Review Course" : "Continue Learning"}
                    </button>
                  </div>

                  {item.isCompleted && (
                    <div className="mt-5 rounded-2xl border border-[#d8f0df] bg-[#f4fcf6] p-4">
                      <p className="text-sm font-medium text-[#18794e]">
                        Certificate available for this course.
                      </p>
                      <button
                        onClick={() =>
                          navigate(
                            `/certificate/${encodeURIComponent(course.title)}`
                          )
                        }
                        className="mt-3 rounded-full border border-[#b7e0c3] px-4 py-2 text-sm font-semibold text-[#18794e] transition hover:bg-white"
                      >
                        View Certificate
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}

        {totalCourses > 0 && (
          <section className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#1f1637]">
                  Overall Progress
                </h3>
                <p className="mt-1 text-sm text-[#6b6680]">
                  Your average completion across all enrolled courses.
                </p>
              </div>
              <p className="text-3xl font-semibold text-[#1f1637]">
                {avgProgress}%
              </p>
            </div>
            <div className="mt-4 h-3 rounded-full bg-[#ece8f7]">
              <div
                className="h-3 rounded-full bg-[#6d28d9]"
                style={{ width: `${avgProgress}%` }}
              ></div>
            </div>
          </section>
        )}
      </div>
    </StudentLayout>
  );
};

export default MyCourses;
