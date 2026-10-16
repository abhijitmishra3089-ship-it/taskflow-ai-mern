import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api.get("/auth/me").then(({ data }) => {
      if (alive) setUser(data.user);
    }).catch(() => {
      localStorage.removeItem("taskflow_token");
      if (alive) setUser(null);
    }).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("taskflow_token", data.token);
    setUser(data.user);
    return data.user;
  };
  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("taskflow_token", data.token);
    setUser(data.user);
    return data.user;
  };
  const logout = async () => {
    try { await api.post("/auth/logout"); } finally {
      localStorage.removeItem("taskflow_token");
      setUser(null);
    }
  };

  return <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>{children}</AuthContext.Provider>;
}
