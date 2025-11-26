import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ to }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="flex items-center gap-2 text-sm px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-md transition"
    >
      <ArrowLeft size={16} />
      Regresar
    </button>
  );
}
