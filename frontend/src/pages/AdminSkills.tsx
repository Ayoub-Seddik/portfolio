import { useEffect, useMemo, useState } from "react";
import type { Skill } from "../api/skillsApi";
import {
  adminCreateSkill,
  adminDeleteSkill,
  adminListSkills,
  adminUpdateSkill,
} from "../api/adminSkillsApi";
import ConfirmModal from "../components/ui/ConfirmModal";

type FormState = {
  category: string;
  name: string;
  sortOrder: string; // input string
};

const emptyForm: FormState = {
  category: "FrontEnd",
  name: "",
  sortOrder: "1",
};

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selected, setSelected] = useState<Skill | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Skill | null>(null);

  const isEditing = !!selected?.id;

  const canSubmit = useMemo(() => {
    return form.category.trim() && form.name.trim() && form.sortOrder.trim();
  }, [form]);

  // common categories (you can add more)
  const CATEGORIES = ["FrontEnd", "BackEnd", "Design", "Other"] as const;

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const data = await adminListSkills();
      setSkills(data);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load skills");
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

  function selectSkill(s: Skill) {
    setSelected(s);
    setForm({
      category: s.category ?? "Other",
      name: s.name ?? "",
      sortOrder: (s.sortOrder ?? 1).toString(),
    });
    setErr(null);
    setMsg(null);
  }

  async function submit() {
    setErr(null);
    setMsg(null);

    const payload = {
      category: form.category.trim(),
      name: form.name.trim(),
      sortOrder: Number(form.sortOrder.trim() || "1"),
    };

    try {
      if (isEditing && selected) {
        await adminUpdateSkill(selected.id, payload);
        setMsg("Skill updated.");
      } else {
        await adminCreateSkill(payload);
        setMsg("Skill created.");
        startCreate();
      }
      await load();
    } catch (e: any) {
      if (e?.status === 401 || e?.status === 403) setErr("Not authorized. Please log in again.");
      else setErr(e?.message ?? "Save failed.");
    }
  }

  function askDelete(s: Skill) {
    setPendingDelete(s);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setConfirmOpen(false);

    try {
      await adminDeleteSkill(pendingDelete.id);
      setMsg("Skill deleted.");
      if (selected?.id === pendingDelete.id) startCreate();
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Delete failed.");
    } finally {
      setPendingDelete(null);
    }
  }

  const grouped = useMemo(() => {
    const map: Record<string, Skill[]> = {};
    for (const s of skills) {
      const cat = (s.category || "Other").trim();
      (map[cat] ||= []).push(s);
    }
    for (const cat of Object.keys(map)) {
      map[cat].sort(
        (a, b) =>
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
          (a.name ?? "").localeCompare(b.name ?? "")
      );
    }
    return map;
  }, [skills]);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Admin</h1>
          <p className="mt-1 text-[var(--muted)]">Manage your skills.</p>
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
            <h2 className="text-lg font-semibold text-[var(--text)]">Skills</h2>
            <button
              onClick={startCreate}
              className="rounded-xl bg-[var(--red)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)]"
            >
              New
            </button>
          </div>

          <div className="mt-3 space-y-4">
            {loading ? (
              <p className="text-sm text-[var(--muted)]">Loading…</p>
            ) : skills.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No skills yet.</p>
            ) : (
              Object.entries(grouped)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([cat, items]) => (
                  <div key={cat}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                      {cat}
                    </p>

                    <div className="space-y-2">
                      {items.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => selectSkill(s)}
                          className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                            selected?.id === s.id
                              ? "border-[var(--red)] bg-[var(--surface-2)]"
                              : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--red)]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[var(--text)]">
                                {s.name}
                              </p>
                              <p className="truncate text-xs text-[var(--muted)]">
                                order: {s.sortOrder}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                askDelete(s);
                              }}
                              className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
                            >
                              Delete
                            </button>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>

        {/* Right: form */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              {isEditing ? "Update Skill" : "Create Skill"}
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
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                placeholder="Sort order (1, 2, 3...)"
                inputMode="numeric"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
              />
            </div>

            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Skill name (e.g., React)"
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
        title="Delete skill?"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.name}" from ${pendingDelete.category}? This cannot be undone.`
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
