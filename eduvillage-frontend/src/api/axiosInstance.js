// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosInstance;


import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

let hasHandledUnauthorized = false;

// 🔐 Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hasToken = localStorage.getItem("token");

    if (status === 401 && hasToken && !hasHandledUnauthorized) {
      hasHandledUnauthorized = true;
      window.dispatchEvent(new Event("auth:unauthorized"));

      setTimeout(() => {
        hasHandledUnauthorized = false;
      }, 300);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
