import { useTranslation } from "react-i18next";
import SkillBar from "../components/SkillBar";
import { skillsMock } from "../mock/skills";

export default function Skills() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
            {t("pages.skills.title")}
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            {/* Optional subtitle (add i18n key later if you want) */}
          </p>
        </div>
      </header>

      {skillsMock.length === 0 ? (
        <p className="mt-6 text-[var(--muted)]">{t("skills.empty")}</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {skillsMock.map((skill) => (
            <li
              key={skill.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-colors hover:bg-[var(--surface-2)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    {skill.name}
                  </h2>
                  {skill.comment ? (
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {skill.comment}
                    </p>
                  ) : null}
                </div>

                <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
                  {skill.level}/10
                </span>
              </div>

              <div className="mt-4">
                <SkillBar level={skill.level} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
