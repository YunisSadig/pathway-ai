import type {
  PathwayRoute,
  ScenarioKind,
  StudentProfile,
  University,
} from "./types";

export type Tri = "met" | "unmet" | "unknown";

export interface Dimension {
  key: "academic" | "afford" | "preference" | "prep";
  title: string;
  state: Tri | "match" | "mismatch";
  summary: string;
  detail: string[];
}

/**
 * Deterministic, transparent assessment. No numeric scores and no admission
 * probability: each dimension says what is known, what is not, and why.
 * University-level data here has no verified program requirements or fees,
 * so academic eligibility and affordability are honestly "unknown".
 */
export function assess(profile: StudentProfile, uni: University): Dimension[] {
  const prefs = profile.preferences;
  const regionAvoid = prefs.avoidedRegions.includes(uni.region);
  const regionLike = prefs.preferredRegions.includes(uni.region);

  const preference: Dimension = {
    key: "preference",
    title: "Destination preference",
    state: regionAvoid ? "mismatch" : regionLike ? "match" : "unknown",
    summary: regionAvoid
      ? "This region is on your avoid list."
      : regionLike
        ? "This region is one of your preferred destinations."
        : prefs.preferredRegions.length
          ? "This region is not among your preferred destinations."
          : "You have not chosen preferred destinations yet.",
    detail: [
      `Located in ${uni.city}, ${uni.country}.`,
      "Field, teaching language and campus life are not yet verified for this university.",
    ],
  };

  const academic: Dimension = {
    key: "academic",
    title: "Academic requirements",
    state: "unknown",
    summary: "Program requirements have not been assessed.",
    detail: [
      "Admission rules differ by program, so none are shown at university level.",
      profile.language.test !== "None" && profile.language.score !== null
        ? `You entered ${profile.language.test} ${profile.language.score}. Compare it with the program's official language requirement.`
        : "Add a language score to your profile so you can compare it with a program's requirement.",
      "Meeting requirements never guarantees admission.",
    ],
  };

  const budget = profile.budget;
  const afford: Dimension = {
    key: "afford",
    title: "Affordability",
    state: "unknown",
    summary: "Tuition has not been verified for this university.",
    detail: [
      budget.maxAnnualTuition !== null
        ? `Your annual tuition limit: ${budget.maxAnnualTuition.toLocaleString()} ${budget.currency}. Compare it with the official fee page.`
        : "You have not set a tuition budget.",
      "Living costs are not verified here. Use the Financial Planner for your own estimates.",
    ],
  };

  const prep: Dimension = {
    key: "prep",
    title: "Preparation time",
    state: "unknown",
    summary:
      profile.intakeYear !== null
        ? `Your target intake: ${profile.intakeSeason && profile.intakeSeason !== "unsure" ? profile.intakeSeason + " " : ""}${profile.intakeYear}.`
        : "You have not set a target intake.",
    detail: [
      "Application deadlines are not verified. Check the official admissions page.",
    ],
  };

  return [academic, afford, preference, prep];
}

export const profileFields: {
  key: string;
  label: string;
  done: (p: StudentProfile) => boolean;
}[] = [
  { key: "stage", label: "Education stage", done: (p) => p.stage !== null },
  {
    key: "country",
    label: "Current country",
    done: (p) => p.currentCountry.trim() !== "",
  },
  {
    key: "degree",
    label: "Intended degree",
    done: (p) => p.targetDegree !== null,
  },
  {
    key: "field",
    label: "Field of study",
    done: (p) => p.preferences.fields.length > 0,
  },
  {
    key: "grade",
    label: "Academic performance",
    done: (p) => p.grade.trim() !== "",
  },
  {
    key: "dest",
    label: "Preferred destinations",
    done: (p) => p.preferences.preferredRegions.length > 0,
  },
  {
    key: "budget",
    label: "Annual tuition budget",
    done: (p) => p.budget.maxAnnualTuition !== null,
  },
  { key: "intake", label: "Target intake", done: (p) => p.intakeYear !== null },
];

export function profileCompletion(p: StudentProfile) {
  const done = profileFields.filter((f) => f.done(p));
  const missing = profileFields.filter((f) => !f.done(p));
  return { done: done.length, total: profileFields.length, missing };
}

/* ---- scenarios ---- */
export interface ScenarioResult {
  title: string;
  changes: string[];
  affected: string[];
  unknown: string[];
  alternatives: string[];
}

export const SCENARIOS: { kind: ScenarioKind; label: string }[] = [
  { kind: "language-short", label: "My language score is not high enough" },
  {
    kind: "scholarship-unavailable",
    label: "The scholarship is not available",
  },
  { kind: "budget-down", label: "My tuition budget decreases" },
  {
    kind: "qualification-incomplete",
    label: "A required qualification is not finished",
  },
  { kind: "delay-intake", label: "I delay my application by one intake" },
  { kind: "change-country", label: "I change my preferred country" },
];

