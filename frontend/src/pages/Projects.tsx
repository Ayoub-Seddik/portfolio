import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchProjects, type Project } from "../api/projectsApi";
import ProjectCard from "../components/ProjectCard";
import { translateCached } from "../utils/translateCached";

type ProjectView = Project & {
  titleView: string;
  descriptionView: string;
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
      {children}
    </span>
  );
}

export default function Projects() {
  const { t, i18n } = useTranslation();
  const isFr = (i18n.resolvedLanguage ?? i18n.language ?? "en")
    .toLowerCase()
    .startsWith("fr");

  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView] = useState<ProjectView[]>([]);

  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");

  // Fetch projects (debounced search). NO lang param.
  useEffect(() => {
    let cancelled = false;

    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProjects(query);
        if (!cancelled) setProjects(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query]);

  // Build view (translate when FR)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!isFr) {
        const v: ProjectView[] = projects.map((p) => ({
          ...p,
          titleView: p.title,
          descriptionView: p.description,
        }));
        if (!cancelled) setView(v);
        return;
      }

      try {
        setTranslating(true);

        const v: ProjectView[] = await Promise.all(
          projects.map(async (p) => {
            const [titleView, descriptionView] = await Promise.all([
              translateCached(p.title, "fr"),
              translateCached(p.description, "fr"),
            ]);
            return { ...p, titleView, descriptionView };
          })
        );

        if (!cancelled) setView(v);
      } finally {
        if (!cancelled) setTranslating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [projects, isFr]);

  const countText = useMemo(() => `${view.length} ${t("projects.title")}`, [view.length, t]);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {t("projects.title")}
        </h1>
        <p className="text-[var(--muted)]">{t("projects.subtitle")}</p>

        {translating && (
          <p className="text-xs text-[var(--muted)]">
            {t("common.translating", "Translating…")}
          </p>
        )}
      </header>

    

      {loading && <p className="mt-6 text-[var(--muted)]">{t("common.loading", "Loading…")}</p>}

      {error && (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <ul
        className="
          mt-6 grid gap-6
          grid-cols-1
          justify-items-center
          sm:grid-cols-2
          lg:grid-cols-3
          sm:justify-items-stretch
        "
      >
        {view.map((project) => (
          <li key={project.id} className="w-full max-w-[360px] sm:max-w-none">
            {/* If your ProjectCard expects Project, pass mapped fields */}
            <ProjectCard
              project={{
                ...project,
                title: project.titleView,
                description: project.descriptionView,
              }}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}