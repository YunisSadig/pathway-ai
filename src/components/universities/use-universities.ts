"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { listUniversities } from "@/lib/api/universities";
import type { Page } from "@/types/api";
import type { UniversityQuery, UniversitySummary } from "@/types/university";

export type UniversitiesState =
  | { status: "loading" }
  | { status: "success"; page: Page<UniversitySummary> }
  | { status: "error"; error: ApiError };

type Settled = {
  key: string;
  result:
    | { status: "success"; page: Page<UniversitySummary> }
    | { status: "error"; error: ApiError };
};

/**
 * Fetches one page of universities. `query === null` means "do not fetch". The state is
 * derived from the request key, so a stale response can never be shown for a newer query.
 */
export function useUniversities(query: UniversityQuery | null): {
  state: UniversitiesState | null;
  retry: () => void;
} {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled | null>(null);
  const key = query ? `${attempt}:${JSON.stringify(query)}` : null;

  useEffect(() => {
    if (!query || !key) return;
    const controller = new AbortController();
    listUniversities(query, { signal: controller.signal })
      .then((page) => {
        if (!Array.isArray(page?.content)) {
          throw new ApiError(0, "Unexpected response shape.");
        }
        setSettled({ key, result: { status: "success", page } });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setSettled({
          key,
          result: {
            status: "error",
            error:
              error instanceof ApiError
                ? error
                : new ApiError(
                    0,
                    "The data service returned an unexpected response.",
                  ),
          },
        });
      });
    return () => controller.abort();
    // `key` encodes `query`; depending on it avoids refetching on identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  if (!key) return { state: null, retry };
  if (settled?.key === key) return { state: settled.result, retry };
  return { state: { status: "loading" }, retry };
}