/** Deterministic what-if over the user's own plan. Never predicts outcomes. */
export function runScenario(
  kind: ScenarioKind,
  routes: PathwayRoute[],
  nameOf: (id: string | null) => string,
): ScenarioResult {
  const primary = routes[0];
  const alts = routes.slice(1).filter((r) => r.universityId);
  const main = nameOf(primary.universityId);
  const altNames = alts.map((r) => nameOf(r.universityId));
  const hasPlan = Boolean(primary.universityId);
  const fallback = altNames.length
    ? `Review your alternatives: ${altNames.join(", ")}.`
    : "Add an alternative route so you have somewhere to go.";
  const undone = primary.milestones.filter((m) => !m.done).length;
  const common = {
    unknown: [
      "Whether the program accepts a later intake or a retake is not known until you check its official page.",
    ],
  };
  switch (kind) {
    case "language-short":
      return {
        title: "Language score falls short",
        changes: [
          "The language requirement of your chosen program is not met.",
        ],
        affected: hasPlan
          ? [`Application to ${main}`, "Language test milestones"]
          : ["Your primary route (none chosen yet)"],
        ...common,
        alternatives: [
          "Retake the test and move the intake later.",
          "Look for programs with a lower or different language requirement.",
          fallback,
        ],
      };
    case "scholarship-unavailable":
      return {
        title: "Scholarship unavailable",
        changes: ["Funding from the scholarship disappears from your plan."],
        affected: primary.scholarshipIds.length
          ? [
              `${primary.scholarshipIds.length} scholarship(s) on your primary route`,
              "Your budget",
            ]
          : ["Your budget (no scholarship was attached)"],
        ...common,
        alternatives: [
          "Compare other scholarships in the directory.",
          "Check programs with lower or no tuition.",
          fallback,
        ],
      };
    case "budget-down":
      return {
        title: "Tuition budget decreases",
        changes: ["Programs above your new limit stop fitting."],
        affected: hasPlan
          ? [`Affordability of ${main}`]
          : ["Affordability of your route"],
        unknown: [
          "Fees are not verified in this prototype. Check each official fee page.",
        ],
        alternatives: [
          "Rebuild your budget in the Financial Planner.",
          "Add a scholarship to the route.",
          fallback,
        ],
      };
    case "qualification-incomplete":
      return {
        title: "A required qualification is unfinished",
        changes: [
          "Your application may not be complete for the intended intake.",
        ],
        affected: hasPlan
          ? [`${undone} open milestone(s) on your primary route`]
          : ["Your preparation milestones"],
        ...common,
        alternatives: [
          "Finish the qualification and target a later intake.",
          "Look for programs with different entry routes.",
          fallback,
        ],
      };
    case "delay-intake":
      return {
        title: "Application delayed by one intake",
        changes: [
          "Your target intake moves later.",
          "You gain preparation time.",
        ],
        affected: hasPlan
          ? [`Intake of ${main}`, "Deadlines on every route"]
          : ["Deadlines on your routes"],
        unknown: [
          "New deadlines are not verified. Check each official admissions page.",
        ],
        alternatives: [
          "Move milestones to match the new intake.",
          "Use the extra time to retake exams.",
        ],
      };
    case "change-country":
      return {
        title: "Preferred country changes",
        changes: ["Your primary route no longer matches your destination."],
        affected: hasPlan
          ? [
              `Your primary route (${main})`,
              "Scholarships tied to the old country",
            ]
          : ["Your destination preferences"],
        ...common,
        alternatives: [
          "Choose a new primary university in the directory.",
          fallback,
        ],
      };
  }
}

/* ---- improvement lab ---- */
export interface RequirementCheck {
  label: string;
  state: Tri;
  note: string;
}

/**
 * Compares a hypothetical value with a requirement the student types in.
 * The requirement is user-entered (or fictional) and is never presented as a verified rule.
 */
export function checkAgainst(
  value: number | null,
  required: number | null,
  label: string,
): RequirementCheck {
  if (value === null || required === null) {
    return { label, state: "unknown", note: "Enter both numbers to compare." };
  }
  return value >= required
    ? {
        label,
        state: "met",
        note: `${value} reaches the ${required} you entered.`,
      }
    : {
        label,
        state: "unmet",
        note: `${value} is ${(required - value).toFixed(1)} below the ${required} you entered.`,
      };
}

/* ---- budget ---- */
export function annualTotal(
  lines: {
    amount: number;
    cadence: "one-time" | "monthly" | "annual";
    credit?: boolean;
  }[],
) {
  const sum = (c: "one-time" | "monthly" | "annual") =>
    lines
      .filter((l) => l.cadence === c)
      .reduce((a, l) => a + (l.credit ? -l.amount : l.amount), 0);
  const oneTime = sum("one-time");
  const monthly = sum("monthly");
  const annual = sum("annual");
  return {
    oneTime,
    monthly,
    annual,
    firstYear: oneTime + monthly * 12 + annual,
    ongoing: monthly * 12 + annual,
  };
}
