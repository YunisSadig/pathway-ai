"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DestinationPicker,
  useSelection,
} from "@/components/shared/destination-picker";
import { EmptyState } from "@/components/shared/empty-state";
import { selectionLabel } from "@/lib/geography";

/** Geographic browsing. There is no university data yet, so results are an honest empty state. */
export function UniversitiesExplorer() {
  const selection = useSelection();
  const label = selectionLabel(selection);
  const waitingForCountry = selection.region?.id === "eu" && !selection.country;

  return (
    <div className="grid gap-8">
      <DestinationPicker basePath="/universities" />
      <section aria-labelledby="results-title">
        <h2 id="results-title" className="sr-only">
          Results
        </h2>
        {waitingForCountry ? (
          <EmptyState
            title="Choose a member state"
            description="The European Union is made up of 27 countries, each with its own universities and rules. Pick one above to set your focus. University listings are not available yet."
          />
        ) : (
          <EmptyState
            title={
              label
                ? `University listings for ${label} aren't available yet.`
                : "University listings aren't available yet."
            }
            description="We're preparing verified university and program information for each destination. Nothing is listed until it has been checked against official sources."
          >
            {label ? (
              <Button asChild variant="outline">
                <Link href="/universities" scroll={false}>
                  View all destinations
                </Link>
              </Button>
            ) : null}
            <Button asChild variant={label ? "ghost" : "outline"}>
              <Link href="/how-it-works">See how Pathway AI will work</Link>
            </Button>
          </EmptyState>
        )}
      </section>
    </div>
  );
}
