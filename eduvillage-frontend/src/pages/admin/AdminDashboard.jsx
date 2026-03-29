import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AdminLayout from "../../components/app/AdminLayout";
import { getAdminStats } from "../../api/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => {
        setStats(res.data);
      })
      .catch((error) => {
        console.error("Failed to load admin stats:", error);
        toast.error(
          error.response?.data?.message || "Failed to load admin dashboard"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const overviewCards = [
    { label: "Total Users", value: stats.totalUsers, note: "All platform accounts" },
    { label: "Students", value: stats.totalStudents, note: "Registered learners" },
    { label: "Teachers", value: stats.totalTeachers, note: "Course creators" },
    { label: "Courses", value: stats.totalCourses, note: "All created courses" },
  ];

  const platformMetrics = [
    {
      label: "Enrollments",
      value: stats.totalEnrollments,
      detail: "Total course enrollments across the platform",
    },
    {
      label: "Completion Rate",
      value: `${stats.completionRate}%`,
      detail: "Current overall completion estimate",
    },
    {
      label: "Students per Teacher",
      value:
        stats.totalTeachers > 0
          ? Math.round(stats.totalStudents / stats.totalTeachers)
          : 0,
      detail: "High-level teaching load snapshot",
    },
  ];

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
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Admin Dashboard
              </span>
              <h1 className="text-3xl font-semibold text-[#1f1637] sm:text-4xl">
                Manage the platform from one place
              </h1>
              <p className="max-w-2xl text-base text-[#6b6680]">
                Review users, courses, and overall platform activity before we
                add the full admin toolset.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/users"
                className="rounded-full border border-[#d9cff6] px-5 py-3 text-sm font-semibold text-[#6d28d9] transition hover:bg-[#f7f3ff]"
              >
                Manage Users
              </Link>
              <Link
                to="/admin/courses"
                className="rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
              >
                Manage Courses
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <div
              key={card.label}
              className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-[#7a7392]">{card.label}</p>
              <p className="mt-3 text-4xl font-semibold text-[#1f1637]">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-[#6b6680]">{card.note}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
          <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1f1637]">
              Platform Snapshot
            </h2>
            <div className="mt-5 space-y-4">
              {platformMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[22px] bg-[#faf8ff] p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-[#1f1637]">{metric.label}</p>
                    <span className="text-2xl font-semibold text-[#6d28d9]">
                      {metric.value}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#6b6680]">
                    {metric.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#1f1637]">
                Quick Actions
              </h2>
              <div className="mt-5 space-y-3">
                <Link
                  to="/admin/users"
                  className="block rounded-[22px] border border-[#ece8f7] px-5 py-4 transition hover:border-[#d3c4f8] hover:bg-[#fcfbff]"
                >
                  <p className="font-semibold text-[#1f1637]">View Users</p>
                  <p className="mt-1 text-sm text-[#6b6680]">
                    Review roles and account status.
                  </p>
                </Link>
                <Link
                  to="/admin/courses"
                  className="block rounded-[22px] border border-[#ece8f7] px-5 py-4 transition hover:border-[#d3c4f8] hover:bg-[#fcfbff]"
                >
                  <p className="font-semibold text-[#1f1637]">Review Courses</p>
                  <p className="mt-1 text-sm text-[#6b6680]">
                    Inspect and manage course records.
                  </p>
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#faf8ff] p-6">
              <h2 className="text-2xl font-semibold text-[#1f1637]">
                Next Admin Steps
              </h2>
              <div className="mt-4 space-y-2 text-sm leading-6 text-[#6b6680]">
                <p>1. Add role change and account status controls.</p>
                <p>2. Add course moderation and delete actions.</p>
                <p>3. Later connect teacher approval flow here.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
