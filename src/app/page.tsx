import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

const TODAY = [
  {
    title: "Universities",
    body: "Browse by region, and by member state inside the European Union. Listings arrive once they are verified.",
    href: "/universities",
    cta: "Explore universities",
  },
  {
    title: "Scholarships",
    body: "See what the scholarship directory will state for every entry, from eligibility to the official source.",
    href: "/scholarships",
    cta: "Explore scholarships",
  },
];

const PLANNED = [
  "Verified university and program information",
  "A student profile with qualifications and budget",
  "Comparing requirements and costs",
  "A primary and a backup study plan",
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section
        aria-labelledby="today-title"
        className="border-y border-border bg-muted section-y"
      >
        <div className="page-container">
          <h2 id="today-title" className="max-w-2xl title-section">
            What you can do today
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {TODAY.map((item) => (
              <div key={item.title} className="flex flex-col card p-6">
                <h3 className="text-xl font-extrabold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.body}</p>
                <Button asChild variant="outline" className="mt-5 self-start">
                  <Link href={item.href}>{item.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="planned-title"
        className="page-container grid gap-8 section-y lg:grid-cols-[1fr_1.2fr] lg:gap-16"
      >
        <div>
          <h2 id="planned-title" className="title-section">
            Where Pathway AI is heading
          </h2>
          <p className="mt-3 text-muted-foreground">
            The goal is to help you understand requirements, costs and
            alternatives before you apply. These parts are not built yet.
          </p>
          <Button asChild variant="ghost" className="mt-4 -ml-3">
            <Link href="/how-it-works">See how it works</Link>
          </Button>
        </div>
        <ul className="divide-y divide-border border-y border-border">
          {PLANNED.map((item) => (
            <li
              key={item}
              className="flex flex-wrap items-center justify-between gap-2 py-4"
            >
              <span className="font-semibold">{item}</span>
              <StatusBadge status="hypothetical">Planned</StatusBadge>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
