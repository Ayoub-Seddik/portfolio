import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import i18n from "../i18n/config";


export default function Navbar() {

    const { t } = useTranslation();

    const NAV_ITEMS = [
        { label : t("nav.home"), to: "/" },
        { label : t("nav.projects"), to: "/projects" },
        { label : t("nav.experience"), to: "/experience" },
        { label : t("nav.resume"), to: "/resume" },
        { label : t("nav.contact"), to: "/contact" },
    ] as const;

    return (
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <nav className="hidden items-center gap-6 md:flex">
                    {NAV_ITEMS.map((item) => (
                        <Link to={item.to} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--red)] transition-colors">
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="ml-2 inline-flex items-center rounded-lg border px-3 py-1 text-sm hover:bg-gray-50 md:hidden"
                    >
                        {t("nav.menu")}
                    </button>
                    
                    <LanguageToggle />
                </div>
            </div>
        </header>
    );
}