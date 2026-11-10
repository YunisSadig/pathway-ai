import type { Country, Region, RegionId } from "@/types/geography";

/** Static geographic configuration. This is navigation, not a university database. */
export const REGIONS: Region[] = [
  { id: "eu", name: "European Union", multiCountry: true },
  { id: "us", name: "United States", multiCountry: false },
  { id: "ca", name: "Canada", multiCountry: false },
  { id: "cn", name: "China", multiCountry: false },
  { id: "kr", name: "South Korea", multiCountry: false },
  { id: "jp", name: "Japan", multiCountry: false },
];

const eu = (code: string, name: string): Country => ({
  code,
  name,
  slug: name.toLowerCase(),
  region: "eu",
});

/** The 27 member states of the European Union. */
export const EU_COUNTRIES: Country[] = [
  eu("AT", "Austria"),
  eu("BE", "Belgium"),
  eu("BG", "Bulgaria"),
  eu("HR", "Croatia"),
  eu("CY", "Cyprus"),
  eu("CZ", "Czechia"),
  eu("DK", "Denmark"),
  eu("EE", "Estonia"),
  eu("FI", "Finland"),
  eu("FR", "France"),
  eu("DE", "Germany"),
  eu("GR", "Greece"),
  eu("HU", "Hungary"),
  eu("IE", "Ireland"),
  eu("IT", "Italy"),
  eu("LV", "Latvia"),
  eu("LT", "Lithuania"),
  eu("LU", "Luxembourg"),
  eu("MT", "Malta"),
  eu("NL", "Netherlands"),
  eu("PL", "Poland"),
  eu("PT", "Portugal"),
  eu("RO", "Romania"),
  eu("SK", "Slovakia"),
  eu("SI", "Slovenia"),
  eu("ES", "Spain"),
  eu("SE", "Sweden"),
];

export interface Selection {
  region: Region | null;
  country: Country | null;
}

/**
 * Turns untrusted query parameters into a valid selection.
 * Unknown regions are ignored, and a country is only valid inside the EU.
 */
export function resolveSelection(
  regionParam: string | null | undefined,
  countryParam: string | null | undefined,
): Selection {
  const region =
    REGIONS.find((r) => r.id === regionParam?.toLowerCase()) ?? null;
  const country =
    region?.id === "eu"
      ? (EU_COUNTRIES.find((c) => c.slug === countryParam?.toLowerCase()) ??
        null)
      : null;
  return { region, country };
}

export const regionName = (id: RegionId) =>
  REGIONS.find((r) => r.id === id)?.name ?? id;

/** Display name for an ISO 3166-1 alpha-2 code. Falls back to the code itself. */
export function countryName(code: string): string {
  const upper = code.toUpperCase();
  return (
    EU_COUNTRIES.find((c) => c.code === upper)?.name ??
    REGIONS.find((r) => !r.multiCountry && r.id === upper.toLowerCase())
      ?.name ??
    upper
  );
}

/** Human label for the current selection, or null when nothing is selected. */
export function selectionLabel({ region, country }: Selection): string | null {
  return country?.name ?? region?.name ?? null;
}
