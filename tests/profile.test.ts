import { expect, test } from "vitest";
import {
  decodeState,
  defaultProfile,
  initialState,
  normalizedGrade,
  validateStep,
} from "@/lib/profile";
test("requires a nickname and valid age", () => {
  expect(validateStep({ ...defaultProfile, name: "", age: 15 }, 0)).toEqual({
    name: expect.any(String),
    age: expect.any(String),
  });
});
test("validates grade scales and optional exam scores", () => {
  expect(
    validateStep(
      { ...defaultProfile, gradeScale: "5", grade: 5, ielts: 0, sat: 0 },
      1,
    ),
  ).toEqual({});
  expect(
    validateStep({ ...defaultProfile, ielts: 6.2, sat: 1234 }, 1),
  ).toHaveProperty("ielts");
  expect(validateStep({ ...defaultProfile, sat: 399 }, 1)).toHaveProperty(
    "sat",
  );
  expect(
    normalizedGrade({ ...defaultProfile, gradeScale: "5", grade: 4 }),
  ).toBe(80);
});
test("validates finances, destinations, and preparation", () => {
  expect(validateStep({ ...defaultProfile, budget: 0 }, 2)).toHaveProperty(
    "budget",
  );
  expect(validateStep({ ...defaultProfile, countries: [] }, 3)).toHaveProperty(
    "countries",
  );
  expect(validateStep({ ...defaultProfile, months: 0 }, 4)).toHaveProperty(
    "months",
  );
});
test("recovers from corrupt, stale, and incorrectly shaped storage", () => {
  for (const raw of [
    null,
    "broken",
    "null",
    '{"version":2}',
    '{"version":1,"profile":null}',
  ])
    expect(decodeState(raw)).toEqual(initialState);
  const decoded = decodeState(
    JSON.stringify({
      version: 1,
      profile: { budget: -1, countries: ["Unknown"], name: 123 },
      step: 99,
      completed: true,
      goals: [{}, "IELTS"],
    }),
  );
  expect(decoded.profile.budget).toBe(18000);
  expect(decoded.profile.countries).toEqual([]);
  expect(decoded.completed).toBe(false);
  expect(decoded.step).toBe(0);
  expect(decoded.goals).toEqual(["IELTS"]);
});
test("round trips a completed valid profile", () => {
  const state = {
    ...initialState,
    profile: { ...defaultProfile, name: "Demo" },
    completed: true,
    step: 4,
  };
  expect(decodeState(JSON.stringify({ version: 1, ...state }))).toEqual(state);
});
