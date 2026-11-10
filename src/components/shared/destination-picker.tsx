"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EU_COUNTRIES,
  REGIONS,
  resolveSelection,
  type Selection,
} from "@/lib/geography";
import { cn } from "@/lib/utils";

const chip =
  "inline-flex min-h-11 items-center rounded-lg border px-4 text-sm font-semibold transition-colors duration-150 active:translate-y-px";
const idle = "border-border bg-surface hover:bg-hover";
const on = "border-primary bg-selected text-primary-soft-foreground";

/** Reads the current, validated selection from the URL. */
export function useSelection(): Selection {
  const params = useSearchParams();
  return resolveSelection(params.get("region"), params.get("country"));
}

/**
 * Region and EU member-state navigation. Every option is a real link that updates the
 * query string, so it works with the keyboard, the back button and shared URLs.
 */
export function DestinationPicker({ basePath }: { basePath: string }) {
  const params = useSearchParams();
  const { region, country } = resolveSelection(
    params.get("region"),
    params.get("country"),
  );

  const href = (next: { region?: string; country?: string }) => {
    const q = new URLSearchParams();
    if (next.region) q.set("region", next.region);
    if (next.country) q.set("country", next.country);
    const s = q.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  return (
    <div className="grid gap-6">
      <nav aria-label="Destination regions">
        <h2 className="text-sm font-semibold text-muted-foreground">Region</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <li key={r.id}>
              <Link
                href={href({ region: r.id })}
                scroll={false}
                aria-current={region?.id === r.id ? "true" : undefined}
                className={cn(chip, region?.id === r.id ? on : idle)}
              >
                {region?.id === r.id ? (
                  <Check aria-hidden className="mr-1.5 size-4" />
                ) : null}
                {r.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {region?.id === "eu" ? (
        <nav
          aria-label="European Union member states"
          className="animate-[fade-in_200ms_ease-out]"
        >
          <h2 className="text-sm font-semibold text-muted-foreground">
            Member states ({EU_COUNTRIES.length})
          </h2>
          <ul className="-mx-1 mt-1 grid max-h-[17.5rem] grid-cols-2 gap-2 overflow-y-auto p-1 sm:max-h-none sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4 xl:grid-cols-5">
            {EU_COUNTRIES.map((c) => (
              <li key={c.code}>
                <Link
                  href={href({ region: "eu", country: c.slug })}
                  scroll={false}
                  aria-current={country?.code === c.code ? "true" : undefined}
                  className={cn(
                    chip,
                    "w-full justify-between gap-2",
                    country?.code === c.code ? on : idle,
                  )}
                >
                  <span>{c.name}</span>
                  <span
                    aria-hidden
                    className="text-xs font-medium text-muted-foreground"
                  >
                    {c.code}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {region ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-muted px-4 py-2">
          <p className="text-sm">
            Selected:{" "}
            <strong>
              {country ? `${country.name}, European Union` : region.name}
            </strong>
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href={href({})} scroll={false}>
              <X aria-hidden /> Clear selection
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
