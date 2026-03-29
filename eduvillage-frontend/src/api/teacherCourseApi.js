import axiosInstance from "./axiosInstance";

// Teacher creates course
export const createCourse = (data) => {
  return axiosInstance.post("/courses", data);
};

// Teacher gets own courses
export const getMyCourses = () => {
  return axiosInstance.get("/courses/my");
};

// Publish course
export const publishCourse = (id) => {
  return axiosInstance.put(`/courses/${id}/publish`);
};


// Get single course (teacher)
export const getCourseById = (id) => {
  return axiosInstance.get(`/courses/${id}`);
};

// Update course
export const updateCourse = (id, data) => {
  return axiosInstance.put(`/courses/${id}`, data);
};

export const getCourseStudents = (courseId) => {
  return axiosInstance.get(`/courses/${courseId}/students`);
};
