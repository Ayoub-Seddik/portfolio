import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Skill } from "../../types/Skill";
import SkillBar from "../../components/SkillBar";
import { skillsMock } from "../../mock/skills";

export default function AdminSkills() {
  const { t } = useTranslation();

  const [skills, setSkills] = useState<Skill[]>(skillsMock);

  const [name, setName] = useState("");
  const [level, setLevel] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  function resetForm() {
    setName("");
    setLevel(5);
    setComment("");
    setEditingId(null);
    setError("");
  }

  function validate() {
    if (!name.trim()) return t("skills.validation.nameRequired");
    if (level < 1 || level > 10) return t("skills.validation.levelRange");
    return "";
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const cleanName = name.trim();
    const cleanComment = comment.trim() || undefined;

    if (editingId) {
      setSkills((prev) =>
        prev.map((s) =>
          s.id === editingId ? { ...s, name: cleanName, level, comment: cleanComment } : s
        )
      );
    } else {
      setSkills((prev) => [
        { id: crypto.randomUUID(), name: cleanName, level, comment: cleanComment },
        ...prev,
      ]);
    }

    resetForm();
  }

  function startEdit(skill: Skill) {
    setEditingId(skill.id);
    setName(skill.name);
    setLevel(skill.level);
    setComment(skill.comment ?? "");
    setError("");
  }

  function remove(id: string) {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
            {t("admin.skills.title")}
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            {/* optional helper text later */}
          </p>
        </div>
      </header>

      {/* Form */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-[var(--muted)]">
                {t("skills.form.name")}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
                placeholder={t("skills.form.name")}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--muted)]">
                {t("skills.form.level")}
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--muted)]">
                {t("skills.form.comment")}
              </label>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
                placeholder={t("skills.form.comment")}
              />
            </div>
          </div>

          {error ? (
            <p className="text-sm text-[var(--red)]">{error}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)]"
            >
              {isEditing ? t("common.update") : t("common.add")}
            </button>

            {isEditing ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
              >
                {t("common.cancel")}
              </button>
            ) : null}
          </div>
        </form>
      </section>

      {/* List */}
      <section className="mt-6">
        <ul className="space-y-3">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-[var(--text)]">
                      {skill.name}
                    </h2>
                    {skill.comment ? (
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {skill.comment}
                      </p>
                    ) : null}
                  </div>

                  <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
                    {skill.level}/10
                  </span>
                </div>

                <div className="mt-4 max-w-sm">
                  <SkillBar level={skill.level} />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(skill)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
                >
                  {t("common.edit")}
                </button>
                <button
                  onClick={() => remove(skill.id)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
                >
                  {t("common.delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
