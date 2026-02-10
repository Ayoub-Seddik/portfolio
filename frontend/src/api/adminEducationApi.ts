import { adminRequest } from "./adminRequest";
import type { Education, EducationStatus } from "./educationApi";

export type EducationPayload = {
  level: string;
  school: string;
  program: string;
  status: EducationStatus;
  completedYear: number | null;
  sortOrder: number;
};

export const adminListEducation = () =>
  adminRequest<Education[]>("/api/admin/educations");

export const adminCreateEducation = (payload: EducationPayload) =>
  adminRequest<Education>("/api/admin/educations", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const adminUpdateEducation = (id: number, payload: EducationPayload) =>
  adminRequest<Education>(`/api/admin/educations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const adminDeleteEducation = (id: number) =>
  adminRequest<void>(`/api/admin/educations/${id}`, { method: "DELETE" });
