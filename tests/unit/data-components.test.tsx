import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { ScholarshipList } from "@/components/scholarships/scholarship-list";
import { UniversityList } from "@/components/universities/university-list";
import { countryName } from "@/lib/geography";
import type { Scholarship } from "@/types/scholarship";
import type { UniversitySummary } from "@/types/university";

// Synthetic fixtures for component tests only. They never ship in the app.
const university: UniversitySummary = {
  slug: "test-university",
  name: "Test University",
  city: "Testville",
  countryCode: "PL",
  countryName: "Poland",
  websiteUrl: null,
};

const scholarship: Scholarship = {
  id: "s1",
  slug: "test-scholarship",
  name: "Test Scholarship",
  sponsor: "Test Sponsor",
  countryCodes: ["DE", "JP"],
  levels: ["master"],
  coverage: ["Tuition"],
  eligibility: [],
  howToApply: "Test",
  sourceUrl: "https://example.test/scholarship",
  checkedAt: "2000-01-01",
  verification: "verified",
};

describe("countryName", () => {
  it("resolves EU members, single-country regions, and falls back to the code", () => {
    expect(countryName("pl")).toBe("Poland");
    expect(countryName("JP")).toBe("Japan");
    expect(countryName("ZZ")).toBe("ZZ");
  });
});

describe("data states", () => {
  it("LoadingState is an accessible busy status", () => {
    render(<LoadingState label="Loading universities" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Loading universities…")).toBeInTheDocument();
  });

  it("ErrorState alerts and only offers retry when asked", async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<ErrorState />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    rerender(<ErrorState onRetry={onRetry} />);
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe("presentation components", () => {
  it("UniversityList renders API data and invents nothing the API lacks", () => {
    render(<UniversityList universities={[university]} />);
    expect(
      screen.getByRole("heading", { name: "Test University" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Testville, Poland")).toBeInTheDocument();
    // websiteUrl is null: no link, and no verification or tuition claims.
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText(/verified|tuition/i)).not.toBeInTheDocument();
  });

  it("ScholarshipList renders API data and an unknown deadline honestly", () => {
    render(<ScholarshipList scholarships={[scholarship]} />);
    expect(screen.getByText("Germany, Japan")).toBeInTheDocument();
    expect(screen.getByText("Master's")).toBeInTheDocument();
    expect(screen.getByText("Not stated")).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("lists render nothing when empty", () => {
    const { container } = render(
      <>
        <UniversityList universities={[]} />
        <ScholarshipList scholarships={[]} />
      </>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe("nullable API fields", () => {
  it("UniversityCard shows only the country when the city is null", () => {
    render(
      <UniversityList
        universities={[{ ...university, city: null, countryName: "Poland" }]}
      />,
    );
    expect(screen.getByText("Poland")).toBeInTheDocument();
    expect(screen.queryByText(/null|,/)).not.toBeInTheDocument();
  });
});
