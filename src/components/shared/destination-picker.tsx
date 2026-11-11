"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Check, MapPin } from "lucide-react";
import { EU_COUNTRIES, REGIONS, resolveSelection } from "@/lib/geography";
import { cn } from "@/lib/utils";

const chip =
  "inline-flex min-h-11 items-center rounded-lg border px-4 text-sm font-semibold transition-colors duration-150 active:translate-y-px";
const idle = "border-border bg-surface hover:bg-hover";
const on = "border-primary bg-selected text-primary-soft-foreground";
const textLink =
  "inline-flex min-h-11 items-center px-1 text-sm font-semibold text-primary-soft-foreground underline underline-offset-4 hover:no-underline";

/**
 * Region and EU member-state navigation. Every option is a real link that updates the query string, so it works
 * with the keyboard, the back button and shared URLs.
 *
 * Once a destination is chosen the picker collapses to a one-line summary with "Change" and "Clear", so results
 * start near the top of the page instead of below 27 country buttons. It stays open while a choice is still
 * needed (no region yet, or the EU without a member state).
 */
export function DestinationPicker({ basePath }: { basePath: string }) {
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const { region, country } = resolveSelection(
    params.get("region"),
    params.get("country"),
  );

  const href = (next: { region?: string; country?: string }) => {
    const q = new URLSearchParams();
    // Keep the view, search, filters and sort when only the destination changes.
    for (const key of [
      "view",
      "q",
      "level",
      "field",
      "language",
      "tuitionMax",
      "currency",
      "sort",
      "direction",
    ]) {
      const value = params.get(key);
      if (value) q.set(key, value);
    }
    if (next.region) q.set("region", next.region);
    if (next.country) q.set("country", next.country);
    const s = q.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  const needsChoice = !region || (region.id === "eu" && !country);
  const expanded = needsChoice || open;
  const summary = country ? `${country.name}, European Union` : region?.name;

  return (
    <div className="grid gap-4">
      {region && !needsChoice ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-border bg-surface px-4 py-1">
          <p className="flex items-center gap-2 py-2">
            <MapPin aria-hidden className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Destination</span>
            <strong>{summary}</strong>
          </p>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="destination-options"
              onClick={() => setOpen((v) => !v)}
              className={textLink}
            >
              {open ? "Close" : "Change"}
            </button>
            <Link href={href({})} scroll={false} className={textLink}>
              Clear selection
            </Link>
          </div>
        </div>
      ) : null}

      <div
        id="destination-options"
        className={cn("grid gap-5", !expanded && "hidden")}
      >
        <nav aria-label="Destination regions">
          <h2 className="text-sm font-medium text-muted-foreground">Region</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <li key={r.id}>
                <Link
                  href={href({ region: r.id })}
                  scroll={false}
                  onClick={() => setOpen(r.id === "eu")}
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
          <nav aria-label="European Union member states">
            <h2 className="text-sm font-medium text-muted-foreground">
              Member states ({EU_COUNTRIES.length})
            </h2>
            <ul className="-mx-1 mt-1 grid max-h-[17.5rem] grid-cols-2 gap-2 overflow-y-auto p-1 sm:max-h-none sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4 xl:grid-cols-6">
              {EU_COUNTRIES.map((c) => (
                <li key={c.code}>
                  <Link
                    href={href({ region: "eu", country: c.slug })}
                    scroll={false}
                    onClick={() => setOpen(false)}
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
                      className="text-sm font-medium text-muted-foreground"
                    >
                      {c.code}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </div>
  );
}
