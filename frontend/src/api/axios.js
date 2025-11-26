// src/api/axios.js
import axios from "axios";
import { API_BASE_URL, getAuthToken } from "./axiosConfig";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor: agrega token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
