"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ExternalLink } from "@/components/shared/fact-ui";
import { LoadingState } from "@/components/shared/loading-state";
import { API_NOT_CONFIGURED } from "@/lib/api/client";
import { getUniversity } from "@/lib/api/universities";
import { DEGREE_LABELS, durationLabel, NOT_STATED } from "@/lib/format";
import { useApiQuery } from "@/lib/use-api-query";
import type { UniversityDetail } from "@/types/university";

export function UniversityDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const { state, retry } = useApiQuery<UniversityDetail>(
    slug ?? null,
    (signal) => getUniversity(slug, { signal }),
    (u) => Array.isArray(u?.programs),
  );

  if (state === null || state.status === "loading") {
    return <LoadingState label="Loading university" rows={3} />;
  }
  if (state.status === "error") {
    if (state.error.status === 404 || state.error.status === 400) {
      return (
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
      );
    }
    return (
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
        onRetry={state.error.message === API_NOT_CONFIGURED ? undefined : retry}
      />
    );
  }
  const u = state.data;
  const place = [u.city, u.countryName].filter(Boolean).join(", ");
  return (
    <article className="grid gap-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
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
      <header>
        <h1 className="title-page">{u.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{place}</p>
        {u.websiteUrl ? (
          <p className="mt-3">
            <ExternalLink href={u.websiteUrl}>University website</ExternalLink>
          </p>
        ) : null}
      </header>
      {u.description ? (
        <p className="max-w-prose text-muted-foreground">{u.description}</p>
      ) : null}

      <section aria-labelledby="programs" className="grid gap-3">
        <h2 id="programs" className="text-xl font-bold">
          Degree programs ({u.programs.length})
        </h2>
        {u.programs.length === 0 ? (
          <p className="bg-surface-muted rounded-lg border border-dashed border-border-strong p-4 text-sm text-muted-foreground">
            No degree programs have been recorded for this university yet.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {u.programs.map((p) => (
              <li key={p.identifier}>
                <article className="h-full card p-5">
                  <p className="text-xs font-semibold tracking-wide text-primary-soft-foreground uppercase">
                    {DEGREE_LABELS[p.degreeLevel]}
                  </p>
                  <h3 className="mt-1 text-lg leading-snug font-bold">
                    <Link
                      href={`/programs/${p.identifier}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.fieldOfStudy ?? NOT_STATED} ·{" "}
                    {durationLabel(p.durationMonths)}
                    {p.teachingLanguage ? ` · ${p.teachingLanguage}` : ""}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="text-sm text-muted-foreground">
        Tuition, deadlines and requirements are on each program page, with their
        official sources.
      </p>
    </article>
  );
}
