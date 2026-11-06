import { expect, test } from "vitest";
import { defaultProfile } from "@/lib/profile";
import { programs } from "@/lib/programs";
import {
  costs,
  gaps,
  match,
  recommendations,
  scenarioProfile,
  whatIf,
} from "@/lib/planning";
test("budget includes 12 months, one-time costs, and emergency buffer", () => {
  const p = programs[0];
  const c = costs(p);
  expect(c.total).toBe(
    p.tuition +
      (p.rent + p.food + p.transport) * 12 +
      p.insurance +
      p.setup +
      c.buffer,
  );
  expect(costs(p, p.rent + 100).total - c.total).toBe(1320);
  expect(costs(p, p.rent, 0).buffer).toBe(0);
});
test("matching is bounded and responds to preferences and budget", () => {
  for (const p of programs) {
    const result = match(defaultProfile, p);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  }
  expect(
    match({ ...defaultProfile, budget: 3000 }, programs[0]).affordability,
  ).toBeLessThan(match(defaultProfile, programs[0]).affordability);
  expect(
    match({ ...defaultProfile, city: "Small city" }, programs[1]).lifestyle,
  ).toBe(100);
  expect(
    recommendations(defaultProfile).every(
      (r) => r.program.field === defaultProfile.field,
    ),
  ).toBe(true);
});
test("what-if exam improvements close relevant qualification gaps", () => {
  const target = programs[2];
  expect(gaps(defaultProfile, target)).toContain(
    "SAT 1300 (currently not taken)",
  );
  const after = whatIf({ ...defaultProfile, grade: 90 }, 7, 1400).find(
    (r) => r.program.id === target.id,
  )!;
  expect(after.gaps).toEqual([]);
  expect(after.academic).toBeGreaterThan(
    match(defaultProfile, target).academic,
  );
});
test("backup transformations are immutable and bounded", () => {
  expect(scenarioProfile(defaultProfile, "budget").budget).toBe(13500);
  expect(
    scenarioProfile({ ...defaultProfile, ielts: 0.5 }, "score").ielts,
  ).toBe(0);
  expect(
    scenarioProfile({ ...defaultProfile, months: 35 }, "delay").months,
  ).toBe(36);
  expect(defaultProfile.budget).toBe(18000);
});
