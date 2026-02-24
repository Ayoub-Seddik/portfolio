import type { TFunction } from "i18next";

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

export function formatExperienceDates(
  exp: Experience,
  t?: TFunction
) {
  // adjust these fields to match your model
  const start = exp.startYear; // or exp.startDate
  const end = exp.endYear;     // or exp.endDate (nullable)

  const present = t ? t("common.present") : "Present";

  const left = start ?? "";
  const right = end ? end : present;

  return `${left} — ${right}`;
}
