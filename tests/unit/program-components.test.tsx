import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgramCard } from "@/components/programs/program-card";
import {
  DeadlineTimeline,
  FundingList,
  RequirementGroups,
  TuitionList,
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

describe("TuitionList", () => {
  it("labels current, outdated and period-less fees and puts current first", () => {
    render(
      <TuitionList
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
    render(<TuitionList tuition={[]} />);
    expect(screen.getByText(/does not mean it is free/)).toBeInTheDocument();
  });
});

describe("DeadlineTimeline and RequirementGroups", () => {
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
    render(<DeadlineTimeline intakes={[intake]} />);
    expect(screen.getByText("Deadline not published")).toBeInTheDocument();
    expect(screen.getByText("Period not stated")).toBeInTheDocument();
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
      <RequirementGroups
        requirements={[req("LANGUAGE_TEST"), req("DOCUMENT")]}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Language proficiency" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Required documents" }),
    ).toBeInTheDocument();
    rerender(<RequirementGroups requirements={[]} />);
    expect(
      screen.getByText(/does not mean there are none/),
    ).toBeInTheDocument();
  });
});

describe("FundingList", () => {
  it("shows one honest empty state and never promises funding", () => {
    render(<FundingList />);
    expect(
      screen.getByText(/No verified scholarship or tuition-waiver/),
    ).toBeInTheDocument();
    expect(screen.getByText(/not a promise|is a promise/)).toBeInTheDocument();
  });

  it("keeps funding kinds distinct and says eligibility is not automatic", () => {
    render(
      <FundingList
        items={[
          {
            name: "Synthetic Waiver",
            kind: "PARTIAL_WAIVER",
            summary: "Synthetic summary",
            source,
          },
          {
            name: "Synthetic Grant",
            kind: "GRANT",
            summary: "Synthetic summary",
            source,
          },
        ]}
      />,
    );
    expect(screen.getByText("Partial tuition waiver")).toBeInTheDocument();
    expect(screen.getByText("Fixed grant")).toBeInTheDocument();
    expect(screen.getAllByText(/not automatic/)).toHaveLength(2);
  });
});

describe("deadline ordering", () => {
  it("lists current dates earliest first and outdated cycles last, by status not position", () => {
    const mk = (
      label: string,
      applicationDeadline: string | null,
      temporalStatus: Intake["temporalStatus"],
    ): Intake => ({
      label,
      academicYear: null,
      startDate: null,
      applicationDeadline,
      applicantCategory: null,
      temporalStatus,
      source,
    });
    render(
      <DeadlineTimeline
        intakes={[
          mk("Old", "2001-01-01", "HISTORICAL"),
          mk("Later", "2099-06-01", "CURRENT"),
          mk("Sooner", "2099-02-01", "CURRENT"),
        ]}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Sooner");
    expect(items[1]).toHaveTextContent("Later");
    expect(items[2]).toHaveTextContent("Old");
    expect(items[2]).toHaveTextContent("This deadline has passed");
  });
});
