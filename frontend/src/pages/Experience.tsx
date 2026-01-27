import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getExperience } from "../data/experienceStore";

type TimelineItem = {
  title: string;
  org: string;
  dates: string;
  bullets: string[];
  tech?: string[];
};

type EducationItem = {
  program: string;
  school: string;
  dates: string;
};

type OverridePayload = {
  experience: TimelineItem[];
  educationItems: EducationItem[];
} | null;

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
      {children}
    </span>
  );
}

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <li className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm hover:bg-[var(--surface-2)] transition-colors">
      <span className="absolute -left-3 top-8 hidden h-3 w-3 rounded-full bg-[var(--red)] md:block" />

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[var(--text)]">
            {item.title}
          </h3>
          <p className="mt-1 text-[var(--muted)]">{item.org}</p>
        </div>

        <div className="shrink-0">
          <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
            {item.dates}
          </span>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {item.bullets.map((b, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-[var(--red)]" />
            <span className="text-[var(--muted)]">{b}</span>
          </li>
        ))}
      </ul>

      {item.tech && item.tech.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {item.tech.map((tech) => (
            <Pill key={tech}>{tech}</Pill>
          ))}
        </div>
      ) : null}
    </li>
  );
}

export default function Experience() {
  const { t, i18n } = useTranslation();

  const lang = i18n.language.toLowerCase().startsWith("fr") ? "fr" : "en";

  const [override, setOverride] = useState<OverridePayload>(null);
  const [loaded, setLoaded] = useState(false);

  // Load override ONCE per language
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getExperience(lang);
        if (!cancelled) setOverride(data);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Default from i18n
  const i18nExperience = t("experiencePage.experience", {
    returnObjects: true,
  }) as TimelineItem[];

  const i18nEducation = t("experiencePage.educationItems", {
    returnObjects: true,
  }) as EducationItem[];

  // Use override if it exists, otherwise fallback to i18n
  const experience = override?.experience ?? i18nExperience;
  const educationItems = override?.educationItems ?? i18nEducation;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {t("experiencePage.title")}
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          {t("experiencePage.subtitle")}
        </p>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Experience timeline */}
        <section className="md:col-span-2">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            {t("experiencePage.sections.experience")}
          </h2>

          {/* Optional tiny loading hint */}
          {!loaded ? (
            <p className="mt-3 text-sm text-[var(--muted)]">...</p>
          ) : null}

          <div className="relative mt-4 md:pl-6">
            <div className="absolute left-0 top-0 hidden h-full w-px bg-[var(--border)] md:block" />
            <ul className="space-y-4">
              {experience.map((item) => (
                <TimelineCard key={`${item.org}-${item.title}`} item={item} />
              ))}
            </ul>
          </div>
        </section>

        {/* Education summary */}
        <aside className="md:col-span-1">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            {t("experiencePage.sections.education")}
          </h2>

          <div className="mt-4 space-y-4">
            {educationItems.map((ed) => (
              <div
                key={`${ed.school}-${ed.program}`}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
              >
                <p className="text-sm font-semibold text-[var(--text)]">
                  {ed.program}
                </p>
                <p className="mt-1 text-[var(--muted)]">{ed.school}</p>

                <div className="mt-4 inline-flex rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
                  {ed.dates}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
