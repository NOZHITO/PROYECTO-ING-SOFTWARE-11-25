// src/api/axiosConfig.js

// 1. Usa la variable de entorno VITE_API_URL definida en tu .env o en el entorno de producción
// Si no existe (ej. en desarrollo sin .env), puedes poner un valor por defecto.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// --- El resto del archivo es el mismo ---

// Obtener token del localStorage
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Headers con token
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
