import { useState } from "react";
import { setAdminCreds } from "./adminAuth";

type Props = { onSuccess: () => void };

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function AdminLogin({ onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!username.trim() || !password.trim()) {
      setErr("Enter admin username and password.");
      return;
    }

    setLoading(true);

    try {
      // 1) Temporarily build a Basic Auth header to test credentials
      const token = btoa(`${username.trim()}:${password}`);

      const res = await fetch(`${BASE_URL}/api/admin/auth-check`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        setErr("Invalid admin credentials.");
        return;
      }

      if (!res.ok) {
        setErr("Login failed. Try again.");
        return;
      }

      // 2) Only store creds after verification succeeds
      setAdminCreds({ username: username.trim(), password });
      onSuccess();
    } catch {
      setErr("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--text)]">Admin Login</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Sign in to manage your portfolio content.
        </p>

        {err && (
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="mt-5 grid gap-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--red)]"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
