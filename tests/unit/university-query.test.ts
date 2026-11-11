import { describe, expect, it } from "vitest";
import {
  PAGE_SIZE,
  countryFilter,
  resolveView,
  toApiQuery,
  universitiesHref,
} from "@/lib/university-query";

const from =
  (obj: Record<string, string>) =>
  (name: string): string | null =>
    obj[name] ?? null;

describe("resolveView", () => {
  it("uses defaults for an empty URL", () => {
    expect(resolveView(from({}))).toEqual({
      q: "",
      page: 1,
      sort: "name",
      direction: "asc",
    });
  });

  it("ignores invalid values and trims/limits the search", () => {
    const view = resolveView(
      from({
        q: `  ${"x".repeat(150)}  `,
        page: "-3",
        sort: "ranking",
        direction: "sideways",
      }),
    );
    expect(view.q).toHaveLength(100);
    expect(view).toMatchObject({ page: 1, sort: "name", direction: "asc" });
    expect(resolveView(from({ page: "abc" })).page).toBe(1);
    expect(resolveView(from({ page: "3.9" })).page).toBe(3);
  });

  it("accepts valid values", () => {
    expect(
      resolveView(
        from({ q: "tech", page: "2", sort: "city", direction: "desc" }),
      ),
    ).toEqual({ q: "tech", page: 2, sort: "city", direction: "desc" });
  });
});

describe("countryFilter", () => {
  it("maps destinations to the single ISO code the API accepts", () => {
    expect(countryFilter(from({}))).toBeNull();
    expect(countryFilter(from({ region: "jp" }))).toBe("JP");
    expect(countryFilter(from({ region: "eu", country: "poland" }))).toBe("PL");
  });

  it("waits for an EU member state, and ignores invalid input", () => {
    expect(countryFilter(from({ region: "eu" }))).toBe("pending");
    expect(countryFilter(from({ region: "eu", country: "atlantis" }))).toBe(
      "pending",
    );
    expect(countryFilter(from({ region: "mars" }))).toBeNull();
    expect(countryFilter(from({ country: "poland" }))).toBeNull();
  });
});

describe("toApiQuery and universitiesHref", () => {
  it("converts the one-based URL page to the zero-based API page", () => {
    expect(
      toApiQuery({ q: "", page: 3, sort: "name", direction: "asc" }, "DE"),
    ).toEqual({
      q: undefined,
      country: "DE",
      page: 2,
      size: PAGE_SIZE,
      sort: "name",
      direction: "asc",
    });
  });

  it("omits defaults from shareable URLs", () => {
    expect(universitiesHref({}, {})).toBe("/universities");
    expect(
      universitiesHref(
        { region: "eu", country: "poland" },
        { q: "a b", page: 2, sort: "city", direction: "desc" },
      ),
    ).toBe(
      "/universities?region=eu&country=poland&q=a+b&sort=city&direction=desc&page=2",
    );
  });
});
