import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/auth/reset_password", {
        token,
        new_password: newPassword,
      });

      setMessage(res.data.msg);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error al restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-sky-800 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-indigo-900/90 p-8 rounded-2xl shadow-lg w-[380px] text-center backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-indigo-300">Restablecer contraseña</h2>

        <input
          type="text"
          placeholder="Token recibido por correo"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="p-2 w-full rounded bg-gray-800 text-white mb-4"
          required
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="p-2 w-full rounded bg-gray-800 text-white mb-4"
          required
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-2 w-full rounded bg-gray-800 text-white mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-indigo-600 hover:bg-indigo-700 w-full py-2 rounded font-semibold transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Restableciendo..." : "Cambiar contraseña"}
        </button>

        {message && <p className="text-indigo-300 mt-4">{message}</p>}

        <Link to="/login" className="text-sm text-indigo-400 hover:text-indigo-300 block mt-6">
          Volver al inicio de sesión
        </Link>
      </form>
    </div>
  );
}
