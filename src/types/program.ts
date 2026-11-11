import type { PageQuery } from "./api";
import type { ProgramDegreeLevel } from "./university";

export type { ProgramDegreeLevel };

/**
 * Contracts for the Spring Boot program API (`/api/v1/programs`). They mirror the backend DTOs exactly
 * (`ProgramListItemResponse`, `ProgramDetailResponse`). Anything the API does not return is unknown to the
 * frontend: tuition, requirements and deadlines are shown only from these fields.
 */

export type StudyMode = "FULL_TIME" | "PART_TIME" | "DISTANCE" | "BLENDED";

export type VerificationStatus = "VERIFIED" | "UNVERIFIED";

/**
 * How a year-specific fact relates to today, derived by the backend from the period its source stated.
 * HISTORICAL values must never be shown as current; UNKNOWN_YEAR means the source stated no period.
 */
export type TemporalStatus = "CURRENT" | "HISTORICAL" | "UNKNOWN_YEAR";

export type ApplicantCategory = "DOMESTIC" | "INTERNATIONAL";

export type BillingPeriod = "PER_YEAR" | "PER_SEMESTER" | "PER_PROGRAM";

export type RequirementType =
  | "MIN_GPA"
  | "LANGUAGE_TEST"
  | "ENTRANCE_EXAM"
  | "PRIOR_DEGREE"
  | "DOCUMENT"
  | "OTHER";

export interface UniversityRef {
  slug: string;
  name: string;
  city: string | null;
  countryCode: string;
  countryName: string;
}

export interface FieldRef {
  slug: string;
  name: string;
}

export interface Verification {
  status: VerificationStatus;
  /** ISO date (YYYY-MM-DD) the record was last checked against its official sources. */
  verifiedOn: string | null;
}

/** One row of `GET /api/v1/programs`. */
export interface ProgramListItem {
  /** `<university-slug>--<program-slug>`: globally unique and stable. */
  identifier: string;
  slug: string;
  name: string;
  degreeLevel: ProgramDegreeLevel;
  field: FieldRef | null;
  studyMode: StudyMode | null;
  durationMonths: number | null;
  /** ISO 639 language codes. */
  teachingLanguages: string[];
  campusCity: string | null;
  university: UniversityRef;
  officialProgramUrl: string | null;
  /** An official admissions-information page. Informational, never an Apply button. */
  officialAdmissionsUrl: string | null;
  /** An ACTIVE apply link. Only present when verified for a current or upcoming cycle. */
  officialApplicationUrl: string | null;
  verification: Verification;
}

export interface SourceRef {
  url: string;
  title: string;
  publisher: string | null;
  type: string;
  /** ISO date the page was read. */
  retrievedOn: string;
}

export interface Intake {
  label: string;
  academicYear: string | null;
  startDate: string | null;
  applicationDeadline: string | null;
  applicantCategory: ApplicantCategory | null;
  temporalStatus: TemporalStatus;
  source: SourceRef;
}

export interface Tuition {
  /** Only set when the source prints an academic year. */
  academicYear: string | null;
  /** Start-date range the source stated, inclusive, either end may be open. */
  effectiveFrom: string | null;
  effectiveTo: string | null;
  /** The source's own wording of the scope. */
  scopeNote: string | null;
  studentCategory: ApplicantCategory;
  amount: number;
  /** ISO 4217. */
  currency: string;
  billingPeriod: BillingPeriod;
  temporalStatus: TemporalStatus;
  source: SourceRef;
}

export interface Requirement {
  applicationCycle: string;
  type: RequirementType;
  description: string;
  minimumValue: number | null;
  valueUnit: string | null;
  temporalStatus: TemporalStatus;
  source: SourceRef;
}

/** `GET /api/v1/programs/{identifier}`. */
export interface ProgramDetail extends ProgramListItem {
  sources: SourceRef[];
  intakes: Intake[];
  tuition: Tuition[];
  requirements: Requirement[];
}

export type ProgramSort = "name" | "university" | "level";

export interface ProgramQuery extends PageQuery {
  q?: string;
  /** Academic-field slug; the API also matches that field's direct children. */
  field?: string;
  level?: Lowercase<ProgramDegreeLevel>;
  /** A single ISO 3166-1 alpha-2 code. */
  country?: string;
  university?: string;
  /** Teaching-language code. */
  language?: string;
  /** Only matches fees that are current; needs `tuitionCurrency`. */
  tuitionMax?: number;
  tuitionCurrency?: string;
  tuitionCategory?: "domestic" | "international";
  sort?: ProgramSort;
  direction?: "asc" | "desc";
}

/**
 * Funding a program page can display. The backend has no funding endpoint yet, so nothing supplies these
 * and the page shows one honest empty state. The kinds stay distinct so a waiver is never presented as a grant.
 */
export type FundingKind =
  | "SCHOLARSHIP"
  | "FULL_WAIVER"
  | "PARTIAL_WAIVER"
  | "DISCOUNT"
  | "GRANT"
  | "STIPEND";

export interface FundingItem {
  name: string;
  kind: FundingKind;
  /** The source's own description, including who is eligible. */
  summary: string;
  source: SourceRef;
}
