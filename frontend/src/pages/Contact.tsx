import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

function isValidEmail(email: string) {
  // simple, practical validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function Contact() {
  const { t } = useTranslation();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.message.trim().length >= 10
    );
  }, [form]);

  function validate(values: FormState): Errors {
    const e: Errors = {};

    if (!values.name.trim()) e.name = t("contact.validation.nameRequired");
    if (!values.email.trim()) e.email = t("contact.validation.emailRequired");
    else if (!isValidEmail(values.email))
      e.email = t("contact.validation.emailInvalid");

    if (!values.message.trim())
      e.message = t("contact.validation.messageRequired");
    else if (values.message.trim().length < 10)
      e.message = t("contact.validation.messageTooShort");

    return e;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    // Frontend-only "submit"
    setSubmitting(true);

    try {
      // Mock DB (optional): store messages locally so you can see it worked
      const key = "portfolio.contact.messages.v1";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.unshift({
        id: crypto.randomUUID(),
        ...form,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(existing));

      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[var(--text)]">
            {t("contact.success.title")}
          </h1>
          <p className="mt-2 text-[var(--muted)]">{t("contact.success.message")}</p>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
          >
            {t("common.backHome")}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {t("contact.title")}
        </h1>
        <p className="mt-2 text-[var(--muted)]">{t("contact.subtitle")}</p>
      </header>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              {t("contact.form.name")}
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              placeholder={t("contact.form.name")}
            />
            {errors.name ? (
              <p className="mt-2 text-sm text-[var(--red)]">{errors.name}</p>
            ) : null}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              {t("contact.form.email")}
            </label>
            <input
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              placeholder={t("contact.form.email")}
              inputMode="email"
            />
            {errors.email ? (
              <p className="mt-2 text-sm text-[var(--red)]">{errors.email}</p>
            ) : null}
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              {t("contact.form.message")}
            </label>
            <textarea
              value={form.message}
              onChange={(e) =>
                setForm((p) => ({ ...p, message: e.target.value }))
              }
              className="mt-1 min-h-[140px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              placeholder={t("contact.form.message")}
            />
            <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{errors.message ? "" : " "}</span>
              <span>{form.message.trim().length}/1000</span>
            </div>

            {errors.message ? (
              <p className="mt-2 text-sm text-[var(--red)]">{errors.message}</p>
            ) : null}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full rounded-xl bg-[var(--red)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--red-dark)] disabled:opacity-60"
          >
            {submitting ? "..." : t("contact.form.send")}
          </button>
        </form>
      </section>
    </main>
  );
}
