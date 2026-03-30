import axiosInstance from "./axiosInstance";

export const generateCertificate = (enrollmentId) => {
  return axiosInstance.post(`/certificates/${enrollmentId}`);
};
