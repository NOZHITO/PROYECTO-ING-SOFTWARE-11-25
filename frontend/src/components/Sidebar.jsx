import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import { Home, Folder, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const links = [
    { name: "Inicio", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Proyectos", icon: <Folder size={20} />, path: "#" },
    { name: "Configuración", icon: <Settings size={20} />, path: "#" },
  ];

  return (
    <motion.aside
      animate={{ width: isOpen ? 230 : 70 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`h-screen flex flex-col border-r fixed left-0 top-0 z-40 ${
        darkMode
          ? "bg-gray-900 border-gray-800 text-gray-100"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/40">
        <AnimatePresence>
          {isOpen && (
            <motion.h2
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold tracking-wide"
            >
              Dashboard
            </motion.h2>
          )}
        </AnimatePresence>

        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-gray-700/40 rounded-md transition"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Enlaces */}
      <nav className="flex-1 mt-2">
        {links.map((link, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-3 mx-2 my-1 rounded-md hover:bg-indigo-600/20 cursor-pointer transition"
            onClick={() => link.path !== "#" && navigate(link.path)}
          >
            {link.icon}
            {isOpen && <span className="text-sm font-medium">{link.name}</span>}
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700/40">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/30 rounded-md hover:bg-gray-600/40 transition"
        >
          {darkMode ? "☀️" : "🌙"} {isOpen && "Tema"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 mt-2 rounded-md hover:bg-red-700 transition text-sm"
        >
          <LogOut size={16} />
          {isOpen && "Salir"}
        </button>
      </div>
    </motion.aside>
  );
}
