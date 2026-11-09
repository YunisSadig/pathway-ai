"use client";

import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { Tabs } from "radix-ui";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

const DESTINATIONS = [
  "European Union",
  "United States",
  "Canada",
  "China",
  "South Korea",
  "Japan",
];

const SCHOLARSHIP_FIELDS = [
  ["Degree level", "Bachelor's, master's or doctoral, always stated"],
  ["Who can apply", "Citizenship, nomination and qualification rules"],
  ["How to apply", "The official route, such as a school or embassy"],
  ["Deadline", "Shown only when confirmed for the current cycle"],
];

const BRANCHES = [
  ["a deadline passes", "Move to a later intake or a backup route."],
  ["funding falls short", "Compare destinations with a smaller budget gap."],
  ["your qualifications change", "Reassess requirements, keep your plan."],
];

const TABS = [
  {
    id: "universities",
    label: "Find universities",
    summary: "Six destinations, one format",
  },
  {
    id: "scholarships",
    label: "Find scholarships",
    summary: "Eligibility stated up front",
  },
  {
    id: "fit",
    label: "Check your fit",
    summary: "Requirements, money and goals",
  },
  {
    id: "plan",
    label: "Plan your route",
    summary: "A main route and a backup",
  },
] as const;

// A fictional requirement, used only to show how a what-if works.
const DEMO_REQUIRED_IELTS = 6.5;
const CURRENT_IELTS = 5.5;

function Panel({
  title,
  body,
  footer,
  children,
}: {
  title: string;
  body: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-full gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-2xl font-extrabold">{title}</h3>
          <StatusBadge status="unknown">In development</StatusBadge>
        </div>
        <p className="mt-3 text-muted-foreground">{body}</p>
        {footer ? <div className="mt-auto pt-6">{footer}</div> : null}
      </div>
      <div className="rounded-xl border border-border bg-background p-5">
        {children}
      </div>
    </div>
  );
}

function UniversitiesPanel() {
  return (
    <Panel
      title="Search universities across six destinations"
      body="Filter by country, subject and city, then save the ones worth a closer look. Each fact shows whether it was checked against an official source."
      footer={
        <Button asChild>
          <Link href="/universities">Explore universities</Link>
        </Button>
      }
    >
      <p className="font-semibold">Destinations</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {DESTINATIONS.map((d) => (
          <li
            key={d}
            className="rounded-full border border-border-strong px-3.5 py-1.5 text-sm font-medium"
          >
            {d}
          </li>
        ))}
      </ul>
      <p className="mt-6 font-semibold">Every fact carries a label</p>
      <dl className="mt-3 space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <dt className="shrink-0">
            <StatusBadge status="verified" />
          </dt>
          <dd className="text-muted-foreground">
            Checked against an official source, with its link and date.
          </dd>
        </div>
        <div className="flex items-start gap-3">
          <dt className="shrink-0">
            <StatusBadge status="unknown" />
          </dt>
          <dd className="text-muted-foreground">
            Not confirmed. Check the official university website.
          </dd>
        </div>
      </dl>
    </Panel>
  );
}

function ScholarshipsPanel() {
  return (
    <Panel
      title="Scholarships, with the fine print first"
      body="Many programs are for master's students only, or need a nomination. Each entry says who it is for, so you do not spend weeks on one you cannot apply for."
    >
      <dl className="divide-y divide-border">
        {SCHOLARSHIP_FIELDS.map(([term, detail]) => (
          <div
            key={term}
            className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[8rem_1fr]"
          >
            <dt className="font-semibold">{term}</dt>
            <dd className="text-muted-foreground">{detail}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

function FitPanel() {
  const id = useId();
  const [score, setScore] = useState(CURRENT_IELTS);
  const met = score >= DEMO_REQUIRED_IELTS;
  const gap = Math.max(DEMO_REQUIRED_IELTS - score, 0);
  const progress = Math.min(score / DEMO_REQUIRED_IELTS, 1);

  return (
    <Panel
      title="Eligibility, money and goals, kept apart"
      body="A university can fit your grades and still miss your budget, so there is no single score. Each question gets its own answer, and when requirements are not verified the answer is unknown. We do not publish admission probabilities."
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">Example University</p>
        <StatusBadge status="hypothetical">Fictional demo</StatusBadge>
      </div>

      <label htmlFor={id} className="mt-4 flex justify-between font-medium">
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
        className="mt-1 h-11 w-full cursor-pointer accent-primary"
      />
      <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
        <motion.div
          className={`h-full rounded-full ${met ? "bg-chart-2" : "bg-primary"}`}
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </div>

      <ul className="mt-3 divide-y divide-border" aria-live="polite">
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
        <li className="flex items-center justify-between gap-3 pt-3">
          <div>
            <p className="font-semibold">Budget</p>
            <p className="text-sm text-muted-foreground">
              Below the example tuition
            </p>
          </div>
          <StatusBadge status="unmet" />
        </li>
      </ul>
      <p className="mt-3 text-sm text-muted-foreground">
        A higher score never guarantees admission.
      </p>
    </Panel>
  );
}

function PlanPanel() {
  return (
    <Panel
      title="One plan with a backup built in"
      body="Set a main route with its milestones, then see what changes when a deadline, budget or qualification does."
      footer={
        <Button asChild>
          <Link href="/assessment">Build my pathway</Link>
        </Button>
      }
    >
      <div className="rounded-lg bg-primary p-4 text-primary-foreground">
        <p className="font-semibold">Primary route</p>
        <p className="mt-1 text-sm text-primary-foreground/85">
          Prepare exams, apply, confirm funding, plan housing
        </p>
      </div>
      <ul className="mt-3 space-y-2">
        {BRANCHES.map(([cause, effect]) => (
          <li
            key={cause}
            className="rounded-lg border border-dashed border-border-strong p-4"
          >
            <p className="font-semibold">If {cause}</p>
            <p className="mt-1 text-sm text-muted-foreground">{effect}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

const PANELS: Record<(typeof TABS)[number]["id"], React.ReactNode> = {
  universities: <UniversitiesPanel />,
  scholarships: <ScholarshipsPanel />,
  fit: <FitPanel />,
  plan: <PlanPanel />,
};

export function Capabilities() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="capabilities-title"
        className="border-y border-border bg-muted section-y"
      >
        <div className="page-container">
          <h2 id="capabilities-title" className="max-w-2xl title-section">
            What you can do with Pathway AI
          </h2>

          <Tabs.Root defaultValue="universities" className="mt-8">
            <Tabs.List
              aria-label="Features"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible"
            >
              {TABS.map((t) => (
                <Tabs.Trigger
                  key={t.id}
                  value={t.id}
                  className="min-h-11 shrink-0 rounded-xl border border-border bg-surface px-4 py-2.5 text-left transition-colors duration-150 hover:bg-hover data-[state=active]:border-primary data-[state=active]:bg-selected lg:shrink"
                >
                  <span className="block text-sm font-semibold whitespace-nowrap lg:text-base">
                    {t.label}
                  </span>
                  <span className="hidden text-sm text-muted-foreground lg:block">
                    {t.summary}
                  </span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {TABS.map((t) => (
              <Tabs.Content
                key={t.id}
                value={t.id}
                className="mt-4 flex flex-col card p-5 sm:p-7"
              >
                <motion.div
                  className="grid flex-1"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {PANELS[t.id]}
                </motion.div>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </div>
      </section>
    </MotionConfig>
  );
}
