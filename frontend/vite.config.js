import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración base de Vite
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:5000", // proxy hacia el backend Flask
    },
  },
});
