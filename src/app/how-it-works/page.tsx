import type { Metadata } from "next";

export const metadata: Metadata = { title: "How it works" };

const STEPS = [
  {
    title: "Tell us where you are",
    body: "Share your qualifications, goals and budget. In this prototype everything stays in your browser.",
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
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold">How it works</h1>
      <ol className="mt-10 space-y-8">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft font-display font-bold text-primary-soft-foreground">
              {i + 1}
            </span>
            <div>
              <h2 className="text-xl font-bold">{step.title}</h2>
              <p className="mt-1 text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
