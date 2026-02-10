import { useEffect, useMemo, useState } from "react";
import type { Project } from "../api/projectsApi";
import { adminCreateProject, adminDeleteProject, adminListProjects, adminUpdateProject } from "../api/adminProjectsApi";
import { slugify } from "../utils/slugify";
import ConfirmModal from "../components/ui/ConfirmModal";
import { clearAdminCreds } from "../admin/adminAuth";

type FormState = {
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  githubUrl: string;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  description: "",
  imageUrl: "",
  liveUrl: "",
  githubUrl: "",
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!slugTouched) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugTouched]);

  const isEditing = !!selected?.id;

  const canSubmit = useMemo(() => {
    return form.title.trim() && form.slug.trim() && form.description.trim();
  }, [form]);

  async function load() {
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const data = await adminListProjects();
      setProjects(data);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  function selectProject(p: Project) {
    setSelected(p);
    setSlugTouched(true); // keep slug as-is when editing
    setForm({
      title: p.title ?? "",
      slug: p.slug ?? "",
      description: p.description ?? "",
      imageUrl: p.imageUrl ?? "",
      liveUrl: p.liveUrl ?? "",
      githubUrl: p.githubUrl ?? "",
    });
    setErr(null);
    setMsg(null);
  }

  function startCreate() {
    setSelected(null);
    setSlugTouched(false);
    setForm(emptyForm);
    setErr(null);
    setMsg(null);
  }

  async function submit() {
    setErr(null);
    setMsg(null);

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim() || null,
        liveUrl: form.liveUrl.trim() || null,
        githubUrl: form.githubUrl.trim() || null,
      };

      if (isEditing && selected) {
        await adminUpdateProject(selected.id, payload);
        setMsg("Project updated.");
      } else {
        await adminCreateProject(payload);
        setMsg("Project created.");
        startCreate();
      }

      await load();
    } catch (e: any) {
      if (e?.status === 409) setErr(e.message || "Slug already exists. Use a unique slug.");
      else if (e?.status === 401 || e?.status === 403) setErr("Not authorized. Please log in again.");
      else setErr(e?.message ?? "Save failed.");
    }
  }

  function askDelete(p: Project) {
    setPendingDelete(p);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setConfirmOpen(false);

    try {
      await adminDeleteProject(pendingDelete.id);
      setMsg("Project deleted.");
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
          <p className="mt-1 text-[var(--muted)]">Manage your portfolio projects.</p>
        </div>

        <button
          onClick={() => {
            clearAdminCreds();
            window.location.reload();
          }}
          className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
        >
          Logout
        </button>
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
            <h2 className="text-lg font-semibold text-[var(--text)]">Projects</h2>
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
            ) : projects.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No projects yet.</p>
            ) : (
              projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProject(p)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    selected?.id === p.id
                      ? "border-[var(--red)] bg-[var(--surface-2)]"
                      : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--red)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--text)]">{p.title}</p>
                      <p className="truncate text-xs text-[var(--muted)]">/{p.slug}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        askDelete(p);
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
              {isEditing ? "Update Project" : "Create Project"}
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
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Title"
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.slug}
                onChange={(e) => {
                  setForm((f) => ({ ...f, slug: e.target.value }));
                  setSlugTouched(true);
                }}
                placeholder="Slug (unique)"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
              />
              <button
                type="button"
                onClick={() => {
                  setForm((f) => ({ ...f, slug: slugify(f.title) }));
                  setSlugTouched(false);
                }}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
              >
                Regenerate slug
              </button>
            </div>

            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description"
              rows={4}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
            />

            <input
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="Image URL"
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.liveUrl}
                onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                placeholder="Live URL"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
              />
              <input
                value={form.githubUrl}
                onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                placeholder="GitHub URL"
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
              />
            </div>

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
        title="Delete project?"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.title}"? This cannot be undone.`
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
