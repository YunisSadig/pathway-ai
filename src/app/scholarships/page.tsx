import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Flag, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";

export const metadata: Metadata = {
  title: "Scholarships",
  description:
    "Why scholarships matter when studying abroad, and what Pathway AI's scholarship directory will contain. Listings are being prepared.",
};

const WHY_VARIES = [
  {
    title: "By institution",
    body: "Universities run their own funding, with their own rules.",
    Icon: Building2,
  },
  {
    title: "By country",
    body: "Governments and agencies fund study in specific places, often for specific nationalities.",
    Icon: Flag,
  },
  {
    title: "By degree level",
    body: "Bachelor's, master's and doctoral funding are usually separate.",
    Icon: GraduationCap,
  },
];

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
        Funding often decides whether a plan is realistic. Who can apply, what
        is covered and how to apply differ a lot, so the directory will state
        each of these up front.
      </PageIntro>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_16rem] lg:gap-14">
        <div className="grid gap-8">
          <section aria-labelledby="why-title">
            <h2 id="why-title" className="text-xl font-extrabold">
              Why funding differs
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {WHY_VARIES.map(({ title, body, Icon }) => (
                <li key={title} className="card p-5">
                  <span
                    aria-hidden
                    className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary-soft-foreground"
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-3 font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </li>
              ))}
            </ul>
          </section>

          <EmptyState
            title="Scholarship listings aren't available yet."
            description="We're preparing a directory of scholarships with their official sources. Until a scholarship has been checked against its official page, it won't appear here."
          >
            <Button asChild variant="outline">
              <Link href="/universities">Browse universities</Link>
            </Button>
          </EmptyState>
        </div>

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
