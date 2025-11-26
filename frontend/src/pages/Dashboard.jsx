import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ Cargar lotes asignados (solo si aplica en tu backend)
  const fetchLotes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/lotes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLotes(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los lotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-sky-900 to-blue-800 text-white p-6">
      {/* 🔹 Barra superior */}
      <div className="flex justify-between items-center mb-10 bg-indigo-900/60 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-indigo-300">
          🦐 Control de Lotes — Bienvenido, {user.name || "Usuario"}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">Rol: {user.role}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* 🔹 Contenido principal */}
      <div className="bg-indigo-900/70 p-8 rounded-2xl shadow-lg max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-300">
          Lotes asignados
        </h2>

        {loading ? (
          <p className="text-gray-300">Cargando lotes...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : lotes.length === 0 ? (
          <p className="text-gray-300">No hay lotes registrados.</p>
        ) : (
          <ul className="space-y-3">
            {lotes.map((lote) => (
              <li
                key={lote.id}
                className="bg-indigo-800/60 p-3 rounded-lg shadow border border-indigo-700 hover:bg-indigo-800 transition"
              >
                <p className="font-semibold text-indigo-200">{lote.nombre}</p>
                <p className="text-sm text-gray-300">
                  Estado: {lote.estado || "Sin datos"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
