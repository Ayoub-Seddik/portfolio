import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchProjects, type Project } from "../api/projectsApi";
import ProjectCard from "../components/ProjectCard";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]">
      {children}
    </span>
  );
}

export default function Projects() {
  const { t } = useTranslation();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // (For the new UI) local search box value
  const [query, setQuery] = useState("");

  // Debounce search so it doesn’t call API every keystroke
  useEffect(() => {
    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProjects(query);
        setProjects(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [query]);

  const countText = useMemo(() => `${projects.length} projects`, [projects.length]);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {t("projects.title")}
        </h1>
        <p className="text-[var(--muted)]">{t("projects.subtitle")}</p>
      </header>

      {/* Search bar (matches your target UI direction) */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full sm:w-80 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
          />
          <Pill>{countText}</Pill>
        </div>
      </div>

      {loading && (
        <p className="mt-6 text-[var(--muted)]">Loading projects…</p>
      )}

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
        {projects.map((project) => (
          <li key={project.id} className="w-full max-w-[360px] sm:max-w-none">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>

    </main>
  );
}
