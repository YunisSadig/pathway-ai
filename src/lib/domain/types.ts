/** Domain models. Frontend-only today; shaped so a REST backend can adopt them later. */

export type Region = "EU" | "US" | "CA" | "CN" | "KR" | "JP";

export const REGION_LABEL: Record<Region, string> = {
  EU: "European Union",
  US: "United States",
  CA: "Canada",
  CN: "China",
  KR: "South Korea",
  JP: "Japan",
};

export type DegreeLevel = "bachelor" | "master" | "doctoral";

export const DEGREE_LABEL: Record<DegreeLevel, string> = {
  bachelor: "Bachelor's",
  master: "Master's",
  doctoral: "Doctoral",
};

/** Where a fact came from. Every displayed fact points at one of these. */
export interface SourceRecord {
  label: string;
  url: string;
  checkedOn: string; // ISO date
  /** What the check actually established. */
  scope: string;
}

export interface University {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: Region;
  city: string;
  website: string;
  /** The university's own description, only when it was readable and in English. */
  overview: string | null;
  sources: SourceRecord[];
}

/** A program is modelled apart from its university: requirements differ per program. */
export interface AdmissionRequirement {
  kind: "language" | "grades" | "test" | "prerequisite" | "document";
  label: string;
  sourceUrl: string;
}

export interface DegreeProgram {
  id: string;
  universityId: string;
  name: string;
  level: DegreeLevel;
  requirements: AdmissionRequirement[];
}

export interface Scholarship {
  id: string;
  slug: string;
  name: string;
  sponsor: string;
  country: string;
  levels: DegreeLevel[];
  fundingType: "Government" | "University" | "Joint programme";
  summary: string;
  whoCanApply: string;
  howToApply: string;
  nomination: string | null;
  deadline: string | null; // null = not verified for the current cycle
  officialUrl: string;
  verifiedOn: string;
  caveats: string[];
}

/* ---------------- Student profile ---------------- */

export type EducationStage =
  | "high-school"
  | "bachelor-student"
  | "bachelor-graduate"
  | "master-student"
  | "working";

export interface LanguageQualification {
  test: "IELTS" | "TOEFL" | "Other" | "None";
  score: number | null;
  plannedDate: string | null;
}

export interface ExaminationResult {
  name: string;
  result: string;
}

export interface StudentBudget {
  currency: string;
  maxAnnualTuition: number | null;
  monthlyLiving: number | null;
  totalFunding: number | null;
  needsScholarship: boolean | null;
}

export interface StudentPreferences {
  fields: string[];
  careerInterests: string;
  teachingLanguage: string;
  preferredRegions: Region[];
  avoidedRegions: Region[];
  citySize: "any" | "large" | "medium" | "small";
  priorities: string[];
}

export interface StudentProfile {
  // Essential
  stage: EducationStage | null;
  citizenship: string;
  currentCountry: string;
  targetDegree: DegreeLevel | null;
  gradingScale: string;
  grade: string;
  intakeYear: number | null;
  intakeSeason: "autumn" | "spring" | "unsure" | null;
  language: LanguageQualification;
  budget: StudentBudget;
  preferences: StudentPreferences;
  // Personalization (optional)
  examinations: ExaminationResult[];
  achievements: string;
  willingToPostpone: boolean | null;
  willingToChangeField: boolean | null;
}

/* ---------------- Planning ---------------- */

export interface PreparationMilestone {
  id: string;
  title: string;
  done: boolean;
}

export interface PathwayRoute {
  slot: "primary" | "alt1" | "alt2";
  universityId: string | null;
  program: string;
  intake: string;
  scholarshipIds: string[];
  milestones: PreparationMilestone[];
  notes: string;
}

export type ScenarioKind =
  | "language-short"
  | "budget-down"
  | "scholarship-unavailable"
  | "delay-intake"
  | "change-country"
  | "qualification-incomplete";

export interface BudgetLine {
  id: string;
  label: string;
  amount: number;
  cadence: "one-time" | "monthly" | "annual";
  /** True for money that reduces cost, such as a scholarship. */
  credit?: boolean;
}

export interface BudgetScenario {
  id: string;
  name: string;
  currency: string;
  lines: BudgetLine[];
}

export interface ImprovementScenario {
  ieltsOverride: number | null;
  budgetOverride: number | null;
}

/** Everything persisted in the browser. Bump STORE_VERSION on shape changes. */
export interface PathwayStore {
  version: number;
  onboarding: { step: number; completed: boolean };
  profile: StudentProfile;
  savedUniversities: string[];
  savedScholarships: string[];
  compare: string[];
  routes: PathwayRoute[];
  budgetScenarios: BudgetScenario[];
  improvement: ImprovementScenario;
  /** Requirements the student typed in from an official page. Never supplied by us. */
  improvementReq: { lang: number | null; tuition: number | null };
}
