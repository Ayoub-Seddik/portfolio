import { useEffect, useMemo, useRef, useState } from "react";
import AddTestimonialModal from "./AddTestimonialModal";
import { listApprovedTestimonials, type Testimonial } from "../../api/testimonialsApi";

function prettyMeta(t: Testimonial) {
  const bits = [t.relation.trim()];
  if (t.company && t.company.trim()) bits.push(t.company.trim());
  return bits.join(" • ");
}

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const intervalRef = useRef<number | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await listApprovedTestimonials();
      setItems(data);
      setIndex(0);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = useMemo(() => {
    if (items.length === 0) return null;
    return items[Math.min(index, items.length - 1)];
  }, [items, index]);

  function next() {
    if (items.length <= 1) return;
    setIndex((i) => (i + 1) % items.length);
  }
  function prev() {
    if (items.length <= 1) return;
    setIndex((i) => (i - 1 + items.length) % items.length);
  }

  // Auto-rotate every 5 seconds (disabled while modal open)
  useEffect(() => {
    if (openModal) return;
    if (items.length <= 1) return;

    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [items.length, openModal]);

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)]">Testimonials</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Feedback from people I’ve worked with.
          </p>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 text-[var(--muted)]">
            Loading testimonials...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 text-[var(--red)]">
            {error}
          </div>
        ) : !active ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 text-[var(--muted)]">
            No testimonials yet. Be the first to leave one!
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <p className="text-[var(--text)] leading-relaxed">
              “{active.message}”
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-[var(--text)]">{active.name}</p>
                <p className="text-sm text-[var(--muted)]">{prettyMeta(active)}</p>
              </div>

              {items.length > 1 && (
                <div className="text-xs text-[var(--muted)]">
                  {index + 1} / {items.length}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MOBILE: 25 / 50 / 25 */}
        <div className="mt-4 grid grid-cols-[25%_50%_25%] gap-2 sm:hidden">
            <button
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
                onClick={prev}
                disabled={items.length <= 1}
            >
                Prev
            </button>

            <button
                className="rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 whitespace-nowrap"
                onClick={() => setOpenModal(true)}
            >
                Add a testimonial
            </button>

            <button
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
                onClick={next}
                disabled={items.length <= 1}
            >
                Next
            </button>
            </div>

            {/* DESKTOP: 20 / 15 / 30 / 15 / 20 */}
            <div className="mt-4 hidden sm:grid sm:grid-cols-[20%_15%_30%_15%_20%] sm:gap-0">
            <button
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
                onClick={prev}
                disabled={items.length <= 1}
            >
                Prev
            </button>

            <div />

            <button
                className="rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 whitespace-nowrap"
                onClick={() => setOpenModal(true)}
            >
                Add a testimonial
            </button>

            <div />

            <button
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
                onClick={next}
                disabled={items.length <= 1}
            >
                Next
            </button>
        </div>

      </div>

      <AddTestimonialModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={() => {
          // Keep home list as approved-only; new one will be pending.
          // You could show a toast here later.
        }}
      />
    </section>
  );
}
