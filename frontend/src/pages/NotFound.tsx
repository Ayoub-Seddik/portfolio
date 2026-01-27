import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">
        {t("notFound.title")}
      </h1>
      <p className="mt-3 text-gray-700">{t("notFound.message")}</p>

      <Link className="mt-4 inline-block underline" to="/">
        {t("common.backHome")}
      </Link>
    </main>
  );
}
