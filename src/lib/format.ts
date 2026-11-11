import type { FundingKind } from "@/types/funding";
import type {
  ApplicantCategory,
  BillingPeriod,
  Intake,
  ProgramDegreeLevel,
  RequirementType,
  StudyMode,
  TemporalStatus,
  Tuition,
} from "@/types/program";

/** Display helpers for API values. They never invent a value: unknown stays "Not stated". */

export const NOT_STATED = "Not stated";

export const DEGREE_LABELS: Record<ProgramDegreeLevel, string> = {
  BACHELOR: "Bachelor's",
  MASTER: "Master's",
  DOCTORATE: "Doctorate",
  DIPLOMA: "Diploma",
  CERTIFICATE: "Certificate",
};

export const STUDY_MODE_LABELS: Record<StudyMode, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  DISTANCE: "Distance learning",
  BLENDED: "Blended",
};

export const BILLING_LABELS: Record<BillingPeriod, string> = {
  PER_YEAR: "per year",
  PER_SEMESTER: "per semester",
  PER_PROGRAM: "for the whole program",
};

export const REQUIREMENT_LABELS: Record<RequirementType, string> = {
  MIN_GPA: "Minimum grade",
  LANGUAGE_TEST: "Language requirement",
  ENTRANCE_EXAM: "Entrance exam or test",
  PRIOR_DEGREE: "Prior qualification",
  DOCUMENT: "Supporting documents",
  OTHER: "Other requirement",
};

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      currencyDisplay: "code",
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    })
      .format(amount)
      .replace(/ /g, " ");
  } catch {
    return `${amount} ${currency}`;
  }
}

/** "2027-01-19" -> "19 Jan 2027". Date-only values are formatted in UTC so they never shift a day. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return NOT_STATED;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function durationLabel(months: number | null): string {
  if (months === null || months <= 0) return NOT_STATED;
  if (months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? "1 year" : `${years} years`;
  }
  return `${months} months`;
}

export function languageName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "language" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function languagesLabel(codes: string[]): string {
  return codes.length ? codes.map(languageName).join(", ") : NOT_STATED;
}

/**
 * The university's own group names are not always the same, so say what the API stored and no more.
 * INTERNATIONAL is how the source labelled the group that is charged (for these records: non-EU/EEA citizens).
 */
export function applicantLabel(category: ApplicantCategory | null): string {
  if (category === "INTERNATIONAL")
    return "International applicants (as the university groups them)";
  if (category === "DOMESTIC") return "Domestic applicants";
  return "All applicants";
}

/** What period the source attached to a fee, in the source's own terms. */
export function tuitionPeriodLabel(
  t: Pick<Tuition, "academicYear" | "effectiveFrom" | "effectiveTo">,
): string {
  if (t.academicYear) return `Academic year ${t.academicYear}`;
  if (t.effectiveFrom && t.effectiveTo)
    return `Study rights started ${formatDate(t.effectiveFrom)} to ${formatDate(t.effectiveTo)}`;
  if (t.effectiveFrom)
    return `Study rights started on or after ${formatDate(t.effectiveFrom)}`;
  if (t.effectiveTo)
    return `Study rights started on or before ${formatDate(t.effectiveTo)}`;
  return "Period not stated by the source";
}

export const TEMPORAL_LABELS: Record<TemporalStatus, string> = {
  CURRENT: "Current",
  HISTORICAL: "Outdated",
  UNKNOWN_YEAR: "Period not stated",
};

export const TEMPORAL_HELP: Record<TemporalStatus, string> = {
  CURRENT: "Applies to the present or an upcoming cycle, as published.",
  HISTORICAL:
    "This period has ended. It is kept for context and does not describe today's requirements or prices.",
  UNKNOWN_YEAR:
    "The source did not say which year this applies to. Confirm it on the official page before relying on it.",
};

export const FUNDING_LABELS: Record<FundingKind, string> = {
  SCHOLARSHIP: "Scholarship",
  FULL_WAIVER: "Full tuition waiver",
  PARTIAL_WAIVER: "Partial tuition waiver",
  DISCOUNT: "Tuition discount",
  GRANT: "Fixed grant",
  STIPEND: "Stipend",
};

/** Requirement groups, in reading order. Types the API does not provide (e.g. portfolio) get no group. */
export const REQUIREMENT_GROUPS: {
  title: string;
  types: RequirementType[];
}[] = [
  { title: "Academic qualifications", types: ["PRIOR_DEGREE", "MIN_GPA"] },
  { title: "Language proficiency", types: ["LANGUAGE_TEST"] },
  { title: "Admission tests", types: ["ENTRANCE_EXAM"] },
  { title: "Required documents", types: ["DOCUMENT"] },
  { title: "Additional requirements", types: ["OTHER"] },
];

const TEMPORAL_ORDER = { CURRENT: 0, UNKNOWN_YEAR: 1, HISTORICAL: 2 } as const;

/** Current first, then undated, then outdated; stable within each group. */
export function byTemporalStatus<T extends { temporalStatus: TemporalStatus }>(
  rows: readonly T[],
): T[] {
  return [...rows].sort(
    (a, b) =>
      TEMPORAL_ORDER[a.temporalStatus] - TEMPORAL_ORDER[b.temporalStatus],
  );
}

/**
 * The next application deadline: the earliest deadline among intakes the backend marks CURRENT.
 * Outdated or undated cycles are never used to infer one.
 */
export function nextDeadline(intakes: readonly Intake[]): Intake | null {
  const dated = intakes.filter(
    (i) => i.temporalStatus === "CURRENT" && i.applicationDeadline,
  );
  dated.sort((a, b) =>
    (a.applicationDeadline as string).localeCompare(
      b.applicationDeadline as string,
    ),
  );
  return dated[0] ?? null;
}
