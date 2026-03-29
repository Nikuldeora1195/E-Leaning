// import { useEffect, useState } from "react";
// import { getAllCourses, deleteCourse } from "../../api/adminApi";
// // import AdminSidebar from "../../components/admin/AdminSidebar";

// import toast from "react-hot-toast";

// const AdminCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all"); // all, published, draft
//   const [searchQuery, setSearchQuery] = useState("");
//   const [deleteModal, setDeleteModal] = useState({ show: false, courseId: null, courseName: "" });

//   useEffect(() => {
//     loadCourses();
//   }, []);

//   const loadCourses = async () => {
//     try {
//       const response = await getAllCourses();
//       setCourses(response.data);
//     } catch (error) {
//       console.error("Failed to load courses:", error);
//       toast.error("Failed to load courses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteClick = (course) => {
//     setDeleteModal({
//       show: true,
//       courseId: course._id,
//       courseName: course.title,
//     });
//   };

//   const handleDeleteConfirm = async () => {
//     const toastId = toast.loading("Deleting course...");
//     try {
//       await deleteCourse(deleteModal.courseId);
//       toast.success("Course deleted successfully! 🗑️", { id: toastId });
//       setDeleteModal({ show: false, courseId: null, courseName: "" });
//       loadCourses(); // Reload courses
//     } catch (error) {
//       console.error("Failed to delete course:", error);
//       toast.error("Failed to delete course", { id: toastId });
//     }
//   };

//   const handleDeleteCancel = () => {
//     setDeleteModal({ show: false, courseId: null, courseName: "" });
//   };

//   // Filter courses
//   const filteredCourses = courses.filter((course) => {
//     const matchesFilter =
//       filter === "all" ||
//       (filter === "published" && course.isPublished) ||
//       (filter === "draft" && !course.isPublished);

//     const matchesSearch =
//       course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       course.createdBy?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       course.createdBy?.email?.toLowerCase().includes(searchQuery.toLowerCase());

//     return matchesFilter && matchesSearch;
//   });

