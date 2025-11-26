import api from "../utils/api";

// Obtener proveedores
export async function getProveedores() {
  const res = await api.get("/proveedores/all");
  return res.data;
}

// Crear proveedor
export async function createProveedor(data) {
  const res = await api.post("/proveedores/create", data);
  return res.data;
}
