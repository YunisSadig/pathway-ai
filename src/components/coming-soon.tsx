import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

/** Honest placeholder for routes whose milestone has not shipped yet. */
export function ComingSoon({
  title,
  description,
  planned,
}: {
  title: string;
  description: string;
  planned: string[];
}) {
  return (
    <section className="page-container section-y">
      <div className="max-w-2xl card p-6 sm:p-8">
        <StatusBadge status="unknown">In development</StatusBadge>
        <h1 className="mt-4 title-page">{title}</h1>
        <p className="mt-3 measure text-lg text-muted-foreground">
          {description}
        </p>
        <p className="mt-6 font-semibold">Planned</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-muted-foreground">
          {planned.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/how-it-works">See how it works</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
