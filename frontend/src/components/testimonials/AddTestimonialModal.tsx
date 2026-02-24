import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createTestimonial } from "../../api/testimonialsApi";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

function clampMessage(msg: string) {
  if (msg.length <= 500) return msg;
  return msg.slice(0, 500);
}

export default function AddTestimonialModal({ open, onClose, onCreated }: Props) {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [relation, setRelation] = useState("");
  const [message, setMessage] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ show confirmation after submit
  const [submitted, setSubmitted] = useState(false);

  // Reset when opening
  useEffect(() => {
    if (!open) return;
    setName("");
    setCompany("");
    setRelation("");
    setMessage("");
    setSaving(false);
    setError(null);
    setSubmitted(false);
  }, [open]);

  const msgLen = message.trim().length;

  const validation = useMemo(() => {
    const errs: string[] = [];
    if (!name.trim()) errs.push(t("testimonials.validation.nameRequired"));
    if (!relation.trim()) errs.push(t("testimonials.validation.relationRequired"));
    if (msgLen < 20) errs.push(t("testimonials.validation.minChars", { min: 20 }));
    if (msgLen > 500) errs.push(t("testimonials.validation.maxChars", { max: 500 }));
    return errs;
  }, [name, relation, msgLen, t]);

  const canSubmit = open && !saving && !submitted && validation.length === 0;

  async function onSubmit() {
    if (!canSubmit) return;
    try {
      setSaving(true);
      setError(null);

      await createTestimonial({
        name: name.trim(),
        company: company.trim() ? company.trim() : undefined,
        relation: relation.trim(),
        message: message.trim(),
      });

      // ✅ show confirmation view
      setSubmitted(true);
      setSaving(false);

      // optional callback (ex: to show toast or refresh lists)
      onCreated?.();
    } catch (e: any) {
      setError(e?.message ?? t("testimonials.errors.submitFailed"));
      setSaving(false);
    }
  }

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-start sm:items-center justify-center
        p-4 overflow-y-auto
      "
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <button
        className="fixed inset-0 bg-black/50"
        aria-label={t("common.close")}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="
          relative w-full max-w-lg
          rounded-2xl border border-[var(--border)] bg-[var(--surface)]
          p-6 shadow-lg
          max-h-[calc(100vh-2rem)]
          overflow-y-auto
          overscroll-contain
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)]">
              {submitted ? t("testimonials.confirm.title") : t("testimonials.modal.title")}
            </h3>

            {!submitted && (
              <p className="mt-1 text-sm text-[var(--muted)]">
                {t("testimonials.modal.pendingNote", {
                  status: t("testimonials.modal.statusPending"),
                })}
              </p>
            )}
          </div>

          <button
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-sm text-[var(--text)] hover:bg-[var(--surface-2)]"
            onClick={onClose}
          >
            {t("common.close")}
          </button>
        </div>

        {/* ✅ Confirmation screen */}
        {submitted ? (
          <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-[var(--text)]">
            {t("testimonials.confirm.sentForReview")}
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-[var(--text)]">
                {t("testimonials.modal.nameLabel")}
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
                placeholder={t("testimonials.modal.placeholders.name")}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-[var(--text)]">
                {t("testimonials.modal.companyLabel")}
              </span>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
                placeholder={t("testimonials.modal.placeholders.company")}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-[var(--text)]">
                {t("testimonials.modal.relationLabel")}
              </span>
              <input
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
                placeholder={t("testimonials.modal.placeholders.relation")}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-[var(--text)]">
                {t("testimonials.modal.messageLabel")}
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(clampMessage(e.target.value))}
                className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
                placeholder={t("testimonials.modal.placeholders.message")}
              />
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>{t("testimonials.modal.messageHint", { min: 20, max: 500 })}</span>
                <span className={msgLen > 500 || msgLen < 20 ? "text-[var(--red)]" : ""}>
                  {msgLen}/500
                </span>
              </div>
            </label>

            {validation.length > 0 && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--muted)]">
                <ul className="list-disc pl-5">
                  {validation.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--red)]">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)]"
                onClick={onClose}
                disabled={saving}
              >
                {t("common.cancel")}
              </button>
              <button
                className="rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                onClick={onSubmit}
                disabled={!canSubmit}
              >
                {saving ? t("testimonials.modal.submitting") : t("testimonials.modal.submit")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}