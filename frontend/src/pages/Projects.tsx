import { useTranslation } from "react-i18next";
import { projectsMock } from "../mock/projects";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
      {children}
    </span>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)]"
    >
      {label}
    </a>
  );
}

export default function Projects() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {t("projects.title")}
        </h1>
        <p className="text-[var(--muted)]">{t("projects.subtitle")}</p>
      </header>

      <ul className="mt-6 grid gap-4">
        {projectsMock.map((p) => (
          <li
            key={p.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm hover:bg-[var(--surface-2)] transition-colors"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-[var(--text)]">
                  {p.title}
                </h2>
                <p className="mt-2 text-[var(--muted)]">{p.description}</p>
              </div>

              <div className="flex flex-wrap gap-2 md:justify-end">
                {p.links.live && (
                  <LinkButton href={p.links.live} label={t("projects.liveSite")} />
                )}
                {p.links.github && (
                  <a
                    href={p.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
                  >
                    {t("projects.sourceCode")}
                  </a>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* What I did */}
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {t("projects.whatIDid")}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text)]">
                  {p.whatIDid.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-[var(--red)]" />
                      <span className="text-[var(--muted)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tech stack */}
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {t("projects.techStack")}
                </h3>

                <div className="mt-3 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {t("projects.languages")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.languages.map((lang) => (
                        <Pill key={lang}>{lang}</Pill>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {t("projects.frameworks")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.frameworks.map((fw) => (
                        <Pill key={fw}>{fw}</Pill>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
