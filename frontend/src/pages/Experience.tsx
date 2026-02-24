import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type { Skill } from "../api/skillsApi";
import { listSkills } from "../api/skillsApi";

import type { Education } from "../api/educationApi";
import { formatEducationStatus, listEducation } from "../api/educationApi";

import type { Experience } from "../api/experienceApi";
import { formatExperienceDates, listExperience } from "../api/experienceApi";

import { translateCached } from "../utils/translateCached";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
      {children}
    </span>
  );
}

function CategoryPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-[var(--text)]">{children}</h2>
  );
}

function normalizeLang(lng: string): "en" | "fr" {
  return lng?.toLowerCase().startsWith("fr") ? "fr" : "en";
}

function mapSkillCategory(cat: string, lang: "en" | "fr") {
  const c = (cat || "Other").trim();
  if (lang !== "fr") return c;

  const lower = c.toLowerCase();
  if (lower === "other") return "Autre";
  // Frontend/Backend/Design often don't need translation; keep as-is.
  return c;
}

function ExperienceRow({
  item,
  open,
  onToggle,
}: {
  item: Experience;
  open: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();

  return (
    <li className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm hover:bg-[var(--surface-2)] transition-colors">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--muted)]">
            {item.company}
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text)]">
            {item.position}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={onToggle}
            className="rounded-xl bg-[var(--red)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)]"
          >
            {open
              ? t("experiencePage.buttons.hideResponsibilities")
              : t("experiencePage.buttons.viewResponsibilities")}
          </button>

          <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
            {formatExperienceDates(item, t)}
          </span>
        </div>
      </div>

      {open && (
        <div className="mt-4 whitespace-pre-line text-sm text-[var(--muted)]">
          {item.summary}
        </div>
      )}
    </li>
  );
}

export default function ExperiencePage() {
  const { t, i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);

  const [openId, setOpenId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr(null);

      try {
        const [sk, edu, exp] = await Promise.all([
          listSkills(),
          listEducation(),
          listExperience(),
        ]);

        if (cancelled) return;

        // Only translate backend content when FR is active.
        if (lang === "fr") {
          const expFr = await Promise.all(
            exp.map(async (x) => ({
              ...x,
              position: await translateCached(x.position, "fr"),
              summary: await translateCached(x.summary, "fr"),
              // company usually stays as-is (names), but you can translate if you want:
              // company: await translateCached(x.company, "fr"),
            }))
          );

          const eduFr = await Promise.all(
            edu.map(async (x) => ({
              ...x,
              program: await translateCached(x.program, "fr"),
              school: await translateCached(x.school, "fr"),
              level: await translateCached(x.level, "fr"),
            }))
          );

          setSkills(sk);
          setEducation(eduFr);
          setExperience(expFr);
        } else {
          setSkills(sk);
          setEducation(edu);
          setExperience(exp);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? t("common.loadFailed"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lang, t]);

  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {};
    for (const s of skills) {
      const rawCat = (s.category || "Other").trim();
      const cat = mapSkillCategory(rawCat, lang);
      (grouped[cat] ||= []).push(s);
    }
    for (const cat of Object.keys(grouped)) {
      grouped[cat].sort(
        (a, b) =>
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
          (a.name ?? "").localeCompare(b.name ?? "")
      );
    }
    return grouped;
  }, [skills, lang]);

  const educationRows = useMemo(() => {
    return [...education].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );
  }, [education]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {t("experiencePage.title")}
        </h1>
        <p className="mt-2 text-[var(--muted)]">{t("experiencePage.subtitle")}</p>
      </header>

      {err && (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-[var(--muted)]">{t("common.loading")}</p>
      ) : (
        <div className="mt-8 space-y-10">
          {/* SKILLS */}
          <section>
            <SectionTitle>{t("experiencePage.sections.skills")}</SectionTitle>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {t("experiencePage.skillsSubtitle")}
            </p>

            <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <div className="space-y-4">
                {Object.entries(skillsByCategory)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([cat, items]) => (
                    <div
                      key={cat}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <CategoryPill>{cat}</CategoryPill>

                      {items.map((s) => (
                        <Pill key={s.id}>{s.name}</Pill>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          </section>

          {/* EDUCATION */}
          <section>
            <SectionTitle>{t("experiencePage.sections.education")}</SectionTitle>

            <div className="mt-4 space-y-4">
              {educationRows.map((ed) => (
                <article
                  key={ed.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm hover:bg-[var(--surface-2)] transition-colors"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-[var(--text)]">
                        {ed.program}
                      </p>
                      <p className="mt-1 text-[var(--muted)]">
                        {ed.school} • {ed.level}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
                        {formatEducationStatus(ed, t)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* EXPERIENCE */}
          <section>
            <SectionTitle>{t("experiencePage.sections.experience")}</SectionTitle>

            <ul className="mt-4 space-y-4">
              {experience.map((item) => (
                <ExperienceRow
                  key={item.id}
                  item={item}
                  open={openId === item.id}
                  onToggle={() =>
                    setOpenId((cur) => (cur === item.id ? null : item.id))
                  }
                />
              ))}
            </ul>
          </section>
        </div>
      )}
    </main>
  );
}