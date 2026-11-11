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
  // The default view is program-first, so every page that mocks universities also gets programs.
  await mockPrograms(page, undefined, api);
  await mockUniversityDetail(page);
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

// ---------------------------------------------------------------------------------------------
// Programs: obviously synthetic, with the real API's filter, sort and paging semantics.
// ---------------------------------------------------------------------------------------------

export interface FixtureProgram {
  n: number;
  identifier: string;
  name: string;
  degreeLevel: "BACHELOR" | "MASTER";
  field: { slug: string; name: string };
  languages: string[];
  university: FixtureUniversity;
  tuitionEur: number | null;
}

const ENGINEERING = {
  slug: "synthetic-engineering",
  name: "Synthetic Engineering",
};
const ARTS = { slug: "synthetic-arts", name: "Synthetic Arts" };

export const PROGRAMS: FixtureProgram[] = Array.from({ length: 14 }, (_, i) => {
  const n = i + 1;
  const university = n === 14 ? FIXTURES[13] : FIXTURES[(n - 1) % 13];
  return {
    n,
    identifier: `${university.slug}--program-${String(n).padStart(2, "0")}`,
    name: `Synthetic Program ${String(n).padStart(2, "0")}`,
    degreeLevel: n % 2 ? "BACHELOR" : "MASTER",
    field: n % 2 || n === 14 ? ENGINEERING : ARTS,
    languages: n === 14 ? ["pl"] : n % 2 ? ["en"] : ["en", "de"],
    university,
    // program 13 has no published tuition at all
    tuitionEur: n === 13 ? null : n * 1000,
  };
});

const source = (path: string) => ({
  url: `https://example.test/${path}`,
  title: `Synthetic source ${path}`,
  publisher: "Synthetic University",
  type: "UNIVERSITY_WEBSITE",
  retrievedOn: "2026-01-02",
});

const listItem = (p: FixtureProgram) => ({
  identifier: p.identifier,
  slug: p.identifier.split("--")[1],
  name: p.name,
  degreeLevel: p.degreeLevel,
  field: p.field,
  studyMode: p.n === 1 ? "FULL_TIME" : null,
  durationMonths: p.degreeLevel === "BACHELOR" ? 36 : p.n === 2 ? null : 24,
  teachingLanguages: p.languages,
  campusCity: null,
  university: {
    slug: p.university.slug,
    name: p.university.name,
    city: p.university.city,
    countryCode: p.university.countryCode,
    countryName: p.university.countryName,
  },
  officialProgramUrl: `https://example.test/programs/${p.n}`,
  officialAdmissionsUrl: `https://example.test/admissions/${p.n}`,
  // only program 2 has a verified, active apply link
  officialApplicationUrl: p.n === 2 ? "https://example.test/apply/2" : null,
  verification: { status: "VERIFIED", verifiedOn: "2026-01-02" },
});

export function programPage(url: URL, data = PROGRAMS) {
  const q = url.searchParams;
  const term = (q.get("q") ?? "").toLowerCase();
  const level = q.get("level")?.toUpperCase();
  const field = q.get("field");
  const language = q.get("language");
  const country = q.get("country")?.toUpperCase();
  const max = q.has("tuitionMax") ? Number(q.get("tuitionMax")) : null;
  const sort = q.get("sort") ?? "name";
  const dir = q.get("direction") === "desc" ? -1 : 1;
  const size = Number(q.get("size") ?? 20);
  const number = Number(q.get("page") ?? 0);
  const key = (p: FixtureProgram) =>
    sort === "university"
      ? p.university.name
      : sort === "level"
        ? p.degreeLevel
        : p.name;
  const rows = data
    .filter((p) => p.name.toLowerCase().includes(term))
    .filter((p) => !level || p.degreeLevel === level)
    .filter((p) => !field || p.field.slug === field)
    .filter((p) => !language || p.languages.includes(language))
    .filter((p) => !country || p.university.countryCode === country)
    .filter(
      (p) => max === null || (p.tuitionEur !== null && p.tuitionEur <= max),
    )
    .sort(
      (a, b) =>
        key(a).localeCompare(key(b)) * dir || a.name.localeCompare(b.name),
    );
  return {
    content: rows.slice(number * size, number * size + size).map(listItem),
    number,
    size,
    totalElements: rows.length,
    totalPages: Math.ceil(rows.length / size),
  };
}

