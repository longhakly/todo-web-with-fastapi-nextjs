import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: process.env.API_TIMEOUT
    ? parseInt(process.env.API_TIMEOUT, 10)
    : 10000,
});

export default api;
