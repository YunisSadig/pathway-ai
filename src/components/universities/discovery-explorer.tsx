"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DestinationPicker } from "@/components/shared/destination-picker";
import { EmptyState } from "@/components/shared/empty-state";
import { ProgramsPanel } from "@/components/programs/programs-panel";
import {
  countryFilter,
  discoveryHref,
  resolveDiscovery,
  type DiscoveryParams,
} from "@/lib/discovery-query";
import { resolveSelection, selectionLabel } from "@/lib/geography";
import { cn } from "@/lib/utils";
import { UniversitiesPanel } from "./universities-panel";

const tab =
  "inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold transition-colors duration-150";

/**
 * Program-first discovery. Choose a destination, then browse programs (default) or the universities that offer
 * them. Every filter lives in the URL, so views are shareable and the back button works.
 */
export function DiscoveryExplorer() {
  const search = useSearchParams();
  const router = useRouter();
  const get = (n: string) => search.get(n);
  const selection = resolveSelection(get("region"), get("country"));
  const label = selectionLabel(selection);
  const base = {
    region: selection.region?.id,
    country: selection.country?.slug,
  };
  const params = resolveDiscovery(get);
  const country = countryFilter(get);
  const pending = country === "pending";

  const change = (next: Partial<DiscoveryParams>) =>
    router.push(discoveryHref(base, { ...params, ...next, page: 1 }), {
      scroll: false,
    });

  return (
    <div className="grid gap-8">
      <DestinationPicker basePath="/universities" />

      <nav aria-label="Browse by" className="flex flex-wrap gap-2">
        {(
          [
            ["programs", "Programs"],
            ["universities", "Universities"],
          ] as const
        ).map(([view, text]) => (
          <Link
            key={view}
            href={discoveryHref(base, {
              view,
              q: params.q,
              direction: params.direction,
              ...(view === "programs"
                ? {
                    level: params.level,
                    field: params.field,
                    language: params.language,
                    tuitionMax: params.tuitionMax,
                    currency: params.currency,
                  }
                : {}),
            })}
            scroll={false}
            aria-current={params.view === view ? "page" : undefined}
            className={cn(
              tab,
              params.view === view
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-surface hover:bg-hover",
            )}
          >
            {text}
          </Link>
        ))}
      </nav>

      {pending ? (
        <section aria-labelledby="results-title">
          <h2 id="results-title" className="sr-only">
            Results
          </h2>
          <EmptyState
            title="Choose a member state"
            description="The European Union is made up of 27 countries, each with its own universities and rules. Pick one above to see its programs and universities."
          />
        </section>
      ) : params.view === "programs" ? (
        <ProgramsPanel
          params={params}
          country={country}
          base={base}
          label={label}
          onChange={change}
        />
      ) : (
        <UniversitiesPanel
          params={params}
          country={country}
          base={base}
          label={label}
          onChange={change}
        />
      )}
    </div>
  );
}
