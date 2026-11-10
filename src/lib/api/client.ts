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

/** Backend origin, e.g. https://api.example.com. Unset until the backend exists. */
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

/** Typed GET. Throws `ApiError` for non-2xx responses or when no backend is configured. */
export async function apiGet<T>(
  path: string,
  params?: Params,
  init?: RequestInit,
): Promise<T> {
  const base = apiBaseUrl();
  if (!base) throw new ApiError(0, "The data service is not configured.");

  const res = await fetch(`${base}${path}${buildQuery(params)}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(res.status, body?.message ?? res.statusText);
  }
  return (await res.json()) as T;
}
