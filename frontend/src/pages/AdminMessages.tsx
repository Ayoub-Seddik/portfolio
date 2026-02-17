import { useEffect, useMemo, useState } from "react";
import {
  listContactMessages,
  hideContactMessage,
  unhideContactMessage,
  deleteContactMessage,
  type ContactMessageResponse,
} from "../api/contactMessagesApi";
import { logoutAdmin } from "../admin/adminAuth";
import { useNavigate } from "react-router-dom";
import { formatPhone10 } from "../utils/phone";

type Tab = "inbox" | "hidden";

function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal"
      />

      {/* Dialog */}
      <div className="relative mx-auto mt-24 w-[92%] max-w-lg">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
          <h2 className="text-lg font-bold text-[var(--text)]">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
          ) : null}

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-60"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)] disabled:opacity-60"
            >
              {loading ? "Deleting..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("inbox");

  const [items, setItems] = useState<ContactMessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state (delete only)
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const hidden = useMemo(() => tab === "hidden", [tab]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await listContactMessages(hidden);
      setItems(data);
    } catch (e: any) {
      const msg = e?.message ?? "Failed";

      if (msg === "Unauthorized") {
        logoutAdmin();
        navigate("/admin");
        return;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function onHide(id: number) {
    // optimistic UI: remove it from current list right away
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id));

    try {
      await hideContactMessage(id);
      // if you want, you can optionally refresh hidden tab counts later
    } catch (e: any) {
      // rollback if failed
      setItems(prev);

      const msg = e?.message ?? "Failed";
      if (msg === "Unauthorized") {
        logoutAdmin();
        navigate("/admin");
        return;
      }
      setError(msg);
    }
  }

    async function onUnhide(id: number) {
        const prev = items;
        setItems((p) => p.filter((x) => x.id !== id)); // optimistic remove

        try {
            await unhideContactMessage(id);
        } catch (e: any) {
            setItems(prev); // rollback
            const msg = e?.message ?? "Failed";
            if (msg === "Unauthorized") {
            logoutAdmin();
            navigate("/admin");
            return;
            }
            setError(msg);
        }
    }


  async function onConfirmDelete() {
    if (deleteId == null) return;

    setDeleteLoading(true);
    try {
      await deleteContactMessage(deleteId);
      setItems((p) => p.filter((x) => x.id !== deleteId));
      setDeleteId(null);
    } catch (e: any) {
      const msg = e?.message ?? "Failed";
      if (msg === "Unauthorized") {
        logoutAdmin();
        navigate("/admin");
        return;
      }
      setError(msg);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
            Contact Messages
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Manage messages submitted from your contact form.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => setTab("inbox")}
            className={[
              "flex-1 rounded-xl border px-4 py-2 text-sm font-semibold sm:flex-none",
              tab === "inbox"
                ? "border-[var(--red)] bg-[var(--surface)] text-[var(--text)]"
                : "border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:bg-[var(--surface-2)]",
            ].join(" ")}
          >
            Inbox
          </button>
          <button
            type="button"
            onClick={() => setTab("hidden")}
            className={[
              "flex-1 rounded-xl border px-4 py-2 text-sm font-semibold sm:flex-none",
              tab === "hidden"
                ? "border-[var(--red)] bg-[var(--surface)] text-[var(--text)]"
                : "border-[var(--border)] bg-[var(--bg)] text-[var(--muted)] hover:bg-[var(--surface-2)]",
            ].join(" ")}
          >
            Hidden
          </button>
        </div>
      </header>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        {loading ? <p className="text-[var(--muted)]">Loading…</p> : null}
        {error ? <p className="mt-2 text-sm text-[var(--red)]">{error}</p> : null}

        {!loading && !error && items.length === 0 ? (
          <p className="text-[var(--muted)]">
            {hidden ? "No hidden messages." : "No messages yet."}
          </p>
        ) : null}

        <div className="mt-4 space-y-4">
          {items.map((m) => (
            <article
              key={m.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-[var(--text)]">{m.fullName}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {m.contactEmail} • {formatPhone10(m.contactNumber)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                    <p className="text-xs text-[var(--muted)]">
                        {new Date(m.createdAt).toLocaleString()}
                    </p>

                    {/* Actions */}
                    {!hidden ? (
                    <button
                        type="button"
                        onClick={() => onHide(m.id)}
                        className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
                    >
                        Hide
                    </button>
                    ) : (
                    <div className="flex items-center gap-2">
                        <button
                        type="button"
                        onClick={() => onUnhide(m.id)}
                        className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
                        >
                        Unhide
                        </button>

                        <button
                        type="button"
                        onClick={() => setDeleteId(m.id)}
                        className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
                        >
                        Delete
                        </button>
                    </div>
                    )}

                    </div>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-[var(--text)]">{m.reason}</p>
                </article>
            ))}
            </div>
      </section>

      <ConfirmModal
        open={deleteId != null}
        title="Delete this message?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onClose={() => (deleteLoading ? null : setDeleteId(null))}
        onConfirm={onConfirmDelete}
      />
    </main>
  );
}
