import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/auth/forgot_password", { email });
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error al enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white">
      <form onSubmit={handleSubmit} className="bg-indigo-900 p-8 rounded-2xl shadow-lg w-[350px] text-center">
        <h2 className="text-2xl font-bold mb-6">Recuperar contraseña</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 w-full rounded bg-gray-800 text-white mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Enviando..." : "Enviar correo"}
        </button>

        {message && <p className="text-indigo-300 mt-4">{message}</p>}

        <Link to="/login" className="text-sm text-indigo-400 hover:text-indigo-300 block mt-6">
          Volver al inicio de sesión
        </Link>
      </form>
    </div>
  );
}
