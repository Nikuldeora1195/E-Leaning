import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import usePageTitle from "../../utils/usePageTitle";
import StudentLayout from "../../components/app/StudentLayout";
import { getMyEnrollments } from "../../api/enrollmentApi";

const StudentDashboard = () => {
  usePageTitle("Student Dashboard | EduVillage");
  const { user } = useContext(AuthContext);

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyEnrollments()
      .then((res) => {
        setEnrollments(res.data);
        setError("");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load enrollments", err);
        if (err.response?.status === 401) {
          setError("Your session expired. Please log in again.");
        } else if (!err.response) {
          setError("Backend is not reachable. Make sure the local server is running.");
        } else {
          setError(err.response?.data?.message || "Failed to load enrollments");
        }
        setLoading(false);
      });
  }, []);

  const enrolledCount = enrollments.length;
  const completedCount = enrollments.filter((item) => item.isCompleted).length;
  const inProgressCount = enrolledCount - completedCount;

  const avgProgress =
    enrolledCount > 0
      ? Math.round(
          enrollments.reduce((sum, item) => sum + (item.progress || 0), 0) /
            enrolledCount
        )
      : 0;

  const recentCourses = enrollments.slice(0, 3);

  const stats = [
    {
      label: "Enrolled Courses",
      value: enrolledCount,
      note: "Courses added to your learning",
    },
    {
      label: "In Progress",
      value: inProgressCount,
      note: "Courses you are currently studying",
    },
    {
      label: "Completed",
      value: completedCount,
      note: "Courses finished successfully",
    },
  ];

  const quickLinks = [
    {
      title: "Browse Courses",
      description: "Find new courses and enroll.",
      to: "/courses",
    },
    {
      title: "My Learning",
      description: "Open your enrolled courses.",
      to: "/my-courses",
    },
    {
      title: "Announcements",
      description: "Check updates from teachers.",
      to: "/announcements",
    },
  ];

  if (loading) {
    return (
      <StudentLayout title="Student Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="">
      <div className="space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Student Dashboard
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-[#1f1637] sm:text-4xl">
                  Welcome back, {user?.name || "Student"}
                </h1>
                <p className="text-base text-[#6b6680]">
                  Keep learning one step at a time. Your enrolled courses,
                  progress, and recent activity are all here.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-90">
              <div className="rounded-2xl bg-[#faf8ff] p-4">
                <p className="text-sm text-[#7a7392]">Average Progress</p>
                <p className="mt-2 text-2xl font-semibold text-[#1f1637]">
                  {avgProgress}%
                </p>
              </div>
              <div className="rounded-2xl bg-[#faf8ff] p-4">
                <p className="text-sm text-[#7a7392]">Role</p>
                <p className="mt-2 text-2xl font-semibold capitalize text-[#1f1637]">
                  {user?.role || "student"}
                </p>
              </div>
              <div className="rounded-2xl bg-[#faf8ff] p-4 col-span-2 sm:col-span-1">
                <p className="text-sm text-[#7a7392]">Email</p>
                <p className="mt-2 truncate text-sm font-medium text-[#1f1637]">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-[#ece8f7] bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-[#7a7392]">{stat.label}</p>
              <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-[#6b6680]">{stat.note}</p>
            </div>
          ))}
        </section>

        {error && (
          <div className="rounded-2xl border border-[#f8caca] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-[#b42318]">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-[#1f1637]">
                  Continue Learning
                </h2>
                <p className="mt-1 text-sm text-[#6b6680]">
                  Jump back into your latest enrolled courses.
                </p>
              </div>
              <Link
                to="/my-courses"
                className="rounded-full border border-[#d9cff6] px-4 py-2 text-sm font-medium text-[#6d28d9] transition hover:bg-[#f7f3ff]"
              >
                View All
              </Link>
            </div>

            {recentCourses.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#ddd6f3] bg-[#fcfbff] px-6 py-12 text-center">
                <h3 className="text-xl font-semibold text-[#1f1637]">
                  No courses enrolled yet
                </h3>
                <p className="mt-2 text-sm text-[#6b6680]">
                  Start with a course and your learning progress will appear
                  here.
                </p>
                <Link
                  to="/courses"
                  className="mt-5 inline-flex rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCourses.map((enrollment) => (
                  <Link
                    key={enrollment._id}
                    to={`/courses/${enrollment.course._id}/content`}
                    className="block rounded-3xl border border-[#ece8f7] bg-[#fcfbff] p-5 transition hover:border-[#cdbcf7] hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-[#1f1637]">
                          {enrollment.course.title}
                        </h3>
                        <p className="text-sm text-[#6b6680]">
                          {enrollment.course.description}
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          enrollment.isCompleted
                            ? "bg-[#e8fbef] text-[#18794e]"
                            : "bg-[#f4f0ff] text-[#6d28d9]"
                        }`}
                      >
                        {enrollment.isCompleted ? "Completed" : "In Progress"}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#7a7392]">Progress</span>
                        <span className="font-medium text-[#1f1637]">
                          {enrollment.progress}%
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[#ece8f7]">
                        <div
                          className="h-2.5 rounded-full bg-[#6d28d9]"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1f1637]">
                Quick Actions
              </h2>
              <div className="mt-5 space-y-3">
                {quickLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block rounded-[22px] border border-[#ece8f7] px-5 py-4 transition hover:border-[#cdbcf7] hover:bg-[#fcfbff]"
                  >
                    <p className="font-semibold text-[#1f1637]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#6b6680]">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1f1637]">
                Account Overview
              </h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#faf8ff] p-4">
                  <p className="text-sm text-[#7a7392]">Name</p>
                  <p className="mt-1 font-medium text-[#1f1637]">
                    {user?.name || "Student"}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#faf8ff] p-4">
                  <p className="text-sm text-[#7a7392]">Email</p>
                  <p className="mt-1 break-all font-medium text-[#1f1637]">
                    {user?.email || "No email"}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#faf8ff] p-4">
                  <p className="text-sm text-[#7a7392]">Average Progress</p>
                  <p className="mt-1 font-medium text-[#1f1637]">
                    {avgProgress}% across all enrolled courses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
