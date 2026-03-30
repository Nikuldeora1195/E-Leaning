import axiosInstance from "./axiosInstance";

export const getMyProfile = () => {
  return axiosInstance.get("/users/me");
};

export const updateMyProfile = (data) => {
  return axiosInstance.put("/users/me", data);
};
