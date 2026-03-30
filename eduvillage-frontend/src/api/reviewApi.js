import axiosInstance from "./axiosInstance";

export const getCourseReviews = (courseId) => {
  return axiosInstance.get(`/reviews/${courseId}`);
};

export const saveCourseReview = (courseId, data) => {
  return axiosInstance.post(`/reviews/${courseId}`, data);
};
