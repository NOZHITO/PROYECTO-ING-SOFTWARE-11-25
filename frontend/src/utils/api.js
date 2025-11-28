import axios from "axios";

const api = axios.create({
  baseURL: "https://TU_BACKEND_EN_RAILWAY/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
