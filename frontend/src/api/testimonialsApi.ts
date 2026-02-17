import { getAdminCreds } from "../admin/adminAuth";

export type TestimonialStatus = "APPROVED" | "PENDING" | "DECLINED";

export type Testimonial = {
  id: string;
  name: string;
  company?: string | null;
  relation: string;
  message: string;
  status: TestimonialStatus;
  createdAt?: string;
};

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

function isAdminEndpoint(url: string) {
  // Works whether you pass full URL or just path
  return url.includes("/api/admin/");
}

function buildBasicAuthHeader(): string | null {
  const creds = getAdminCreds();
  if (!creds) return null;
  // Keep password as-is (you stored it raw), but trim username
  const token = btoa(`${creds.username.trim()}:${creds.password}`);
  return `Basic ${token}`;
}

/**
 * Robust HTTP helper:
 * - throws on non-2xx
 * - handles 204 No Content + empty bodies safely
 * - automatically attaches Basic Auth for /api/admin/**
 */
async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const url = typeof input === "string" ? input : input.toString();

  // Base headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (isAdminEndpoint(url)) {
    const auth = buildBasicAuthHeader();
    if (auth) headers["Authorization"] = auth;
  }

  const res = await fetch(url, {
    ...init,
    headers,
  });

  // If unauthorized, give a clearer error (optional but helpful)
  if (res.status === 401 || res.status === 403) {
    throw new Error("Unauthorized: admin login required (invalid or missing credentials).");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text().catch(() => "");
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

// ----------------------
// PUBLIC
// ----------------------
export function listApprovedTestimonials(): Promise<Testimonial[]> {
  return http<Testimonial[]>(`${BASE_URL}/api/testimonials`);
}

export type CreateTestimonialRequest = {
  name: string;
  company?: string;
  relation: string;
  message: string;
};

export function createTestimonial(body: CreateTestimonialRequest): Promise<void> {
  return http<void>(`${BASE_URL}/api/testimonials`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ----------------------
// ADMIN
// ----------------------
export function listAllTestimonials(): Promise<Testimonial[]> {
  return http<Testimonial[]>(`${BASE_URL}/api/admin/testimonials`);
}

export function updateTestimonialStatus(id: string, status: TestimonialStatus): Promise<void> {
  return http<void>(`${BASE_URL}/api/admin/testimonials/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteTestimonial(id: string): Promise<void> {
  return http<void>(`${BASE_URL}/api/admin/testimonials/${id}`, {
    method: "DELETE",
  });
}
