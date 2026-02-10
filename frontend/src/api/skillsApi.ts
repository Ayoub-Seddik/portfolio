export type Skill = {
  id: number;
  category: string; // FrontEnd, BackEnd, Design
  name: string;
  sortOrder: number;
};

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function listSkills(): Promise<Skill[]> {
  const res = await fetch(`${BASE_URL}/api/skills`);
  if (!res.ok) throw new Error("Failed to load skills");
  return res.json();
}