//   // Calculate stats
//   const totalCourses = courses.length;
//   const publishedCourses = courses.filter((c) => c.isPublished).length;
//   const draftCourses = courses.filter((c) => !c.isPublished).length;

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
//           <h1 className="text-4xl font-bold text-[#142C52] mb-2">Course Management</h1>
//           <p className="text-[#071426] opacity-70 text-lg">
//             Monitor and manage all courses on the platform
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl p-6 border border-[#CCE7EC] shadow-md">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-linear-to-br from-[#CCE7EC] to-[#4C97A8] p-3 rounded-full">
//                 <span className="text-3xl">📚</span>
//               </div>
//             </div>
//             <h3 className="text-[#071426] opacity-70 text-sm mb-1">Total Courses</h3>
//             <p className="text-3xl font-bold text-[#142C52]">{totalCourses}</p>
//           </div>

//           <div className="bg-white rounded-xl p-6 border border-[#CCE7EC] shadow-md">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-linear-to-br from-[#22C55E]/20 to-[#178740]/20 p-3 rounded-full">
//                 <span className="text-3xl">✅</span>
//               </div>
//             </div>
//             <h3 className="text-[#071426] opacity-70 text-sm mb-1">Published</h3>
//             <p className="text-3xl font-bold text-[#142C52]">{publishedCourses}</p>
//           </div>

//           <div className="bg-white rounded-xl p-6 border border-[#CCE7EC] shadow-md">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-linear-to-br from-[#EF4444]/20 to-[#EB1414]/20 p-3 rounded-full">
//                 <span className="text-3xl">📝</span>
//               </div>
//             </div>
//             <h3 className="text-[#071426] opacity-70 text-sm mb-1">Draft</h3>
//             <p className="text-3xl font-bold text-[#142C52]">{draftCourses}</p>
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
//                 All ({totalCourses})
//               </button>
//               <button
//                 onClick={() => setFilter("published")}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   filter === "published"
//                     ? "bg-linear-to-r from-[#1B9AAA] to-[#16808D] text-white shadow-md"
//                     : "bg-[#F4F7FA] text-[#071426] hover:bg-[#CCE7EC]"
//                 }`}
//               >
//                 Published ({publishedCourses})
//               </button>
//               <button
//                 onClick={() => setFilter("draft")}
//                 className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                   filter === "draft"
//                     ? "bg-linear-to-r from-[#1B9AAA] to-[#16808D] text-white shadow-md"
//                     : "bg-[#F4F7FA] text-[#071426] hover:bg-[#CCE7EC]"
//                 }`}
//               >
//                 Draft ({draftCourses})
//               </button>
//             </div>

//             {/* Search */}
//             <div className="relative w-full md:w-64">
//               <input
//                 type="text"
//                 placeholder="Search courses or instructors..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full border-2 border-[#CCE7EC] rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-[#1B9AAA] transition-colors"
//               />
//               <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
//             </div>
//           </div>
//         </div>

//         {/* Courses Grid */}
//         {filteredCourses.length === 0 ? (
//           <div className="bg-white rounded-xl border border-[#CCE7EC] shadow-lg p-12 text-center">
//             <div className="text-6xl mb-4">📚</div>
//             <h3 className="text-2xl font-bold text-[#142C52] mb-2">No Courses Found</h3>
//             <p className="text-[#071426] opacity-70">
//               {searchQuery
//                 ? "Try adjusting your search query"
//                 : "No courses match the selected filter"}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredCourses.map((course) => (
//               <div
//                 key={course._id}
//                 className="bg-white rounded-xl border border-[#CCE7EC] hover:border-[#1B9AAA] hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
//               >
//                 {/* Course Header */}
//                 <div className="h-40 bg-linear-to-br from-[#CCE7EC] via-[#4C97A8] to-[#02394A] relative overflow-hidden">
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="text-6xl opacity-80">
//                       {course.isPublished ? "🎓" : "📝"}
//                     </span>
//                   </div>

//                   {/* Status Badge */}
//                   <div className="absolute top-3 right-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
//                         course.isPublished
//                           ? "bg-linear-to-r from-[#22C55E] to-[#178740] text-white"
//                           : "bg-white text-[#EF4444] border-2 border-[#EF4444]"
//                       }`}
//                     >
//                       {course.isPublished ? "✓ Published" : "Draft"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Course Content */}
//                 <div className="p-6 space-y-4">
//                   {/* Title */}
//                   <h3 className="text-xl font-bold text-[#142C52] line-clamp-2 min-h-14">
//                     {course.title}
//                   </h3>

//                   {/* Instructor Info */}
//                   <div className="flex items-center gap-3 pt-2 border-t border-[#CCE7EC]">
//                     <div className="w-10 h-10 bg-linear-to-br from-[#1B9AAA] to-[#16808D] rounded-full flex items-center justify-center shrink-0">
//                       <span className="text-white font-bold text-sm">
//                         {course.createdBy?.name?.charAt(0).toUpperCase() || "T"}
//                       </span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-[#142C52] text-sm truncate">
//                         {course.createdBy?.name || "Unknown"}
//                       </p>
//                       <p className="text-xs text-[#071426] opacity-60 truncate">
//                         {course.createdBy?.email || "No email"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Course ID */}
//                   <div className="bg-[#F4F7FA] rounded-lg p-2 border border-[#CCE7EC]">
//                     <p className="text-xs text-[#071426] opacity-60">
//                       Course ID: <span className="font-mono">{course._id.slice(-8)}</span>
//                     </p>
//                   </div>

//                   {/* Delete Button */}
//                   <button
//                     onClick={() => handleDeleteClick(course)}
//                     className="w-full bg-[#EF4444]/10 text-[#EF4444] py-2.5 rounded-lg font-semibold hover:bg-[#EF4444] hover:text-white transition-all border-2 border-[#EF4444] flex items-center justify-center gap-2"
//                   >
//                     <span>🗑️</span>
//                     <span>Delete Course</span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Delete Confirmation Modal */}
//       {deleteModal.show && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
//             {/* Modal Icon */}
//             <div className="w-16 h-16 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-4xl">⚠️</span>
//             </div>

//             {/* Modal Content */}
//             <h3 className="text-2xl font-bold text-[#142C52] text-center mb-2">
//               Delete Course?
//             </h3>
//             <p className="text-[#071426] opacity-70 text-center mb-6">
//               Are you sure you want to delete <strong>"{deleteModal.courseName}"</strong>?
//               This action cannot be undone.
//             </p>

//             {/* Modal Buttons */}
//             <div className="flex gap-3">
//               <button
//                 onClick={handleDeleteCancel}
//                 className="flex-1 px-6 py-3 rounded-lg font-semibold border-2 border-[#CCE7EC] text-[#071426] hover:bg-[#F4F7FA] transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 className="flex-1 px-6 py-3 rounded-lg font-semibold bg-linear-to-r from-[#EF4444] to-[#EB1414] text-white hover:shadow-lg transition-all"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminCourses;