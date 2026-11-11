"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  Clock,
  Languages,
  MapPin,
  TriangleAlert,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DataRow,
  DataRows,
  DetailSection,
  Notice,
} from "@/components/shared/detail-ui";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ExternalLink } from "@/components/shared/fact-ui";
import { LoadingState } from "@/components/shared/loading-state";
import { SectionNav } from "@/components/shared/section-nav";
import { API_NOT_CONFIGURED } from "@/lib/api/client";
import { getProgram } from "@/lib/api/programs";
import {
  byTemporalStatus,
  DEGREE_LABELS,
  durationLabel,
  formatDate,
  formatMoney,
  languagesLabel,
  nextDeadline,
  NOT_STATED,
  STUDY_MODE_LABELS,
  BILLING_LABELS,
} from "@/lib/format";
import { useApiQuery } from "@/lib/use-api-query";
import { cn } from "@/lib/utils";
import type { ProgramDetail } from "@/types/program";
import {
  DeadlineTimeline,
  FundingList,
  RequirementGroups,
  TuitionList,
} from "./program-sections";

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="page-container section-y">{children}</div>;
}

export function ProgramDetailView() {
  const { identifier } = useParams<{ identifier: string }>();
  const { state, retry } = useApiQuery<ProgramDetail>(
    identifier ?? null,
    (signal) => getProgram(identifier, { signal }),
    (p) => Array.isArray(p?.tuition) && Array.isArray(p?.requirements),
  );

  if (state === null || state.status === "loading") {
    return (
      <Shell>
        <LoadingState label="Loading program" rows={4} />
      </Shell>
    );
  }
  if (state.status === "error") {
    if (state.error.status === 404 || state.error.status === 400) {
      return (
        <Shell>
          <EmptyState
            title="We couldn't find this program"
            description="It may have been removed, or the link may be wrong. Programs are listed once their information has been checked against official sources."
          >
            <Button asChild variant="outline">
              <Link href="/universities">Browse programs</Link>
            </Button>
          </EmptyState>
        </Shell>
      );
    }
    return (
      <Shell>
        <ErrorState
          title={
            state.error.message === API_NOT_CONFIGURED
              ? "The program service isn't configured"
              : "We couldn't load this program"
          }
          description={
            state.error.status === 0
              ? "The program service could not be reached. Check your connection and try again."
              : "The program service had a problem. Please try again in a moment."
          }
          onRetry={
            state.error.message === API_NOT_CONFIGURED ? undefined : retry
          }
        />
      </Shell>
    );
  }
  return <ProgramDetailContent p={state.data} />;
}

/** One cell of the key-facts band. The band is the only bordered surface above the fold. */
function KeyFact({
  label,
  href,
  children,
  detail,
  muted,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
  detail?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="grid content-start gap-1 bg-surface p-4 sm:p-5">
      <dt className="text-sm text-muted-foreground">
        <a
          href={href}
          className="underline decoration-dotted underline-offset-4 hover:text-foreground"
        >
          {label}
        </a>
      </dt>
      <dd
        className={cn(
          "text-xl leading-snug font-bold tabular-nums",
          muted && "text-base font-semibold text-muted-foreground",
        )}
      >
        {children}
      </dd>
      {detail ? (
        <dd className="text-sm text-muted-foreground">{detail}</dd>
      ) : null}
    </div>
  );
}

/**
 * Tuition at a glance. Every fee the backend marks CURRENT is listed with the applicant group it applies to,
 * so no fee reads as "the" price for everyone. An undated or outdated fee is described as such and is never
 * promoted to a price.
 */
function tuitionFact(p: ProgramDetail): {
  value: React.ReactNode;
  detail?: React.ReactNode;
  muted?: boolean;
} {
  const current = p.tuition.filter((t) => t.temporalStatus === "CURRENT");
  const undated = p.tuition.some((t) => t.temporalStatus === "UNKNOWN_YEAR");
  const group = (c: "DOMESTIC" | "INTERNATIONAL") =>
    c === "DOMESTIC" ? "Domestic applicants" : "International applicants";
  if (current.length > 0) {
    const groups = new Set(current.map((t) => t.studentCategory));
    return {
      value: (
        <span className="grid gap-1">
          {current.map((t, i) => (
            <span key={i} className="block">
              {formatMoney(t.amount, t.currency)}
              <span className="block text-sm font-medium text-muted-foreground">
                {BILLING_LABELS[t.billingPeriod]} · {group(t.studentCategory)}
              </span>
            </span>
          ))}
        </span>
      ),
      detail: (
        <>
          {groups.size === 1
            ? "Fees for other applicant groups are not recorded."
            : "The fee depends on the applicant group."}
          {undated ? " Another fee has no stated year." : ""}
        </>
      ),
    };
  }
  if (undated) {
    return {
      value: "Year not confirmed",
      detail: "A fee was found but its year is not stated. See details.",
      muted: true,
    };
  }
  if (p.tuition.length > 0) {
    return {
      value: "No current fee published",
      detail: "Only outdated fees are on record.",
      muted: true,
    };
  }
  return { value: "Not published", muted: true };
}

