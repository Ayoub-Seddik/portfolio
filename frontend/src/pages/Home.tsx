import { useTranslation } from "react-i18next";

export default function Home() {
    const { t } = useTranslation();

    return (
        <main className="mx-auto max-w-6x1 px-4 py-10">
            <section className="rounded-2x1 border bg-white p-6">
                <h1 className="text-3x1 font-bold tracking-tight">
                    {t("home.title")}
                </h1>
                <p className="mt-3 text-gray-700">{t("home.about")}</p>
            </section>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <section className="rounded-2x1 border bg-white p-6">
                    <h2 className="text-2x1 font-semibold">{t("home.skillsTitle")}</h2>
                    <a className="mt-4 inline-block text-sm font-medium underline" href="/skills">
                        {t("home.skillsCta")}
                    </a>
                </section>

                <section className="rounded-2x1 border bg-white p-6">
                    <h2 className="text-xl font-semibold">{t("home.hobbiesTitle")}</h2>
                    <a className="mt-4 inline-block text-sm font-medium underline" href="/hobbies">
                        {t("home.hobbiesCta")}
                    </a>
                </section>
            </div>
        </main>
    );
}