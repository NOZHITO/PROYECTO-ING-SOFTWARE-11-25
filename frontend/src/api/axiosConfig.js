// src/api/axiosConfig.js

// 👉 Cambia esta URL si tu backend escucha en otro puerto
export const API_BASE_URL = "http://127.0.0.1:5000";

// Obtener token del localStorage
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Headers con token
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
