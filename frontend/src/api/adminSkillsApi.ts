import { adminRequest } from "./adminRequest";
import type { Skill } from "./skillsApi";

export type SkillPayload = {
  category: string;
  name: string;
  sortOrder: number;
};

export const adminListSkills = () => adminRequest<Skill[]>("/api/admin/skills");

export const adminCreateSkill = (payload: SkillPayload) =>
  adminRequest<Skill>("/api/admin/skills", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const adminUpdateSkill = (id: number, payload: SkillPayload) =>
  adminRequest<Skill>(`/api/admin/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const adminDeleteSkill = (id: number) =>
  adminRequest<void>(`/api/admin/skills/${id}`, { method: "DELETE" });
