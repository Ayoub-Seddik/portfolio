import { useTranslation } from "react-i18next";
import SkillBar from "../components/SkillBar";
import { skillsMock } from "../mock/skills";
import profilePic from "../assets/profile.jpg";

export default function Home() {
  const { t } = useTranslation();

  // These arrays contain ONLY translation keys (not visible text)
  const heroTagKeys = ["home.heroTags.react", "home.heroTags.spring", "home.heroTags.sql"] as const;

  const hobbyKeys = [
    "home.hobbies.gym",
    "home.hobbies.gaming",
    "home.hobbies.cooking",
    "home.hobbies.learning",
  ] as const;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      {/* HERO */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
              {t("home.heroTitle", { name: "Seddik Ayoub" })}
            </h1>

            <p className="mt-3 text-[var(--muted)]">
              {t("home.heroSubtitle")}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {heroTagKeys.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--muted)]"
                >
                  {t(key)}
                </span>
              ))}
            </div>
          </div>

          {/* PHOTO */}
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-[var(--red)]/10 blur-xl" />
              <img
                src={profilePic}
                alt="Seddik Ayoub"
                className="relative h-64 w-64 rounded-full object-cover border border-[var(--border)] bg-[var(--bg)] md:h-80 md:w-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOBBIES */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--text)]">
          {t("home.hobbiesTitle")}
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {hobbyKeys.map((baseKey) => (
            <div
              key={baseKey}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 hover:bg-[var(--surface-2)] transition-colors"
            >
              <p className="font-semibold text-[var(--text)]">
                {t(`${baseKey}.title`)}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {t(`${baseKey}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--text)]">
          {t("home.skillsTitle")}
        </h2>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {skillsMock.map((skill) => (
            <li
              key={skill.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 hover:bg-[var(--surface-2)] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-[var(--text)]">
                    {skill.name}
                  </p>

                  {/* Note: skill.comment comes from data (mock now, backend later) */}
                  {skill.comment ? (
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {skill.comment}
                    </p>
                  ) : null}
                </div>

                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]">
                  {skill.level}/10
                </span>
              </div>

              <div className="mt-4">
                <SkillBar level={skill.level} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
