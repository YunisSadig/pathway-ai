"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { UniversityPagination } from "@/components/universities/university-pagination";
import { API_NOT_CONFIGURED } from "@/lib/api/client";
import { listPrograms } from "@/lib/api/programs";
import {
  discoveryHref,
  toProgramsQuery,
  type DiscoveryParams,
} from "@/lib/discovery-query";
import { useApiQuery } from "@/lib/use-api-query";
import type { Page } from "@/types/api";
import type { ProgramListItem } from "@/types/program";
import { ProgramFilters, type Facets } from "./program-filters";
import { ProgramList } from "./program-list";

type Base = { region?: string | null; country?: string | null };

/** Facets (disciplines and languages) are derived from the programs the API holds for the destination. */
function useFacets(country: string | null): Facets {
  const { state } = useApiQuery<Page<ProgramListItem>>(
    `facets:${country ?? "all"}`,
    (signal) =>
      listPrograms({ country: country ?? undefined, size: 100 }, { signal }),
    (page) => Array.isArray(page?.content),
  );
  return useMemo(() => {
    if (state?.status !== "success") return { fields: [], languages: [] };
    const fields = new Map<string, string>();
    const languages = new Set<string>();
    for (const p of state.data.content) {
      if (p.field) fields.set(p.field.slug, p.field.name);
      p.teachingLanguages.forEach((l) => languages.add(l));
    }
    return {
      fields: [...fields]
        .map(([slug, name]) => ({ slug, name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      languages: [...languages].sort(),
    };
  }, [state]);
}

export function ProgramsPanel({
  params,
  country,
  base,
  label,
  onChange,
}: {
  params: DiscoveryParams;
  country: string | null;
  base: Base;
  label: string | null;
  onChange: (next: Partial<DiscoveryParams>) => void;
}) {
  const query = useMemo(
    () => toProgramsQuery(params, country),
    [params, country],
  );
  const { state, retry } = useApiQuery<Page<ProgramListItem>>(
    JSON.stringify(query),
    (signal) => listPrograms(query, { signal }),
    (page) => Array.isArray(page?.content),
  );
  const facets = useFacets(country);
  const clearHref = discoveryHref(base, { view: "programs" });

  return (
    <div className="grid gap-6">
      <ProgramFilters
        params={params}
        base={base}
        facets={facets}
        clearHref={clearHref}
        onChange={onChange}
      />
      <section
        aria-labelledby="results-title"
        aria-live="polite"
        className="min-h-[75vh]"
      >
        <h2 id="results-title" className="sr-only">
          Program results
        </h2>
        {state === null || state.status === "loading" ? (
          <LoadingState label="Loading programs" />
        ) : state.status === "error" ? (
          <ErrorState
            title={
              state.error.message === API_NOT_CONFIGURED
                ? "The program service isn't configured"
                : "We couldn't load programs"
            }
            description={
              state.error.message === API_NOT_CONFIGURED
                ? "Set NEXT_PUBLIC_API_BASE_URL to the backend address and restart the app."
                : state.error.status === 0
                  ? "The program service could not be reached. Check your connection and try again."
                  : state.error.status === 400
                    ? "These filters were not accepted. Adjust them and try again."
                    : "The program service had a problem. Please try again in a moment."
            }
            onRetry={
              state.error.message === API_NOT_CONFIGURED ? undefined : retry
            }
          />
        ) : state.data.content.length === 0 ? (
          <EmptyState
            title={
              state.data.totalElements > 0
                ? "That page doesn't exist"
                : `No programs found${label ? ` for ${label}` : ""}.`
            }
            description={
              state.data.totalElements > 0
                ? "There are fewer pages of results than that."
                : "Nothing matches these filters yet. Programs only appear once their information has been checked against official sources."
            }
          >
            <Button asChild variant="outline">
              <Link href={clearHref} scroll={false}>
                {state.data.totalElements > 0
                  ? "Go to the first page"
                  : "Clear filters"}
              </Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="grid gap-5">
            <p className="font-semibold">
              {state.data.totalElements}{" "}
              {state.data.totalElements === 1 ? "program" : "programs"}
              {label ? ` in ${label}` : ""}
            </p>
            <ProgramList programs={state.data.content} />
            <UniversityPagination
              page={state.data.number + 1}
              totalPages={state.data.totalPages}
              hrefFor={(page) => discoveryHref(base, { ...params, page })}
            />
            <p className="max-w-prose text-sm text-muted-foreground">
              Open a program to see tuition, deadlines and requirements exactly
              as published, with the official source. Nothing here is a promise
              of admission or funding.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
