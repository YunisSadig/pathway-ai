import type { DegreeLevel, Money, SourceInfo } from "./common";
import type { PageQuery } from "./api";

export interface University extends SourceInfo {
  id: string;
  slug: string;
  name: string;
  /** ISO 3166-1 alpha-2, matches `Country.code` in `geography.ts`. */
  countryCode: string;
  city: string;
  websiteUrl?: string;
}

export interface DegreeProgram extends SourceInfo {
  id: string;
  universityId: string;
  name: string;
  level: DegreeLevel;
  /** ISO 639-1 language codes. */
  teachingLanguages: string[];
  durationMonths?: number;
  /** Yearly tuition. Absent means unknown, never zero. */
  tuitionPerYear?: Money;
  admissionRequirements?: string[];
}

export interface UniversityQuery extends PageQuery {
  /** ISO 3166-1 alpha-2 country codes. */
  countryCodes?: string[];
  search?: string;
}
