import { useContext } from "react";
import { AuthContext } from "../state/auth.context";
import { login, logout, register } from "../api/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ email, username, password }) => {
    setLoading(true);
    try {
      const data = await register({ email, password, username });
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("Register failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, user, handleLogin, handleLogout, handleRegister };
};
