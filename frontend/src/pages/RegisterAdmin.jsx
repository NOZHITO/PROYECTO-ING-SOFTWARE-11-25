import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const RegisterAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register_admin", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status === 201) {
        setSuccess("Administrador creado correctamente ✅");
        setTimeout(() => navigate("/login"), 2000);
      }

    }  catch (err) {
        console.log("ERROR COMPLETO:", err);
        console.log("ERROR RESPONSE:", err.response);
        console.log("ERROR DATA:", err.response?.data);

        setError(JSON.stringify(err.response?.data) || "Error desconocido");
    }


    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
      <div className="bg-[#1e1b4b] p-8 rounded-2xl shadow-xl w-[380px]">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Crear Administrador
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Repetir contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500"
            required
          />

          {/* Mensajes */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm text-center">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 py-2 rounded text-white font-bold transition
              ${loading 
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>

        </form>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-indigo-300 mt-4 cursor-pointer hover:underline text-center"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </p>

      </div>
    </div>
  );
};

export default RegisterAdmin;
