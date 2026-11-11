"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ExternalLink, Fact, SourceLine } from "@/components/shared/fact-ui";
import { LoadingState } from "@/components/shared/loading-state";
import { API_NOT_CONFIGURED } from "@/lib/api/client";
import { getProgram } from "@/lib/api/programs";
import {
  DEGREE_LABELS,
  durationLabel,
  formatDate,
  languagesLabel,
  NOT_STATED,
  STUDY_MODE_LABELS,
} from "@/lib/format";
import { useApiQuery } from "@/lib/use-api-query";
import { cn } from "@/lib/utils";
import type { ProgramDetail } from "@/types/program";
import {
  FundingSection,
  IntakesSection,
  RequirementsSection,
  TuitionSection,
} from "./program-sections";

export function ProgramDetailView() {
  const { identifier } = useParams<{ identifier: string }>();
  const { state, retry } = useApiQuery<ProgramDetail>(
    identifier ?? null,
    (signal) => getProgram(identifier, { signal }),
    (p) => Array.isArray(p?.tuition) && Array.isArray(p?.requirements),
  );

  if (state === null || state.status === "loading") {
    return <LoadingState label="Loading program" rows={4} />;
  }
  if (state.status === "error") {
    if (state.error.status === 404 || state.error.status === 400) {
      return (
        <EmptyState
          title="We couldn't find this program"
          description="It may have been removed, or the link may be wrong. Programs are listed once their information has been checked against official sources."
        >
          <Button asChild variant="outline">
            <Link href="/universities">Browse programs</Link>
          </Button>
        </EmptyState>
      );
    }
    return (
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
        onRetry={state.error.message === API_NOT_CONFIGURED ? undefined : retry}
      />
    );
  }
  return <ProgramDetailContent p={state.data} />;
}

function ProgramDetailContent({ p }: { p: ProgramDetail }) {
  const { university, verification } = p;
  const place = [university.city, university.countryName]
    .filter(Boolean)
    .join(", ");
  return (
    <article className="grid gap-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
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

      <header>
        <p className="text-sm font-semibold text-primary-soft-foreground">
          {DEGREE_LABELS[p.degreeLevel]}
          {p.field ? ` · ${p.field.name}` : ""}
        </p>
        <h1 className="mt-1 title-page">{p.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          <Link
            href={`/universities/${university.slug}`}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            {university.name}
          </Link>
          {place ? `, ${place}` : ""}
        </p>
        <p
          className={cn(
            "mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold",
            verification.status === "VERIFIED"
              ? "bg-success-soft text-success"
              : "bg-warning-soft text-warning",
          )}
        >
          {verification.status === "VERIFIED" && verification.verifiedOn
            ? `Verified from official pages · last checked ${formatDate(verification.verifiedOn)}`
            : "Not verified against official pages"}
        </p>
      </header>

      <section aria-labelledby="overview" className="card p-5 sm:p-6">
        <h2 id="overview" className="text-xl font-bold">
          Program overview
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Fact label="Degree level">{DEGREE_LABELS[p.degreeLevel]}</Fact>
          <Fact label="Discipline">{p.field?.name ?? NOT_STATED}</Fact>
          <Fact label="Duration">{durationLabel(p.durationMonths)}</Fact>
          <Fact label="Study mode">
            {p.studyMode ? STUDY_MODE_LABELS[p.studyMode] : NOT_STATED}
          </Fact>
          <Fact label="Teaching languages">
            {languagesLabel(p.teachingLanguages)}
          </Fact>
          <Fact label="Campus city">{p.campusCity ?? NOT_STATED}</Fact>
        </dl>
      </section>

      <section aria-labelledby="official-links" className="card p-5 sm:p-6">
        <h2 id="official-links" className="text-xl font-bold">
          Official links
        </h2>
        <ul className="mt-3 grid gap-2">
          {p.officialProgramUrl ? (
            <li>
              <ExternalLink href={p.officialProgramUrl}>
                Official program page
              </ExternalLink>
            </li>
          ) : null}
          {p.officialAdmissionsUrl ? (
            <li>
              <ExternalLink href={p.officialAdmissionsUrl}>
                Official admissions information
              </ExternalLink>
            </li>
          ) : null}
          {!p.officialProgramUrl && !p.officialAdmissionsUrl ? (
            <li className="text-sm text-muted-foreground">
              No official program or admissions page has been recorded yet.
            </li>
          ) : null}
        </ul>
        {p.officialApplicationUrl ? (
          <a
            href={p.officialApplicationUrl}
            rel="noopener noreferrer"
            target="_blank"
            className={cn(buttonVariants({ size: "lg" }), "mt-4")}
          >
            Apply on the official page
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <p className="bg-surface-muted mt-4 rounded-lg p-3 text-sm text-muted-foreground">
            There is no verified application link for the current cycle, so no
            Apply button is shown.{" "}
            {p.officialAdmissionsUrl
              ? "Use the official admissions information above to find out how and when to apply."
              : "No admissions page has been recorded either: check the university's official website for how and when to apply."}
          </p>
        )}
      </section>

      <TuitionSection tuition={p.tuition} />
      <IntakesSection intakes={p.intakes} />
      <RequirementsSection requirements={p.requirements} />
      <FundingSection />

      <section aria-labelledby="sources" className="card p-5 sm:p-6">
        <h2 id="sources" className="text-xl font-bold">
          Sources
        </h2>
        {p.sources.length ? (
          <ul className="mt-3 grid gap-2">
            {p.sources.map((s) => (
              <li key={s.url}>
                <SourceLine source={s} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No sources are recorded for this program.
          </p>
        )}
      </section>

      <aside
        aria-labelledby="how-to-read"
        className="rounded-xl bg-muted p-5 text-sm"
      >
        <h2 id="how-to-read" className="font-bold">
          How to read this page
        </h2>
        <ul className="mt-2 grid gap-1.5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Verified</strong>: read from an
            official page on the date shown. Always confirm on the official page
            before applying; fees, dates and rules change.
          </li>
          <li>
            <strong className="text-foreground">Not stated</strong>: the source
            did not say. It is never filled in with a guess.
          </li>
          <li>
            <strong className="text-foreground">Outdated</strong>: the period
            has ended, so it does not describe today.
          </li>
          <li>
            <strong className="text-foreground">Period not stated</strong>: the
            source gave no year; confirm it independently.
          </li>
          <li>
            Pathway AI does not predict admission, scholarships or savings.
          </li>
        </ul>
      </aside>
    </article>
  );
}
