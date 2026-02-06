import axios from "axios";

const api = axios.create({
  baseURL: "https://water-montoring-system-backend-1.onrender.comgi",
});

// Attach token automatically
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default api;
