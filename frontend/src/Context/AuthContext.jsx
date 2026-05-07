import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import http from "../Services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      await http.get("/auth/me");
      setIsAuth(true);
    } catch {
      setIsAuth(false); // 👈 IMPORTANT (no redirect here)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async () => {
    try {
      await checkAuth();
    } catch {
      toast.error("Login failed");
    }
  };

  const logout = async () => {
    try {
      await http.post("/auth/logout");
      setIsAuth(false);
      window.location.href = "/login";
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);