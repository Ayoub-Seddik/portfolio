import axios from "axios";
import i18n from "i18next";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
});

// Always attach ?lang=...
api.interceptors.request.use((config) => {
  const lang = i18n.language || "en";

  // Preserve any existing params
  config.params = { ...(config.params ?? {}), lang };

  return config;
});

export default api;
