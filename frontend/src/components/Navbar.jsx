import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Usuario";
  const userRole = localStorage.getItem("role") || "Desconocido";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-700 shadow-lg text-white">
      <div
        className="font-bold text-2xl tracking-wide cursor-pointer hover:text-indigo-300 transition"
        onClick={() => navigate(userRole === "admin" ? "/admin" : "/lotes")}
      >
        🦐 AquaTrack
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm text-indigo-200">
          <p className="font-semibold">{userName}</p>
          <p className="text-xs text-indigo-300 capitalize">{userRole}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
