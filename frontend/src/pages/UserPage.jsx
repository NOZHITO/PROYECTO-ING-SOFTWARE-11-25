import React, { useState, useEffect } from "react";
import { createUser, getUsers, deleteUser } from "../services/users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "pescador",
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // cargar usuarios existentes
  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res);
    } catch (e) {
      console.error("Error cargando usuarios", e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!form.username) {
      return setError("El username es obligatorio para pescador y vendedor");
    }

    try {
      await createUser(form);
      setMsg("Usuario creado correctamente");

      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "pescador",
      });

      loadUsers();
    } catch (err) {
      setError(err.response?.data?.msg || "Error al crear usuario");
    }
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-4">Gestión de Usuarios</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-indigo-900 p-6 rounded-xl w-96 mb-8"
      >
        <h2 className="text-xl mb-4">Crear nuevo usuario</h2>

        <input
          type="text"
          placeholder="Nombre completo"
          className="w-full p-2 mb-3 rounded bg-indigo-800"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Nombre de usuario (username)"
          className="w-full p-2 mb-3 rounded bg-indigo-800"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Correo (opcional para trabajadores)"
          className="w-full p-2 mb-3 rounded bg-indigo-800"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-3 rounded bg-indigo-800"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <select
          className="w-full p-2 mb-3 rounded bg-indigo-800"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="pescador">Pescador</option>
          <option value="vendedor">Vendedor</option>
        </select>

        {error && <p className="text-red-400">{error}</p>}
        {msg && <p className="text-green-400">{msg}</p>}

        <button className="bg-indigo-600 w-full p-2 rounded mt-3">
          Crear usuario
        </button>
      </form>

      {/* Lista de usuarios */}
      <h2 className="text-2xl mb-3">Usuarios existentes</h2>
      <div className="grid grid-cols-1 gap-4">
        {users.map((u) => (
          <div key={u.id} className="bg-indigo-800 p-4 rounded-lg flex justify-between">
            <div>
              <p><strong>{u.name}</strong> ({u.role})</p>
              <p>Correo: {u.email || "—"}</p>
            </div>
            <button
              className="bg-red-500 px-3 py-1 rounded"
              onClick={() => deleteUser(u.id).then(loadUsers)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
