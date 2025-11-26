import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Toaster, toast } from "react-hot-toast";

// Servicios
import {
  getUsers,
  createUser as apiCreateUser,
  deleteUser as apiDeleteUser,
} from "../services/users";

import {
  getLotes,
  createLote as apiCreateLote,
  deleteLote as apiDeleteLote,
  updateLoteEstado,
} from "../services/lotes";

import {
  getProveedores,
  createProveedor as apiCreateProveedor,
} from "../services/proveedores";

// Estados válidos para los lotes
const ESTADOS = ["inactivo", "en crianza", "en venta", "vendido"];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  // FORMULARIO USUARIO
  const [formUser, setFormUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "pescador",
  });

  // FORMULARIO LOTE
  const [formLote, setFormLote] = useState({
    nombre: "",
    ubicacion: "",
    fechaInicio: "",
  });

  // FORMULARIO PROVEEDOR
  const [formProveedor, setFormProveedor] = useState({
    nombre: "",
    telefono: "",
    ubicacion: "",
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    await Promise.all([cargarUsuarios(), cargarLotes(), cargarProveedores()]);
  };

  const cargarUsuarios = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Error al cargar usuarios");
    }
  };

  const cargarLotes = async () => {
    try {
      const data = await getLotes();
      setLotes(data);
    } catch (err) {
      toast.error("Error al cargar lotes");
    }
  };

  const cargarProveedores = async () => {
    try {
      const data = await getProveedores();
      setProveedores(data);
    } catch (err) {
      toast.error("Error al cargar proveedores");
    }
  };

  // Crear Usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await apiCreateUser(formUser);
      toast.success(res.msg || "Usuario creado correctamente");

      setFormUser({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "pescador",
      });

      cargarUsuarios();
    } catch (err) {
      toast.error("Error al crear usuario");
    }
  };

  // Crear lote
  const handleCreateLote = async (e) => {
    e.preventDefault();
    try {
      const res = await apiCreateLote(formLote);

      toast.success(res.msg || "Lote creado correctamente");

      setFormLote({
        nombre: "",
        ubicacion: "",
        fechaInicio: "",
      });

      cargarLotes();
    } catch (err) {
      toast.error("Error al crear lote");
    }
  };

  // Crear proveedor
  const handleCreateProveedor = async (e) => {
    e.preventDefault();
    try {
      const res = await apiCreateProveedor(formProveedor);

      toast.success(res.msg || "Proveedor registrado");

      setFormProveedor({
        nombre: "",
        telefono: "",
        ubicacion: "",
      });

      cargarProveedores();
    } catch (err) {
      toast.error("Error al crear proveedor");
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;

    try {
      await apiDeleteUser(id);
      toast.success("Usuario eliminado");
      cargarUsuarios();
    } catch (err) {
      toast.error("Error al eliminar usuario");
    }
  };

  // Eliminar lote
  const handleDeleteLote = async (id) => {
    if (!confirm("¿Eliminar este lote?")) return;

    try {
      await apiDeleteLote(id);
      toast.success("Lote eliminado");
      cargarLotes();
    } catch (err) {
      toast.error("Error al eliminar lote");
    }
  };

  // Actualizar estado del lote
  const handleUpdateEstado = async (id, nuevoEstado) => {
    if (!nuevoEstado || nuevoEstado === "Seleccionar") return;

    try {
      await updateLoteEstado(id, nuevoEstado);
      toast.success("Estado actualizado correctamente");
      cargarLotes();
    } catch (err) {
      toast.error("No tienes permiso para ese cambio");
    }
  };

  // -------------------------------------------------------------------
  // 🌟 UI
  // -------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white">
      <Navbar />
      <Toaster />

      <div className="p-8 space-y-10">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Panel de Administración 🦐
        </h1>

        {/* Crear Usuario */}
        <section className="bg-indigo-900/60 p-6 rounded-xl shadow-lg max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Crear Usuario</h2>

          <form onSubmit={handleCreateUser} className="space-y-3">
            <input
              className="w-full p-2 rounded bg-indigo-800"
              placeholder="Nombre"
              value={formUser.name}
              onChange={(e) =>
                setFormUser({ ...formUser, name: e.target.value })
              }
            />

            <input
              className="w-full p-2 rounded bg-indigo-800"
              placeholder="Usuario"
              value={formUser.username}
              onChange={(e) =>
                setFormUser({ ...formUser, username: e.target.value })
              }
            />

            <input
              className="w-full p-2 rounded bg-indigo-800"
              placeholder="Correo (opcional)"
              value={formUser.email}
              type="email"
              onChange={(e) =>
                setFormUser({ ...formUser, email: e.target.value })
              }
            />

            <input
              type="password"
              className="w-full p-2 rounded bg-indigo-800"
              placeholder="Contraseña"
              value={formUser.password}
              onChange={(e) =>
                setFormUser({ ...formUser, password: e.target.value })
              }
            />

            <select
              className="w-full p-2 bg-indigo-800 rounded"
              value={formUser.role}
              onChange={(e) =>
                setFormUser({ ...formUser, role: e.target.value })
              }
            >
              <option value="pescador">Pescador</option>
              <option value="vendedor">Vendedor</option>
            </select>

            <button className="w-full bg-green-600 hover:bg-green-700 p-2 rounded">
              Crear Usuario
            </button>
          </form>
        </section>

        {/* Crear Lote */}
        <section className="bg-indigo-900/60 p-6 rounded-xl shadow-lg max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Registrar Lote</h2>

          <form onSubmit={handleCreateLote} className="space-y-3">
            <input
              className="w-full p-2 rounded bg-indigo-800"
              placeholder="Nombre del lote"
              value={formLote.nombre}
              onChange={(e) =>
                setFormLote({ ...formLote, nombre: e.target.value })
              }
            />

            <input
              className="w-full p-2 rounded bg-indigo-800"
              placeholder="Ubicación"
              value={formLote.ubicacion}
              onChange={(e) =>
                setFormLote({ ...formLote, ubicacion: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full p-2 rounded bg-indigo-800"
              value={formLote.fechaInicio}
              onChange={(e) =>
                setFormLote({ ...formLote, fechaInicio: e.target.value })
              }
            />

            <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">
              Crear Lote
            </button>
          </form>
        </section>

        {/* Usuarios */}
        <section className="bg-indigo-900/50 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Usuarios</h2>

          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td className="capitalize">{u.role}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Lotes */}
        <section className="bg-indigo-900/50 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Lotes Registrados</h2>

          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Inicio</th>
                <th>Estado</th>
                <th>Cambiar</th>
                <th>Eliminar</th>
              </tr>
            </thead>

            <tbody>
              {lotes.map((l) => (
                <tr key={l.id}>
                  <td>{l.nombre}</td>
                  <td>{l.ubicacion}</td>
                  <td>{l.fechaInicio}</td>
                  <td className="capitalize">{l.estado}</td>

                  <td>
                    <select
                      className="bg-indigo-800 p-1 rounded"
                      defaultValue="Seleccionar"
                      onChange={(e) =>
                        handleUpdateEstado(l.id, e.target.value)
                      }
                    >
                      <option disabled>Seleccionar</option>
                      {ESTADOS.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <button
                      onClick={() => handleDeleteLote(l.id)}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Crear Proveedor */}
        <section className="bg-indigo-900/60 p-6 rounded-xl shadow-lg max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Registrar Proveedor</h2>

          <form onSubmit={handleCreateProveedor} className="space-y-3">
            <input
              className="w-full p-2 rounded bg-indigo-800"
              placeholder="Nombre"
              value={formProveedor.nombre}
              onChange={(e) =>
                setFormProveedor({
                  ...formProveedor,
                  nombre: e.target.value,
                })
              }
            />

            <input
              className="w-full p-2 rounded bg-indigo-800"
              placeholder="Teléfono"
              value={formProveedor.telefono}
              onChange={(e) =>
                setFormProveedor({
                  ...formProveedor,
                  telefono: e.target.value,
                })
              }
            />

            <input
              className="w-full p-2 rounded bg-indigo-800"
              placeholder="Ubicación"
              value={formProveedor.ubicacion}
              onChange={(e) =>
                setFormProveedor({
                  ...formProveedor,
                  ubicacion: e.target.value,
                })
              }
            />

            <button className="w-full bg-yellow-600 hover:bg-yellow-700 p-2 rounded">
              Registrar Proveedor
            </button>
          </form>
        </section>

        {/* Lista de Proveedores */}
        <section className="bg-indigo-900/50 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Proveedores</h2>

          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Ubicación</th>
              </tr>
            </thead>

            <tbody>
              {proveedores.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.telefono}</td>
                  <td>{p.ubicacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
