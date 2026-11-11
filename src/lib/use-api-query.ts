"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";

export type QueryState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError };

type Settled<T> = {
  key: string;
  result: { status: "success"; data: T } | { status: "error"; error: ApiError };
};

/**
 * Fetches one resource. `key === null` means "do not fetch". The state is derived from the request key, so a
 * stale response is never shown for a newer request, and `retry` re-runs the same request.
 * `isValid` rejects a 200 whose body does not have the expected shape (it becomes an error, not an empty list).
 */
export function useApiQuery<T>(
  key: string | null,
  fetcher: (signal: AbortSignal) => Promise<T>,
  isValid: (data: T) => boolean = () => true,
): { state: QueryState<T> | null; retry: () => void } {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const requestKey = key === null ? null : `${attempt}:${key}`;

  useEffect(() => {
    if (requestKey === null) return;
    const controller = new AbortController();
    fetcher(controller.signal)
      .then((data) => {
        if (!isValid(data)) throw new ApiError(0, "Unexpected response shape.");
        setSettled({ key: requestKey, result: { status: "success", data } });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setSettled({
          key: requestKey,
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
    // `requestKey` encodes the request; the fetcher and validator are recreated each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  if (requestKey === null) return { state: null, retry };
  if (settled?.key === requestKey) return { state: settled.result, retry };
  return { state: { status: "loading" }, retry };
}
