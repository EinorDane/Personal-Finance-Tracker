import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Make sure this matches your backend server
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token dynamically if exists, but NOT for auth endpoints
api.interceptors.request.use((config) => {
  // Do NOT attach token for register or login endpoints
  if (
    config.url &&
    (config.url.includes("/api/auth/register") || config.url.includes("/api/auth/login"))
  ) {
    return config;
  }
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
