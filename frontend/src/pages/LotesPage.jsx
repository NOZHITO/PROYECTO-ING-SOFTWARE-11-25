import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function LotesPage() {
  const [lotes, setLotes] = useState([]);
  const token = localStorage.getItem("token");

  const fetchLotes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/lotes/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLotes(res.data);
    } catch (err) {
      console.error("Error al cargar lotes:", err);
    }
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-sky-900 text-white">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Gestión de Lotes</h1>

        <div className="bg-indigo-900/70 p-6 rounded-lg shadow-lg">
          {lotes.length === 0 ? (
            <p>No hay lotes registrados.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ubicación</th>
                  <th>Fecha de Inicio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {lotes.map((l) => (
                  <tr key={l.id}>
                    <td>{l.nombre}</td>
                    <td>{l.ubicacion}</td>
                    <td>{l.fechaInicio}</td>
                    <td>{l.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
