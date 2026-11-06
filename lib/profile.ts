export const countries = [
  "Netherlands",
  "Germany",
  "Finland",
  "Italy",
  "Poland",
] as const;
export const fields = ["Computer science", "Business", "Design"] as const;
export type Profile = {
  name: string;
  age: number;
  citizenship: string;
  educationCountry: string;
  qualification: string;
  grade: number;
  gradeScale: "100" | "5";
  ielts: number;
  sat: number;
  achievements: string;
  field: string;
  career: string;
  budget: number;
  scholarship: boolean;
  countries: string[];
  city: "Balanced" | "Big city" | "Small city";
  teaching: "Project-based" | "Lecture-based";
  months: number;
  intake: string;
  expectations: string;
  worry: string;
};
export const defaultProfile: Profile = {
  name: "",
  age: 17,
  citizenship: "Azerbaijan",
  educationCountry: "Azerbaijan",
  qualification: "School leaving certificate",
  grade: 82,
  gradeScale: "100",
  ielts: 6,
  sat: 0,
  achievements: "",
  field: "Computer science",
  career: "Software engineer",
  budget: 18000,
  scholarship: false,
  countries: ["Netherlands", "Germany"],
  city: "Balanced",
  teaching: "Project-based",
  months: 12,
  intake: "Autumn 2028",
  expectations: "",
  worry: "Finances",
};
export type ProfileErrors = Partial<Record<keyof Profile, string>>;
export function validateStep(profile: Profile, step: number): ProfileErrors {
  const e: ProfileErrors = {};
  if (step === 0) {
    if (!profile.name.trim() || profile.name.length > 40)
      e.name = "Enter a nickname of 1–40 characters.";
    if (!Number.isInteger(profile.age) || profile.age < 16 || profile.age > 60)
      e.age = "Enter an age between 16 and 60.";
    if (!profile.citizenship.trim()) e.citizenship = "Choose your citizenship.";
    if (!profile.educationCountry.trim())
      e.educationCountry = "Choose your country of education.";
  }
  if (step === 1) {
    const max = profile.gradeScale === "5" ? 5 : 100;
    if (
      !Number.isFinite(profile.grade) ||
      profile.grade < 0 ||
      profile.grade > max
    )
      e.grade = `Enter a grade between 0 and ${max}.`;
    if (
      !Number.isFinite(profile.ielts) ||
      profile.ielts < 0 ||
      profile.ielts > 9 ||
      (profile.ielts * 2) % 1 !== 0
    )
      e.ielts = "Use IELTS bands from 0–9 in steps of 0.5, or 0 if not taken.";
    if (
      !Number.isInteger(profile.sat) ||
      (profile.sat !== 0 &&
        (profile.sat < 400 || profile.sat > 1600 || profile.sat % 10 !== 0))
    )
      e.sat = "Enter 400–1600 in steps of 10, or 0 if not taken.";
  }
  if (step === 2) {
    if (!fields.includes(profile.field as (typeof fields)[number]))
      e.field = "Choose a field of study.";
    if (!profile.career.trim())
      e.career = "Tell us a career you’re curious about.";
    if (
      !Number.isFinite(profile.budget) ||
      profile.budget < 3000 ||
      profile.budget > 150000
    )
      e.budget = "Enter an annual budget between €3,000 and €150,000.";
  }
  if (step === 3 && !profile.countries.length)
    e.countries = "Choose at least one destination.";
  if (
    step === 4 &&
    (!Number.isInteger(profile.months) ||
      profile.months < 1 ||
      profile.months > 36)
  )
    e.months = "Choose 1–36 months of preparation.";
  return e;
}
export function normalizedGrade(profile: Profile) {
  return profile.gradeScale === "5" ? profile.grade * 20 : profile.grade;
}
export type SavedState = {
  profile: Profile;
  step: number;
  completed: boolean;
  goals: string[];
  primary: string;
  backup: string;
};
export const initialState: SavedState = {
  profile: defaultProfile,
  step: 0,
  completed: false,
  goals: [],
  primary: "",
  backup: "",
};
const text = (value: unknown, fallback: string, max = 500) =>
  typeof value === "string" ? value.slice(0, max) : fallback;
const number = (value: unknown, fallback: number, min: number, max: number) =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= min &&
  value <= max
    ? value
    : fallback;
export function decodeState(raw: string | null): SavedState {
  try {
    if (!raw) return initialState;
    const data = JSON.parse(raw);
    if (
      !data ||
      data.version !== 1 ||
      !data.profile ||
      typeof data.profile !== "object"
    )
      return initialState;
    const p = data.profile;
    const profile: Profile = {
      name: text(p.name, "", 40),
      age: number(p.age, 17, 16, 60),
      citizenship: text(p.citizenship, "Azerbaijan", 80),
      educationCountry: text(p.educationCountry, "Azerbaijan", 80),
      qualification: text(p.qualification, defaultProfile.qualification, 80),
      grade: number(p.grade, 82, 0, 100),
      gradeScale: p.gradeScale === "5" ? "5" : "100",
      ielts: number(p.ielts, 6, 0, 9),
      sat: number(p.sat, 0, 0, 1600),
      achievements: text(p.achievements, ""),
      field: fields.includes(p.field) ? p.field : defaultProfile.field,
      career: text(p.career, defaultProfile.career, 100),
      budget: number(p.budget, 18000, 3000, 150000),
      scholarship: p.scholarship === true,
      countries: Array.isArray(p.countries)
        ? countries.filter((c) => p.countries.includes(c))
        : defaultProfile.countries,
      city: ["Balanced", "Big city", "Small city"].includes(p.city)
        ? p.city
        : "Balanced",
      teaching:
        p.teaching === "Lecture-based" ? "Lecture-based" : "Project-based",
      months: number(p.months, 12, 1, 36),
      intake: text(p.intake, defaultProfile.intake, 80),
      expectations: text(p.expectations, ""),
      worry: text(p.worry, "Finances", 100),
    };
    return {
      profile,
      step: Math.floor(number(data.step, 0, 0, 4)),
      completed:
        data.completed === true &&
        [0, 1, 2, 3, 4].every(
          (s) => Object.keys(validateStep(profile, s)).length === 0,
        ),
      goals: Array.isArray(data.goals)
        ? data.goals
            .filter((g: unknown) => typeof g === "string")
            .slice(0, 20)
            .map((g: string) => g.slice(0, 100))
        : [],
      primary: text(data.primary, "", 50),
      backup: text(data.backup, "", 50),
    };
  } catch {
    return initialState;
  }
}
