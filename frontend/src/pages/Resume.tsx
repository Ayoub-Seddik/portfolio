import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getResume } from "../data/resumeStore";

export default function Resume() {
  const { t, i18n } = useTranslation();
  const isFrench = i18n.language?.toLowerCase().startsWith("fr");

  const fallbackUrl = useMemo(
    () => (isFrench ? "/Ayoub_Seddik_Cv_FR.pdf" : "/Ayoub_Seddik_Cv_EN.pdf"),
    [isFrench]
  );

  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    let urlToRevoke: string | null = null;

    (async () => {
      const file = await getResume(isFrench ? "fr" : "en");
      if (!file) {
        setObjectUrl(null);
        return;
      }
      const url = URL.createObjectURL(file);
      urlToRevoke = url;
      setObjectUrl(url);
    })();

    return () => {
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
    };
  }, [isFrench]);

  const resumeUrl = objectUrl ?? fallbackUrl;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {t("resumePage.title")}
        </h1>
        <p className="mt-2 text-[var(--muted)]">{t("resumePage.subtitle")}</p>
      </header>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={resumeUrl}
            download
            className="inline-flex items-center justify-center rounded-xl bg-[var(--red)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--red-dark)]"
          >
            {t("resumePage.download")}
          </a>

          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
          >
            {t("resumePage.open")}
          </a>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
          <iframe key={resumeUrl} title="Resume PDF" src={resumeUrl} className="h-[75vh] w-full" />
        </div>
      </section>
    </main>
  );
}
