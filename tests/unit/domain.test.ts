import { describe, expect, it } from "vitest";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { UNIVERSITIES } from "@/data/universities";
import {
  annualTotal,
  checkAgainst,
  profileCompletion,
  runScenario,
} from "@/lib/domain/evaluate";
import {
  emptyProfile,
  initialStore,
  parseStore,
  STORE_VERSION,
} from "@/lib/store";

describe("university data", () => {
  it("has 64 or more distinct institutions with unique slugs", () => {
    expect(UNIVERSITIES.length).toBeGreaterThanOrEqual(64);
    expect(new Set(UNIVERSITIES.map((u) => u.slug)).size).toBe(
      UNIVERSITIES.length,
    );
  });
  it("meets the regional minimums", () => {
    const n = (r: string) => UNIVERSITIES.filter((u) => u.region === r).length;
    expect(n("EU")).toBeGreaterThanOrEqual(30);
    expect(n("US")).toBeGreaterThanOrEqual(10);
    for (const r of ["CA", "CN", "KR", "JP"])
      expect(n(r)).toBeGreaterThanOrEqual(6);
  });
  it("gives every record an https website and a dated source", () => {
    for (const u of UNIVERSITIES) {
      expect(u.website.startsWith("https://")).toBe(true);
      expect(u.sources[0].checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("scholarship data", () => {
  it("never states a deadline it has not verified", () => {
    for (const s of SCHOLARSHIPS) {
      expect(s.deadline).toBeNull();
      expect(s.officialUrl.startsWith("https://")).toBe(true);
      expect(s.levels.length).toBeGreaterThan(0);
    }
  });
});

describe("store", () => {
  it("returns defaults for missing, corrupt or old-version data", () => {
    expect(parseStore(null)).toEqual(initialStore());
    expect(parseStore("{not json")).toEqual(initialStore());
    expect(
      parseStore(JSON.stringify({ version: 0, savedUniversities: ["x"] })),
    ).toEqual(initialStore());
  });
  it("keeps valid stored data and caps the comparison at three", () => {
    const s = parseStore(
      JSON.stringify({
        version: STORE_VERSION,
        savedUniversities: ["a", 3, "b"],
        compare: ["1", "2", "3", "4"],
      }),
    );
    expect(s.savedUniversities).toEqual(["a", "b"]);
    expect(s.compare).toHaveLength(3);
    expect(s.routes).toHaveLength(3);
  });
});

describe("evaluation logic", () => {
  it("reports an empty profile as 0 of N and lists what is missing", () => {
    const c = profileCompletion(emptyProfile());
    expect(c.done).toBe(0);
    expect(c.missing.length).toBe(c.total);
  });
  it("compares a value with a user-entered requirement", () => {
    expect(checkAgainst(5.5, 6.5, "x").state).toBe("unmet");
    expect(checkAgainst(7, 6.5, "x").state).toBe("met");
    expect(checkAgainst(null, 6.5, "x").state).toBe("unknown");
  });
  it("totals one-time, monthly and yearly costs and subtracts credits", () => {
    const t = annualTotal([
      { amount: 1000, cadence: "one-time" },
      { amount: 500, cadence: "monthly" },
      { amount: 3000, cadence: "annual" },
      { amount: 1000, cadence: "annual", credit: true },
    ]);
    expect(t.firstYear).toBe(1000 + 6000 + 2000);
    expect(t.ongoing).toBe(8000);
  });
  it("runs scenarios deterministically without predicting outcomes", () => {
    const routes = initialStore().routes;
    const a = runScenario("language-short", routes, () => "x");
    const b = runScenario("language-short", routes, () => "x");
    expect(a).toEqual(b);
    expect(a.alternatives.length).toBeGreaterThan(0);
    expect(JSON.stringify(a)).not.toMatch(/%|probab/i);
  });
});
