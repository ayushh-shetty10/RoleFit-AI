import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${apiBaseUrl}/api/auth`,
  withCredentials: true,
});

export const register = async ({ username, email, password }) => {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error("Auth API register error:", err);
    throw err;
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error("Auth API login error:", err);
    throw err;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (err) {
    console.error("Auth API logout error:", err);
    throw err;
  }
};

export const Getme = async () => {
  try {
    const response = await api.get("/get-me");
    return response.data;
  } catch (err) {
    console.error("Auth API Getme error:", err);
    throw err;
  }
};
