import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "How it works" };

const STEPS = [
  {
    title: "Describe where you are",
    body: "Share your qualifications, goals and budget. Skip anything you do not know yet. In this prototype everything stays in your browser.",
  },
  {
    title: "Explore real universities",
    body: "Browse institutions worldwide. Every fact shows whether it is verified, and unknown stays unknown.",
  },
  {
    title: "See what is missing",
    body: "Requirements, finances and preferences are assessed separately, so one score never hides the details.",
  },
  {
    title: "Plan a primary and a backup route",
    body: "Build a roadmap with milestones, scholarships and alternatives you can revise as things change.",
  },
];

export default function HowItWorksPage() {
  return (
    <section className="page-container section-y">
      <h1 className="title-page">How it works</h1>
      <ol className="mt-8 max-w-3xl divide-y divide-border border-y border-border">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-5 py-6">
            <span className="w-8 shrink-0 font-display text-3xl font-extrabold text-primary tabular-nums">
              {i + 1}
            </span>
            <div>
              <h2 className="text-xl font-bold">{step.title}</h2>
              <p className="mt-1 measure text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <Button asChild size="lg" className="mt-8">
        <Link href="/assessment">Build my pathway</Link>
      </Button>
    </section>
  );
}
