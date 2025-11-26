import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/auth/register_admin", form);
      setSuccess(res.data.msg);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Error al registrar administrador");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-950 via-sky-900 to-blue-800 text-white">
      <div className="bg-indigo-900 p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Administrador</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            className="w-full mb-3 p-2 rounded bg-indigo-800 text-white"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full mb-3 p-2 rounded bg-indigo-800 text-white"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full mb-3 p-2 rounded bg-indigo-800 text-white"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Repetir contraseña"
            className="w-full mb-4 p-2 rounded bg-indigo-800 text-white"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />

          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-2">{success}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Crear cuenta
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sky-300 hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
