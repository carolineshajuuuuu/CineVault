import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("access_token")
      ? {}
      : null
  );

  // LOGIN
  const login = async (username, password) => {
    try {
      const response = await api.post("auth/login/", {
        username,
        password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setUser({
        username,
      });

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // REGISTER
  const register = async (email, username, password) => {
    try {
      const response = await api.post("auth/register/", {
        email,
        username,
        password,
      });

      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}