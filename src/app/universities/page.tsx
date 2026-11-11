import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/shared/page-intro";
import { DiscoveryExplorer } from "@/components/universities/discovery-explorer";

export const metadata: Metadata = {
  title: "Universities",
  description:
    "Discover degree programs by destination, discipline, level, language and tuition, then see the universities that offer them.",
};

export default function UniversitiesPage() {
  return (
    <div className="page-container section-y">
      <PageIntro title="Universities">
        Pick a destination, then browse degree programs or the universities that
        offer them. Everything is shown as published, with its official source
        and the date it was read.
      </PageIntro>

      <div className="mt-8">
        <Suspense
          fallback={
            <p className="min-h-[75vh] text-muted-foreground">
              Loading destinations…
            </p>
          }
        >
          <DiscoveryExplorer />
        </Suspense>
      </div>
    </div>
  );
}
