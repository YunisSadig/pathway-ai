import { describe, expect, it } from "vitest";
import {
  applicantLabel,
  durationLabel,
  formatDate,
  formatMoney,
  languageName,
  languagesLabel,
  NOT_STATED,
  tuitionPeriodLabel,
} from "@/lib/format";

describe("formatMoney", () => {
  it("shows the ISO currency code so units are never ambiguous", () => {
    expect(formatMoney(13000, "EUR")).toBe("EUR 13,000");
    expect(formatMoney(1234.5, "USD")).toBe("USD 1,234.50");
  });
  it("survives an unknown currency code", () => {
    expect(formatMoney(5, "")).toContain("5");
  });
});

describe("formatDate", () => {
  it("formats date-only values without shifting the day", () => {
    expect(formatDate("2027-01-19")).toBe("19 Jan 2027");
    expect(formatDate("2024-08-01")).toBe("1 Aug 2024");
  });
  it("reads missing values as not stated", () => {
    expect(formatDate(null)).toBe(NOT_STATED);
    expect(formatDate(undefined)).toBe(NOT_STATED);
  });
});

describe("durationLabel", () => {
  it("renders years and months, and never invents a duration", () => {
    expect(durationLabel(36)).toBe("3 years");
    expect(durationLabel(12)).toBe("1 year");
    expect(durationLabel(18)).toBe("18 months");
    expect(durationLabel(null)).toBe(NOT_STATED);
    expect(durationLabel(0)).toBe(NOT_STATED);
  });
});

describe("languages", () => {
  it("names languages and reports none as not stated", () => {
    expect(languageName("en")).toBe("English");
    expect(languagesLabel(["fi", "sv"])).toBe("Finnish, Swedish");
    expect(languagesLabel([])).toBe(NOT_STATED);
  });
});

describe("applicantLabel and tuitionPeriodLabel", () => {
  it("does not overstate what a group means", () => {
    expect(applicantLabel("INTERNATIONAL")).toContain(
      "as the university groups them",
    );
    expect(applicantLabel("DOMESTIC")).toBe("Domestic applicants");
    expect(applicantLabel(null)).toBe("All applicants");
  });

  it("describes exactly the period the source stated", () => {
    const none = { effectiveFrom: null, effectiveTo: null };
    expect(tuitionPeriodLabel({ academicYear: "2026/2027", ...none })).toBe(
      "Academic year 2026/2027",
    );
    expect(
      tuitionPeriodLabel({
        academicYear: null,
        effectiveFrom: "2025-08-01",
        effectiveTo: null,
      }),
    ).toBe("Study rights started on or after 1 Aug 2025");
    expect(
      tuitionPeriodLabel({
        academicYear: null,
        effectiveFrom: null,
        effectiveTo: "2024-08-01",
      }),
    ).toBe("Study rights started on or before 1 Aug 2024");
    expect(tuitionPeriodLabel({ academicYear: null, ...none })).toBe(
      "Period not stated by the source",
    );
  });
});
