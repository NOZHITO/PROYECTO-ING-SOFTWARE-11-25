import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/auth/register_admin", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status === 201) {
        setSuccess("Administrador creado correctamente.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error("Error al registrar administrador:", err.response?.data);
      setError(err.response?.data?.msg || "Error al registrar administrador.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
      <div className="bg-[#1e1b4b] p-8 rounded-2xl shadow-lg w-[350px] text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Crear Administrador</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repetir contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800 text-white"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded"
          >
            Crear cuenta
          </button>
        </form>

        <p
          onClick={() => navigate("/login")}
          className="text-sm text-indigo-300 mt-4 cursor-pointer hover:underline"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </p>
      </div>
    </div>
  );
};

export default RegisterAdmin;
