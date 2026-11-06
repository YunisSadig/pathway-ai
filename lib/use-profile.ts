"use client";
import { useMemo, useSyncExternalStore } from "react";
import { decodeState, initialState, type SavedState } from "@/lib/profile";
export const storageKey = "pathway-profile-v1";
let cached = initialState;
let previousRaw: string | null | undefined;
const listeners = new Set<() => void>();
function snapshot() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw !== previousRaw) {
      previousRaw = raw;
      cached = decodeState(raw);
    }
  } catch {
    /* In-memory state remains usable when storage is blocked. */
  }
  return cached;
}
function subscribe(callback: () => void) {
  listeners.add(callback);
  const changed = (e: StorageEvent) => {
    if (e.key === storageKey || e.key === null) callback();
  };
  window.addEventListener("storage", changed);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", changed);
  };
}
export function updateProfile(
  update: Partial<SavedState> | ((current: SavedState) => SavedState),
) {
  const current = snapshot();
  cached =
    typeof update === "function" ? update(current) : { ...current, ...update };
  let persisted = true;
  try {
    const raw = JSON.stringify({ version: 1, ...cached });
    localStorage.setItem(storageKey, raw);
    previousRaw = raw;
  } catch {
    persisted = false;
  }
  listeners.forEach((fn) => fn());
  return persisted;
}
export function useProfile({ draft = false }: { draft?: boolean } = {}) {
  const state = useSyncExternalStore(subscribe, snapshot, () => initialState);
  const safeState = useMemo(
    () => decodeState(JSON.stringify({ version: 1, ...state })),
    [state],
  );
  return { state: draft ? state : safeState, update: updateProfile };
}
