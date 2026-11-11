import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgramCard } from "@/components/programs/program-card";
import {
  IntakesSection,
  RequirementsSection,
  TuitionSection,
} from "@/components/programs/program-sections";
import type {
  Intake,
  ProgramListItem,
  Requirement,
  SourceRef,
  Tuition,
} from "@/types/program";

// Synthetic fixtures for component tests only. They never ship in the app.
const source: SourceRef = {
  url: "https://example.test/source",
  title: "Synthetic source",
  publisher: "Synthetic University",
  type: "UNIVERSITY_WEBSITE",
  retrievedOn: "2026-01-02",
};

const program: ProgramListItem = {
  identifier: "synthetic-u--synthetic-p",
  slug: "synthetic-p",
  name: "Synthetic Program",
  degreeLevel: "MASTER",
  field: { slug: "synthetic-field", name: "Synthetic Field" },
  studyMode: null,
  durationMonths: null,
  teachingLanguages: [],
  campusCity: null,
  university: {
    slug: "synthetic-u",
    name: "Synthetic University",
    city: null,
    countryCode: "XA",
    countryName: "Synthetic Land",
  },
  officialProgramUrl: null,
  officialAdmissionsUrl: null,
  officialApplicationUrl: null,
  verification: { status: "UNVERIFIED", verifiedOn: null },
};

const fee = (over: Partial<Tuition>): Tuition => ({
  academicYear: null,
  effectiveFrom: null,
  effectiveTo: null,
  scopeNote: null,
  studentCategory: "INTERNATIONAL",
  amount: 1000,
  currency: "EUR",
  billingPeriod: "PER_YEAR",
  temporalStatus: "CURRENT",
  source,
  ...over,
});

describe("ProgramCard", () => {
  it("links to the program and its university and reads unknowns as not stated", () => {
    render(<ProgramCard program={program} />);
    expect(
      screen.getByRole("link", { name: "Synthetic Program" }),
    ).toHaveAttribute("href", "/programs/synthetic-u--synthetic-p");
    expect(
      screen.getByRole("link", { name: "Synthetic University" }),
    ).toHaveAttribute("href", "/universities/synthetic-u");
    expect(screen.getAllByText(/Not stated/).length).toBeGreaterThan(0);
    expect(
      screen.getByText("Not verified against official pages"),
    ).toBeInTheDocument();
    // no city: the country alone, never "null, Synthetic Land"
    expect(screen.getByText("Synthetic Land")).toBeInTheDocument();
    expect(screen.queryByText(/null/)).not.toBeInTheDocument();
  });
});

describe("TuitionSection", () => {
  it("labels current, outdated and period-less fees and puts current first", () => {
    render(
      <TuitionSection
        tuition={[
          fee({
            amount: 500,
            academicYear: "2000/2001",
            temporalStatus: "HISTORICAL",
          }),
          fee({
            amount: 250,
            scopeNote: "As printed",
            temporalStatus: "UNKNOWN_YEAR",
          }),
          fee({ amount: 1000, academicYear: "2099/2100" }),
        ]}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(within(items[0]).getByText("Current")).toBeInTheDocument();
    expect(items[0]).toHaveTextContent("EUR 1,000");
    expect(within(items[1]).getByText("Period not stated")).toBeInTheDocument();
    expect(items[1]).toHaveTextContent("Confirm it on the official page");
    expect(within(items[2]).getByText("Outdated")).toBeInTheDocument();
    expect(items[2]).toHaveTextContent("not today's price");
  });

  it("says nothing was recorded instead of implying free tuition", () => {
    render(<TuitionSection tuition={[]} />);
    expect(screen.getByText(/does not mean it is free/)).toBeInTheDocument();
  });
});

describe("IntakesSection and RequirementsSection", () => {
  const intake: Intake = {
    label: "Autumn 2027 admission",
    academicYear: null,
    startDate: null,
    applicationDeadline: null,
    applicantCategory: null,
    temporalStatus: "UNKNOWN_YEAR",
    source,
  };

  it("shows an unknown deadline as not stated", () => {
    render(<IntakesSection intakes={[intake]} />);
    expect(screen.getByText("Application deadline")).toBeInTheDocument();
    expect(screen.getAllByText("Not stated").length).toBeGreaterThan(0);
  });

  it("groups language requirements and warns when none are recorded", () => {
    const req = (type: Requirement["type"]): Requirement => ({
      applicationCycle: "2099",
      type,
      description: `Synthetic ${type}`,
      minimumValue: null,
      valueUnit: null,
      temporalStatus: "CURRENT",
      source,
    });
    const { rerender } = render(
      <RequirementsSection
        requirements={[req("LANGUAGE_TEST"), req("DOCUMENT")]}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Language requirements" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Other published requirements" }),
    ).toBeInTheDocument();
    rerender(<RequirementsSection requirements={[]} />);
    expect(
      screen.getByText(/does not mean there are none/),
    ).toBeInTheDocument();
  });
});
