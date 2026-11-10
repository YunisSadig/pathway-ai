export type RegionId = "eu" | "us" | "ca" | "cn" | "kr" | "jp";

export interface Region {
  id: RegionId;
  name: string;
  /** True when the region is a group of countries rather than one country. */
  multiCountry: boolean;
}

export interface Country {
  /** ISO 3166-1 alpha-2 */
  code: string;
  /** URL-safe identifier used in query strings. */
  slug: string;
  name: string;
  region: RegionId;
}
