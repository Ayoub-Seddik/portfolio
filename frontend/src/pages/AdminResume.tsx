import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteResume, getResume, saveResume } from "../data/resumeStore";

type Lang = "en" | "fr";

function Card({
  title,
  lang,
}: {
  title: string;
  lang: Lang;
}) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState<File | null>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    (async () => {
      const file = await getResume(lang);
      setCurrent(file);
    })();
  }, [lang]);

  async function onSave() {
    setStatus("");
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setStatus(t("adminResume.invalidType"));
      return;
    }

    await saveResume(lang, selected);
    const file = await getResume(lang);
    setCurrent(file);
    setSelected(null);
    setStatus(t("adminResume.saved"));
  }

  async function onRemove() {
    setStatus("");
    await deleteResume(lang);
    setCurrent(null);
    setSelected(null);
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>

      <p className="mt-2 text-sm text-[var(--muted)]">
        <span className="font-semibold text-[var(--text)]">
          {t("adminResume.current")}:
        </span>{" "}
        {current ? current.name : t("adminResume.notSet")}
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]">
          {t("adminResume.chooseFile")}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setSelected(e.target.files?.[0] ?? null)}
          />
        </label>

        {selected ? (
          <span className="text-sm text-[var(--muted)]">{selected.name}</span>
        ) : (
          <span className="text-sm text-[var(--muted)]">&nbsp;</span>
        )}
      </div>

      {status ? (
        <p className="mt-3 text-sm text-[var(--red)]">{status}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSave}
          className="rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)] disabled:opacity-60"
          disabled={!selected}
        >
          {t("adminResume.save")}
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
        >
          {t("adminResume.remove")}
        </button>
      </div>
    </section>
  );
}

export default function AdminResume() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {t("adminResume.title")}
        </h1>
        <p className="mt-2 text-[var(--muted)]">{t("adminResume.subtitle")}</p>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title={t("adminResume.english")} lang="en" />
        <Card title={t("adminResume.french")} lang="fr" />
      </div>
    </main>
  );
}
