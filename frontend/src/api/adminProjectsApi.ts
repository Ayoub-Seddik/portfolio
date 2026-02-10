import type { Project } from "./projectsApi";
import { getAdminCreds } from "../admin/adminAuth";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export type ProjectUpsert = {
  title: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
};

function basicAuthHeader(username: string, password: string) {
  const token = btoa(`${username}:${password}`);
  return `Basic ${token}`;
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const creds = getAdminCreds();
  if (!creds) throw Object.assign(new Error("Not logged in."), { status: 401 });

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
      Authorization: basicAuthHeader(creds.username, creds.password),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json?.message ?? text;
    } catch {}
    const err: any = new Error(message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function adminListProjects(): Promise<Project[]> {
  return request<Project[]>("/api/projects", { method: "GET" });
}

export async function adminCreateProject(payload: ProjectUpsert): Promise<Project> {
  return request<Project>("/api/admin/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adminUpdateProject(id: number, payload: ProjectUpsert): Promise<Project> {
  return request<Project>(`/api/admin/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteProject(id: number): Promise<void> {
  return request<void>(`/api/admin/projects/${id}`, { method: "DELETE" });
}
