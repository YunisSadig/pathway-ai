import type { Metadata } from "next";
import Link from "next/link";
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
}[] = [
  {
    title: "Explore destinations",
    body: "Browse regions and European Union member states to decide where to look.",
    status: "verified",
    label: "Available now",
  },
  {
    title: "Discover universities and scholarships",
    body: "Verified institution, program and funding information will be added.",
    status: "unknown",
    label: "In preparation",
  },
  {
    title: "Build your educational profile",
    body: "Enter your qualifications, budget and preferences.",
    status: "hypothetical",
    label: "Planned",
  },
  {
    title: "Compare opportunities",
    body: "Check known requirements and personal fit side by side.",
    status: "hypothetical",
    label: "Planned",
  },
  {
    title: "Build your pathway",
    body: "Create a primary study plan and a backup plan.",
    status: "hypothetical",
    label: "Planned",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="page-container section-y">
      <PageIntro title="How it works">
        Pathway AI is being built in five stages. Only the first exists today.
        The rest are plans, not features.
      </PageIntro>

      <ol className="mt-10 grid max-w-3xl gap-3">
        {STAGES.map((s, i) => (
          <li
            key={s.title}
            className={`flex items-start gap-4 card p-4 sm:p-5 ${
              i === 0 ? "border-primary" : ""
            }`}
          >
            <span
              aria-hidden
              className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h2>
              <p className="mt-1 text-muted-foreground">{s.body}</p>
              <StatusBadge status={s.status} className="mt-3">
                {s.label}
              </StatusBadge>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/universities">Explore universities</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/scholarships">Explore scholarships</Link>
        </Button>
      </div>
    </div>
  );
}
