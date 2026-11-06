import { normalizedGrade, type Profile } from "@/lib/profile";
import { programs, type Program } from "@/lib/programs";
export const euro = (amount: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
export function costs(
  program: Program,
  rent = program.rent,
  bufferPercent = 10,
) {
  const living =
    (rent + program.food + program.transport) * 12 + program.insurance;
  const subtotal = program.tuition + living + program.setup;
  const buffer = Math.round((subtotal * bufferPercent) / 100);
  return {
    tuition: program.tuition,
    housing: rent * 12,
    food: program.food * 12,
    transport: program.transport * 12,
    insurance: program.insurance,
    setup: program.setup,
    living,
    buffer,
    total: subtotal + buffer,
  };
}
export function gaps(profile: Profile, program: Program) {
  const items: string[] = [];
  if (profile.ielts < program.ielts)
    items.push(
      `IELTS ${program.ielts.toFixed(1)} (currently ${profile.ielts.toFixed(1)})`,
    );
  if (normalizedGrade(profile) < program.grade)
    items.push(`Grade average ${program.grade}/100 equivalent`);
  if (program.sat && profile.sat < program.sat)
    items.push(`SAT ${program.sat} (currently ${profile.sat || "not taken"})`);
  if (program.field === "Design" && !profile.achievements.trim())
    items.push("Prepare an illustrative portfolio");
  return items;
}
const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
export function match(profile: Profile, program: Program) {
  const grade = Math.min(1, normalizedGrade(profile) / program.grade);
  const english = Math.min(1, profile.ielts / program.ielts);
  const sat = program.sat ? Math.min(1, profile.sat / program.sat) : 1;
  const academic = clamp((grade * 0.4 + english * 0.4 + sat * 0.2) * 100);
  const affordability = clamp((profile.budget / costs(program).total) * 100);
  const lifestyle =
    (profile.city === "Balanced" || profile.city === program.cityType
      ? 60
      : 30) + (profile.teaching === program.teaching ? 40 : 15);
  const career = profile.field === program.field ? 100 : 30;
  const destination = profile.countries.includes(program.country) ? 100 : 40;
  const score = clamp(
    academic * 0.35 +
      affordability * 0.25 +
      lifestyle * 0.15 +
      career * 0.15 +
      destination * 0.1,
  );
  return {
    academic,
    affordability,
    lifestyle,
    career,
    score,
    gaps: gaps(profile, program),
  };
}
export function recommendations(profile: Profile) {
  return programs
    .filter((p) => p.field === profile.field)
    .map((program) => ({ program, ...match(profile, program) }))
    .sort(
      (a, b) => b.score - a.score || a.program.id.localeCompare(b.program.id),
    );
}
export type Scenario = "ready" | "score" | "budget" | "delay";
export function scenarioProfile(profile: Profile, scenario: Scenario): Profile {
  if (scenario === "score")
    return { ...profile, ielts: Math.max(0, profile.ielts - 1) };
  if (scenario === "budget")
    return { ...profile, budget: Math.round(profile.budget * 0.75) };
  if (scenario === "delay")
    return { ...profile, months: Math.min(36, profile.months + 6) };
  return { ...profile };
}
export function whatIf(profile: Profile, ielts: number, sat: number) {
  return recommendations({ ...profile, ielts, sat });
}
