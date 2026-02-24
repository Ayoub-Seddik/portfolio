export type EducationStatus = "IN_PROGRESS" | "COMPLETED";

export type Education = {
  id: number;
  level: string;
  school: string;
  program: string;
  status: EducationStatus;
  completedYear: number | null;
  expectedYear: number | null;
  sortOrder: number;
};

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function listEducation(): Promise<Education[]> {
  const res = await fetch(`${BASE_URL}/api/educations`);
  if (!res.ok) throw new Error("Failed to load education");
  return res.json();
}


import type { TFunction } from "i18next";

export function formatEducationStatus(ed: Education, t?: TFunction) {
  // adjust fields to match your model:
  // Example: ed.status could be "IN_PROGRESS" | "COMPLETED"
  const status = (ed.status ?? "").toUpperCase();
  const year = ed.completedYear ?? ed.expectedYear ?? "";

  const inProgress = t ? t("common.inProgress") : "In progress";
  const completed = t ? t("common.completed") : "Completed";

  if (status === "IN_PROGRESS") return year ? `${inProgress} • ${year}` : inProgress;
  if (status === "COMPLETED") return year ? `${completed} • ${year}` : completed;

  // fallback (if you already store a string)
  return ed.status ?? "";
}