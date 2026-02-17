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

    if (!values.fullName.trim()) e.fullName = "Full name is required";

    if (!values.contactEmail.trim()) e.contactEmail = "Email is required";
    else if (!isValidEmail(values.contactEmail))
      e.contactEmail = "Please enter a valid email (ex: name@email.com)";

    if (!values.contactNumber.trim()) e.contactNumber = "Phone is required";
    else if (values.contactNumber.length !== 10)
      e.contactNumber = "Phone number must be exactly 10 digits";

    const reasonLen = values.reason.trim().length;
    if (!values.reason.trim()) e.reason = "Reason is required";
    else if (reasonLen < 20) e.reason = "Reason must be at least 20 characters";
    else if (reasonLen > 500) e.reason = "Reason must be at most 500 characters";

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
        contactNumber: form.contactNumber, // digits only
        reason: form.reason.trim(),
      });

      setSubmitted(true);
      setForm({ fullName: "", contactEmail: "", contactNumber: "", reason: "" });
      setErrors({});
    } catch (err: any) {
      setErrors((p) => ({ ...p, reason: err?.message ?? "Send failed" }));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Message received
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Thanks — I’ll get back to you soon.
          </p>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
          >
            Back
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
              Full Name
            </label>
            <input
              value={form.fullName}
              onChange={(e) => {
                const value = e.target.value;
                setForm((p) => ({ ...p, fullName: value }));
                if (errors.fullName) {
                  setErrors((p) => ({ ...p, fullName: undefined }));
                }
              }}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              placeholder="Full Name"
            />
            {errors.fullName ? (
              <p className="mt-2 text-sm text-[var(--red)]">{errors.fullName}</p>
            ) : null}
          </div>

          {/* Contact Email */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              Contact Email
            </label>
            <input
              value={form.contactEmail}
              onChange={(e) => {
                const value = e.target.value;
                setForm((p) => ({ ...p, contactEmail: value }));
                if (errors.contactEmail) {
                  setErrors((p) => ({ ...p, contactEmail: undefined }));
                }
              }}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              placeholder="email@example.com"
              inputMode="email"
              autoComplete="email"
            />
            {errors.contactEmail ? (
              <p className="mt-2 text-sm text-[var(--red)]">
                {errors.contactEmail}
              </p>
            ) : null}
          </div>

          {/* Contact Number (10 digits only) */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              Contact Number
            </label>
            <input
              value={formatPhone10(form.contactNumber)} // pretty display
              onChange={(e) => {
                const digits = onlyDigitsMax10(e.target.value);
                setForm((p) => ({ ...p, contactNumber: digits }));

                if (errors.contactNumber) {
                  setErrors((p) => ({ ...p, contactNumber: undefined }));
                }
              }}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              placeholder="(514) 555-1234"
              inputMode="numeric"
              autoComplete="tel"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{errors.contactNumber ? "" : " "}</span>
              <span>{form.contactNumber.length}/10 digits</span>
            </div>

            {errors.contactNumber ? (
              <p className="mt-2 text-sm text-[var(--red)]">
                {errors.contactNumber}
              </p>
            ) : null}
          </div>

          {/* Reason */}
          <div>
            <label className="text-sm font-medium text-[var(--muted)]">
              Reason for contact
            </label>
            <textarea
              value={form.reason}
              onChange={(e) => {
                const value = e.target.value;
                setForm((p) => ({ ...p, reason: value }));

                if (errors.reason) {
                  setErrors((p) => ({ ...p, reason: undefined }));
                }
              }}
              className="mt-1 min-h-[140px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              placeholder="Minimum 20 characters, max 500"
              maxLength={500}
            />
            <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{errors.reason ? "" : " "}</span>
              <span>{form.reason.trim().length}/500</span>
            </div>

            {errors.reason ? (
              <p className="mt-2 text-sm text-[var(--red)]">{errors.reason}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[var(--red)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--red-dark)] disabled:opacity-60"
          >
            {submitting ? "..." : "Send"}
          </button>
        </form>
      </section>
    </main>
  );
}
