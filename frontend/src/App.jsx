import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Login from "./pages/Login";
import RegisterAdmin from "./pages/RegisterAdmin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import LotesPage from "./pages/LotesPage";

// App principal
export default function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Función para proteger rutas
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAdmin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Panel de administración */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Gestión de lotes (puede ser vista por admin o worker) */}
        <Route
          path="/lotes"
          element={
            <ProtectedRoute allowedRoles={["admin", "worker"]}>
              <LotesPage />
            </ProtectedRoute>
          }
        />

        {/* Página de error 404 */}
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white text-3xl">
              404 - Página no encontrada
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
