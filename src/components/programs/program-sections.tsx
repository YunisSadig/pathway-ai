import Link from "next/link";
import {
  applicantLabel,
  BILLING_LABELS,
  formatDate,
  formatMoney,
  REQUIREMENT_LABELS,
  tuitionPeriodLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { SourceLine, TemporalBadge } from "@/components/shared/fact-ui";
import type { Intake, Requirement, Tuition } from "@/types/program";

/** Shared heading + "nothing recorded" wording for a section of published facts. */
function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="card p-5 sm:p-6">
      <h2 id={id} className="text-xl font-bold">
        {title}
      </h2>
      {intro ? (
        <p className="mt-1 max-w-prose text-sm text-muted-foreground">
          {intro}
        </p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Missing({ children }: { children: React.ReactNode }) {
  return (
    <p className="bg-surface-muted rounded-lg border border-dashed border-border-strong p-4 text-sm text-muted-foreground">
      {children}
    </p>
  );
}

const order = { CURRENT: 0, UNKNOWN_YEAR: 1, HISTORICAL: 2 } as const;

export function TuitionSection({ tuition }: { tuition: Tuition[] }) {
  const rows = [...tuition].sort(
    (a, b) => order[a.temporalStatus] - order[b.temporalStatus],
  );
  return (
    <Section
      id="tuition"
      title="Tuition"
      intro="Fees exactly as published, with the period the source attached to each one."
    >
      {rows.length === 0 ? (
        <Missing>
          No tuition information has been recorded for this program yet. This
          does not mean it is free. Check the official page for current fees.
        </Missing>
      ) : (
        <ul className="grid gap-3">
          {rows.map((t, i) => (
            <li
              key={i}
              className={cn(
                "rounded-xl border p-4",
                t.temporalStatus === "HISTORICAL"
                  ? "bg-surface-muted border-border"
                  : "border-border-strong bg-surface",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    t.temporalStatus === "HISTORICAL" &&
                      "text-muted-foreground line-through decoration-1",
                  )}
                >
                  {formatMoney(t.amount, t.currency)}{" "}
                  <span className="text-sm font-semibold text-muted-foreground no-underline">
                    {BILLING_LABELS[t.billingPeriod]}
                  </span>
                </p>
                <TemporalBadge status={t.temporalStatus} />
              </div>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold">Applies to</dt>
                  <dd>{applicantLabel(t.studentCategory)}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Period</dt>
                  <dd>{tuitionPeriodLabel(t)}</dd>
                </div>
              </dl>
              {t.scopeNote ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Source wording: “{t.scopeNote}”
                </p>
              ) : null}
              {t.temporalStatus === "UNKNOWN_YEAR" ? (
                <p className="mt-2 text-sm font-medium text-warning">
                  The source does not say which year this fee applies to.
                  Confirm it on the official page before relying on it.
                </p>
              ) : null}
              {t.temporalStatus === "HISTORICAL" ? (
                <p className="mt-2 text-sm font-medium text-danger">
                  This period has ended. It is shown for context only and is not
                  today&apos;s price.
                </p>
              ) : null}
              <div className="mt-3">
                <SourceLine source={t.source} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

export function IntakesSection({ intakes }: { intakes: Intake[] }) {
  const rows = [...intakes].sort(
    (a, b) => order[a.temporalStatus] - order[b.temporalStatus],
  );
  return (
    <Section
      id="deadlines"
      title="Intakes and application deadlines"
      intro="Dates as published. They change every year, so confirm them on the official page."
    >
      {rows.length === 0 ? (
        <Missing>
          No intake or deadline information has been recorded for this program
          yet.
        </Missing>
      ) : (
        <ul className="grid gap-3">
          {rows.map((i, n) => (
            <li
              key={n}
              className={cn(
                "rounded-xl border p-4",
                i.temporalStatus === "HISTORICAL"
                  ? "bg-surface-muted border-border"
                  : "border-border-strong bg-surface",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-bold">{i.label}</p>
                <TemporalBadge status={i.temporalStatus} />
              </div>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                <div>
                  <dt className="font-semibold">Application deadline</dt>
                  <dd>{formatDate(i.applicationDeadline)}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Studies start</dt>
                  <dd>{formatDate(i.startDate)}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Applies to</dt>
                  <dd>{applicantLabel(i.applicantCategory)}</dd>
                </div>
              </dl>
              {i.academicYear ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Academic year {i.academicYear}
                </p>
              ) : null}
              {i.temporalStatus === "HISTORICAL" ? (
                <p className="mt-2 text-sm font-medium text-danger">
                  This deadline has passed.
                </p>
              ) : null}
              <div className="mt-3">
                <SourceLine source={i.source} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function RequirementItem({ r }: { r: Requirement }) {
  return (
    <li
      className={cn(
        "rounded-xl border p-4",
        r.temporalStatus === "HISTORICAL"
          ? "bg-surface-muted border-border"
          : "border-border-strong bg-surface",
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-bold">{REQUIREMENT_LABELS[r.type]}</p>
        <TemporalBadge status={r.temporalStatus} />
      </div>
      <p className="mt-2">{r.description}</p>
      {r.minimumValue !== null ? (
        <p className="mt-1 text-sm text-muted-foreground">
          Minimum: {r.minimumValue}
          {r.valueUnit ? ` ${r.valueUnit}` : ""}
        </p>
      ) : null}
      <p className="mt-1 text-sm text-muted-foreground">
        Application cycle: {r.applicationCycle}
      </p>
      <div className="mt-3">
        <SourceLine source={r.source} />
      </div>
    </li>
  );
}

export function RequirementsSection({
  requirements,
}: {
  requirements: Requirement[];
}) {
  const language = requirements.filter((r) => r.type === "LANGUAGE_TEST");
  const other = requirements.filter((r) => r.type !== "LANGUAGE_TEST");
  return (
    <Section
      id="requirements"
      title="Admission requirements"
      intro="Published requirements only. Meeting them does not guarantee admission, and a missing item does not mean there is no requirement."
    >
      {requirements.length === 0 ? (
        <Missing>
          No admission requirements have been recorded for this program yet.
          That does not mean there are none: check the official admissions page.
        </Missing>
      ) : (
        <div className="grid gap-6">
          {language.length ? (
            <div>
              <h3 className="font-semibold">Language requirements</h3>
              <ul className="mt-2 grid gap-3">
                {language.map((r, i) => (
                  <RequirementItem key={i} r={r} />
                ))}
              </ul>
            </div>
          ) : null}
          {other.length ? (
            <div>
              <h3 className="font-semibold">Other published requirements</h3>
              <ul className="mt-2 grid gap-3">
                {other.map((r, i) => (
                  <RequirementItem key={i} r={r} />
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </Section>
  );
}

/** Honest funding placeholder: no scholarship API exists yet, so nothing is claimed. */
export function FundingSection() {
  return (
    <Section
      id="funding"
      title="Scholarships and funding"
      intro="Funding is never assumed."
    >
      <Missing>
        Pathway AI has no verified scholarship or tuition-waiver information for
        this program yet. If the university offers any, it is not shown here,
        and nothing on this page should be read as a promise of funding.{" "}
        <Link
          href="/scholarships"
          className="font-semibold text-primary-soft-foreground underline underline-offset-4"
        >
          See the scholarships page
        </Link>
        .
      </Missing>
    </Section>
  );
}
