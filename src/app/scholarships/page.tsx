import type { Metadata } from "next";
import { Suspense } from "react";
import { ScholarshipsExplorer } from "@/components/scholarships/scholarships-explorer";
import { PageIntro } from "@/components/shared/page-intro";

export const metadata: Metadata = {
  title: "Scholarships",
  description:
    "Why scholarships matter when studying abroad, and what Pathway AI's scholarship directory will contain. Listings are being prepared.",
};

const WILL_INCLUDE = [
  "Sponsoring organization",
  "Country and degree level",
  "What is covered",
  "Who can apply",
  "How to apply",
  "Deadlines",
  "Official source",
];

export default function ScholarshipsPage() {
  return (
    <div className="page-container section-y">
      <PageIntro title="Scholarships">
        Funding often decides whether a plan is realistic. Scholarships differ a
        lot in who can apply, which degree level they cover and how you apply,
        so the directory will state each of these up front.
      </PageIntro>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_16rem] lg:gap-14">
        <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
          <ScholarshipsExplorer />
        </Suspense>
        <aside
          aria-labelledby="sch-include"
          className="h-fit rounded-xl bg-muted p-5"
        >
          <h2 id="sch-include" className="font-bold">
            Each entry will show
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {WILL_INCLUDE.map((item) => (
              <li key={item} className="border-l-2 border-coral pl-3">
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
