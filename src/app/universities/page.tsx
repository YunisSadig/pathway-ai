import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/shared/page-intro";
import { DiscoveryExplorer } from "@/components/universities/discovery-explorer";

export const metadata: Metadata = {
  title: "Universities",
  description:
    "Discover degree programs by destination, discipline, level, language and tuition, then see the universities that offer them.",
};

const COVERAGE = [
  { item: "Universities and their locations", ready: true },
  { item: "Degree programs and teaching languages", ready: true },
  {
    item: "Admission requirements and deadlines (where published)",
    ready: true,
  },
  { item: "Tuition and fees (where published)", ready: true },
  { item: "Scholarships and funding", ready: false },
  { item: "Student life", ready: false },
];

export default function UniversitiesPage() {
  return (
    <div className="page-container section-y">
      <PageIntro title="Universities">
        Start with where you might study, then browse degree programs or
        universities. Everything is shown as published by the university, with
        its official source and the date it was checked.
      </PageIntro>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_16rem] lg:gap-14">
        <Suspense
          fallback={
            <p className="text-muted-foreground">Loading destinations…</p>
          }
        >
          <DiscoveryExplorer />
        </Suspense>
        <aside
          aria-labelledby="include-title"
          className="h-fit rounded-xl bg-muted p-5"
        >
          <h2 id="include-title" className="font-bold">
            What you can explore
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {COVERAGE.map(({ item, ready }) => (
              <li key={item} className="border-l-2 border-mint pl-3">
                {item}
                {ready ? null : (
                  <span className="ml-1 text-xs font-semibold">(not yet)</span>
                )}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
