import axiosInstance from "./axiosInstance";

export const getCourseStudents = (courseId) => {
  return axiosInstance.get(`/courses/${courseId}/students`);
};
