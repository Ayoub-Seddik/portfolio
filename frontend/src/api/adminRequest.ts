import { getAdminCreds } from "../admin/adminAuth";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function buildAuthHeader(): Record<string, string> {
  const creds = getAdminCreds();
  if (!creds) return {};
  const token = btoa(`${creds.username}:${creds.password}`);
  return { Authorization: `Basic ${token}` };
}

export async function adminRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...buildAuthHeader(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text || `Request failed (${res.status})`);
  }

  // ✅ no content
  if (res.status === 204) return undefined as T;

  // ✅ handle empty body even if status is 200/201
  const text = await res.text().catch(() => "");
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}
