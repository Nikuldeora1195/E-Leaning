import axiosInstance from "./axiosInstance";

// ================= STUDENT =================

export const getPublishedCourses = (search = "") => {
  return axiosInstance.get(`/courses?search=${search}`);
};


export const enrollCourse = (courseId) => {
  return axiosInstance.post(`/enroll/${courseId}`);
};

export const getMyEnrollments = () => {
  return axiosInstance.get("/enroll/my-courses");
};

// ================= TEACHER =================

export const getTeacherCourses = () => {
  return axiosInstance.get("/courses/my");
};

export const togglePublishCourse = (courseId) => {
  return axiosInstance.patch(`/courses/${courseId}/publish`);
};

// ================= PROGRESS =================

export const updateProgress = (enrollId, progress) => {
  return axiosInstance.put(`/enroll/progress/${enrollId}`, {
    progress,
  });
};

// ✅ LESSON COMPLETION (FIXED)
export const completeLesson = (lessonId) => {
  return axiosInstance.put(
    `/enroll/lesson/${lessonId}/complete`
  );
};


// ================= QUIZ =================

export const createQuiz = (data) => {
  return axiosInstance.post("/quizzes", data);
};

export const submitQuiz = (data) => {
  return axiosInstance.post("/quizzes/submit", data);
};

export const getQuizByCourse = (courseId) => {
  return axiosInstance.get(`/quizzes/course/${courseId}`);
};
