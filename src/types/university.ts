import type { PageQuery } from "./api";

/**
 * Contracts for the Spring Boot university API (`/api/v1/universities`). Field names and
 * nullability mirror the backend's JSON exactly. The API does not yet expose an id,
 * tuition, admission requirements or source/verification information, so none are modelled:
 * anything absent from the API is unknown to the frontend.
 */

/** Upper-case, as serialised by the backend enum. */
export type ProgramDegreeLevel =
  "BACHELOR" | "MASTER" | "DOCTORATE" | "DIPLOMA" | "CERTIFICATE";

/** One row of `GET /api/v1/universities`. */
export interface UniversitySummary {
  slug: string;
  name: string;
  /** Nullable in the database although the backend README documents a string. */
  city: string | null;
  /** ISO 3166-1 alpha-2. */
  countryCode: string;
  countryName: string;
  websiteUrl: string | null;
}

export interface ProgramSummary {
  slug: string;
  name: string;
  degreeLevel: ProgramDegreeLevel;
  fieldOfStudy: string | null;
  durationMonths: number | null;
  teachingLanguage: string | null;
}

/** `GET /api/v1/universities/{slug}`. */
export interface UniversityDetail extends UniversitySummary {
  description: string | null;
  programs: ProgramSummary[];
}

export type UniversitySort = "name" | "city";
export type SortDirection = "asc" | "desc";

export interface UniversityQuery extends PageQuery {
  /** Case-insensitive name search, at most 100 characters. */
  q?: string;
  /** A single ISO 3166-1 alpha-2 code. The API does not accept a list. */
  country?: string;
  sort?: UniversitySort;
  direction?: SortDirection;
}
