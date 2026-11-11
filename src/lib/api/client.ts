import type { ApiErrorBody } from "@/types/api";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const API_NOT_CONFIGURED = "The data service is not configured.";

/**
 * Backend origin, e.g. http://localhost:8080. It is public by design (the browser calls the
 * API directly), so it must never contain a secret. Unset means "not configured".
 */
export function apiBaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || null;
}

type Params = Record<string, string | number | readonly string[] | undefined>;

export function buildQuery(params: Params = {}): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (typeof value === "object") {
      if (value.length) q.set(key, value.join(","));
    } else {
      q.set(key, String(value));
    }
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

/**
 * Typed GET. Throws `ApiError` with status 0 when no backend is configured or it cannot be
 * reached, and with the HTTP status for non-2xx responses. Aborted requests rethrow the abort.
 */
export async function apiGet<T>(
  path: string,
  params?: Params,
  init?: RequestInit,
): Promise<T> {
  const base = apiBaseUrl();
  if (!base) throw new ApiError(0, API_NOT_CONFIGURED);

  let res: Response;
  try {
    res = await fetch(`${base}${path}${buildQuery(params)}`, init);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError(0, "The data service could not be reached.");
  }
  if (!res.ok) {
    const body = (await res
      .json()
      .catch(() => null)) as Partial<ApiErrorBody> | null;
    throw new ApiError(res.status, body?.message ?? res.statusText);
  }
  return (await res.json()) as T;
}
