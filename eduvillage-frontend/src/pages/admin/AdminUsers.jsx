import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/app/AdminLayout";
import {
  getAdminUsers,
  toggleAdminUserStatus,
  updateAdminUserRole,
} from "../../api/adminApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [busyUserId, setBusyUserId] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesFilter = filter === "all" || user.role === filter;
      const query = search.toLowerCase();
      const matchesSearch =
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [users, filter, search]);

  const stats = {
    total: users.length,
    students: users.filter((user) => user.role === "student").length,
    teachers: users.filter((user) => user.role === "teacher").length,
    admins: users.filter((user) => user.role === "admin").length,
    active: users.filter((user) => user.isActive).length,
  };

  const filters = [
    { key: "all", label: `All (${stats.total})` },
    { key: "student", label: `Students (${stats.students})` },
    { key: "teacher", label: `Teachers (${stats.teachers})` },
    { key: "admin", label: `Admins (${stats.admins})` },
  ];

  const handleRoleChange = async (userId, role) => {
    const toastId = toast.loading("Updating role...");
    setBusyUserId(userId);

    try {
      await updateAdminUserRole(userId, role);
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role } : user))
      );
      toast.success("User role updated", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role", {
        id: toastId,
      });
    } finally {
      setBusyUserId("");
    }
  };

  const handleStatusToggle = async (userId) => {
    const toastId = toast.loading("Updating status...");
    setBusyUserId(userId);

    try {
      const res = await toggleAdminUserStatus(userId);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, isActive: res.data.user.isActive }
            : user
        )
      );
      toast.success("User status updated", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status", {
        id: toastId,
      });
    } finally {
      setBusyUserId("");
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
              Admin Users
            </span>
            <h1 className="text-3xl font-semibold text-[#1f1637] sm:text-4xl">
              Manage accounts and roles
            </h1>
            <p className="max-w-2xl text-base text-[#6b6680]">
              Review users, change roles, and enable or disable accounts from one place.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-5">
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Total Users</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">{stats.total}</p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Students</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">{stats.students}</p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Teachers</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">{stats.teachers}</p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Admins</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">{stats.admins}</p>
          </div>
          <div className="rounded-[24px] border border-[#ece8f7] bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[#7a7392]">Active</p>
            <p className="mt-3 text-4xl font-semibold text-[#1f1637]">{stats.active}</p>
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
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9] md:w-72"
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-[#ece8f7] bg-white shadow-sm">
          {filteredUsers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="text-2xl font-semibold text-[#1f1637]">
                No users found
              </h2>
              <p className="mt-2 text-sm text-[#6b6680]">
                Try another filter or search term.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead className="border-b border-[#ece8f7] bg-[#faf8ff]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f1637]">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f1637]">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f1637]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f1637]">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f1637]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-[#f2eefb]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4f0ff] text-sm font-semibold text-[#6d28d9]">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium text-[#1f1637]">
                              {user.name || "Unknown"}
                            </p>
                            <p className="mt-1 text-sm text-[#6b6680]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          disabled={busyUserId === user._id}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="rounded-2xl border border-[#ddd6f3] px-4 py-2.5 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9] disabled:opacity-60"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isActive
                              ? "bg-[#e8fbef] text-[#18794e]"
                              : "bg-[#fff1f1] text-[#b42318]"
                          }`}
                        >
                          {user.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6b6680]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusToggle(user._id)}
                          disabled={busyUserId === user._id}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            user.isActive
                              ? "border border-[#f2c5c5] text-[#b42318] hover:bg-[#fff5f5]"
                              : "border border-[#cde8d7] text-[#18794e] hover:bg-[#f4fcf6]"
                          } disabled:opacity-60`}
                        >
                          {user.isActive ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
