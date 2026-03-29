// import { useEffect, useState } from "react";
// import { getAllUsers, updateUserRole, updateUserStatus } from "../../api/adminApi";
// // import AdminSidebar from "../../components/admin/AdminSidebar";
// import toast from "react-hot-toast";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all"); // all, student, teacher, admin
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     try {
//       const response = await getAllUsers();
//       setUsers(response.data);
//     } catch (error) {
//       console.error("Failed to load users:", error);
//       toast.error("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRoleChange = async (userId, newRole) => {
//     const toastId = toast.loading("Updating user role...");
//     try {
//       await updateUserRole(userId, newRole);
//       toast.success("User role updated successfully! ✅", { id: toastId });
//       loadUsers(); // Reload users
//     } catch (error) {
//       console.error("Failed to update role:", error);
//       toast.error("Failed to update user role", { id: toastId });
//     }
//   };

//   const handleStatusToggle = async (userId, currentStatus) => {
//     const newStatus = !currentStatus;
//     const toastId = toast.loading(newStatus ? "Activating user..." : "Deactivating user...");
    
//     try {
//       await updateUserStatus(userId, newStatus);
//       toast.success(
//         newStatus ? "User activated successfully! ✅" : "User deactivated successfully! ⛔",
//         { id: toastId }
//       );
//       loadUsers(); // Reload users
//     } catch (error) {
//       console.error("Failed to update status:", error);
//       toast.error("Failed to update user status", { id: toastId });
//     }
//   };

//   // Filter users
//   const filteredUsers = users.filter((user) => {
//     const matchesFilter = filter === "all" || user.role === filter;
//     const matchesSearch =
//       user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   // Calculate stats
//   const totalUsers = users.length;
//   const studentCount = users.filter((u) => u.role === "student").length;
//   const teacherCount = users.filter((u) => u.role === "teacher").length;
//   const adminCount = users.filter((u) => u.role === "admin").length;
//   const activeUsers = users.filter((u) => u.isActive).length;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#F4F7FA] flex">
//         {/* <AdminSidebar /> */}
//         <div className="flex-1 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B9AAA]"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F4F7FA] flex">
//       {/* <AdminSidebar /> */}

//       {/* Main Content */}
//       <main className="flex-1 p-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-[#142C52] mb-2">User Management</h1>
//           <p className="text-[#071426] opacity-70 text-lg">
//             Manage user roles, permissions, and account status
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
//           <div className="bg-white rounded-xl p-4 border border-[#CCE7EC] shadow-md">
//             <p className="text-xs text-[#071426] opacity-60 mb-1">Total Users</p>
//             <p className="text-2xl font-bold text-[#142C52]">{totalUsers}</p>
//           </div>
//           <div className="bg-white rounded-xl p-4 border border-[#CCE7EC] shadow-md">
//             <p className="text-xs text-[#071426] opacity-60 mb-1">Students</p>
//             <p className="text-2xl font-bold text-[#142C52]">{studentCount}</p>
//           </div>
//           <div className="bg-white rounded-xl p-4 border border-[#CCE7EC] shadow-md">
//             <p className="text-xs text-[#071426] opacity-60 mb-1">Teachers</p>
//             <p className="text-2xl font-bold text-[#142C52]">{teacherCount}</p>
//           </div>
//           <div className="bg-white rounded-xl p-4 border border-[#CCE7EC] shadow-md">
//             <p className="text-xs text-[#071426] opacity-60 mb-1">Admins</p>
//             <p className="text-2xl font-bold text-[#142C52]">{adminCount}</p>
//           </div>
//           <div className="bg-white rounded-xl p-4 border border-[#CCE7EC] shadow-md">
//             <p className="text-xs text-[#071426] opacity-60 mb-1">Active</p>
//             <p className="text-2xl font-bold text-[#22C55E]">{activeUsers}</p>
//           </div>
//         </div>

//         {/* Filters and Search */}
//         <div className="bg-white rounded-xl border border-[#CCE7EC] shadow-lg p-6 mb-6">
//           <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
//             {/* Filter Tabs */}
//             <div className="flex gap-2 flex-wrap">
//               <button
//                 onClick={() => setFilter("all")}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   filter === "all"
//                     ? "bg-linear-to-r from-[#1B9AAA] to-[#16808D] text-white shadow-md"
//                     : "bg-[#F4F7FA] text-[#071426] hover:bg-[#CCE7EC]"
//                 }`}
//               >
//                 All ({totalUsers})
//               </button>
//               <button
//                 onClick={() => setFilter("student")}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   filter === "student"
//                     ? "bg-linear-to-r from-[#1B9AAA] to-[#16808D] text-white shadow-md"
//                     : "bg-[#F4F7FA] text-[#071426] hover:bg-[#CCE7EC]"
//                 }`}
//               >
//                 Students ({studentCount})
//               </button>
//               <button
//                 onClick={() => setFilter("teacher")}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   filter === "teacher"
//                     ? "bg-linear-to-r from-[#1B9AAA] to-[#16808D] text-white shadow-md"
//                     : "bg-[#F4F7FA] text-[#071426] hover:bg-[#CCE7EC]"
//                 }`}
//               >
//                 Teachers ({teacherCount})
//               </button>
//               <button
//                 onClick={() => setFilter("admin")}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   filter === "admin"
//                     ? "bg-linear-to-r from-[#1B9AAA] to-[#16808D] text-white shadow-md"
//                     : "bg-[#F4F7FA] text-[#071426] hover:bg-[#CCE7EC]"
//                 }`}
//               >
//                 Admins ({adminCount})
//               </button>
//             </div>

//             {/* Search */}
//             <div className="relative w-full md:w-64">
//               <input
//                 type="text"
//                 placeholder="Search by name or email..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full border-2 border-[#CCE7EC] rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-[#1B9AAA] transition-colors"
//               />
//               <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
//             </div>
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="bg-white rounded-xl border border-[#CCE7EC] shadow-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-linear-to-r from-[#CCE7EC]/30 to-[#4C97A8]/10 border-b border-[#CCE7EC]">
//                 <tr>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-[#142C52]">
//                     User
//                   </th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-[#142C52]">
//                     Email
//                   </th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-[#142C52]">
//                     Role
//                   </th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-[#142C52]">
//                     Status
//                   </th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-[#142C52]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="text-center py-12">
//                       <div className="text-[#071426] opacity-60">
//                         <p className="text-lg mb-2">No users found</p>
//                         <p className="text-sm">Try adjusting your filters or search query</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredUsers.map((user) => (
//                     <tr
//                       key={user._id}
//                       className="border-b border-[#CCE7EC] hover:bg-[#F4F7FA] transition-colors"
//                     >
//                       {/* User Info */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-linear-to-br from-[#1B9AAA] to-[#16808D] rounded-full flex items-center justify-center shrink-0">
//                             <span className="text-white font-bold text-sm">
//                               {user.name.charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                           <div>
//                             <p className="font-medium text-[#142C52]">{user.name}</p>
//                             <p className="text-xs text-[#071426] opacity-60">ID: {user._id.slice(-6)}</p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Email */}
//                       <td className="px-6 py-4">
//                         <p className="text-sm text-[#071426]">{user.email}</p>
//                       </td>

//                       {/* Role Dropdown */}
//                       <td className="px-6 py-4">
//                         <select
//                           value={user.role}
//                           onChange={(e) => handleRoleChange(user._id, e.target.value)}
//                           className="px-3 py-1.5 rounded-lg border-2 border-[#CCE7EC] focus:border-[#1B9AAA] focus:outline-none text-sm font-medium text-[#142C52] cursor-pointer hover:bg-[#F4F7FA] transition-colors"
//                         >
//                           <option value="student">Student</option>
//                           <option value="teacher">Teacher</option>
//                           <option value="admin">Admin</option>
//                         </select>
//                       </td>

//                       {/* Status */}
//                       <td className="px-6 py-4">
//                         <span
//                           className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
//                             user.isActive
//                               ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]"
//                               : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]"
//                           }`}
//                         >
//                           <span>{user.isActive ? "●" : "○"}</span>
//                           <span>{user.isActive ? "Active" : "Disabled"}</span>
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => handleStatusToggle(user._id, user.isActive)}
//                           className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
//                             user.isActive
//                               ? "bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white border border-[#EF4444]"
//                               : "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E] hover:text-white border border-[#22C55E]"
//                           }`}
//                         >
//                           {user.isActive ? "Disable" : "Enable"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination Placeholder */}
//           {filteredUsers.length > 0 && (
//             <div className="bg-[#F4F7FA] px-6 py-4 border-t border-[#CCE7EC]">
//               <div className="flex justify-between items-center">
//                 <p className="text-sm text-[#071426] opacity-70">
//                   Showing {filteredUsers.length} of {totalUsers} users
//                 </p>
//                 <div className="flex gap-2">
//                   <button className="px-3 py-1 rounded-lg border border-[#CCE7EC] text-sm font-medium text-[#071426] hover:bg-white transition-colors">
//                     Previous
//                   </button>
//                   <button className="px-3 py-1 rounded-lg bg-linear-to-r from-[#1B9AAA] to-[#16808D] text-white text-sm font-medium">
//                     1
//                   </button>
//                   <button className="px-3 py-1 rounded-lg border border-[#CCE7EC] text-sm font-medium text-[#071426] hover:bg-white transition-colors">
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminUsers;