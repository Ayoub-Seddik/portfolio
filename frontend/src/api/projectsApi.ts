import api from "./apiClient";

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

export async function fetchProjects(q?: string): Promise<Project[]> {
  const res = await api.get<Project[]>("/api/projects", {
    params: q && q.trim() ? { q: q.trim() } : undefined,
  });

  return res.data;
}