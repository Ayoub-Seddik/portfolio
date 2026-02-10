export type EducationStatus = "IN_PROGRESS" | "COMPLETED";

export type Education = {
  id: number;
  level: string;
  school: string;
  program: string;
  status: EducationStatus;
  completedYear: number | null;
  sortOrder: number;
};

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function listEducation(): Promise<Education[]> {
  const res = await fetch(`${BASE_URL}/api/educations`);
  if (!res.ok) throw new Error("Failed to load education");
  return res.json();
}

export function formatEducationStatus(ed: Education) {
  if (ed.status === "COMPLETED") {
    return ed.completedYear ? `Completed • ${ed.completedYear}` : "Completed";
  }
  return ed.completedYear ? `In progress • ${ed.completedYear}` : "In progress";
}
