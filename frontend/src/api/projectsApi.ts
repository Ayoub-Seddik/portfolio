export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  createdAt?: string;
};

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function fetchProjects(q?: string): Promise<Project[]> {
  const url = new URL("/api/projects", BASE_URL);
  if (q && q.trim()) url.searchParams.set("q", q.trim());

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to load projects (${res.status}): ${text}`);
  }

  return res.json();
}
