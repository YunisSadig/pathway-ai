import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "AI Advisor preview" };

const EXAMPLES = [
  [
    "What should I check first for a master's abroad?",
    "Your degree level, your language certificate and your budget. Then read the program page for the exact requirements.",
  ],
  [
    "Can I apply with a lower language score?",
    "That depends on the program. The advisor would point you to the official requirement and show your gap. It would not predict admission.",
  ],
  [
    "What if my first choice does not work out?",
    "It would open your pathway planner and suggest which alternative route to review.",
  ],
];

export default function AdvisorPreviewPage() {
  return (
    <section className="page-container section-y">
      <div className="max-w-2xl">
        <StatusBadge status="hypothetical">Illustration only</StatusBadge>
        <h1 className="mt-3 title-page">AI Advisor preview</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          A planned assistant that would help you read your own plan. It is{" "}
          <strong>not connected to any AI service</strong> today. The answers
          below are written examples, not generated, and they are not checked
          against official sources.
        </p>
      </div>
      <ul className="mt-8 grid max-w-2xl gap-4">
        {EXAMPLES.map(([q, a]) => (
          <li key={q} className="card p-5">
            <p className="font-semibold">{q}</p>
            <p className="mt-2 text-muted-foreground">{a}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/pathway-planner">Open the pathway planner</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/universities">Browse universities</Link>
        </Button>
      </div>
    </section>
  );
}
