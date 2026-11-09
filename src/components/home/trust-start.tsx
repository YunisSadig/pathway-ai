import Link from "next/link";
import { Button } from "@/components/ui/button";

const FACT_RULES = [
  "Official university and government pages come first.",
  "Every fact keeps its source link and the date it was checked.",
  "Requirements, fees and scholarship conditions can differ by program, applicant group and intake, so we say which one applies.",
  "Anything we cannot confirm is labelled, never filled in.",
];

/** Trust notes beside the closing call to action. */
export function TrustStart() {
  return (
    <section className="page-container grid gap-10 section-y lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
      <div>
        <h2 className="title-section">How we handle facts</h2>
        <ul className="mt-6 space-y-3">
          {FACT_RULES.map((rule) => (
            <li key={rule} className="measure border-l-4 border-mint pl-4">
              {rule}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl bg-primary p-7 text-primary-foreground sm:p-9">
        <h2 className="title-section">Start with what you know today</h2>
        <p className="mt-3 text-primary-foreground/90">
          A few questions are enough for a first outline. Skip anything you are
          unsure about.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Link href="/assessment">Build my pathway</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="text-primary-foreground hover:bg-primary-foreground/15"
          >
            <Link href="/how-it-works">See how it works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
