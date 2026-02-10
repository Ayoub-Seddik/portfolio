export type Experience = {
  id: number;
  company: string;
  position: string;
  startYear: number;
  endYear: number | null;
  isPresent: boolean;
  summary: string;
  sortOrder: number;
};

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function listExperience(): Promise<Experience[]> {
  const res = await fetch(`${BASE_URL}/api/experiences`);
  if (!res.ok) throw new Error("Failed to load experience");
  return res.json();
}

export function formatExperienceDates(e: Experience) {
  // You can later add months; for now years:
  const end = e.isPresent ? "Present" : (e.endYear ?? "");
  return `${e.startYear} — ${end}`;
}
