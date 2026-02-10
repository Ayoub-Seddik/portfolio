import { adminRequest } from "./adminRequest";

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

export type ExperiencePayload = {
  company: string;
  position: string;
  startYear: number;
  endYear: number | null;
  isPresent: boolean;
  summary: string;
  sortOrder: number;
};

export const adminListExperience = () =>
  adminRequest<Experience[]>("/api/admin/experiences");

export const adminCreateExperience = (payload: ExperiencePayload) =>
  adminRequest<Experience>("/api/admin/experiences", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const adminUpdateExperience = (id: number, payload: ExperiencePayload) =>
  adminRequest<Experience>(`/api/admin/experiences/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const adminDeleteExperience = (id: number) =>
  adminRequest<void>(`/api/admin/experiences/${id}`, { method: "DELETE" });
