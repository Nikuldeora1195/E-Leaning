import axiosInstance from "./axiosInstance";

// Create announcement (teacher/admin)
export const createAnnouncement = (data) => {
  return axiosInstance.post("/notifications", data);
};

// Get announcements (students & teachers)
export const getAnnouncements = () => {
  return axiosInstance.get("/notifications");
};
