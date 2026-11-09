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
    body: "Browse regions and European Union member states.",
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
        Pathway AI is being built in stages. Only the first stage exists today.
        The rest are plans, not features.
      </PageIntro>

      <ol className="mt-10 max-w-3xl">
        {STAGES.map((s, i) => (
          <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
            {i < STAGES.length - 1 ? (
              <span
                aria-hidden
                className="absolute top-10 bottom-0 left-5 w-px bg-border-strong"
              />
            ) : null}
            <span
              aria-hidden
              className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full border text-sm font-bold ${
                i === 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border-strong bg-surface"
              }`}
            >
              {i + 1}
            </span>
            <div className="pt-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold">{s.title}</h2>
                <StatusBadge status={s.status}>{s.label}</StatusBadge>
              </div>
              <p className="mt-1 text-muted-foreground">{s.body}</p>
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
