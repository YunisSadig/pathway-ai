import { describe, expect, it } from "vitest";
import {
  PAGE_SIZE,
  countryFilter,
  discoveryHref,
  resolveDiscovery,
  toProgramsQuery,
  toUniversitiesQuery,
} from "@/lib/discovery-query";

const from =
  (obj: Record<string, string>) =>
  (name: string): string | null =>
    obj[name] ?? null;

describe("resolveDiscovery", () => {
  it("is program-first with defaults for an empty URL", () => {
    expect(resolveDiscovery(from({}))).toEqual({
      view: "programs",
      q: "",
      page: 1,
      sort: "name",
      direction: "asc",
      level: null,
      field: null,
      language: null,
      tuitionMax: null,
      currency: "EUR",
    });
  });

  it("ignores invalid values and trims/limits the search", () => {
    const p = resolveDiscovery(
      from({
        view: "everything",
        q: `  ${"x".repeat(150)}  `,
        page: "-3",
        sort: "ranking",
        direction: "sideways",
        level: "phd",
        field: "Not A Slug",
        language: "english",
        tuitionMax: "-5",
        currency: "euro",
      }),
    );
    expect(p.q).toHaveLength(100);
    expect(p).toMatchObject({
      view: "programs",
      page: 1,
      sort: "name",
      direction: "asc",
      level: null,
      field: null,
      language: null,
      tuitionMax: null,
      currency: "EUR",
    });
    expect(resolveDiscovery(from({ page: "abc" })).page).toBe(1);
    expect(resolveDiscovery(from({ tuitionMax: "abc" })).tuitionMax).toBeNull();
    expect(resolveDiscovery(from({ tuitionMax: "1e9" })).tuitionMax).toBeNull();
  });

  it("accepts valid program filters (case-insensitively where the API does)", () => {
    expect(
      resolveDiscovery(
        from({
          q: "data",
          page: "2",
          sort: "university",
          direction: "desc",
          level: "MASTER",
          field: "computer-and-data-science",
          language: "EN",
          tuitionMax: "15000",
          currency: "usd",
        }),
      ),
    ).toEqual({
      view: "programs",
      q: "data",
      page: 2,
      sort: "university",
      direction: "desc",
      level: "master",
      field: "computer-and-data-science",
      language: "en",
      tuitionMax: 15000,
      currency: "USD",
    });
  });

  it("only allows the sort keys of the current view", () => {
    expect(resolveDiscovery(from({ sort: "city" })).sort).toBe("name");
    expect(
      resolveDiscovery(from({ view: "universities", sort: "city" })).sort,
    ).toBe("city");
    expect(
      resolveDiscovery(from({ view: "universities", sort: "level" })).sort,
    ).toBe("name");
    expect(resolveDiscovery(from({ sort: "level" })).sort).toBe("level");
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

describe("API queries", () => {
  const p = resolveDiscovery(
    from({
      q: "data",
      page: "3",
      level: "master",
      field: "economics",
      language: "fi",
      tuitionMax: "18000",
      currency: "EUR",
    }),
  );

  it("converts the one-based URL page to the zero-based API page", () => {
    expect(toProgramsQuery(p, "FI")).toEqual({
      q: "data",
      field: "economics",
      level: "master",
      country: "FI",
      language: "fi",
      tuitionMax: 18000,
      tuitionCurrency: "EUR",
      page: 2,
      size: PAGE_SIZE,
      sort: "name",
      direction: "asc",
    });
  });

  it("never sends a currency without a tuition maximum", () => {
    const q = toProgramsQuery(
      resolveDiscovery(from({ currency: "USD" })),
      null,
    );
    expect(q.tuitionMax).toBeUndefined();
    expect(q.tuitionCurrency).toBeUndefined();
  });

  it("builds the university query without program filters", () => {
    const q = toUniversitiesQuery(
      resolveDiscovery(from({ view: "universities", q: "x", level: "master" })),
      "DE",
    );
    expect(q).toEqual({
      q: "x",
      country: "DE",
      page: 0,
      size: PAGE_SIZE,
      sort: "name",
      direction: "asc",
    });
  });
});

describe("discoveryHref", () => {
  it("omits defaults from shareable URLs", () => {
    expect(discoveryHref({}, {})).toBe("/universities");
    expect(discoveryHref({}, { view: "programs" })).toBe("/universities");
    expect(discoveryHref({}, { view: "universities" })).toBe(
      "/universities?view=universities",
    );
  });

  it("keeps program filters together and drops them for universities", () => {
    expect(
      discoveryHref(
        { region: "eu", country: "finland" },
        {
          view: "programs",
          q: "a b",
          level: "master",
          field: "economics",
          language: "en",
          tuitionMax: 15000,
          currency: "EUR",
          sort: "university",
          direction: "desc",
          page: 2,
        },
      ),
    ).toBe(
      "/universities?region=eu&country=finland&q=a+b&level=master&field=economics&language=en&tuitionMax=15000&currency=EUR&sort=university&direction=desc&page=2",
    );
    expect(
      discoveryHref({}, { view: "universities", level: "master", q: "x" }),
    ).toBe("/universities?view=universities&q=x");
  });
});