function ProgramDetailContent({ p }: { p: ProgramDetail }) {
  const { university, verification } = p;
  const place = [university.city, university.countryName]
    .filter(Boolean)
    .join(", ");
  const verified =
    verification.status === "VERIFIED" && verification.verifiedOn;
  const tuition = tuitionFact(p);
  const deadline = nextDeadline(p.intakes);
  const undatedCycle = p.intakes.some(
    (i) => i.temporalStatus === "UNKNOWN_YEAR",
  );
  const nav = [
    { id: "overview", label: "Overview" },
    { id: "tuition", label: "Tuition & funding" },
    { id: "admissions", label: "Admissions" },
    ...(p.intakes.length ? [{ id: "deadlines", label: "Deadlines" }] : []),
    ...(p.sources.length ? [{ id: "sources", label: "Sources" }] : []),
  ];
  const currentRequirements = p.requirements.filter(
    (r) => r.temporalStatus === "CURRENT",
  ).length;

  return (
    <article>
      <header className="border-b border-border bg-linear-to-b from-primary-soft to-background">
        <div className="page-container pt-6 pb-8 sm:pt-8 sm:pb-10">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-muted-foreground"
          >
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link
                  href="/universities"
                  className="underline-offset-4 hover:underline"
                >
                  Programs
                </Link>
              </li>
              <ChevronRight aria-hidden className="size-4" />
              <li>
                <Link
                  href={`/universities/${university.slug}`}
                  className="underline-offset-4 hover:underline"
                >
                  {university.name}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <p className="eyebrow">
                {DEGREE_LABELS[p.degreeLevel]}
                {p.field ? ` · ${p.field.name}` : ""}
              </p>
              <h1 className="mt-2 max-w-3xl title-page">{p.name}</h1>
              <p className="mt-2 text-lg">
                <Link
                  href={`/universities/${university.slug}`}
                  className="font-semibold underline-offset-4 hover:underline"
                >
                  {university.name}
                </Link>
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <MapPin aria-hidden className="size-4" />
                  {place}
                </li>
                {p.durationMonths ? (
                  <li className="flex items-center gap-1.5">
                    <Clock aria-hidden className="size-4" />
                    {durationLabel(p.durationMonths)}
                    {p.studyMode ? ` · ${STUDY_MODE_LABELS[p.studyMode]}` : ""}
                  </li>
                ) : null}
                {p.teachingLanguages.length ? (
                  <li className="flex items-center gap-1.5">
                    <Languages aria-hidden className="size-4" />
                    {languagesLabel(p.teachingLanguages)}
                  </li>
                ) : null}
              </ul>
              <p
                className={cn(
                  "mt-4 flex items-center gap-1.5 text-sm font-semibold",
                  verified ? "text-success" : "text-warning",
                )}
              >
                {verified ? (
                  <BadgeCheck aria-hidden className="size-4" />
                ) : (
                  <TriangleAlert aria-hidden className="size-4" />
                )}
                {verified
                  ? `Verified from official pages · last checked ${formatDate(verification.verifiedOn)}`
                  : "Not verified against official pages"}
              </p>
            </div>

            <div className="grid gap-3 sm:max-w-sm lg:min-w-64">
              {p.officialApplicationUrl ? (
                <a
                  href={p.officialApplicationUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  Apply on the official page
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
              {p.officialAdmissionsUrl ? (
                <a
                  href={p.officialAdmissionsUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      variant: p.officialApplicationUrl ? "outline" : "primary",
                    }),
                  )}
                >
                  Official admissions information
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
              {p.officialProgramUrl ? (
                <ExternalLink href={p.officialProgramUrl}>
                  Official program page
                </ExternalLink>
              ) : null}
              {!p.officialApplicationUrl ? (
                <Notice className="max-w-xs">
                  {p.officialAdmissionsUrl
                    ? "There is no verified application link for the current cycle, so no Apply button is shown. Use the admissions information to see how and when to apply."
                    : "There is no verified application link for the current cycle, so no Apply button is shown. Check the university's official website for how and when to apply."}
                </Notice>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="page-container pt-6 sm:pt-8">
        <dl className="grid gap-px overflow-hidden rounded-xl border border-border-strong bg-border-strong sm:grid-cols-2 lg:grid-cols-4">
          <KeyFact
            label="Tuition"
            href="#tuition"
            detail={tuition.detail}
            muted={tuition.muted}
          >
            {tuition.value}
          </KeyFact>
          <KeyFact
            label="Next deadline"
            href={p.intakes.length ? "#deadlines" : "#admissions"}
            muted={!deadline}
            detail={
              deadline
                ? deadline.label
                : p.intakes.length
                  ? "No current dated deadline. See the timeline."
                  : undefined
            }
          >
            {deadline
              ? formatDate(deadline.applicationDeadline)
              : undatedCycle
                ? "Date not confirmed"
                : "Not published"}
          </KeyFact>
          <KeyFact
            label="Admissions"
            href="#admissions"
            muted={currentRequirements === 0}
            detail={
              currentRequirements === 0
                ? "Check the official admissions page."
                : undefined
            }
          >
            {currentRequirements === 0
              ? "Requirements not published"
              : `${currentRequirements} published requirement${currentRequirements > 1 ? "s" : ""}`}
          </KeyFact>
          <KeyFact
            label="Funding"
            href="#tuition"
            muted
            detail="No scholarship or waiver is assumed."
          >
            No verified information
          </KeyFact>
        </dl>
      </div>

      <div className="mt-6">
        <SectionNav items={nav} />
      </div>

      <div className="page-container pb-12">
        <DetailSection id="overview" title="Overview">
          <DataRows>
            <DataRow label="Discipline">{p.field?.name ?? NOT_STATED}</DataRow>
            <DataRow label="Duration">
              {durationLabel(p.durationMonths)}
            </DataRow>
            <DataRow label="Study mode">
              {p.studyMode ? STUDY_MODE_LABELS[p.studyMode] : NOT_STATED}
            </DataRow>
            <DataRow label="Teaching languages">
              {languagesLabel(p.teachingLanguages)}
            </DataRow>
            <DataRow label="Campus city">{p.campusCity ?? NOT_STATED}</DataRow>
          </DataRows>
        </DetailSection>

        <DetailSection
          id="tuition"
          title="Tuition & funding"
          intro="Fees as published, with the period the source attached to each."
        >
          <div className="grid gap-8">
            <div>
              <h3 className="mb-4 text-base font-bold">Tuition</h3>
              <TuitionList tuition={p.tuition} />
            </div>
            <div className="border-t border-border pt-6">
              <h3 className="mb-3 text-base font-bold">
                Scholarships and funding
              </h3>
              <FundingList />
            </div>
          </div>
        </DetailSection>

        <DetailSection
          id="admissions"
          title="Admissions"
          intro="What the university publishes about applying."
        >
          <RequirementGroups requirements={byTemporalStatus(p.requirements)} />
        </DetailSection>

        {p.intakes.length ? (
          <DetailSection
            id="deadlines"
            title="Deadlines & intakes"
            intro="Dates change every year. Confirm them on the official page."
          >
            <DeadlineTimeline intakes={p.intakes} />
          </DetailSection>
        ) : null}

        {p.sources.length ? (
          <DetailSection
            id="sources"
            title="Sources"
            intro="Every fact above links to the official page it was read from."
          >
            <ul className="divide-y divide-border">
              {p.sources.map((s) => (
                <li
                  key={s.url}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5 first:pt-0"
                >
                  <ExternalLink href={s.url}>
                    {s.publisher ? `${s.publisher}: ` : ""}
                    {s.title}
                  </ExternalLink>
                  <span className="text-sm text-muted-foreground">
                    read {formatDate(s.retrievedOn)}
                  </span>
                </li>
              ))}
            </ul>
            <details className="group mt-6 text-sm">
              <summary className="min-h-6 cursor-pointer font-semibold underline decoration-dotted underline-offset-4">
                How to read this page
              </summary>
              <ul className="mt-3 grid max-w-prose gap-1.5 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Verified</strong>: a page
                  was read on the date shown. It does not promise the fact is
                  still current. Fees, dates and rules change, so confirm on the
                  official page before applying.
                </li>
                <li>
                  <strong className="text-foreground">Current</strong>: the
                  period stated by the source covers the present or an upcoming
                  cycle.
                </li>
                <li>
                  <strong className="text-foreground">Outdated</strong>: the
                  period has ended. It does not describe today.
                </li>
                <li>
                  <strong className="text-foreground">Period not stated</strong>
                  : the source gave no year. Confirm it independently.
                </li>
                <li>
                  <strong className="text-foreground">Not stated</strong>: the
                  source did not say. It is never filled in with a guess.
                </li>
                <li>
                  Pathway AI does not predict admission, scholarships or
                  savings.
                </li>
              </ul>
            </details>
          </DetailSection>
        ) : null}
      </div>
    </article>
  );
}
