import type { Region, University } from "@/lib/domain/types";
import generated from "./universities.generated.json";

interface Generated {
  name: string;
  slug: string;
  country: string;
  region: string;
  city: string;
  website: string;
  finalUrl: string | null;
  checkedOn: string;
  description: string | null;
}

/** Keep the site's own wording only when it is readable, English prose. */
function readableEnglish(text: string | null): string | null {
  if (!text || text.length < 60) return null;
  if (/[^\u0000-ɏ‘-”–—…]/.test(text)) return null;
  const hits = text.toLowerCase().match(/\b(the|and|of|to|in|for|with|is)\b/g);
  return hits && hits.length >= 3 ? text : null;
}

export const UNIVERSITIES: University[] = (generated as Generated[]).map(
  (g) => ({
    id: g.slug,
    slug: g.slug,
    name: g.name,
    country: g.country,
    region: g.region as Region,
    city: g.city,
    website: g.website,
    overview: readableEnglish(g.description),
    sources: [
      {
        label: `${g.name} official website`,
        url: g.website,
        checkedOn: g.checkedOn,
        scope:
          "Confirmed the official site loads. Only the name, location and link are checked; programs, fees and requirements are not.",
      },
    ],
  }),
);

export const UNIVERSITY_BY_SLUG = new Map(UNIVERSITIES.map((u) => [u.slug, u]));

export const COUNTRIES = [
  ...new Set(UNIVERSITIES.map((u) => u.country)),
].sort();
