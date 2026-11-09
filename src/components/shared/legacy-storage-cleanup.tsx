"use client";

import { useEffect } from "react";

/** Keys written by earlier prototypes. Only these are removed; nothing else is touched. */
const LEGACY_KEYS = ["pathway-ai:store"];

export function LegacyStorageCleanup() {
  useEffect(() => {
    try {
      for (const key of LEGACY_KEYS) window.localStorage.removeItem(key);
    } catch {
      /* storage unavailable: nothing to clean */
    }
  }, []);
  return null;
}
