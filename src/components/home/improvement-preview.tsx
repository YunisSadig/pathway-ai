"use client";

import { MotionConfig, motion } from "motion/react";
import { useId, useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";

// Fictional requirement used purely to illustrate the idea.
const DEMO_REQUIRED_IELTS = 6.5;
const CURRENT_IELTS = 5.5;

export function ImprovementPreview() {
  const [score, setScore] = useState(CURRENT_IELTS);
  const id = useId();
  const met = score >= DEMO_REQUIRED_IELTS;
  const progress = Math.min(score / DEMO_REQUIRED_IELTS, 1);
  const gap = Math.max(DEMO_REQUIRED_IELTS - score, 0);

  return (
    <MotionConfig reducedMotion="user">
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-balance sm:text-4xl">
              Try a what-if before you spend a month on it
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Change a score or a budget and see which requirements it would
              satisfy, which stay open and which we cannot judge yet.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display font-bold">Example University</p>
              <StatusBadge status="hypothetical">
                Fictional demo, required score invented
              </StatusBadge>
            </div>

            <label
              htmlFor={id}
              className="mt-6 flex justify-between font-semibold"
            >
              <span>If your IELTS were</span>
              <span className="tabular-nums">{score.toFixed(1)}</span>
            </label>
            <input
              id={id}
              type="range"
              min={4.5}
              max={8}
              step={0.5}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              aria-valuetext={`IELTS ${score.toFixed(1)}`}
              className="mt-3 h-11 w-full cursor-pointer accent-primary"
            />

            <div className="mt-4">
              <div
                className="h-2.5 overflow-hidden rounded-full bg-muted"
                aria-hidden
              >
                <motion.div
                  className={`h-full rounded-full ${met ? "bg-chart-2" : "bg-primary"}`}
                  initial={false}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <ul className="mt-5 divide-y divide-border" aria-live="polite">
                <li className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">Language score</p>
                    <p className="text-sm text-muted-foreground">
                      {met
                        ? `Reaches the demo minimum of ${DEMO_REQUIRED_IELTS.toFixed(1)}`
                        : `${gap.toFixed(1)} below the demo minimum of ${DEMO_REQUIRED_IELTS.toFixed(1)}`}
                    </p>
                  </div>
                  <StatusBadge status={met ? "met" : "unmet"} />
                </li>
                <li className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">Subject prerequisites</p>
                    <p className="text-sm text-muted-foreground">
                      Not entered, so we cannot judge
                    </p>
                  </div>
                  <StatusBadge status="unknown">Unknown</StatusBadge>
                </li>
              </ul>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              A higher score never guarantees admission.
            </p>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
