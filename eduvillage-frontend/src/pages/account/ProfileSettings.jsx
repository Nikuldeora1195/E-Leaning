import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { getMyProfile, updateMyProfile } from "../../api/userApi";
import StudentLayout from "../../components/app/StudentLayout";
import TeacherLayout from "../../components/app/TeacherLayout";
import AdminLayout from "../../components/app/AdminLayout";
import usePageTitle from "../../utils/usePageTitle";

const ProfileSettings = () => {
  usePageTitle("Profile Settings | LearnMax");
  const { user, updateUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getMyProfile();
        setForm((prev) => ({
          ...prev,
          name: res.data.name || "",
          email: res.data.email || "",
        }));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Saving profile...");

    try {
      const res = await updateMyProfile(form);
      updateUser(res.data.user);
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
      toast.success("Profile updated successfully", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  const Layout =
    user?.role === "admin"
      ? AdminLayout
      : user?.role === "teacher"
      ? TeacherLayout
      : StudentLayout;

  if (loading) {
    return (
      <Layout title="">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7e0fb] border-t-[#6d28d9]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[28px] border border-[#ece8f7] bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
              Profile Settings
            </span>
            <h1 className="text-3xl font-semibold text-[#1f1637] sm:text-4xl">
              Manage your account
            </h1>
            <p className="max-w-2xl text-base text-[#6b6680]">
              Update your basic details and change your password from one clean page.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4f4864]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4f4864]">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#4f4864]">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={form.currentPassword}
                    onChange={(e) =>
                      setForm({ ...form, currentPassword: e.target.value })
                    }
                    className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                    placeholder="Only if changing password"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#4f4864]">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                    className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-[#ece8f7] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#1f1637]">
                Account Summary
              </h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#faf8ff] p-4">
                  <p className="text-sm text-[#7a7392]">Role</p>
                  <p className="mt-1 font-medium capitalize text-[#1f1637]">
                    {user?.role || "student"}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#faf8ff] p-4">
                  <p className="text-sm text-[#7a7392]">Teacher Request</p>
                  <p className="mt-1 font-medium capitalize text-[#1f1637]">
                    {user?.teacherRequestStatus || "none"}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#faf8ff] p-4">
                  <p className="text-sm text-[#7a7392]">Platform</p>
                  <p className="mt-1 font-medium text-[#1f1637]">
                    LearnMax by Nikul Kumar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProfileSettings;
