// import axios from "axios";

// const API = axios.create({
//   // baseURL: "http://localhost:5000/api",
//   baseURL:"https://fsd114-nikuldeora1195.onrender.com/api"
// });

// // Attach JWT token automatically
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// // Get admin stats
// export const getAdminStats = () => {
//   return API.get("/admin/stats");
// };

// // Get all users
// export const getAllUsers = () => {
//   return API.get("/admin/users");
// };

// // Update user role
// export const updateUserRole = (userId, role) => {
//   return API.put(`/admin/users/${userId}/role`, { role });
// };

// // Update user status
// export const updateUserStatus = (userId, isActive) => {
//   return API.put(`/admin/users/${userId}/status`, { isActive });
// };

// // Get all courses
// export const getAllCourses = () => {
//   return API.get("/admin/courses");
// };

// // Delete course
// export const deleteCourse = (courseId) => {
//   return API.delete(`/admin/courses/${courseId}`);
// };