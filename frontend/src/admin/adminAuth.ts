const KEY = "admin_basic_auth_v1";

export type AdminCreds = { username: string; password: string };

export function getAdminCreds(): AdminCreds | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.username || !parsed?.password) return null;
    return parsed as AdminCreds;
  } catch {
    return null;
  }
}

export function setAdminCreds(creds: AdminCreds) {
  sessionStorage.setItem(KEY, JSON.stringify(creds));
}

export function clearAdminCreds() {
  sessionStorage.removeItem(KEY);
}

export function isAdminLoggedIn(): boolean {
  return getAdminCreds() !== null;
}

export function logoutAdmin() {
  clearAdminCreds();
}
