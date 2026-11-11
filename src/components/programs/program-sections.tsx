import {
  applicantLabel,
  BILLING_LABELS,
  byTemporalStatus,
  formatDate,
  formatMoney,
  FUNDING_LABELS,
  REQUIREMENT_GROUPS,
  REQUIREMENT_LABELS,
  tuitionPeriodLabel,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { ClampText } from "@/components/shared/clamp-text";
import { Evidence, Missing, Notice } from "@/components/shared/detail-ui";
import { TemporalBadge } from "@/components/shared/fact-ui";
import type { FundingItem } from "@/types/funding";
import type { Intake, Requirement, Tuition } from "@/types/program";

/*
 * Content blocks for the program page. They render facts only: the surrounding section, its heading and
 * its anchor come from <DetailSection> in the view. Each block has a single honest empty state.
 */

export function TuitionList({ tuition }: { tuition: Tuition[] }) {
  if (tuition.length === 0) {
    return (
      <Missing>
        No tuition information has been recorded for this program yet. This does
        not mean it is free. Check the official page for current fees.
      </Missing>
    );
  }
  return (
    <div className="grid gap-4">
      <Notice>
        Fees can differ by applicant group. Check which group applies to you on
        the official page.
      </Notice>
      <ul className="divide-y divide-border">
        {byTemporalStatus(tuition).map((t, i) => {
          const historical = t.temporalStatus === "HISTORICAL";
          return (
            <li
              key={i}
              className="grid gap-x-8 gap-y-2 py-5 first:pt-0 sm:grid-cols-[13rem_minmax(0,1fr)]"
            >
              <p
                className={cn(
                  "text-2xl leading-tight font-bold tabular-nums",
                  historical &&
                    "text-muted-foreground line-through decoration-1",
                )}
              >
                {formatMoney(t.amount, t.currency)}
                <span className="block text-sm font-medium text-muted-foreground no-underline">
                  {BILLING_LABELS[t.billingPeriod]}
                </span>
              </p>
              <div className="grid min-w-0 gap-2">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <p className="font-semibold">
                    {applicantLabel(t.studentCategory)}
                  </p>
                  <TemporalBadge status={t.temporalStatus} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {tuitionPeriodLabel(t)}
                </p>
                {t.temporalStatus === "UNKNOWN_YEAR" ? (
                  <Notice tone="warning">
                    The source gives no year for this fee. Confirm it on the
                    official page before relying on it.
                  </Notice>
                ) : null}
                {historical ? (
                  <Notice tone="danger">
                    This period has ended. It is shown for context only and is
                    not today&apos;s price.
                  </Notice>
                ) : null}
                {t.scopeNote ? (
                  <div className="text-sm text-muted-foreground">
                    <ClampText
                      text={`Source wording: “${t.scopeNote}”`}
                      limit={200}
                    />
                  </div>
                ) : null}
                <Evidence source={t.source} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Funding is never assumed. The backend has no funding data yet, so `items` is normally empty and one short
 * sentence is shown. When data exists, each kind keeps its own label so a waiver is not read as a grant.
 */
export function FundingList({ items = [] }: { items?: FundingItem[] }) {
  if (items.length === 0) {
    return (
      <Missing>
        No verified scholarship or tuition-waiver information is available for
        this program yet. If the university offers funding it is not shown here,
        and nothing on this page is a promise that you will receive any.
      </Missing>
    );
  }
  return (
    <ul className="divide-y divide-border">
      {items.map((f, i) => (
        <li key={i} className="grid gap-1.5 py-4 first:pt-0">
          <p className="text-xs font-semibold tracking-wide text-primary-soft-foreground uppercase">
            {FUNDING_LABELS[f.kind]}
          </p>
          <p className="font-semibold">{f.name}</p>
          <ClampText text={f.summary} />
          <Notice>
            Eligibility applies. Receiving funding is not automatic.
          </Notice>
          <Evidence source={f.source} />
        </li>
      ))}
    </ul>
  );
}

/** Earliest first within a status group; undated cycles last. Status comes from the backend, never from position. */
function sortIntakes(intakes: Intake[]): Intake[] {
  return byTemporalStatus(intakes).sort((a, b) => {
    if (a.temporalStatus !== b.temporalStatus) return 0;
    return (a.applicationDeadline ?? "9999").localeCompare(
      b.applicationDeadline ?? "9999",
    );
  });
}

export function DeadlineTimeline({ intakes }: { intakes: Intake[] }) {
  return (
    <ol className="grid">
      {sortIntakes(intakes).map((i, n) => {
        const past = i.temporalStatus === "HISTORICAL";
        return (
          <li
            key={n}
            className="relative grid gap-1 border-l-2 border-border pb-7 pl-6 last:border-transparent last:pb-0"
          >
            <span
              aria-hidden
              className={cn(
                "absolute top-1.5 -left-[7px] size-3 rounded-full border-2 bg-background",
                i.temporalStatus === "CURRENT" && "border-success bg-success",
                i.temporalStatus === "UNKNOWN_YEAR" && "border-warning",
                past && "border-border-strong",
              )}
            />
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p
                className={cn(
                  "text-lg font-bold tabular-nums",
                  past && "text-muted-foreground",
                )}
              >
                <span className="sr-only">Application deadline: </span>
                {i.applicationDeadline
                  ? formatDate(i.applicationDeadline)
                  : "Deadline not published"}
              </p>
              <TemporalBadge status={i.temporalStatus} />
            </div>
            <p className="font-medium">{i.label}</p>
            <p className="text-sm text-muted-foreground">
              {[
                i.academicYear ? `Academic year ${i.academicYear}` : null,
                i.startDate ? `Studies start ${formatDate(i.startDate)}` : null,
                applicantLabel(i.applicantCategory),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {past ? (
              <Notice tone="danger">
                This deadline has passed. It is shown for context only.
              </Notice>
            ) : null}
            {i.temporalStatus === "UNKNOWN_YEAR" ? (
              <Notice tone="warning">
                The source does not say which year this applies to. Confirm the
                date on the official page.
              </Notice>
            ) : null}
            <Evidence source={i.source} />
          </li>
        );
      })}
    </ol>
  );
}

function RequirementItem({ r }: { r: Requirement }) {
  return (
    <li className="grid gap-1.5 py-3.5 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="font-semibold">{REQUIREMENT_LABELS[r.type]}</p>
        {r.temporalStatus !== "CURRENT" ? (
          <TemporalBadge status={r.temporalStatus} />
        ) : null}
      </div>
      <ClampText text={r.description} />
      {r.minimumValue !== null ? (
        <p className="text-sm text-muted-foreground">
          Minimum: {r.minimumValue}
          {r.valueUnit ? ` ${r.valueUnit}` : ""}
        </p>
      ) : null}
      <p className="text-sm text-muted-foreground">
        Application cycle {r.applicationCycle}
      </p>
      <Evidence source={r.source} />
    </li>
  );
}

export function RequirementGroups({
  requirements,
}: {
  requirements: Requirement[];
}) {
  if (requirements.length === 0) {
    return (
      <Missing>
        No admission requirements have been recorded for this program yet. That
        does not mean there are none: check the official admissions page.
      </Missing>
    );
  }
  return (
    <div className="grid gap-8">
      <Notice>
        Published requirements only. Meeting them does not guarantee admission,
        and a missing item does not mean there is no requirement.
      </Notice>
      {REQUIREMENT_GROUPS.map((g) => {
        const rows = requirements.filter((r) => g.types.includes(r.type));
        if (rows.length === 0) return null;
        return (
          <div key={g.title}>
            <h3 className="text-base font-bold">{g.title}</h3>
            <ul className="mt-3 divide-y divide-border">
              {byTemporalStatus(rows).map((r, i) => (
                <RequirementItem key={i} r={r} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
