import React, { useState } from "react"; // Asumo que usas React hooks
import { useNavigate } from "react-router-dom"; // Asumo que usas useNavigate
import api from "../utils/api"; // Tu instancia de Axios configurada

// Define el componente RegisterAdmin
const RegisterAdmin = () => {
    // Definiciones de estado (ejemplo, debes adaptarlas a tu formulario)
    const [formData, setFormData] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        confirmPassword: "" 
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Lógica para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await api.post("/auth/register_admin", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });

            if (response.status === 201) {
                setSuccess("Administrador creado correctamente.");
                // Redirige al login después de 2 segundos
                setTimeout(() => navigate("/login"), 2000); 
            }

        } catch (err) {
            console.error("Error al registrar administrador:", err.response?.data);
            // Muestra el mensaje de error del backend o uno genérico
            setError(err.response?.data?.msg || "Error al registrar administrador.");
        }
    };
    
    // Función para manejar cambios en el formulario (deberías tener una)
    // const handleChange = (e) => { ... } 

    return (
        // Aquí iría el código JSX de tu formulario de registro
        <div className="register-container">
            <h1>Registro de Administrador</h1>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            
            <form onSubmit={handleSubmit}>
                {/* Campos del formulario */}
                {/* ... */}
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

// 🔥 Exportación por defecto: Esto soluciona el error [MISSING_EXPORT]
export default RegisterAdmin;
