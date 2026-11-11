import { resolveSelection } from "@/lib/geography";
import type { ProgramQuery, ProgramSort } from "@/types/program";
import type {
  SortDirection,
  UniversityQuery,
  UniversitySort,
} from "@/types/university";

export const PAGE_SIZE = 12;
export const MAX_SEARCH_LENGTH = 100;
export const DEFAULT_CURRENCY = "EUR";
/** The currencies offered in the tuition filter. The API accepts any 3-letter ISO code. */
export const CURRENCIES = ["EUR", "USD", "GBP", "CAD", "CHF", "SEK"] as const;
export const LEVELS = [
  "bachelor",
  "master",
  "doctorate",
  "diploma",
  "certificate",
] as const;

export type DiscoveryView = "programs" | "universities";
export type Level = (typeof LEVELS)[number];

export interface DiscoveryParams {
  view: DiscoveryView;
  q: string;
  /** One-based page number as shown in the URL. */
  page: number;
  sort: string;
  direction: SortDirection;
  // program-only filters
  level: Level | null;
  field: string | null;
  language: string | null;
  tuitionMax: number | null;
  currency: string;
}

type Get = (name: string) => string | null;

const PROGRAM_SORTS: ProgramSort[] = ["name", "university", "level"];
const UNIVERSITY_SORTS: UniversitySort[] = ["name", "city"];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Turns untrusted URL parameters into valid ones. Anything invalid falls back to a default. */
export function resolveDiscovery(get: Get): DiscoveryParams {
  const view: DiscoveryView =
    get("view") === "universities" ? "universities" : "programs";
  const page = Number.parseInt(get("page") ?? "", 10);
  const allowed: readonly string[] =
    view === "programs" ? PROGRAM_SORTS : UNIVERSITY_SORTS;
  const sort = allowed.includes(get("sort") ?? "") ? get("sort")! : "name";
  const level = (get("level") ?? "").toLowerCase();
  const field = get("field") ?? "";
  const language = (get("language") ?? "").toLowerCase();
  const max = Number(get("tuitionMax"));
  const currency = (get("currency") ?? "").toUpperCase();
  return {
    view,
    q: (get("q") ?? "").trim().slice(0, MAX_SEARCH_LENGTH),
    page: Number.isSafeInteger(page) && page >= 1 ? page : 1,
    sort,
    direction: get("direction") === "desc" ? "desc" : "asc",
    level: (LEVELS as readonly string[]).includes(level)
      ? (level as Level)
      : null,
    field: SLUG.test(field) && field.length <= 120 ? field : null,
    language: /^[a-z]{2,3}$/.test(language) ? language : null,
    tuitionMax:
      Number.isFinite(max) && max > 0 && max <= 10_000_000 ? max : null,
    currency: /^[A-Z]{3}$/.test(currency) ? currency : DEFAULT_CURRENCY,
  };
}

/**
 * ISO country code the API should filter by, or null when the destination has no single country yet
 * (nothing selected = all; the EU without a member state = "pending", which fetches nothing).
 */
export function countryFilter(get: Get): string | null | "pending" {
  const { region, country } = resolveSelection(get("region"), get("country"));
  if (!region) return null;
  if (region.id === "eu") return country ? country.code : "pending";
  return region.id.toUpperCase();
}

export function toProgramsQuery(
  p: DiscoveryParams,
  country: string | null,
): ProgramQuery {
  return {
    q: p.q || undefined,
    field: p.field ?? undefined,
    level: p.level ?? undefined,
    country: country ?? undefined,
    language: p.language ?? undefined,
    tuitionMax: p.tuitionMax ?? undefined,
    tuitionCurrency: p.tuitionMax ? p.currency : undefined,
    page: p.page - 1,
    size: PAGE_SIZE,
    sort: p.sort as ProgramSort,
    direction: p.direction,
  };
}

export function toUniversitiesQuery(
  p: DiscoveryParams,
  country: string | null,
): UniversityQuery {
  return {
    q: p.q || undefined,
    country: country ?? undefined,
    page: p.page - 1,
    size: PAGE_SIZE,
    sort: p.sort as UniversitySort,
    direction: p.direction,
  };
}

/** Builds a `/universities` URL, omitting defaults so shared links stay short. */
export function discoveryHref(
  base: { region?: string | null; country?: string | null },
  p: Partial<DiscoveryParams>,
): string {
  const q = new URLSearchParams();
  if (base.region) q.set("region", base.region);
  if (base.country) q.set("country", base.country);
  if (p.view === "universities") q.set("view", "universities");
  if (p.q) q.set("q", p.q);
  if (p.view !== "universities") {
    if (p.level) q.set("level", p.level);
    if (p.field) q.set("field", p.field);
    if (p.language) q.set("language", p.language);
    if (p.tuitionMax) {
      q.set("tuitionMax", String(p.tuitionMax));
      q.set("currency", p.currency ?? DEFAULT_CURRENCY);
    }
  }
  if (p.sort && p.sort !== "name") q.set("sort", p.sort);
  if (p.direction && p.direction !== "asc") q.set("direction", p.direction);
  if (p.page && p.page > 1) q.set("page", String(p.page));
  const s = q.toString();
  return s ? `/universities?${s}` : "/universities";
}
