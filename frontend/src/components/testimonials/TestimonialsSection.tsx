import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import AddTestimonialModal from "./AddTestimonialModal";
import { listApprovedTestimonials, type Testimonial } from "../../api/testimonialsApi";
import { translateCached } from "../../utils/translateCached";

type TView = Testimonial & {
  messageView: string;
  relationView: string;
  companyView?: string;
};

function prettyMeta(relation: string, company?: string) {
  const bits = [relation.trim()];
  if (company && company.trim()) bits.push(company.trim());
  return bits.join(" • ");
}

export default function TestimonialsSection() {
  const { t, i18n } = useTranslation();

  const [items, setItems] = useState<Testimonial[]>([]);
  const [view, setView] = useState<TView[]>([]);

  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const isFr = i18n.language?.toLowerCase().startsWith("fr");

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const data = await listApprovedTestimonials();
      setItems(data);
      setIndex(0);
    } catch (e: any) {
      setError(e?.message ?? t("testimonials.errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Translate backend-provided content when language changes or items change
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // English: no translation
      if (!isFr) {
        const v: TView[] = items.map((x) => ({
          ...x,
          messageView: x.message,
          relationView: x.relation,
          companyView: x.company ?? undefined,
        }));
        if (!cancelled) setView(v);
        return;
      }

      // French: translate fields (cached)
      try {
        setTranslating(true);

        const v: TView[] = await Promise.all(
          items.map(async (x) => {
            const [msg, rel, comp] = await Promise.all([
              translateCached(x.message, "fr"),
              translateCached(x.relation, "fr"),
              x.company?.trim() ? translateCached(x.company, "fr") : Promise.resolve(x.company),
            ]);

            return {
              ...x,
              messageView: msg,
              relationView: rel,
              companyView: comp,
            };
          })
        );

        if (!cancelled) setView(v);
      } finally {
        if (!cancelled) setTranslating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [items, isFr]);

  const active = useMemo(() => {
    if (view.length === 0) return null;
    return view[Math.min(index, view.length - 1)];
  }, [view, index]);

  function next() {
    if (view.length <= 1) return;
    setIndex((i) => (i + 1) % view.length);
  }
  function prev() {
    if (view.length <= 1) return;
    setIndex((i) => (i - 1 + view.length) % view.length);
  }

  useEffect(() => {
    if (openModal) return;
    if (view.length <= 1) return;

    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % view.length);
    }, 5000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [view.length, openModal]);

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)]">{t("testimonials.title")}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("testimonials.subtitle")}</p>
          {translating && (
            <p className="mt-1 text-xs text-[var(--muted)]">
              {t("common.translating", "Translating…")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 text-[var(--muted)]">
            {t("testimonials.loading")}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 text-[var(--red)]">
            {error}
          </div>
        ) : !active ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 text-[var(--muted)]">
            {t("testimonials.empty")}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <p className="text-[var(--text)] leading-relaxed">“{active.messageView}”</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-[var(--text)]">{active.name}</p>
                <p className="text-sm text-[var(--muted)]">
                  {prettyMeta(active.relationView, active.companyView)}
                </p>
              </div>

              {view.length > 1 && (
                <div className="text-xs text-[var(--muted)]">
                  {t("testimonials.counter", { current: index + 1, total: view.length })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MOBILE */}
        <div className="mt-4 grid grid-cols-[25%_50%_25%] gap-2 sm:hidden">
          <button
            onClick={prev}
            disabled={view.length <= 1}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
          >
            {t("common.prev")}
          </button>

          <button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 whitespace-nowrap"
          >
            {t("testimonials.add")}
          </button>

          <button
            onClick={next}
            disabled={view.length <= 1}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
          >
            {t("common.next")}
          </button>
        </div>

        {/* DESKTOP */}
        <div className="mt-4 hidden sm:grid sm:grid-cols-[20%_15%_30%_15%_20%] sm:gap-0">
          <button
            onClick={prev}
            disabled={view.length <= 1}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
          >
            {t("common.prev")}
          </button>

          <div />

          <button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 whitespace-nowrap"
          >
            {t("testimonials.add")}
          </button>

          <div />

          <button
            onClick={next}
            disabled={view.length <= 1}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
          >
            {t("common.next")}
          </button>
        </div>
      </div>

      <AddTestimonialModal open={openModal} onClose={() => setOpenModal(false)} />
    </section>
  );
}