import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchCsrfToken, getCurrentUser, loginUser, logoutUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrapAuth = useCallback(async () => {
    try {
      await fetchCsrfToken();
      const res = await getCurrentUser();
      setUser(res.data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const login = useCallback(async (payload) => {
    const res = await loginUser(payload);
    setUser(res.data.user || null);
    return res;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, setUser, login, logout, bootstrapAuth }), [user, loading, login, logout, bootstrapAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
