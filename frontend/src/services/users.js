import api from "../utils/api";

export const getUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post("/admin/create_user", data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/delete_user/${id}`);
  return res.data;
};
