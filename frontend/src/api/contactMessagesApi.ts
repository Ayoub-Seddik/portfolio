import { getAdminCreds } from "../admin/adminAuth"; 

export type ContactMessageRequest = {
  fullName: string;
  contactEmail: string;
  contactNumber: string;
  reason: string;
};

export type ContactMessageResponse = ContactMessageRequest & {
  id: number;
  createdAt: string;
};

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

function adminHeaders() {
  const creds = getAdminCreds();
  if (!creds) throw new Error("Not logged in");
  return { Authorization: `Basic ${btoa(`${creds.username}:${creds.password}`)}` };
}

export async function createContactMessage(payload: ContactMessageRequest) {
  const res = await fetch(`${BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to send message");
}

export async function listContactMessages(hidden: boolean): Promise<ContactMessageResponse[]> {
  const res = await fetch(
    `${BASE_URL}/api/admin/contact-messages?hidden=${hidden}`,
    { headers: adminHeaders() }
  );

  if (res.status === 401 || res.status === 403) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to load messages");

  return res.json();
}

export async function hideContactMessage(id: number) {
  const res = await fetch(`${BASE_URL}/api/admin/contact-messages/${id}/hide`, {
    method: "PATCH",
    headers: adminHeaders(),
  });
  if (res.status === 401 || res.status === 403) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to hide message");
}

export async function unhideContactMessage(id: number) {
  const res = await fetch(`${BASE_URL}/api/admin/contact-messages/${id}/unhide`, {
    method: "PATCH",
    headers: adminHeaders(),
  });
  if (res.status === 401 || res.status === 403) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to unhide message");
}

export async function deleteContactMessage(id: number) {
  const res = await fetch(`${BASE_URL}/api/admin/contact-messages/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (res.status === 401 || res.status === 403) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to delete message");
}