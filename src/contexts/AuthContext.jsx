import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe, login as apiLogin, register as apiRegister, googleLogin as apiGoogleLogin } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await getMe();
          setUser(data.user);
          setIsAuthenticated(true);
        } catch (err) {
          // Token invalid, clear it
          localStorage.removeItem("token");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await apiLogin({ email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const data = await apiRegister({ name, email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  }, []);

  const googleAuth = useCallback(async (idToken) => {
    const data = await apiGoogleLogin(idToken);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    googleAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
