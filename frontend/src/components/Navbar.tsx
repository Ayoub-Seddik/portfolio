import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import LanguageToggle from "./LanguageToggle";
import { useAdminAuth } from "../admin/useAdminAuth";
import { logoutAdmin } from "../admin/adminAuth";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useAdminAuth();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const NAV_ITEMS = useMemo(
    () => [
      { label: t("nav.home"), to: "/" },
      { label: t("nav.projects"), to: "/projects" },
      { label: t("nav.experience"), to: "/experience" },
      { label: t("nav.resume"), to: "/resume" },
      { label: t("nav.contact"), to: "/contact" },
    ],
    [t]
  );

  function handleLogout() {
    logoutAdmin();
    setOpen(false);
    navigate("/");
  }

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-[#262626]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* LEFT: Desktop nav */}
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

        {/* LEFT: Mobile hamburger */}
        <div className="md:hidden" ref={menuRef}>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)] transition"
          >
            {/* simple hamburger icon */}
            <span className="block h-[2px] w-5 bg-current" />
            <span className="mt-1 block h-[2px] w-5 bg-current" />
            <span className="mt-1 block h-[2px] w-5 bg-current" />
          </button>

          {/* Dropdown panel */}
          {open && (
            <div className="absolute left-4 right-4 top-[72px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg">
              <div className="grid gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="my-3 h-px bg-[var(--border)]" />

              {/* Admin controls inside menu (mobile only) */}
              {isAdmin ? (
                <div className="grid gap-2">
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)] transition"
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl bg-[var(--red)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)] transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--muted)] hover:border-[var(--red)] hover:text-[var(--red)] transition"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Admin buttons (desktop) + Language toggle (always visible) */}
        <div className="flex items-center gap-3">
          {/* Desktop admin controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
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
                Login
              </Link>
            )}
          </div>

          {/* Keep language toggle OUTSIDE hamburger */}
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
