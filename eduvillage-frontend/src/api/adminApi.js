import axiosInstance from "./axiosInstance";

export const getAdminStats = () => {
  return axiosInstance.get("/admin/stats");
};

export const getAdminUsers = () => {
  return axiosInstance.get("/admin/users");
};

export const getAdminCourses = () => {
  return axiosInstance.get("/admin/courses");
};

export const updateAdminUserRole = (userId, role) => {
  return axiosInstance.put(`/admin/users/${userId}/role`, { role });
};

export const toggleAdminUserStatus = (userId) => {
  return axiosInstance.put(`/admin/users/${userId}/status`);
};
