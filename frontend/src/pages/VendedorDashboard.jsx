import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Toaster, toast } from "react-hot-toast";

const VendedorDashboard = () => {
  const token = localStorage.getItem("token");

  const [lotes, setLotes] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [formProveedor, setFormProveedor] = useState({
    nombre: "",
    telefono: "",
    ubicacion: "",
  });

  useEffect(() => {
    fetchLotes();
    fetchProveedores();
  }, []);

  const fetchLotes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/lotes/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLotes(res.data);
    } catch {
      toast.error("Error al cargar lotes");
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/proveedores/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProveedores(res.data);
    } catch {
      toast.error("Error al cargar proveedores");
    }
  };

  const updateEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(
        `http://127.0.0.1:5000/api/lotes/update_state/${id}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Estado actualizado");
      fetchLotes();
    } catch {
      toast.error("No tienes permiso para ese cambio");
    }
  };

  const createProveedor = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/proveedores/create",
        formProveedor,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.msg);
      setFormProveedor({ nombre: "", telefono: "", ubicacion: "" });
      fetchProveedores();
    } catch {
      toast.error("Error al crear proveedor");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-sky-800 text-white">
      <Navbar />
      <Toaster />

      <div className="p-8 space-y-10">
        <h1 className="text-4xl font-bold text-center">Panel del Vendedor 🛒</h1>

        {/* LOTES */}
        <section className="bg-indigo-900/50 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Lotes disponibles</h2>

          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Inicio</th>
                <th>Estado</th>
                <th>Cambiar estado</th>
              </tr>
            </thead>

            <tbody>
              {lotes.map((l) => (
                <tr key={l.id}>
                  <td>{l.nombre}</td>
                  <td>{l.ubicacion}</td>
                  <td>{l.fechaInicio}</td>
                  <td className="capitalize">{l.estado}</td>

                  <td>
                    {l.estado === "en venta" ? (
                      <button
                        onClick={() => updateEstado(l.id, "vendido")}
                        className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                      >
                        Marcar como "Vendido"
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">No permitido</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* CREAR PROVEEDOR */}
        <section className="bg-purple-900/50 p-6 rounded-xl shadow-lg max-w-xl mx-auto">
          <h2 className="text-2xl mb-4 font-semibold">Registrar Proveedor</h2>

          <form onSubmit={createProveedor} className="space-y-3">
            <input
              className="w-full p-2 bg-indigo-800 rounded"
              placeholder="Nombre"
              value={formProveedor.nombre}
              onChange={(e) =>
                setFormProveedor({ ...formProveedor, nombre: e.target.value })
              }
            />

            <input
              className="w-full p-2 bg-indigo-800 rounded"
              placeholder="Teléfono"
              value={formProveedor.telefono}
              onChange={(e) =>
                setFormProveedor({ ...formProveedor, telefono: e.target.value })
              }
            />

            <input
              className="w-full p-2 bg-indigo-800 rounded"
              placeholder="Ubicación"
              value={formProveedor.ubicacion}
              onChange={(e) =>
                setFormProveedor({ ...formProveedor, ubicacion: e.target.value })
              }
            />

            <button className="bg-yellow-600 w-full p-2 rounded hover:bg-yellow-700">
              Crear Proveedor
            </button>
          </form>
        </section>

        {/* LISTA PROVEEDORES */}
        <section className="bg-indigo-900/50 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Proveedores</h2>

          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Ubicación</th>
              </tr>
            </thead>

            <tbody>
              {proveedores.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.telefono}</td>
                  <td>{p.ubicacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default VendedorDashboard;
