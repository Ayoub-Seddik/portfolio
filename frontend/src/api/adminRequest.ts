import { getAdminCreds } from "../admin/adminAuth";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function adminRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const creds = getAdminCreds();
  if (!creds) {
    const err: any = new Error("Not logged in");
    err.status = 401;
    throw err;
  }

  const token = btoa(`${creds.username}:${creds.password}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    const err: any = new Error(msg || res.statusText);
    err.status = res.status;
    throw err;
  }

  // 204 no content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
