import { useSyncExternalStore } from "react";
import { isAdminLoggedIn } from "./adminAuth";

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

export function useAdminAuth() {
  return useSyncExternalStore(subscribe, isAdminLoggedIn);
}
