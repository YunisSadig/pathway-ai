"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { DetailSection, Missing } from "@/components/shared/detail-ui";
import { ExternalLink } from "@/components/shared/fact-ui";
import { LoadingState } from "@/components/shared/loading-state";
import { API_NOT_CONFIGURED } from "@/lib/api/client";
import { getUniversity } from "@/lib/api/universities";
import { DEGREE_LABELS, durationLabel, NOT_STATED } from "@/lib/format";
import { useApiQuery } from "@/lib/use-api-query";
import type { UniversityDetail } from "@/types/university";

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="page-container section-y">{children}</div>;
}

export function UniversityDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const { state, retry } = useApiQuery<UniversityDetail>(
    slug ?? null,
    (signal) => getUniversity(slug, { signal }),
    (u) => Array.isArray(u?.programs),
  );

  if (state === null || state.status === "loading") {
    return (
      <Shell>
        <LoadingState label="Loading university" rows={3} />
      </Shell>
    );
  }
  if (state.status === "error") {
    if (state.error.status === 404 || state.error.status === 400) {
      return (
        <Shell>
          <EmptyState
            title="We couldn't find this university"
            description="It may have been removed, or the link may be wrong."
          >
            <Button asChild variant="outline">
              <Link href="/universities?view=universities">
                Browse universities
              </Link>
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
              ? "The university service isn't configured"
              : "We couldn't load this university"
          }
          description={
            state.error.status === 0
              ? "The university service could not be reached. Check your connection and try again."
              : "The university service had a problem. Please try again in a moment."
          }
          onRetry={
            state.error.message === API_NOT_CONFIGURED ? undefined : retry
          }
        />
      </Shell>
    );
  }
  const u = state.data;
  const place = [u.city, u.countryName].filter(Boolean).join(", ");
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
                  href="/universities?view=universities"
                  className="underline-offset-4 hover:underline"
                >
                  Universities
                </Link>
              </li>
              <ChevronRight aria-hidden className="size-4" />
              <li aria-current="page">{u.name}</li>
            </ol>
          </nav>
          <p className="mt-5 eyebrow">University</p>
          <h1 className="mt-2 max-w-3xl title-page">{u.name}</h1>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <MapPin aria-hidden className="size-4" />
              {place}
            </li>
            {u.websiteUrl ? (
              <li className="flex items-center gap-1.5">
                <Globe aria-hidden className="size-4" />
                <ExternalLink href={u.websiteUrl}>
                  University website
                </ExternalLink>
              </li>
            ) : null}
          </ul>
          {u.description ? (
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground">
              {u.description}
            </p>
          ) : null}
        </div>
      </header>

      <div className="page-container pb-12">
        <DetailSection
          id="programs"
          title={`Degree programs (${u.programs.length})`}
          intro="Tuition, deadlines and requirements are on each program page, with their official sources."
        >
          {u.programs.length === 0 ? (
            <Missing>
              No degree programs have been recorded for this university yet.
            </Missing>
          ) : (
            <ul className="divide-y divide-border">
              {u.programs.map((p) => (
                <li
                  key={p.identifier}
                  className="grid gap-0.5 py-4 first:pt-0 last:pb-0"
                >
                  <p className="text-xs font-semibold tracking-wide text-primary-soft-foreground uppercase">
                    {DEGREE_LABELS[p.degreeLevel]}
                  </p>
                  <h3 className="text-lg leading-snug font-bold">
                    <Link
                      href={`/programs/${p.identifier}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {p.fieldOfStudy ?? NOT_STATED} ·{" "}
                    {durationLabel(p.durationMonths)}
                    {p.teachingLanguage ? ` · ${p.teachingLanguage}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </DetailSection>
      </div>
    </article>
  );
}
