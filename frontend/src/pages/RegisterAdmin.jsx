import api from "../utils/api";

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
      setTimeout(() => navigate("/login"), 2000);
    }

  } catch (err) {
    console.error("Error al registrar administrador:", err.response?.data);
    setError(err.response?.data?.msg || "Error al registrar administrador.");
  }
};
