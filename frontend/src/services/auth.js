import api from "../utils/api";

export async function loginWorker(username, password) {
  const res = await api.post("/auth/login", { username, password });
  return res.data;
}

export async function loginAdmin(email, password) {
  const res = await api.post("/auth/login_admin", { email, password });
  return res.data;
}
