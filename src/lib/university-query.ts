import { resolveSelection } from "@/lib/geography";
import type {
  SortDirection,
  UniversityQuery,
  UniversitySort,
} from "@/types/university";

export const PAGE_SIZE = 12;
export const MAX_SEARCH_LENGTH = 100;

export interface UniversityView {
  q: string;
  /** One-based page number as shown in the URL. */
  page: number;
  sort: UniversitySort;
  direction: SortDirection;
}

type Get = (name: string) => string | null;

/** Turns untrusted URL parameters into a valid view. Anything invalid falls back to defaults. */
export function resolveView(get: Get): UniversityView {
  const page = Number.parseInt(get("page") ?? "", 10);
  return {
    q: (get("q") ?? "").trim().slice(0, MAX_SEARCH_LENGTH),
    page: Number.isSafeInteger(page) && page >= 1 ? page : 1,
    sort: get("sort") === "city" ? "city" : "name",
    direction: get("direction") === "desc" ? "desc" : "asc",
  };
}

/**
 * ISO country code the API should filter by, or null when the destination has no single
 * country yet (nothing selected = all universities; the EU without a member state = none).
 */
export function countryFilter(get: Get): string | null | "pending" {
  const { region, country } = resolveSelection(get("region"), get("country"));
  if (!region) return null;
  if (region.id === "eu") return country ? country.code : "pending";
  return region.id.toUpperCase();
}

export function toApiQuery(
  view: UniversityView,
  country: string | null,
): UniversityQuery {
  return {
    q: view.q || undefined,
    country: country ?? undefined,
    page: view.page - 1,
    size: PAGE_SIZE,
    sort: view.sort,
    direction: view.direction,
  };
}

/** Builds a `/universities` URL, omitting defaults so shared links stay short. */
export function universitiesHref(
  base: { region?: string | null; country?: string | null },
  view: Partial<UniversityView>,
): string {
  const q = new URLSearchParams();
  if (base.region) q.set("region", base.region);
  if (base.country) q.set("country", base.country);
  if (view.q) q.set("q", view.q);
  if (view.sort && view.sort !== "name") q.set("sort", view.sort);
  if (view.direction && view.direction !== "asc")
    q.set("direction", view.direction);
  if (view.page && view.page > 1) q.set("page", String(view.page));
  const s = q.toString();
  return s ? `/universities?${s}` : "/universities";
}
