/// <reference types="vite/client" />
import axios from "axios";
import { getAdminCreds } from "../admin/adminAuth";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
});

// Attach Basic Auth ONLY for admin endpoints
apiClient.interceptors.request.use((config) => {
  const url = config.url ?? "";

  // Only protect admin calls like: /api/admin/projects
  if (url.startsWith("/api/admin/")) {
    const creds = getAdminCreds();

    if (creds) {
      const token = btoa(`${creds.username}:${creds.password}`);

      config.headers = config.headers ?? {};
      config.headers.Authorization = `Basic ${token}`;
    }
  } else {
    // Safety: never send auth to public endpoints
    if (config.headers && "Authorization" in config.headers) {
      delete (config.headers as any).Authorization;
    }
  }

  return config;
});

export default apiClient;