/** Detail with a CURRENT fee, an OUTDATED one and (program 1 only) a fee whose period is not stated. */
export function programDetail(p: FixtureProgram) {
  const tuition = [
    ...(p.tuitionEur === null
      ? []
      : [
          {
            academicYear: "2099/2100",
            effectiveFrom: null,
            effectiveTo: null,
            scopeNote: null,
            studentCategory: "INTERNATIONAL",
            amount: p.tuitionEur,
            currency: "EUR",
            billingPeriod: "PER_YEAR",
            temporalStatus: "CURRENT",
            source: source(`tuition/${p.n}`),
          },
          {
            academicYear: "2000/2001",
            effectiveFrom: null,
            effectiveTo: null,
            scopeNote: null,
            studentCategory: "INTERNATIONAL",
            amount: p.tuitionEur - 500,
            currency: "EUR",
            billingPeriod: "PER_YEAR",
            temporalStatus: "HISTORICAL",
            source: source(`tuition-old/${p.n}`),
          },
        ]),
    ...(p.n === 1
      ? [
          {
            academicYear: null,
            effectiveFrom: null,
            effectiveTo: null,
            scopeNote: "Synthetic: fee as printed, no year stated",
            studentCategory: "DOMESTIC",
            amount: 250,
            currency: "EUR",
            billingPeriod: "PER_SEMESTER",
            temporalStatus: "UNKNOWN_YEAR",
            source: source("tuition-unknown/1"),
          },
        ]
      : []),
  ];
  return {
    ...listItem(p),
    sources: [source(`programs/${p.n}`)],
    intakes: [
      {
        label: "Autumn 2099 admission",
        academicYear: null,
        startDate: null,
        applicationDeadline: "2099-01-15",
        applicantCategory: null,
        temporalStatus: "CURRENT",
        source: source(`admissions/${p.n}`),
      },
      {
        label: "Autumn 2000 admission",
        academicYear: null,
        startDate: null,
        applicationDeadline: "2000-01-15",
        applicantCategory: null,
        temporalStatus: "HISTORICAL",
        source: source(`admissions-old/${p.n}`),
      },
    ],
    tuition,
    // program 1 has none at all, so the "nothing recorded" wording is exercised
    requirements:
      p.n === 1
        ? []
        : [
            {
              applicationCycle: "2099",
              type: "LANGUAGE_TEST",
              description: "Synthetic language requirement",
              minimumValue: 6.5,
              valueUnit: "IELTS overall",
              temporalStatus: "CURRENT",
              source: source(`req/${p.n}`),
            },
            {
              applicationCycle: "2099",
              type: "ENTRANCE_EXAM",
              description:
                "Synthetic entrance test for applicants without a local diploma",
              minimumValue: null,
              valueUnit: null,
              temporalStatus: "CURRENT",
              source: source(`req2/${p.n}`),
            },
          ],
  };
}

/** Intercepts the program list and detail endpoints. Pass `override` to simulate failures. */
export async function mockPrograms(
  page: Page,
  override?: Handler,
  into?: FakeApi,
): Promise<FakeApi> {
  const api: FakeApi = into ?? { requests: [] };
  await page.route(`${API}/api/v1/programs*`, async (route) => {
    const url = new URL(route.request().url());
    api.requests.push(url.searchParams);
    if (override) return override(route, url);
    return json(route, programPage(url));
  });
  await page.route(`${API}/api/v1/programs/*`, async (route) => {
    const url = new URL(route.request().url());
    if (override) return override(route, url);
    const id = decodeURIComponent(url.pathname.split("/").pop() ?? "");
    const p = PROGRAMS.find((x) => x.identifier === id);
    return p
      ? json(route, programDetail(p))
      : json(route, apiError(404, `Program not found: ${id}`), 404);
  });
  return api;
}

/** University detail with its programs, as the API embeds them. */
export async function mockUniversityDetail(page: Page) {
  await page.route(`${API}/api/v1/universities/*`, async (route) => {
    const url = new URL(route.request().url());
    const slug = decodeURIComponent(url.pathname.split("/").pop() ?? "");
    const u = FIXTURES.find((x) => x.slug === slug);
    if (!u)
      return json(route, apiError(404, `University not found: ${slug}`), 404);
    return json(route, {
      ...u,
      description: null,
      programs: PROGRAMS.filter((p) => p.university.slug === slug).map((p) => ({
        identifier: p.identifier,
        slug: p.identifier.split("--")[1],
        name: p.name,
        degreeLevel: p.degreeLevel,
        fieldOfStudy: p.field.name,
        durationMonths: 36,
        teachingLanguage: "English",
      })),
    });
  });
}
