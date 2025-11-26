import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [nombre, setNombre] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = "/login"));
  }, []);

  const handleCrearLote = async (e) => {
    e.preventDefault();
    try {
      await api.post("/lotes/crear", { nombre });
      setMsg("✅ Lote creado correctamente");
      setNombre("");
    } catch (err) {
      console.error(err);
      setMsg("❌ Error al crear lote");
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar user={user} />

      <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-indigo-400">
          Crear nuevo lote
        </h2>

        <form onSubmit={handleCrearLote} className="space-y-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del lote"
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md font-semibold"
          >
            Crear Lote
          </button>
        </form>

        {msg && <p className="mt-4 text-center text-sm">{msg}</p>}
      </div>
    </div>
  );
}
