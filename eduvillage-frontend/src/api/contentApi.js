import axios from "./axiosInstance";

// Create section
export const createSection = (data) =>
  axios.post("/content/sections", data);

// Create lesson
export const createLesson = (data) =>
  axios.post("/content/lessons", data);

export const updateSection = (sectionId, data) =>
  axios.put(`/content/sections/${sectionId}`, data);

export const deleteSection = (sectionId) =>
  axios.delete(`/content/sections/${sectionId}`);

export const updateLesson = (lessonId, data) =>
  axios.put(`/content/lessons/${lessonId}`, data);

export const deleteLesson = (lessonId) =>
  axios.delete(`/content/lessons/${lessonId}`);

export const uploadMedia = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post("/content/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get course content
export const getCourseContent = (courseId) =>
  axios.get(`/content/course/${courseId}`);
