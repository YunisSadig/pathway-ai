"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DestinationPicker,
  useSelection,
} from "@/components/shared/destination-picker";
import { EmptyState } from "@/components/shared/empty-state";
import { selectionLabel } from "@/lib/geography";
import { cn } from "@/lib/utils";

const LEVELS = [
  { id: "bachelor", name: "Bachelor's" },
  { id: "master", name: "Master's" },
  { id: "doctoral", name: "Doctoral" },
];

/** Browse by degree level and destination. There is no scholarship data yet. */
export function ScholarshipsExplorer() {
  const params = useSearchParams();
  const selection = useSelection();
  const level = LEVELS.find((l) => l.id === params.get("level")) ?? null;
  const label = selectionLabel(selection);

  const levelHref = (id: string | null) => {
    const q = new URLSearchParams(params.toString());
    if (id) q.set("level", id);
    else q.delete("level");
    const s = q.toString();
    return s ? `/scholarships?${s}` : "/scholarships";
  };

  const scope = [
    level ? `${level.name} study` : null,
    label ? `in ${label}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="grid gap-8">
      <nav aria-label="Degree level">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Degree level
        </h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <li key={l.id}>
              <Link
                href={levelHref(level?.id === l.id ? null : l.id)}
                scroll={false}
                aria-current={level?.id === l.id ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-lg border px-4 text-sm font-semibold transition-colors duration-150 active:translate-y-px",
                  level?.id === l.id
                    ? "border-primary bg-selected text-primary-soft-foreground"
                    : "border-border bg-surface hover:bg-hover",
                )}
              >
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <DestinationPicker basePath="/scholarships" />

      <section aria-labelledby="sch-results">
        <h2 id="sch-results" className="sr-only">
          Results
        </h2>
        <EmptyState
          title={
            scope
              ? `Scholarship listings for ${scope} aren't available yet.`
              : "Scholarship listings aren't available yet."
          }
          description="We're preparing a directory of scholarships with their official sources. Until a scholarship has been checked against its official page, it won't appear here."
        >
          {scope ? (
            <Button asChild variant="outline">
              <Link href="/scholarships" scroll={false}>
                Clear all choices
              </Link>
            </Button>
          ) : null}
          <Button
            asChild
            variant={scope ? "link" : "outline"}
            size={scope ? "link" : "md"}
          >
            <Link href="/universities">Browse universities</Link>
          </Button>
        </EmptyState>
      </section>
    </div>
  );
}
