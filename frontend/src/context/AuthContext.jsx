import { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
