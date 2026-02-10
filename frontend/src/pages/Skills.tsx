import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SkillBar from "../components/SkillBar";
import { listSkills, type Skill } from "../api/skillsApi"; // adjust path if needed

const CATEGORY_ORDER: Record<string, number> = {
  FrontEnd: 1,
  BackEnd: 2,
  Design: 3,
};

export default function Skills() {
  const { t } = useTranslation();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listSkills();
        setSkills(data);
      } catch (e) {
        setError((e as Error).message ?? "Failed to load skills");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const sortedSkills = useMemo(() => {
    return [...skills].sort((a, b) => {
      const ca = CATEGORY_ORDER[a.category] ?? 999;
      const cb = CATEGORY_ORDER[b.category] ?? 999;
      if (ca !== cb) return ca - cb;
      return a.sortOrder - b.sortOrder;
    });
  }, [skills]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
            {t("pages.skills.title")}
          </h1>
          <p className="mt-2 text-[var(--muted)]">{/* optional subtitle */}</p>
        </div>
      </header>

      {loading ? (
        <p className="mt-6 text-[var(--muted)]">{t("common.loading")}</p>
      ) : error ? (
        <p className="mt-6 text-red-500">{error}</p>
      ) : sortedSkills.length === 0 ? (
        <p className="mt-6 text-[var(--muted)]">{t("skills.empty")}</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {sortedSkills.map((skill) => (
            <li
              key={skill.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-colors hover:bg-[var(--surface-2)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    {skill.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {skill.category}
                  </p>
                </div>

                <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
                  {skill.sortOrder}
                </span>
              </div>

              {/* If SkillBar expects a "level", you have 2 options:
                  1) remove SkillBar for now, or
                  2) map sortOrder/category to a level.
                  Below is a simple safe placeholder mapping. */}
              <div className="mt-4">
                <SkillBar level={Math.min(10, Math.max(1, skill.sortOrder))} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
