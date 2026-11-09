import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/shared/page-intro";
import { UniversitiesExplorer } from "@/components/universities/universities-explorer";

export const metadata: Metadata = {
  title: "Universities",
  description:
    "Browse study destinations by region and by European Union member state. University listings are being prepared.",
};

const WILL_INCLUDE = [
  "Universities and their locations",
  "Degree programs",
  "Teaching languages",
  "Admission requirements",
  "Tuition and costs",
  "Scholarships",
  "Student life",
];

export default function UniversitiesPage() {
  return (
    <div className="page-container section-y">
      <PageIntro title="Universities">
        Start with where you might study. University information will be added
        destination by destination, once it has been verified.
      </PageIntro>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_16rem] lg:gap-14">
        <Suspense
          fallback={
            <p className="text-muted-foreground">Loading destinations…</p>
          }
        >
          <UniversitiesExplorer />
        </Suspense>
        <aside
          aria-labelledby="include-title"
          className="h-fit rounded-xl bg-muted p-5"
        >
          <h2 id="include-title" className="font-bold">
            What you will be able to explore
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {WILL_INCLUDE.map((item) => (
              <li key={item} className="border-l-2 border-mint pl-3">
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
