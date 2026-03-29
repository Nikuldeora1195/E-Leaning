import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import usePageTitle from "../../utils/usePageTitle";
import * as teacherCourseApi from "../../api/teacherCourseApi";
import TeacherLayout from "../../components/app/TeacherLayout";

const TeacherDashboard = () => {
  usePageTitle("Teacher Dashboard | EduVillage");

  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalStudents: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await teacherCourseApi.getMyCourses();
        const courses = response.data;

        const publishedCourses = courses.filter((course) => course.isPublished).length;
        const draftCourses = courses.length - publishedCourses;

        let totalStudents = 0;

        for (const course of courses) {
          try {
            const studentRes = await teacherCourseApi.getCourseStudents(course._id);
            totalStudents += studentRes.data.length;
          } catch {
            console.log("No students for course:", course.title);
          }
        }

        setStats({
          totalCourses: courses.length,
          publishedCourses,
          draftCourses,
          totalStudents,
        });

        setRecentCourses(courses.slice(0, 4));
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
      title: "Announcements",
      description: "Post updates for your learners.",
      to: "/teacher/announcements/create",
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
                Manage your courses, review student activity, and keep your
                teaching workflow organized.
              </p>
            </div>

            <div className="rounded-[24px] bg-[#faf8ff] p-5 lg:min-w-[260px]">
              <p className="text-sm text-[#7a7392]">Teaching Summary</p>
              <p className="mt-2 text-2xl font-semibold text-[#1f1637]">
                {stats.totalCourses} courses
              </p>
              <p className="mt-2 text-sm text-[#6b6680]">
                {stats.totalStudents} total student enrollments across your
                courses.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Total Courses</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {stats.totalCourses}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Published</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {stats.publishedCourses}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Drafts</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {stats.draftCourses}
            </p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Students</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
              {stats.totalStudents}
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
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
              <div className="rounded-[24px] border border-dashed border-[#ddd6f3] bg-[#fcfbff] px-6 py-12 text-center">
                <h3 className="text-xl font-semibold text-[#1f1637]">
                  No courses yet
                </h3>
                <p className="mt-2 text-sm text-[#6b6680]">
                  Create your first course to get started.
                </p>
                <Link
                  to="/teacher/courses/create"
                  className="mt-5 inline-flex rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                >
                  Create Course
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div
                    key={course._id}
                    className="rounded-[24px] border border-[#ece8f7] bg-[#fcfbff] p-5"
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

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        to={`/teacher/courses/${course._id}/edit`}
                        className="rounded-full bg-[#6d28d9] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                      >
                        Edit Course
                      </Link>
                      <Link
                        to={`/courses/${course._id}/content`}
                        className="rounded-full border border-[#d9cff6] px-4 py-2 text-sm font-semibold text-[#6d28d9] transition hover:bg-[#f7f3ff]"
                      >
                        Manage Content
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
