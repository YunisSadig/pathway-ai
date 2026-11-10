import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  GitCompareArrows,
  Library,
  Route,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/shared/page-intro";
import { StatusBadge, type Status } from "@/components/ui/status-badge";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "The five stages of Pathway AI, and which of them exist today. Only destination browsing is available now.",
};

const STAGES: {
  title: string;
  body: string;
  status: Status;
  label: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Explore destinations",
    body: "Browse regions and European Union member states to decide where to look.",
    status: "verified",
    label: "Available now",
    Icon: Compass,
  },
  {
    title: "Discover universities and scholarships",
    body: "Verified institution, program and funding information will be added.",
    status: "unknown",
    label: "In preparation",
    Icon: Library,
  },
  {
    title: "Build your educational profile",
    body: "Enter your qualifications, budget and preferences.",
    status: "hypothetical",
    label: "Planned",
    Icon: UserRound,
  },
  {
    title: "Compare opportunities",
    body: "Check known requirements and personal fit side by side.",
    status: "hypothetical",
    label: "Planned",
    Icon: GitCompareArrows,
  },
  {
    title: "Build your pathway",
    body: "Create a primary study plan and a backup plan.",
    status: "hypothetical",
    label: "Planned",
    Icon: Route,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="page-container grid gap-10 section-y lg:grid-cols-[1fr_1.35fr] lg:gap-16">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <PageIntro title="How it works">
          Pathway AI is being built in five stages. Only the first exists today.
          The rest are plans, not features.
        </PageIntro>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/universities">Explore universities</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/scholarships">Explore scholarships</Link>
          </Button>
        </div>
      </div>

      <ol className="grid gap-3">
        {STAGES.map(({ title, body, status, label, Icon }, i) => (
          <li
            key={title}
            className={`flex items-start gap-4 card p-4 sm:p-5 ${
              i === 0 ? "border-primary" : ""
            }`}
          >
            <span
              aria-hidden
              className={`grid size-11 shrink-0 place-items-center rounded-lg ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <h2 className="text-lg font-bold">
                  <span aria-hidden className="text-muted-foreground">
                    {i + 1}.{" "}
                  </span>
                  <span className="sr-only">Step {i + 1}: </span>
                  {title}
                </h2>
                <StatusBadge status={status}>{label}</StatusBadge>
              </div>
              <p className="mt-1 text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
