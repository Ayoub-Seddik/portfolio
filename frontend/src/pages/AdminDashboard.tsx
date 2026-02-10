import { Link } from "react-router-dom";

const adminCards = [
  {
    title: "Projects",
    desc: "Create, update, delete portfolio projects.",
    to: "/admin/projects",
  },
  {
    title: "Skills",
    desc: "Edit skills and categories shown on your site.",
    to: "/admin/skills",
  },
  {
    title: "Experience",
    desc: "Update experience.",
    to: "/admin/experience",
  },
  {
    title: "Education",
    desc: "Update education timeline.",
    to: "/admin/educations",
  },
  {
    title: "Resume PDF",
    desc: "Upload / replace your resume PDF used on the site.",
    to: "/admin/resume",
  },
  {
    title: "Testimonials",
    desc: "Approve or deny testimonials before they go live.",
    to: "/admin/testimonials",
    badge: "Coming soon",
  },
] as const;

export default function AdminDashboard() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text)]">Admin</h1>
        <p className="mt-2 text-[var(--muted)]">
          Manage your portfolio content and approvals.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:bg-[var(--surface-2)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--red)] transition">
                {c.title}
              </h2>

              {"badge" in c && (
                <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[10px] font-semibold text-[var(--muted)]">
                  {c.badge}
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-[var(--muted)]">{c.desc}</p>

            <div className="mt-4 text-sm font-semibold text-[var(--red)]">
              Manage →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
