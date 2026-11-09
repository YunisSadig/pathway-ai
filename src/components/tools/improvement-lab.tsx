"use client";

import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { checkAgainst } from "@/lib/domain/evaluate";
import { update, useHydrated, useStore } from "@/lib/store";

const num = (v: string) =>
  v.trim() === "" || Number.isNaN(Number(v)) ? null : Number(v);

function Row({
  c,
  was,
  changed,
}: {
  changed: boolean;
  c: ReturnType<typeof checkAgainst>;
  was: ReturnType<typeof checkAgainst>;
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div>
        <p className="font-semibold">{c.label}</p>
        <p className="text-sm text-muted-foreground">{c.note}</p>
        {changed && was.state !== c.state ? (
          <p className="text-sm">
            Before:{" "}
            {was.state === "met"
              ? "Met"
              : was.state === "unmet"
                ? "Not met"
                : "Unknown"}
          </p>
        ) : null}
      </div>
      <StatusBadge status={c.state} />
    </li>
  );
}

export function ImprovementLab() {
  const store = useStore();
  const hydrated = useHydrated();
  if (!hydrated) return <p className="text-muted-foreground">Loading…</p>;

  const p = store.profile;
  const imp = store.improvement;
  const original = p.language.test !== "None" ? p.language.score : null;
  const hypothetical = imp.ieltsOverride ?? original;
  const changed = imp.ieltsOverride !== null || imp.budgetOverride !== null;
  const tuitionNow = p.budget.maxAnnualTuition;
  const budgetHypo = imp.budgetOverride ?? tuitionNow;

  const [reqLang, reqTuition] = [
    store.improvementReq.lang,
    store.improvementReq.tuition,
  ];
  const lang = checkAgainst(hypothetical, reqLang, "Language score");
  const tuition = checkAgainst(budgetHypo, reqTuition, "Tuition budget");
  const langOrig = checkAgainst(original, reqLang, "Language score");
  const tuitionOrig = checkAgainst(tuitionNow, reqTuition, "Tuition budget");

  const setImp = (patch: Partial<typeof imp>) =>
    update((s) => ({ ...s, improvement: { ...s.improvement, ...patch } }));
  const setReq = (patch: { lang?: number | null; tuition?: number | null }) =>
    update((s) => ({
      ...s,
      improvementReq: { ...s.improvementReq, ...patch },
    }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card p-5" aria-labelledby="hypo">
        <h2 id="hypo" className="text-xl font-bold">
          Change something
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your real profile is not changed. These are what-ifs.
        </p>
        <div className="mt-4 grid gap-4">
          <Field
            label={`Language score (now: ${original ?? "not set"})`}
            htmlFor="imp-lang"
            hint="Use the same scale as your test, for example IELTS 5.5."
          >
            <TextInput
              id="imp-lang"
              inputMode="decimal"
              value={imp.ieltsOverride ?? ""}
              placeholder={
                original !== null ? String(original) : "What if you scored…"
              }
              aria-describedby="imp-lang-hint"
              onChange={(e) => setImp({ ieltsOverride: num(e.target.value) })}
            />
          </Field>
          <Field
            label={`Yearly tuition limit in ${p.budget.currency} (now: ${tuitionNow ?? "not set"})`}
            htmlFor="imp-budget"
          >
            <TextInput
              id="imp-budget"
              inputMode="numeric"
              value={imp.budgetOverride ?? ""}
              placeholder={
                tuitionNow !== null
                  ? String(tuitionNow)
                  : "What if your limit were…"
              }
              onChange={(e) => setImp({ budgetOverride: num(e.target.value) })}
            />
          </Field>
          <Button
            variant="outline"
            onClick={() =>
              setImp({ ieltsOverride: null, budgetOverride: null })
            }
            disabled={!changed}
          >
            Restore my real values
          </Button>
        </div>
      </section>

      <section className="card p-5" aria-labelledby="req">
        <h2 id="req" className="text-xl font-bold">
          Compare with a requirement
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Type the requirement you found on a program&rsquo;s official page. We
          do not supply requirements here, so nothing below is a verified rule.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Required language score" htmlFor="req-lang">
            <TextInput
              id="req-lang"
              inputMode="decimal"
              value={reqLang ?? ""}
              onChange={(e) => setReq({ lang: num(e.target.value) })}
            />
          </Field>
          <Field
            label={`Yearly tuition (${p.budget.currency})`}
            htmlFor="req-tuition"
          >
            <TextInput
              id="req-tuition"
              inputMode="numeric"
              value={reqTuition ?? ""}
              onChange={(e) => setReq({ tuition: num(e.target.value) })}
            />
          </Field>
        </div>
        <ul className="mt-4 divide-y divide-border" aria-live="polite">
          <Row c={lang} was={langOrig} changed={changed} />
          <Row c={tuition} was={tuitionOrig} changed={changed} />
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Meeting a requirement never guarantees admission.
        </p>
      </section>
    </div>
  );
}
