"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { REGIONS } from "@/lib/geography";
import { SITE } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="page-container grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:py-24">
        <div>
          <p className="eyebrow">Study-abroad guide · In development</p>
          <h1 className="mt-4 title-hero">{SITE.tagline}</h1>
          <p className="mt-5 measure text-lg text-muted-foreground sm:text-xl">
            Pathway AI will help you compare universities, costs and
            scholarships. Today you can browse destinations; verified listings
            are being prepared.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/universities">Explore universities</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/how-it-works">How it works</Link>
            </Button>
          </div>
        </div>

        <motion.nav
          aria-label="Study destinations"
          className="rounded-2xl border border-border bg-surface p-3 shadow-lg sm:p-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <p className="px-3 pt-2 pb-2 font-display font-bold">
            Choose a destination
          </p>
          <ul className="divide-y divide-border">
            {REGIONS.map((r, i) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.12 + i * 0.04,
                  duration: 0.25,
                  ease: EASE,
                }}
              >
                <Link
                  href={`/universities?region=${r.id}`}
                  className="group flex min-h-12 items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors duration-150 hover:bg-hover"
                >
                  <span className="font-semibold">{r.name}</span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    {r.multiCountry ? "27 member states" : null}
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </section>
    </MotionConfig>
  );
}
