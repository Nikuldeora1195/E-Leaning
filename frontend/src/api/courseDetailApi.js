import axiosInstance from "./axiosInstance";

export const getCourseById = (id) => {
  return axiosInstance.get(`/courses/${id}`);
};
