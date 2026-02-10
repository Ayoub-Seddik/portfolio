import { Link } from "react-router-dom";
import type { Project } from "../api/projectsApi";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const hasLinks = Boolean(project.liveUrl || project.githubUrl);

  return (
    <article className="group w-full flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] 
    bg-[var(--surface)] shadow-sm transition hover:bg-[var(--surface-2)]">
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--bg)]">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[var(--muted)]">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-[var(--text)] line-clamp-1">
          {project.title}
        </h3>

        <p className="mt-2 text-sm text-[var(--muted)] line-clamp-3">
          {project.description}
        </p>

        {/* Actions pinned to bottom */}
        <div className="mt-auto pt-4">
          {hasLinks ? (
            <div className="flex items-center justify-between gap-2">
              {/* Left side actions */}
              <div className="flex flex-wrap gap-2">
                {/* <Link
                  to={`/projects/${project.slug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)]"
                >
                  View project
                </Link> */}

                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
                  >
                    Live site
                  </a>
                ) : (
                  <span className="inline-flex h-9 w-[92px]" />
                )}
              </div>

              {/* Right side GitHub */}
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
                >
                  GitHub
                </a>
              ) : (
                <span className="inline-flex h-9 w-[72px]" />
              )}
            </div>
          ) : (
            // 👇 No links case
            <div className="flex h-9 items-center text-sm italic text-[var(--muted)]">
              Currently in development, coming soon…
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
