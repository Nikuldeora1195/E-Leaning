import axiosInstance from "./axiosInstance";

// Student: enroll in course
export const enrollInCourse = (courseId) => {
  return axiosInstance.post(`/enroll/${courseId}`);
};

// Student: get my enrollments
export const getMyEnrollments = () => {
  return axiosInstance.get("/enroll/my-courses");
};
