import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
    const { i18n } = useTranslation();
    const isFr = i18n.language.startsWith("fr");

    function toggleLanguage() {
        i18n.changeLanguage(isFr ? "en" : "fr");
    }

    return (
        <button
            type="button"
            onClick={toggleLanguage}
            className="relative inline-flex h-9 w-20 items-center rounded-full border bg-white px-1 transition-colors hover:bg-gray-50"
            aria-label="Toggle Language"
            aria-pressed={isFr}
        >
            {/* The labels behind the slider */}
            <span className="absolute left-3 text-xs font-semibold text-gray-600">
                EN
            </span>

            <span className="absolute right-3 text-xs font-semibold text-gray-600">
                FR
            </span>

            {/* The slider */}
            <span
                className={[
                    "inline-flex h-7 w-9 items-center justify-center rounded-full border bg-white text-xs font-bold shadow-sm transition-transform",
                    isFr ? "translate-x-9" : "translate-x-0",
                ].join(" ")}
            >
                {isFr ? "FR" : "EN"}
            </span>
        </button>
    );
}