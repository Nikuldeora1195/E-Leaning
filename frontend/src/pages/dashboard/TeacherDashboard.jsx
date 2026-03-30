import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import usePageTitle from "../../utils/usePageTitle";
import * as teacherCourseApi from "../../api/teacherCourseApi";
import TeacherLayout from "../../components/app/TeacherLayout";

const TeacherDashboard = () => {
  usePageTitle("Teacher Dashboard | LearnMax");

  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalStudents: 0,
    completedEnrollments: 0,
    averageProgress: 0,
    averageRating: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [analyticsRes, coursesRes] = await Promise.all([
          teacherCourseApi.getTeacherAnalytics(),
          teacherCourseApi.getMyCourses(),
        ]);

        setStats(analyticsRes.data);
        setTopCourses(analyticsRes.data.topCourses || []);
        setRecentCourses(coursesRes.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7fb] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Create Course",
      description: "Start a new course and add content later.",
      to: "/teacher/courses/create",
    },
    {
      title: "Manage Courses",
      description: "Edit, publish, or update your existing courses.",
      to: "/teacher/courses",
    },
    {
      title: "Students",
      description: "View student progress across your courses.",
      to: "/teacher/students",
    },
    {
      title: "Profile Settings",
      description: "Update your account details and password.",
      to: "/profile",
    },
  ];

  return (
    <TeacherLayout title="">
      <div className="space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Teacher Dashboard
              </span>
              <h1 className="text-3xl font-semibold text-[#1f1637] sm:text-4xl">
                Welcome back, {user?.name || "Teacher"}
              </h1>
              <p className="text-base text-[#6b6680]">
                Track how your courses are performing, review student progress,
                and keep teaching data in one place.
              </p>
            </div>

            <div className="rounded-3xl bg-[#faf8ff] p-5 lg:min-w-70">
              <p className="text-sm text-[#7a7392]">Teaching Summary</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f1637]">
                {stats.totalStudents} enrollments
              </p>
              <p className="mt-2 text-sm text-[#6b6680]">
                {stats.averageProgress}% average progress and {stats.averageRating} / 5 average rating.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Total Courses</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {stats.totalCourses}
            </p>
          </div>
          <div className="rounded-3xl border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Published</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {stats.publishedCourses}
            </p>
          </div>
          <div className="rounded-3xl border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Completion</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {stats.completedEnrollments}
            </p>
          </div>
          <div className="rounded-3xl border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Avg Rating</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {stats.averageRating}
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-[#1f1637]">
                    Recent Courses
                  </h2>
                  <p className="mt-1 text-sm text-[#6b6680]">
                    Your latest created or updated courses.
                  </p>
                </div>
                <Link
                  to="/teacher/courses"
                  className="rounded-full border border-[#d9cff6] px-4 py-2 text-sm font-medium text-[#6d28d9] transition hover:bg-[#f7f3ff]"
                >
                  View All
                </Link>
              </div>

              {recentCourses.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#ddd6f3] bg-[#fcfbff] px-6 py-12 text-center">
                  <h3 className="text-xl font-semibold text-[#1f1637]">
                    No courses yet
                  </h3>
                  <p className="mt-2 text-sm text-[#6b6680]">
                    Create your first course to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div
                      key={course._id}
                      className="rounded-3xl border border-[#ece8f7] bg-[#fcfbff] p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-[#1f1637]">
                            {course.title}
                          </h3>
                          <p className="text-sm leading-6 text-[#6b6680]">
                            {course.description}
                          </p>
                        </div>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            course.isPublished
                              ? "bg-[#e8fbef] text-[#18794e]"
                              : "bg-[#f4f0ff] text-[#6d28d9]"
                          }`}
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-[#1f1637]">
                  Top Course Performance
                </h2>
                <p className="text-sm text-[#6b6680]">
                  A quick look at which courses are attracting learners and keeping them active.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {topCourses.length === 0 ? (
                  <div className="rounded-3xl bg-[#faf8ff] p-5 text-sm text-[#6b6680]">
                    Analytics will appear here once students start enrolling and leaving reviews.
                  </div>
                ) : (
                  topCourses.map((course) => (
                    <div
                      key={course._id}
                      className="rounded-3xl border border-[#ece8f7] bg-[#fcfbff] p-5"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-[#1f1637]">{course.title}</p>
                          <p className="mt-1 text-sm text-[#6b6680]">
                            {course.enrollments} enrollments • {course.averageProgress}% average progress
                          </p>
                        </div>
                        <span className="rounded-full bg-[#f4f0ff] px-3 py-1 text-sm font-semibold text-[#6d28d9]">
                          {course.averageRating || 0} / 5
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1f1637]">
              Quick Actions
            </h2>
            <div className="mt-5 space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="block rounded-[22px] border border-[#ece8f7] px-5 py-4 transition hover:border-[#cdbcf7] hover:bg-[#fcfbff]"
                >
                  <p className="font-semibold text-[#1f1637]">{action.title}</p>
                  <p className="mt-1 text-sm text-[#6b6680]">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
