import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import { useAdminAuth } from "../admin/useAdminAuth";
import { logoutAdmin } from "../admin/adminAuth";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAdmin = useAdminAuth();

  const NAV_ITEMS = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.projects"), to: "/projects" },
    { label: t("nav.experience"), to: "/experience" },
    { label: t("nav.resume"), to: "/resume" },
    { label: t("nav.contact"), to: "/contact" },
  ] as const;

  function handleLogout() {
    logoutAdmin();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--red)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <>
              <Link
                to="/admin/projects"
                className="rounded-lg border border-[var(--border)] px-3 py-1 text-sm text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)] transition"
              >
                Admin
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-[var(--red)] px-3 py-1 text-sm font-medium text-white hover:bg-[var(--red-dark)] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="rounded-lg border border-[var(--border)] px-3 py-1 text-sm text-[var(--muted)] hover:border-[var(--red)] hover:text-[var(--red)] transition"
            >
              Admin Login
            </Link>
          )}

          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
