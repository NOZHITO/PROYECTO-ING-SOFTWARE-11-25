import api from "../utils/api";

// Obtener todos los lotes
export async function getLotes() {
  const res = await api.get("/lotes/all");
  return res.data;
}

// Crear lote
export async function createLote(data) {
  const res = await api.post("/lotes/create", data);
  return res.data;
}

// Eliminar lote
export async function deleteLote(id) {
  const res = await api.delete(`/lotes/delete/${id}`);
  return res.data;
}

// Actualizar estado del lote
export async function updateLoteEstado(id, estado) {
  const res = await api.put(`/lotes/update_state/${id}`, { estado });
  return res.data;
}
