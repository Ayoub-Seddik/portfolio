import { useEffect, useMemo, useState } from "react";
import type { Education, EducationStatus } from "../api/educationApi";
import {
  adminCreateEducation,
  adminDeleteEducation,
  adminListEducation,
  adminUpdateEducation,
} from "../api/adminEducationApi";
import ConfirmModal from "../components/ui/ConfirmModal";

type FormState = {
  level: string;
  school: string;
  program: string;
  status: EducationStatus;
  completedYear: string; // keep as string for input
  sortOrder: string;
};

const emptyForm: FormState = {
  level: "",
  school: "",
  program: "",
  status: "IN_PROGRESS",
  completedYear: "",
  sortOrder: "1",
};

export default function AdminEducation() {
  const [items, setItems] = useState<Education[]>([]);
  const [selected, setSelected] = useState<Education | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Education | null>(null);

  const isEditing = !!selected?.id;

  const canSubmit = useMemo(() => {
    return (
      form.level.trim() &&
      form.school.trim() &&
      form.program.trim() &&
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
      const data = await adminListEducation();
      setItems(data);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load education");
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

  function selectItem(ed: Education) {
    setSelected(ed);
    setForm({
      level: ed.level ?? "",
      school: ed.school ?? "",
      program: ed.program ?? "",
      status: ed.status ?? "IN_PROGRESS",
      completedYear: ed.completedYear?.toString() ?? "",
      sortOrder: (ed.sortOrder ?? 1).toString(),
    });
    setErr(null);
    setMsg(null);
  }

  async function submit() {
    setErr(null);
    setMsg(null);

    const payload = {
      level: form.level.trim(),
      school: form.school.trim(),
      program: form.program.trim(),
      status: form.status,
      completedYear: form.completedYear.trim()
        ? Number(form.completedYear.trim())
        : null,
      sortOrder: Number(form.sortOrder.trim() || "1"),
    };

    // if IN_PROGRESS, ignore completedYear if you want
    if (payload.status === "IN_PROGRESS") {
      // you can keep an expected year here if you want;
      // if you prefer null for in-progress, uncomment next line:
      // payload.completedYear = null;
    }

    try {
      if (isEditing && selected) {
        await adminUpdateEducation(selected.id, payload);
        setMsg("Education updated.");
      } else {
        await adminCreateEducation(payload);
        setMsg("Education created.");
        startCreate();
      }
      await load();
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403) setErr("Not authorized. Please log in again.");
      else setErr(e?.message ?? "Save failed.");
    }
  }

  function askDelete(ed: Education) {
    setPendingDelete(ed);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setConfirmOpen(false);

    try {
      await adminDeleteEducation(pendingDelete.id);
      setMsg("Education deleted.");
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
          <p className="mt-1 text-[var(--muted)]">Manage your education.</p>
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
        {/* Left: list */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[var(--text)]">Education</h2>
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
              <p className="text-sm text-[var(--muted)]">No education entries yet.</p>
            ) : (
              items
                .slice()
                .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                .map((ed) => (
                  <button
                    key={ed.id}
                    onClick={() => selectItem(ed)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                      selected?.id === ed.id
                        ? "border-[var(--red)] bg-[var(--surface-2)]"
                        : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--red)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--text)]">
                          {ed.program}
                        </p>
                        <p className="truncate text-xs text-[var(--muted)]">
                          {ed.school} • {ed.level}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          askDelete(ed);
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

        {/* Right: form */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              {isEditing ? "Update Education" : "Create Education"}
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

          <div className="mt-4 grid gap-3">
            <input
              value={form.level}
              onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
              placeholder="Level (e.g., College)"
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
            />

            <input
              value={form.school}
              onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))}
              placeholder="School"
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
            />

            <input
              value={form.program}
              onChange={(e) => setForm((f) => ({ ...f, program: e.target.value }))}
              placeholder="Program"
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as EducationStatus }))
                }
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
              >
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <input
                value={form.completedYear}
                onChange={(e) => setForm((f) => ({ ...f, completedYear: e.target.value }))}
                placeholder={form.status === "COMPLETED" ? "Completed year (e.g., 2026)" : "Expected year (optional)"}
                inputMode="numeric"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
              />
            </div>

            <input
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              placeholder="Sort order (1, 2, 3...)"
              inputMode="numeric"
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
            />

            <button
              type="button"
              onClick={submit}
              disabled={!canSubmit}
              className="mt-2 rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-[var(--red-dark)]"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </section>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete education entry?"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.program}"? This cannot be undone.`
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
