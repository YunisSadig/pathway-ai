import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

const wrap = "mx-auto max-w-6xl px-4 sm:px-6";

/** 2. Problem and opportunity: an editorial contrast, not a card grid. */
export function Problem() {
  return (
    <section className="border-y border-border bg-muted py-20">
      <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_1.2fr]`}>
        <h2 className="text-3xl font-extrabold text-balance sm:text-4xl">
          Applying abroad is a hundred small questions asked in the wrong order.
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold text-muted-foreground">
              Guessing
            </h3>
            <ul className="mt-3 space-y-3 text-muted-foreground">
              <li>Requirements spread over dozens of websites</li>
              <li>One ranking standing in for fit</li>
              <li>Costs discovered after you have chosen</li>
              <li>No plan if the first choice falls through</li>
            </ul>
          </div>
          <div className="rounded-xl bg-surface p-5 shadow-sm">
            <h3 className="text-lg font-bold">Planning</h3>
            <ul className="mt-3 space-y-3">
              <li>Requirements gathered with their sources</li>
              <li>Eligibility, money and preferences kept apart</li>
              <li>Costs estimated before you commit</li>
              <li>A backup route built alongside the main one</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: "Describe where you are",
    body: "Qualifications, goals, budget and what matters to you. Skip anything you do not know yet.",
  },
  {
    title: "Explore real universities",
    body: "Search by country, subject and city. Each fact shows whether it is verified.",
  },
  {
    title: "See what is missing",
    body: "Gaps in qualifications, funding and preparation, listed separately and explained.",
  },
  {
    title: "Build primary and backup routes",
    body: "A roadmap you can change when a score, deadline or budget changes.",
  },
];

/** 3. A real sequence, so numbering is meaningful here. */
export function HowItWorks() {
  return (
    <section id="how" className={`${wrap} py-20 lg:py-28`}>
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Four steps from a question to a plan
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            You can stop after any step and come back later.
          </p>
        </div>
        <ol className="divide-y divide-border border-y border-border">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-5 py-6">
              <span className="font-display text-3xl font-extrabold text-primary tabular-nums">
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mt-1 max-w-md text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const REGIONS = [
  "European Union",
  "United States",
  "Canada",
  "China",
  "South Korea",
  "Japan",
];

/** 4. Explorer preview: destinations and the status vocabulary, no invented records. */
export function ExplorerPreview() {
  return (
    <section className="bg-primary-soft py-20 lg:py-28">
      <div className={`${wrap} grid gap-12 lg:grid-cols-2 lg:items-center`}>
        <div>
          <h2 className="text-3xl font-extrabold text-primary-soft-foreground sm:text-4xl">
            One directory for six destinations
          </h2>
          <p className="mt-4 max-w-md text-primary-soft-foreground/90">
            Compare institutions across regions in the same format, and save the
            ones worth a closer look.
          </p>
          <Button asChild className="mt-7">
            <Link href="/universities">Explore universities</Link>
          </Button>
        </div>
        <div className="rounded-2xl bg-surface p-6 shadow-md">
          <p className="font-display font-bold">Destinations</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {REGIONS.map((region) => (
              <li
                key={region}
                className="rounded-full border border-border-strong px-3.5 py-1.5 text-sm font-medium"
              >
                {region}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-display font-bold">
            Every fact carries a label
          </p>
          <dl className="mt-3 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <dt>
                <StatusBadge status="verified" />
              </dt>
              <dd className="text-muted-foreground">
                Checked against an official source, with its link and date.
              </dd>
            </div>
            <div className="flex items-start gap-3">
              <dt>
                <StatusBadge status="unknown" />
              </dt>
              <dd className="text-muted-foreground">
                We could not confirm it. Check the official university website.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

const DIMENSIONS = [
  {
    name: "Formal eligibility",
    status: "unknown" as const,
    note: "Needs verified program requirements",
  },
  {
    name: "Financial feasibility",
    status: "unmet" as const,
    note: "Budget below the example tuition",
  },
  {
    name: "Academic preferences",
    status: "met" as const,
    note: "Subject matches your interest",
  },
  {
    name: "Lifestyle fit",
    status: "met" as const,
    note: "City size matches your preference",
  },
  {
    name: "Career relevance",
    status: "unknown" as const,
    note: "Career goal not entered yet",
  },
];

/** 5. Matching: separate dimensions rather than a single score. */
export function Matching() {
  return (
    <section className={`${wrap} py-20 lg:py-28`}>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="order-2 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:order-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display font-bold">Example University</p>
            <StatusBadge status="hypothetical">Fictional demo</StatusBadge>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {DIMENSIONS.map((d) => (
              <li
                key={d.name}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3"
              >
                <div>
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm text-muted-foreground">{d.note}</p>
                </div>
                <StatusBadge status={d.status} />
              </li>
            ))}
          </ul>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl font-extrabold text-balance sm:text-4xl">
            A university can fit your grades and still miss your budget
          </h2>
          <p className="mt-4 text-muted-foreground">
            So we never collapse everything into one number. Each question gets
            its own answer, and when we lack verified requirements the answer is
            unknown, not a guess.
          </p>
          <p className="mt-4 text-muted-foreground">
            We do not publish admission probabilities.
          </p>
        </div>
      </div>
    </section>
  );
}

const SCHOLARSHIP_FIELDS = [
  ["Degree level", "Bachelor's, master's or doctoral, always stated"],
  ["Who can apply", "Citizenship, nomination and qualification rules"],
  ["How to apply", "The official route, such as a school or embassy"],
  ["Deadline", "Shown only when confirmed for the current cycle"],
  ["Last checked", "The date we verified it against the official page"],
];

/** 6. Scholarship preview: what a scholarship page tells you, no amounts or deadlines. */
export function ScholarshipPreview() {
  return (
    <section className="border-y border-border bg-muted py-20 lg:py-28">
      <div className={`${wrap} grid gap-12 lg:grid-cols-[0.9fr_1.1fr]`}>
        <div>
          <h2 className="text-3xl font-extrabold text-balance sm:text-4xl">
            Scholarships, with the fine print up front
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Many programs are for master&apos;s students only, or need a
            nomination. We state who each one is for, so you do not spend weeks
            on one you cannot apply for.
          </p>
        </div>
        <dl className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {SCHOLARSHIP_FIELDS.map(([term, detail]) => (
            <div
              key={term}
              className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr]"
            >
              <dt className="font-semibold">{term}</dt>
              <dd className="text-muted-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const BRANCHES = [
  ["A deadline passes", "Move to a later intake, or switch to a backup route."],
  ["Funding falls short", "Compare destinations with a smaller budget gap."],
  [
    "Your qualifications change",
    "Reassess requirements without losing your plan.",
  ],
];

/** 8. Alternative pathways: a main line with branches. */
export function Pathways() {
  return (
    <section className={`${wrap} py-20 lg:py-28`}>
      <h2 className="max-w-2xl text-3xl font-extrabold text-balance sm:text-4xl">
        Plans change. Yours can bend instead of break.
      </h2>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
          <p className="font-display text-xl font-bold">Primary route</p>
          <ol className="mt-4 space-y-3 text-primary-foreground/90">
            <li>Prepare exams and documents</li>
            <li>Apply before each deadline</li>
            <li>Confirm funding</li>
            <li>Plan housing and travel</li>
          </ol>
        </div>
        <ul className="space-y-3">
          {BRANCHES.map(([title, body]) => (
            <li
              key={title}
              className="rounded-xl border border-dashed border-border-strong bg-surface p-5"
            >
              <p className="font-semibold">If {title.toLowerCase()}</p>
              <p className="mt-1 text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const TRUST = [
  "Official university and government pages come first.",
  "Every fact keeps its source link and the date we checked it.",
  "Tuition and deadlines show the year and applicant group they apply to.",
  "Anything we cannot confirm is labelled, never filled in.",
];

/** 10. Trust, sources and transparency. */
export function Trust() {
  return (
    <section className="border-y border-border bg-muted py-20">
      <div className={`${wrap} grid gap-10 lg:grid-cols-2`}>
        <h2 className="text-3xl font-extrabold text-balance sm:text-4xl">
          How we handle facts
        </h2>
        <ul className="space-y-4 text-lg">
          {TRUST.map((line) => (
            <li key={line} className="border-l-4 border-mint pl-4">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 11. Final call to action. */
export function FinalCta() {
  return (
    <section className={`${wrap} py-20 lg:py-28`}>
      <div className="rounded-3xl bg-primary px-6 py-14 text-primary-foreground sm:px-12">
        <h2 className="max-w-2xl text-3xl font-extrabold text-balance sm:text-5xl">
          Start with what you know today.
        </h2>
        <p className="mt-4 max-w-lg text-primary-foreground/90">
          A few questions are enough for a first outline of your pathway.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
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
            <Link href="/universities">Explore universities</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
