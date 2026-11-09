"use client";

import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { SITE } from "@/lib/site";

interface Node {
  title: string;
  detail: string;
  status: Status;
  statusLabel: string;
  tone: string;
}

// Illustrative content only: no real institution, score or deadline appears here.
const NODES: Node[] = [
  {
    title: "Your profile",
    detail: "Azerbaijan · Bachelor's · Computer science",
    status: "user",
    statusLabel: "You entered",
    tone: "bg-mint",
  },
  {
    title: "Gap check",
    detail: "Language certificate not taken yet",
    status: "unmet",
    statusLabel: "Missing",
    tone: "bg-coral",
  },
  {
    title: "Funding",
    detail: "Scholarships open to your degree level",
    status: "unknown",
    statusLabel: "To research",
    tone: "bg-primary",
  },
];

const ROUTES = [
  { title: "Primary route", detail: "A technical university in Europe" },
  { title: "Backup route", detail: "A comprehensive university in Canada" },
];

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-28">
        <div>
          <h1 className="text-5xl font-extrabold text-balance sm:text-6xl lg:text-7xl">
            {SITE.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Pathway AI turns scattered requirements, costs and deadlines into
            one plan you can follow, with a backup route if the first one
            changes.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/assessment">Build my pathway</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/universities">Explore universities</Link>
            </Button>
          </div>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            Free prototype. What you enter stays in your browser.
          </p>
        </div>

        <figure aria-label="Example pathway preview">
          <div className="relative rounded-2xl border border-border bg-surface p-5 shadow-lg sm:p-7">
            <figcaption className="mb-5 flex items-center justify-between gap-3">
              <span className="font-display text-base font-bold">
                Example pathway
              </span>
              <StatusBadge status="hypothetical">Illustration</StatusBadge>
            </figcaption>

            <ol className="relative space-y-4 pl-9">
              <motion.span
                aria-hidden
                className="absolute top-3 bottom-3 left-[11px] w-0.5 origin-top rounded bg-border-strong"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
              {NODES.map((node, i) => (
                <motion.li
                  key={node.title}
                  className="relative rounded-xl border border-border bg-background p-4"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.28, duration: 0.35 }}
                >
                  <span
                    aria-hidden
                    className={`absolute top-5 -left-9 size-6 rounded-full border-4 border-surface ${node.tone}`}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{node.title}</p>
                    <StatusBadge status={node.status}>
                      {node.statusLabel}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {node.detail}
                  </p>
                </motion.li>
              ))}
              <li className="relative grid gap-3 sm:grid-cols-2">
                {ROUTES.map((route, i) => (
                  <motion.div
                    key={route.title}
                    className={`rounded-xl p-4 ${
                      i === 0
                        ? "bg-primary text-primary-foreground"
                        : "border border-dashed border-border-strong bg-surface"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.15 + i * 0.2, duration: 0.4 }}
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
