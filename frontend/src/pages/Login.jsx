import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let res;

      if (role === "admin") {
        // LOGIN ADMINISTRADOR
        res = await axios.post("http://127.0.0.1:5000/api/auth/login_admin", {
          email: form.email,
          password: form.password,
        });

      } else {
        // LOGIN TRABAJADOR (pescador o vendedor)
        res = await axios.post("http://127.0.0.1:5000/api/auth/login", {
        username: form.username,
        password: form.password,
        });
      }

      const token = res.data.token;
      const userRole = res.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);

      // Redirección según rol
      if (userRole === "admin") navigate("/admin");
      else navigate("/lotes");

      // Limpiar formulario
      setForm({ email: "", username: "", password: "" });

    } catch (err) {
      console.error("Error de login:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.msg ||
          "Error al iniciar sesión."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-950 via-sky-900 to-blue-800 text-white">
      <div className="bg-indigo-900 p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>

        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`px-4 py-2 rounded-l-lg ${
              role === "admin" ? "bg-indigo-600" : "bg-indigo-800"
            }`}
          >
            Administrador
          </button>

          <button
            type="button"
            onClick={() => setRole("worker")}
            className={`px-4 py-2 rounded-r-lg ${
              role === "worker" ? "bg-indigo-600" : "bg-indigo-800"
            }`}
          >
            Trabajador
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {role === "admin" ? (
            <input
              type="email"
              placeholder="Correo"
              className="w-full mb-3 p-2 rounded bg-indigo-800 text-white"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          ) : (
            <input
              type="text"
              placeholder="Nombre de usuario"
              className="w-full mb-3 p-2 rounded bg-indigo-800 text-white"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          )}

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full mb-3 p-2 rounded bg-indigo-800 text-white"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Entrar
          </button>
        </form>

        {role === "admin" && (
          <>
            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                className="text-sm text-sky-300 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="text-center mt-3">
              <Link
                to="/register"
                className="text-sm text-sky-300 hover:underline"
              >
                Crear cuenta de administrador
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
