import axiosInstance from "./axiosInstance";

export const getPublishedCourses = (search = "") => {
  return axiosInstance.get(`/courses?search=${search}`);
};

export const enrollCourse = (courseId) => {
  return axiosInstance.post(`/enroll/${courseId}`);
};

export const getMyEnrollments = () => {
  return axiosInstance.get("/enroll/my-courses");
};

export const getTeacherCourses = () => {
  return axiosInstance.get("/courses/my");
};

export const togglePublishCourse = (courseId) => {
  return axiosInstance.patch(`/courses/${courseId}/publish`);
};

export const completeLesson = (lessonId) => {
  return axiosInstance.put(`/enroll/lesson/${lessonId}/complete`);
};

export const createQuiz = (data) => {
  return axiosInstance.post("/quizzes", data);
};

export const submitQuiz = (data) => {
  return axiosInstance.post("/quizzes/submit", data);
};

export const getQuizByCourse = (courseId) => {
  return axiosInstance.get(`/quizzes/course/${courseId}`);
};

export const getMyQuizAttempts = (courseId) => {
  return axiosInstance.get(`/quizzes/course/${courseId}/attempts/me`);
};
