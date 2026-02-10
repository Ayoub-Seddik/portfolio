import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "../components/ui/ConfirmModal";
import type { Experience } from "../api/adminExperienceApi";
import {
  adminCreateExperience,
  adminDeleteExperience,
  adminListExperience,
  adminUpdateExperience,
} from "../api/adminExperienceApi";

type FormState = {
  company: string;
  position: string;
  startYear: string;
  endYear: string;
  isPresent: boolean;
  summary: string;
  sortOrder: string;
};

const emptyForm: FormState = {
  company: "",
  position: "",
  startYear: "2025",
  endYear: "",
  isPresent: false,
  summary: "",
  sortOrder: "1",
};

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--red)] ${
        props.className ?? ""
      }`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`mt-1 min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--red)] ${
        props.className ?? ""
      }`}
    />
  );
}

export default function AdminExperience() {
  const [items, setItems] = useState<Experience[]>([]);
  const [selected, setSelected] = useState<Experience | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Experience | null>(null);

  const isEditing = !!selected?.id;

  const canSubmit = useMemo(() => {
    return (
      form.company.trim() &&
      form.position.trim() &&
      form.startYear.trim() &&
      form.sortOrder.trim()
    );
  }, [form]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const data = await adminListExperience();
      setItems(data);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load experience");
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setSelected(null);
    setForm(emptyForm);
    setErr(null);
    setMsg(null);
  }

  function selectItem(x: Experience) {
    setSelected(x);
    setForm({
      company: x.company ?? "",
      position: x.position ?? "",
      startYear: (x.startYear ?? "").toString(),
      endYear: x.endYear == null ? "" : x.endYear.toString(),
      isPresent: !!x.isPresent,
      summary: x.summary ?? "",
      sortOrder: (x.sortOrder ?? 1).toString(),
    });
    setErr(null);
    setMsg(null);
  }

  async function submit() {
    setErr(null);
    setMsg(null);

    const startYear = Number(form.startYear);
    const sortOrder = Number(form.sortOrder);

    if (Number.isNaN(startYear) || startYear < 1900 || startYear > 2100) {
      setErr("Start year must be a valid year.");
      return;
    }
    if (Number.isNaN(sortOrder) || sortOrder < 1) {
      setErr("Sort order must be a number (1, 2, 3...).");
      return;
    }

    const endYear = form.isPresent ? null : form.endYear.trim() ? Number(form.endYear) : null;
    if (!form.isPresent && form.endYear.trim()) {
      if (Number.isNaN(endYear as any) || (endYear as number) < 1900 || (endYear as number) > 2100) {
        setErr("End year must be a valid year.");
        return;
      }
    }

    const payload = {
      company: form.company.trim(),
      position: form.position.trim(),
      startYear,
      endYear,
      isPresent: form.isPresent,
      summary: form.summary.trim(),
      sortOrder,
    };

    try {
      if (isEditing && selected) {
        await adminUpdateExperience(selected.id, payload);
        setMsg("Experience updated.");
      } else {
        await adminCreateExperience(payload);
        setMsg("Experience created.");
        startCreate();
      }
      await load();
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403) setErr("Not authorized. Please log in again.");
      else setErr(e?.message ?? "Save failed.");
    }
  }

  function askDelete(x: Experience) {
    setPendingDelete(x);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setConfirmOpen(false);

    try {
      await adminDeleteExperience(pendingDelete.id);
      setMsg("Experience deleted.");
      if (selected?.id === pendingDelete.id) startCreate();
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Delete failed.");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Admin</h1>
          <p className="mt-1 text-[var(--muted)]">Manage your experience timeline.</p>
        </div>
      </div>

      {err && (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}
      {msg && (
        <div className="mt-6 rounded-xl border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {msg}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left list */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[var(--text)]">Experience</h2>
            <button
              onClick={startCreate}
              className="rounded-xl bg-[var(--red)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)]"
            >
              New
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {loading ? (
              <p className="text-sm text-[var(--muted)]">Loading…</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No experience yet.</p>
            ) : (
              items
                .slice()
                .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                .map((x) => (
                  <button
                    key={x.id}
                    onClick={() => selectItem(x)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                      selected?.id === x.id
                        ? "border-[var(--red)] bg-[var(--surface-2)]"
                        : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--red)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--text)]">
                          {x.position}
                        </p>
                        <p className="truncate text-xs text-[var(--muted)]">{x.company}</p>
                        <p className="truncate text-xs text-[var(--muted)]">
                          {x.startYear} — {x.isPresent ? "Present" : x.endYear ?? ""}
                          {" · "}order {x.sortOrder}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          askDelete(x);
                        }}
                        className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
                      >
                        Delete
                      </button>
                    </div>
                  </button>
                ))
            )}
          </div>
        </section>

        {/* Right form */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              {isEditing ? "Update Experience" : "Create Experience"}
            </h2>

            {isEditing && (
              <button
                onClick={startCreate}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-4 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[var(--muted)]">Company</label>
                <Input
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  placeholder="Rogers Communications"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--muted)]">Position</label>
                <Input
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                  placeholder="Customer Service Representative"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-[var(--muted)]">Start year</label>
                <Input
                  inputMode="numeric"
                  value={form.startYear}
                  onChange={(e) => setForm((f) => ({ ...f, startYear: e.target.value }))}
                  placeholder="2019"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--muted)]">End year</label>
                <Input
                  inputMode="numeric"
                  value={form.endYear}
                  onChange={(e) => setForm((f) => ({ ...f, endYear: e.target.value }))}
                  placeholder="2026"
                  disabled={form.isPresent}
                />
              </div>

              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <input
                    type="checkbox"
                    checked={form.isPresent}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        isPresent: e.target.checked,
                        endYear: e.target.checked ? "" : f.endYear,
                      }))
                    }
                    className="h-4 w-4"
                  />
                  Present
                </label>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[var(--muted)]">Sort order</label>
                <Input
                  inputMode="numeric"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                  placeholder="1"
                />
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Lower numbers appear first (top of timeline).
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--muted)]">Summary</label>
              <Textarea
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                placeholder="Write what you did. Use multiple sentences."
              />
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={!canSubmit}
              className="mt-1 rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-[var(--red-dark)]"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </section>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete experience?"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.position}" at ${pendingDelete.company}? This cannot be undone.`
            : "Are you sure?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </main>
  );
}
