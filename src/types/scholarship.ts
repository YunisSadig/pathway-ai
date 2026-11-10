import type { DegreeLevel, SourceInfo } from "./common";
import type { PageQuery } from "./api";

export interface Scholarship extends SourceInfo {
  id: string;
  slug: string;
  name: string;
  sponsor: string;
  /** ISO 3166-1 alpha-2 codes of the countries where it can be used. */
  countryCodes: string[];
  levels: DegreeLevel[];
  /** What is covered, e.g. tuition or living costs. */
  coverage: string[];
  eligibility: string[];
  howToApply: string;
  /** ISO 8601 date. Absent means unknown or rolling. */
  deadline?: string;
}

export interface ScholarshipQuery extends PageQuery {
  countryCodes?: string[];
  levels?: DegreeLevel[];
  search?: string;
}
