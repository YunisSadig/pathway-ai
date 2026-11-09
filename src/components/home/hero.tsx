"use client";

import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { SITE } from "@/lib/site";

interface Step {
  title: string;
  detail: string;
  status: Status;
  statusLabel: string;
  dot: string;
}

// Illustrative content only: no real institution, score or deadline appears here.
const STEPS: Step[] = [
  {
    title: "Your profile",
    detail: "Azerbaijan · Bachelor's · Computer science",
    status: "user",
    statusLabel: "You entered",
    dot: "bg-chart-2",
  },
  {
    title: "Gap check",
    detail: "Language certificate not taken yet",
    status: "unmet",
    statusLabel: "Missing",
    dot: "bg-chart-3",
  },
  {
    title: "Funding",
    detail: "Scholarships open to your degree level",
    status: "unknown",
    statusLabel: "To research",
    dot: "bg-primary",
  },
];

const ROUTES = [
  { title: "Primary route", detail: "A technical university in Europe" },
  { title: "Backup route", detail: "A comprehensive university in Canada" },
];

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="page-container grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
        <div>
          <h1 className="title-hero">{SITE.tagline}</h1>
          <p className="mt-5 measure text-lg text-muted-foreground sm:text-xl">
            Explore universities across six destinations, compare your options,
            find scholarships and build a study-abroad plan around your goals.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/assessment">Build my pathway</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/universities">Explore universities</Link>
            </Button>
          </div>
          <p className="mt-5 max-w-lg text-sm text-muted-foreground">
            Free prototype, still in development. What you enter stays in your
            browser.
          </p>
        </div>

        <figure aria-label="Example pathway preview" className="w-full">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-lg sm:p-6">
            <figcaption className="mb-5 flex items-center justify-between gap-3">
              <span className="font-display text-base font-bold">
                Example pathway
              </span>
              <StatusBadge status="hypothetical">Illustration</StatusBadge>
            </figcaption>

            <ol className="relative space-y-3 pl-9">
              <motion.span
                aria-hidden
                className="absolute top-3 bottom-3 left-[11px] w-0.5 origin-top rounded bg-border-strong"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
              {STEPS.map((step, i) => (
                <motion.li
                  key={step.title}
                  className="relative rounded-xl border border-border bg-background p-4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.22, duration: 0.3 }}
                >
                  <span
                    aria-hidden
                    className={`absolute top-5 -left-9 size-6 rounded-full border-4 border-surface ${step.dot}`}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{step.title}</p>
                    <StatusBadge status={step.status}>
                      {step.statusLabel}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.detail}
                  </p>
                </motion.li>
              ))}
              <li className="grid gap-3 sm:grid-cols-2">
                {ROUTES.map((route, i) => (
                  <motion.div
                    key={route.title}
                    className={`rounded-xl p-4 ${
                      i === 0
                        ? "bg-primary text-primary-foreground"
                        : "border border-dashed border-border-strong"
                    }`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.15, duration: 0.3 }}
                  >
                    <p className="font-semibold">{route.title}</p>
                    <p
                      className={`mt-1 text-sm ${
                        i === 0
                          ? "text-primary-foreground/85"
                          : "text-muted-foreground"
                      }`}
                    >
                      {route.detail}
                    </p>
                  </motion.div>
                ))}
              </li>
            </ol>
          </div>
        </figure>
      </section>
    </MotionConfig>
  );
}
