import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteExperience,
  getExperience,
  saveExperience,
  type EducationItem,
  type ExperienceItem,
  type Lang,
} from "../data/experienceStore";

function Input({ value, onChange, placeholder }: any) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
    />
  );
}

function Textarea({ value, onChange, placeholder }: any) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 min-h-[90px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
    />
  );
}

export default function AdminExperienceEducation() {
  const { t, i18n } = useTranslation();

  const [lang, setLang] = useState<Lang>(
    i18n.language.toLowerCase().startsWith("fr") ? "fr" : "en"
  );
  const [tab, setTab] = useState<"experience" | "education">("experience");
  const [status, setStatus] = useState("");

  // defaults from i18n (used for reset)
  const defaults = useMemo(() => {
    return {
      experience: t("experiencePage.experience", { returnObjects: true }) as ExperienceItem[],
      educationItems: t("experiencePage.educationItems", { returnObjects: true }) as EducationItem[],
    };
  }, [t, lang]); // lang changes make t() return the other language

  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);

  useEffect(() => {
    (async () => {
      setStatus("");
      const saved = await getExperience(lang);
      if (saved) {
        setExperience(saved.experience);
        setEducationItems(saved.educationItems);
      } else {
        setExperience(defaults.experience);
        setEducationItems(defaults.educationItems);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, defaults.experience.length, defaults.educationItems.length]);

  async function onSave() {
    await saveExperience(lang, { experience, educationItems });
    setStatus(t("adminExperience.status.saved"));
    setTimeout(() => setStatus(""), 1500);
  }

  async function onReset() {
    await deleteExperience(lang);
    setExperience(defaults.experience);
    setEducationItems(defaults.educationItems);
    setStatus(t("adminExperience.status.reset"));
    setTimeout(() => setStatus(""), 1500);
  }

  function addExperienceItem() {
    setExperience((prev) => [
      ...prev,
      { title: "", org: "", dates: "", bullets: [""], tech: [] },
    ]);
  }

  function addEducationItem() {
    setEducationItems((prev) => [...prev, { program: "", school: "", dates: "" }]);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {t("adminExperience.title")}
        </h1>
        <p className="text-[var(--muted)]">{t("adminExperience.subtitle")}</p>
      </header>

      {/* Controls */}
      <section className="mt-6 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 text-sm font-semibold rounded-lg ${
              lang === "en"
                ? "bg-[var(--red)] text-white"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {t("adminExperience.language.en")}
          </button>
          <button
            onClick={() => setLang("fr")}
            className={`px-3 py-1 text-sm font-semibold rounded-lg ${
              lang === "fr"
                ? "bg-[var(--red)] text-white"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {t("adminExperience.language.fr")}
          </button>
        </div>

        <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
          <button
            onClick={() => setTab("experience")}
            className={`px-3 py-1 text-sm font-semibold rounded-lg ${
              tab === "experience"
                ? "bg-[var(--bg)] text-[var(--text)]"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {t("adminExperience.tabs.experience")}
          </button>
          <button
            onClick={() => setTab("education")}
            className={`px-3 py-1 text-sm font-semibold rounded-lg ${
              tab === "education"
                ? "bg-[var(--bg)] text-[var(--text)]"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {t("adminExperience.tabs.education")}
          </button>
        </div>

        <button
          onClick={onSave}
          className="rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)]"
        >
          {t("adminExperience.actions.save")}
        </button>

        <button
          onClick={onReset}
          className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
        >
          {t("adminExperience.actions.reset")}
        </button>

        {status ? <span className="text-sm text-[var(--red)]">{status}</span> : null}
      </section>

      {/* Content */}
      {tab === "experience" ? (
        <section className="mt-6 space-y-4">
          <button
            onClick={addExperienceItem}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
          >
            {t("adminExperience.actions.addItem")}
          </button>

          {experience.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="flex justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--muted)]">
                  #{idx + 1}
                </p>
                <button
                  onClick={() =>
                    setExperience((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--red)]"
                >
                  {t("adminExperience.actions.remove")}
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-[var(--muted)]">
                    {t("adminExperience.fields.title")}
                  </label>
                  <Input
                    value={item.title}
                    onChange={(e: any) =>
                      setExperience((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x))
                      )
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--muted)]">
                    {t("adminExperience.fields.org")}
                  </label>
                  <Input
                    value={item.org}
                    onChange={(e: any) =>
                      setExperience((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, org: e.target.value } : x))
                      )
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--muted)]">
                    {t("adminExperience.fields.dates")}
                  </label>
                  <Input
                    value={item.dates}
                    onChange={(e: any) =>
                      setExperience((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, dates: e.target.value } : x))
                      )
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-[var(--muted)]">
                  {t("adminExperience.fields.bullets")}
                </label>

                <div className="mt-2 space-y-2">
                  {item.bullets.map((b, bi) => (
                    <div key={bi} className="flex gap-2">
                      <input
                        value={b}
                        onChange={(e) =>
                          setExperience((prev) =>
                            prev.map((x, i) => {
                              if (i !== idx) return x;
                              const bullets = x.bullets.map((bb, j) =>
                                j === bi ? e.target.value : bb
                              );
                              return { ...x, bullets };
                            })
                          )
                        }
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
                      />
                      <button
                        onClick={() =>
                          setExperience((prev) =>
                            prev.map((x, i) => {
                              if (i !== idx) return x;
                              const bullets = x.bullets.filter((_, j) => j !== bi);
                              return { ...x, bullets: bullets.length ? bullets : [""] };
                            })
                          )
                        }
                        className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm font-semibold text-[var(--muted)] hover:text-[var(--red)]"
                      >
                        {t("adminExperience.actions.remove")}
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setExperience((prev) =>
                      prev.map((x, i) =>
                        i === idx ? { ...x, bullets: [...x.bullets, ""] } : x
                      )
                    )
                  }
                  className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
                >
                  {t("adminExperience.actions.addBullet")}
                </button>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-[var(--muted)]">
                  {t("adminExperience.fields.tech")}
                </label>
                <Textarea
                  value={(item.tech ?? []).join(", ")}
                  onChange={(e: any) =>
                    setExperience((prev) =>
                      prev.map((x, i) => {
                        if (i !== idx) return x;
                        const tech = e.target.value
                          .split(",")
                          .map((s: string) => s.trim())
                          .filter(Boolean);
                        return { ...x, tech };
                      })
                    )
                  }
                  placeholder="React, TypeScript, Spring Boot"
                />
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="mt-6 space-y-4">
          <button
            onClick={addEducationItem}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
          >
            {t("adminExperience.actions.addItem")}
          </button>

          {educationItems.map((ed, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="flex justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--muted)]">
                  #{idx + 1}
                </p>
                <button
                  onClick={() =>
                    setEducationItems((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--red)]"
                >
                  {t("adminExperience.actions.remove")}
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-[var(--muted)]">
                    {t("adminExperience.fields.program")}
                  </label>
                  <Input
                    value={ed.program}
                    onChange={(e: any) =>
                      setEducationItems((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, program: e.target.value } : x))
                      )
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--muted)]">
                    {t("adminExperience.fields.school")}
                  </label>
                  <Input
                    value={ed.school}
                    onChange={(e: any) =>
                      setEducationItems((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, school: e.target.value } : x))
                      )
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--muted)]">
                    {t("adminExperience.fields.dates")}
                  </label>
                  <Input
                    value={ed.dates}
                    onChange={(e: any) =>
                      setEducationItems((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, dates: e.target.value } : x))
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
