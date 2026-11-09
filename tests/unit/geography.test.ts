import { describe, expect, it } from "vitest";
import {
  EU_COUNTRIES,
  REGIONS,
  resolveSelection,
  selectionLabel,
} from "@/lib/geography";

describe("geography configuration", () => {
  it("lists the six destination regions", () => {
    expect(REGIONS.map((r) => r.id)).toEqual([
      "eu",
      "us",
      "ca",
      "cn",
      "kr",
      "jp",
    ]);
  });

  it("has exactly the 27 EU member states", () => {
    expect(EU_COUNTRIES).toHaveLength(27);
    expect(new Set(EU_COUNTRIES.map((c) => c.code)).size).toBe(27);
    expect(new Set(EU_COUNTRIES.map((c) => c.slug)).size).toBe(27);
  });

  it("does not include non-members", () => {
    const names = EU_COUNTRIES.map((c) => c.name);
    for (const n of ["United Kingdom", "Switzerland", "Norway", "Iceland"]) {
      expect(names).not.toContain(n);
    }
    for (const n of ["Poland", "Czechia", "Germany", "Croatia"]) {
      expect(names).toContain(n);
    }
  });
});

describe("resolveSelection", () => {
  it("resolves a region and an EU country, case-insensitively", () => {
    const s = resolveSelection("EU", "Poland");
    expect(s.region?.id).toBe("eu");
    expect(s.country?.name).toBe("Poland");
    expect(selectionLabel(s)).toBe("Poland");
  });

  it("ignores unknown regions and countries", () => {
    expect(resolveSelection("mars", "poland")).toEqual({
      region: null,
      country: null,
    });
    expect(resolveSelection("eu", "atlantis")).toMatchObject({ country: null });
    expect(selectionLabel(resolveSelection("eu", "atlantis"))).toBe(
      "European Union",
    );
  });

  it("only accepts a country inside the European Union", () => {
    expect(resolveSelection("us", "poland").country).toBeNull();
    expect(resolveSelection(null, "poland").country).toBeNull();
    expect(selectionLabel(resolveSelection(null, null))).toBeNull();
  });
});
