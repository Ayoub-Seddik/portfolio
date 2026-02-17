import { useEffect, useMemo, useState } from "react";
import {
  deleteTestimonial,
  listAllTestimonials,
  type Testimonial,
  type TestimonialStatus,
  updateTestimonialStatus,
} from "../api/testimonialsApi";

import ConfirmModal from "../components/ui/ConfirmModal";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--muted)]">
      {children}
    </span>
  );
}

function Column({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
        <Badge>{count}</Badge>
      </div>
      <div className="mt-4 grid gap-3">{children}</div>
    </div>
  );
}

function TestimonialCard({
  t,
  busy,
  onApprove,
  onDecline,
  onMoveToPending,
  onDelete,
}: {
  t: Testimonial;
  busy: boolean;
  onApprove?: () => void;
  onDecline?: () => void;
  onMoveToPending?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <p className="text-[var(--text)] leading-relaxed">“{t.message}”</p>

      <div className="mt-3">
        <p className="font-semibold text-[var(--text)]">{t.name}</p>
        <p className="text-sm text-[var(--muted)]">
          {t.relation}
          {t.company ? ` • ${t.company}` : ""}
        </p>
        {t.createdAt && (
          <p className="mt-1 text-xs text-[var(--muted)]">
            Submitted: {new Date(t.createdAt).toLocaleString()}
          </p>
        )}
      </div>

      {(onApprove || onDecline || onMoveToPending || onDelete) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {onApprove && (
            <button
              className="rounded-xl bg-[var(--red)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              disabled={busy}
              onClick={onApprove}
            >
              Approve
            </button>
          )}

          {onDecline && (
            <button
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
              disabled={busy}
              onClick={onDecline}
            >
              Decline
            </button>
          )}

          {onMoveToPending && (
            <button
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
              disabled={busy}
              onClick={onMoveToPending}
            >
              Move to Pending
            </button>
          )}

          {onDelete && (
            <button
              className="rounded-xl bg-[var(--red)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              disabled={busy}
              onClick={onDelete}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // ✅ Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await listAllTestimonials();
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const approved = useMemo(
    () => items.filter((x) => x.status === "APPROVED"),
    [items]
  );
  const pending = useMemo(
    () => items.filter((x) => x.status === "PENDING"),
    [items]
  );
  const declined = useMemo(
    () => items.filter((x) => x.status === "DECLINED"),
    [items]
  );

  async function setStatus(id: string, status: TestimonialStatus) {
    try {
      setBusyId(id);
      setError(null);

      await updateTestimonialStatus(id, status);

      // Optimistic local update
      setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (e: any) {
      setError(e?.message ?? "Failed to update status.");
      await load();
    } finally {
      setBusyId(null);
    }
  }

  function askDelete(id: string) {
    setSelectedId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!selectedId) return;

    try {
      setBusyId(selectedId);
      setError(null);

      await deleteTestimonial(selectedId);

      setItems((prev) => prev.filter((t) => t.id !== selectedId));
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete testimonial.");
      await load();
    } finally {
      setBusyId(null);
      setConfirmOpen(false);
      setSelectedId(null);
    }
  }

  const selectedName =
    selectedId ? items.find((t) => t.id === selectedId)?.name : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
            Manage Testimonials
          </h1>
          <p className="mt-1 text-[var(--muted)]">
            Approve to show on Home. Declined can be deleted.
          </p>
        </div>

        <button
          className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
          onClick={load}
          disabled={loading}
        >
          Refresh
        </button>
      </header>

      {error && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-[var(--red)]">
          {error}
        </div>
      )}

      {loading ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--muted)]">
          Loading...
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-3">
          {/* PENDING */}
          <Column title="Pending" count={pending.length}>
            {pending.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                No pending testimonials.
              </p>
            ) : (
              pending.map((t) => (
                <TestimonialCard
                  key={t.id}
                  t={t}
                  busy={busyId === t.id}
                  onApprove={() => setStatus(t.id, "APPROVED")}
                  onDecline={() => setStatus(t.id, "DECLINED")}
                />
              ))
            )}
          </Column>

          {/* APPROVED */}
          <Column title="Approved" count={approved.length}>
            {approved.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                No approved testimonials.
              </p>
            ) : (
              approved.map((t) => (
                <TestimonialCard
                  key={t.id}
                  t={t}
                  busy={busyId === t.id}
                  onMoveToPending={() => setStatus(t.id, "PENDING")}
                />
              ))
            )}
          </Column>

          {/* DECLINED */}
          <Column title="Declined" count={declined.length}>
            {declined.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                No declined testimonials.
              </p>
            ) : (
              declined.map((t) => (
                <TestimonialCard
                  key={t.id}
                  t={t}
                  busy={busyId === t.id}
                  onMoveToPending={() => setStatus(t.id, "PENDING")}
                  onDelete={() => askDelete(t.id)}
                />
              ))
            )}
          </Column>
        </section>
      )}

      {/* ✅ Confirm delete modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Delete testimonial?"
        message={
          selectedId
            ? `Delete the declined testimonial${
                selectedName ? ` from "${selectedName}"` : ""
              }? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedId(null);
        }}
      />
    </main>
  );
}
