import axios from "axios";

const api = axios.create({
  baseURL: "https://proyecto-ing-software-11-25-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
