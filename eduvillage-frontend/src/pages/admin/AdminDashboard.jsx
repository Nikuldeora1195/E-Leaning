// import { useEffect, useState } from "react";
// import * as adminApi from "../../api/adminApi";
// // import AdminSidebar from "../../components/admin/AdminSidebar";
// import StatCard from "../../components/admin/StatCard";
// import toast from "react-hot-toast";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalStudents: 0,
//     totalTeachers: 0,
//     totalCourses: 0,
//     totalEnrollments: 0,
//     completionRate: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadStats();
//   }, []);

//   const loadStats = async () => {
//     try {
//       const response = await adminApi.getAdminStats();
//       setStats(response.data);
//     } catch (error) {
//       console.error("Failed to load stats:", error);
//       toast.error("Failed to load dashboard statistics");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B9AAA]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F4F7FA]">
//       <div className="flex">
//         {/* <AdminSidebar /> */}

//         {/* Main Content */}
//         <main className="flex-1 p-8">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-4xl font-bold text-[#142C52] mb-2">
//               Admin Dashboard
//             </h1>
//             <p className="text-[#071426] opacity-70 text-lg">
//               Welcome back! Here's what's happening with EduVillage today.
//             </p>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//             <StatCard
//               title="Total Users"
//               value={stats.totalUsers}
//               icon="👥"
//               color="blue"
//               trend={8}
//             />
//             <StatCard
//               title="Total Students"
//               value={stats.totalStudents}
//               icon="🎓"
//               color="green"
//               trend={12}
//             />
//             <StatCard
//               title="Total Teachers"
//               value={stats.totalTeachers}
//               icon="👨‍🏫"
//               color="purple"
//               trend={5}
//             />
//             <StatCard
//               title="Total Courses"
//               value={stats.totalCourses}
//               icon="📚"
//               color="orange"
//               trend={15}
//             />
//             <StatCard
//               title="Total Enrollments"
//               value={stats.totalEnrollments}
//               icon="📝"
//               color="blue"
//               trend={20}
//             />
//             <StatCard
//               title="Completion Rate"
//               value={`${stats.completionRate}%`}
//               icon="✅"
//               color="green"
//               trend={3}
//             />
//           </div>

//           {/* Analytics Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {/* Recent Activity */}
//             <div className="bg-white rounded-xl border border-[#CCE7EC] shadow-lg p-6">
//               <h2 className="text-xl font-bold text-[#142C52] mb-4 flex items-center gap-2">
//                 <span>📊</span>
//                 <span>Platform Overview</span>
//               </h2>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center p-3 bg-[#F4F7FA] rounded-lg">
//                   <span className="text-[#071426] font-medium">Student Enrollment Rate</span>
//                   <span className="text-[#1B9AAA] font-bold">
//                     {stats.totalStudents > 0
//                       ? Math.round((stats.totalEnrollments / stats.totalStudents) * 100) / 100
//                       : 0}{" "}
//                     per student
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-[#F4F7FA] rounded-lg">
//                   <span className="text-[#071426] font-medium">Teacher-Student Ratio</span>
//                   <span className="text-[#1B9AAA] font-bold">
//                     1:{stats.totalTeachers > 0 ? Math.round(stats.totalStudents / stats.totalTeachers) : 0}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-[#F4F7FA] rounded-lg">
//                   <span className="text-[#071426] font-medium">Courses per Teacher</span>
//                   <span className="text-[#1B9AAA] font-bold">
//                     {stats.totalTeachers > 0
//                       ? Math.round((stats.totalCourses / stats.totalTeachers) * 10) / 10
//                       : 0}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-[#F4F7FA] rounded-lg">
//                   <span className="text-[#071426] font-medium">Average Enrollments per Course</span>
//                   <span className="text-[#1B9AAA] font-bold">
//                     {stats.totalCourses > 0
//                       ? Math.round(stats.totalEnrollments / stats.totalCourses)
//                       : 0}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white rounded-xl border border-[#CCE7EC] shadow-lg p-6">
//               <h2 className="text-xl font-bold text-[#142C52] mb-4 flex items-center gap-2">
//                 <span>⚡</span>
//                 <span>Quick Actions</span>
//               </h2>
//               <div className="grid grid-cols-2 gap-4">
//                 <button className="flex flex-col items-center justify-center p-4 bg-linear-to-br from-[#CCE7EC] to-[#4C97A8]/30 rounded-lg hover:shadow-md transition-all">
//                   <span className="text-3xl mb-2">👥</span>
//                   <span className="text-sm font-semibold text-[#142C52]">Manage Users</span>
//                 </button>
//                 <button className="flex flex-col items-center justify-center p-4 bg-linear-to-br from-[#22C55E]/20 to-[#178740]/10 rounded-lg hover:shadow-md transition-all">
//                   <span className="text-3xl mb-2">📚</span>
//                   <span className="text-sm font-semibold text-[#142C52]">Manage Courses</span>
//                 </button>
//                 <button className="flex flex-col items-center justify-center p-4 bg-linear-to-br from-[#1B9AAA]/20 to-[#16808D]/10 rounded-lg hover:shadow-md transition-all">
//                   <span className="text-3xl mb-2">📈</span>
//                   <span className="text-sm font-semibold text-[#142C52]">View Reports</span>
//                 </button>
//                 <button className="flex flex-col items-center justify-center p-4 bg-linear-to-br from-[#EF4444]/20 to-[#EB1414]/10 rounded-lg hover:shadow-md transition-all">
//                   <span className="text-3xl mb-2">⚙️</span>
//                   <span className="text-sm font-semibold text-[#142C52]">Settings</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Performance Chart Placeholder */}
//           <div className="bg-white rounded-xl border border-[#CCE7EC] shadow-lg p-6">
//             <h2 className="text-xl font-bold text-[#142C52] mb-4 flex items-center gap-2">
//               <span>📈</span>
//               <span>Platform Growth</span>
//             </h2>
//             <div className="h-64 bg-[#F4F7FA] rounded-lg flex items-center justify-center border-2 border-dashed border-[#CCE7EC]">
//               <div className="text-center">
//                 <span className="text-6xl mb-4 block">📊</span>
//                 <p className="text-[#071426] opacity-60 font-medium">
//                   Chart visualization coming soon
//                 </p>
//                 <p className="text-sm text-[#071426] opacity-40 mt-2">
//                   Integration with Chart.js or Recharts
//                 </p>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;