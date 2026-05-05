import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, logoutUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrapAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");
      
      const res = await getCurrentUser();
      setUser(res.data.user || null);
    } catch {
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapAuth();
    
    // Listen for custom event from axios interceptor when refresh completely fails
    const handleAuthExpired = () => {
      setUser(null);
    };
    
    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, [bootstrapAuth]);

  const login = useCallback(async (payload) => {
    const res = await loginUser(payload);
    
    if (res.data.accessToken && res.data.refreshToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }
    
    setUser(res.data.user || null);
    return res;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await logoutUser({ refreshToken });
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, loading, setUser, login, logout, bootstrapAuth }), [user, loading, login, logout, bootstrapAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
