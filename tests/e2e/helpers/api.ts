import type { Page, Route } from "@playwright/test";

/** Must match `webServer.env.NEXT_PUBLIC_API_BASE_URL` in playwright.config.ts. */
export const API = "http://api.pathway.test";

/** Obviously synthetic records. They exist only in tests, never in the app. */
export interface FixtureUniversity {
  slug: string;
  name: string;
  city: string;
  countryCode: string;
  countryName: string;
  websiteUrl: string | null;
}

const make = (
  n: number,
  countryCode: string,
  countryName: string,
  city: string,
): FixtureUniversity => ({
  slug: `synthetic-${countryCode.toLowerCase()}-${n}`,
  name: `Synthetic Test University ${String(n).padStart(2, "0")}`,
  city,
  countryCode,
  countryName,
  websiteUrl: n % 2 ? `https://example.test/u/${n}` : null,
});

export const FIXTURES: FixtureUniversity[] = [
  ...Array.from({ length: 13 }, (_, i) =>
    make(i + 1, "DE", "Germany", "Testburg"),
  ),
  make(14, "PL", "Poland", "Testowo"),
  make(15, "JP", "Japan", "Testo City"),
];

export interface FakeApi {
  /** Query strings of every list request the page made. */
  requests: URLSearchParams[];
}

type Handler = (route: Route, url: URL) => Promise<void> | void;

const cors = { "access-control-allow-origin": "*" };

export const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: "application/json",
    headers: cors,
    body: JSON.stringify(body),
  });

/** Serves the synthetic fixtures with the real API's filter, sort and paging semantics. */
export function universityPage(url: URL, data = FIXTURES) {
  const q = url.searchParams;
  const term = (q.get("q") ?? "").toLowerCase();
  const country = q.get("country")?.toUpperCase();
  const sort = q.get("sort") === "city" ? "city" : "name";
  const dir = q.get("direction") === "desc" ? -1 : 1;
  const size = Number(q.get("size") ?? 20);
  const number = Number(q.get("page") ?? 0);
  const rows = data
    .filter((u) => u.name.toLowerCase().includes(term))
    .filter((u) => !country || u.countryCode === country)
    .sort((a, b) => a[sort].localeCompare(b[sort]) * dir);
  return {
    content: rows.slice(number * size, number * size + size),
    number,
    size,
    totalElements: rows.length,
    totalPages: Math.ceil(rows.length / size),
  };
}

/** Intercepts the university list endpoint. Pass `override` to simulate failures. */
export async function mockUniversities(
  page: Page,
  override?: Handler,
): Promise<FakeApi> {
  const api: FakeApi = { requests: [] };
  await page.route(`${API}/api/v1/universities*`, async (route) => {
    const url = new URL(route.request().url());
    api.requests.push(url.searchParams);
    if (override) return override(route, url);
    return json(route, universityPage(url));
  });
  return api;
}

export const apiError = (status: number, message: string) => ({
  timestamp: "2000-01-01T00:00:00Z",
  status,
  error: "Error",
  message,
  path: "/api/v1/universities",
});
