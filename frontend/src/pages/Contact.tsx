import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createContactMessage } from "../api/contactMessagesApi";
import { formatPhone10 } from "../utils/phone";

type FormState = {
  fullName: string;
  contactEmail: string;
  contactNumber: string; // digits only: "5145551234"
  reason: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function onlyDigitsMax10(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

export default function Contact() {
  const { t } = useTranslation();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    contactEmail: "",
    contactNumber: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      form.fullName.trim().length > 0 &&
      isValidEmail(form.contactEmail) &&
      form.contactNumber.length === 10 &&
      form.reason.trim().length >= 20 &&
      form.reason.trim().length <= 500
    );
  }, [form]);

  function validate(values: FormState): Errors {
    const e: Errors = {};

    if (!values.fullName.trim()) e.fullName = t("contact.validation.fullNameRequired");

    if (!values.contactEmail.trim()) e.contactEmail = t("contact.validation.emailRequired");
    else if (!isValidEmail(values.contactEmail))
      e.contactEmail = t("contact.validation.emailInvalid");

    if (!values.contactNumber.trim()) e.contactNumber = t("contact.validation.phoneRequired");
    else if (values.contactNumber.length !== 10)
      e.contactNumber = t("contact.validation.phoneInvalid");

    const reasonLen = values.reason.trim().length;
    if (!values.reason.trim()) e.reason = t("contact.validation.reasonRequired");
    else if (reasonLen < 20) e.reason = t("contact.validation.reasonTooShort", { min: 20 });
    else if (reasonLen > 500) e.reason = t("contact.validation.reasonTooLong", { max: 500 });

    return e;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await createContactMessage({
        fullName: form.fullName.trim(),
        contactEmail: form.contactEmail.trim(),
        contactNumber: form.contactNumber,
        reason: form.reason.trim(),
      });

      setSubmitted(true);
      setForm({ fullName: "", contactEmail: "", contactNumber: "", reason: "" });
      setErrors({});
    } catch (err: any) {
      setErrors((p) => ({ ...p, reason: err?.message ?? t("contact.errors.sendFailed") }));
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
            {t("contact.success.back")}
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
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              {t("contact.labels.fullName")}
            </label>
            <input
              value={form.fullName}
              onChange={(e) => {
                const value = e.target.value;
                setForm((p) => ({ ...p, fullName: value }));
                if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }));
              }}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              placeholder={t("contact.placeholders.fullName")}
            />
            {errors.fullName ? (
              <p className="mt-2 text-sm text-[var(--red)]">{errors.fullName}</p>
            ) : null}
          </div>

          {/* Contact Email */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              {t("contact.labels.email")}
            </label>
            <input
              value={form.contactEmail}
              onChange={(e) => {
                const value = e.target.value;
                setForm((p) => ({ ...p, contactEmail: value }));
                if (errors.contactEmail) setErrors((p) => ({ ...p, contactEmail: undefined }));
              }}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              placeholder={t("contact.placeholders.email")}
              inputMode="email"
              autoComplete="email"
            />
            {errors.contactEmail ? (
              <p className="mt-2 text-sm text-[var(--red)]">{errors.contactEmail}</p>
            ) : null}
          </div>

          {/* Contact Number */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              {t("contact.labels.phone")}
            </label>
            <input
              value={formatPhone10(form.contactNumber)}
              onChange={(e) => {
                const digits = onlyDigitsMax10(e.target.value);
                setForm((p) => ({ ...p, contactNumber: digits }));
                if (errors.contactNumber) setErrors((p) => ({ ...p, contactNumber: undefined }));
              }}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              placeholder={t("contact.placeholders.phone")}
              inputMode="numeric"
              autoComplete="tel"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{errors.contactNumber ? "" : " "}</span>
              <span>
                {t("contact.phoneCounter", { current: form.contactNumber.length, total: 10 })}
              </span>
            </div>

            {errors.contactNumber ? (
              <p className="mt-2 text-sm text-[var(--red)]">{errors.contactNumber}</p>
            ) : null}
          </div>

          {/* Reason */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              {t("contact.labels.reason")}
            </label>
            <textarea
              value={form.reason}
              onChange={(e) => {
                const value = e.target.value;
                setForm((p) => ({ ...p, reason: value }));
                if (errors.reason) setErrors((p) => ({ ...p, reason: undefined }));
              }}
              className="mt-1 min-h-[140px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              placeholder={t("contact.placeholders.reason")}
              maxLength={500}
            />
            <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{errors.reason ? "" : " "}</span>
              <span>{t("contact.reasonCounter", { current: form.reason.trim().length, total: 500 })}</span>
            </div>

            {errors.reason ? (
              <p className="mt-2 text-sm text-[var(--red)]">{errors.reason}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting || !canSubmit}
            className="w-full rounded-xl bg-[var(--red)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--red-dark)] disabled:opacity-60"
          >
            {submitting ? t("contact.buttons.sending") : t("contact.buttons.send")}
          </button>
        </form>
      </section>
    </main>
  );
}