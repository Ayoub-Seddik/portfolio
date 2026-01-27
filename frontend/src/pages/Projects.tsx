import { useTranslation } from "react-i18next";

export default function Projects() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">
        {t("pages.projects.title")}
      </h1>
      <p className="mt-3 text-gray-700">
        {/* later: projects list/cards */}
      </p>
    </main>
  );
}
