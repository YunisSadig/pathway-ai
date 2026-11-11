import Link from "next/link";
import { ArrowRight, Globe2, GraduationCap } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

const TODAY = [
  {
    title: "Degree programs",
    body: "Filter by destination, level, discipline and language. Each program page shows tuition, deadlines and requirements as published, with the official source.",
    href: "/universities",
    cta: "Browse programs",
    Icon: GraduationCap,
  },
  {
    title: "Universities",
    body: "See which universities are listed in each destination and the programs each one offers.",
    href: "/universities?view=universities",
    cta: "Browse universities",
    Icon: Globe2,
  },
];

const PLANNED = [
  "Verified scholarship listings",
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
            {TODAY.map(({ title, body, href, cta, Icon }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col card p-6 transition-colors duration-150 hover:border-border-strong hover:bg-hover"
              >
                <span
                  aria-hidden
                  className="grid size-11 place-items-center rounded-lg bg-primary-soft text-primary-soft-foreground"
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-muted-foreground">{body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-soft-foreground">
                  {cta}
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
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
          <p className="mt-3 measure text-muted-foreground">
            The goal is to help you understand requirements, costs and
            alternatives before you apply. These parts are not built yet, and
            scholarships are not listed yet.
          </p>
          <Button asChild variant="link" size="link" className="mt-2">
            <Link href="/how-it-works">
              See how it works <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <ul className="divide-y divide-border border-y border-border">
          {PLANNED.map((item) => (
            <li
              key={item}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4"
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
