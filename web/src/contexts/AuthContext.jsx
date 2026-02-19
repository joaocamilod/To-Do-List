import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("todo_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const savedToken = localStorage.getItem("todo_token");
      const savedUser = localStorage.getItem("todo_user");

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          await authService.getMe();
          setToken(savedToken);
          setUser(parsedUser);
        } catch {
          localStorage.removeItem("todo_token");
          localStorage.removeItem("todo_user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("todo_token", data.token);
    localStorage.setItem("todo_user", JSON.stringify(data.user));
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await authService.register(name, email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("todo_token", data.token);
    localStorage.setItem("todo_user", JSON.stringify(data.user));
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("todo_token");
    localStorage.removeItem("todo_user");
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
