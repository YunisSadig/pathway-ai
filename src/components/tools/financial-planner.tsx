"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "@/components/ui/field";
import { annualTotal } from "@/lib/domain/evaluate";
import type { BudgetLine } from "@/lib/domain/types";
import { update, useHydrated, useStore } from "@/lib/store";

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

const DEFAULTS: Omit<BudgetLine, "id">[] = [
  { label: "Tuition", amount: 0, cadence: "annual" },
  { label: "Housing", amount: 0, cadence: "monthly" },
  { label: "Food", amount: 0, cadence: "monthly" },
  { label: "Transport", amount: 0, cadence: "monthly" },
  { label: "Health insurance", amount: 0, cadence: "annual" },
  { label: "Moving and setup", amount: 0, cadence: "one-time" },
  { label: "Emergency reserve", amount: 0, cadence: "one-time" },
  { label: "Scholarship", amount: 0, cadence: "annual", credit: true },
];
const CADENCE = {
  "one-time": "One-time",
  monthly: "Per month",
  annual: "Per year",
} as const;
const num = (v: string) =>
  v.trim() === "" || Number.isNaN(Number(v)) || Number(v) < 0 ? 0 : Number(v);

export function FinancialPlanner() {
  const store = useStore();
  const hydrated = useHydrated();
  const [currency, setCurrency] = useState<string | null>(null);
  const [lines, setLines] = useState<BudgetLine[]>(() =>
    DEFAULTS.map((d, i) => ({ ...d, id: `default-${i}` })),
  );
  const [name, setName] = useState("");
  const [saved, setSaved] = useState("");
  const cur = currency ?? store.profile.budget.currency;
  if (!hydrated) return <p className="text-muted-foreground">Loading…</p>;

  const t = annualTotal(lines);
  const fmt = (n: number) => `${n.toLocaleString()} ${cur}`;
  const setLine = (id: string, patch: Partial<BudgetLine>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const limit = store.profile.budget.maxAnnualTuition;
  const tuitionLine = lines.find((l) => l.label === "Tuition");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="card p-5" aria-labelledby="lines">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="lines" className="text-xl font-bold">
            Costs
          </h2>
          <Field label="Currency" htmlFor="fp-cur" className="w-32">
            <SelectInput
              id="fp-cur"
              value={cur}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {["EUR", "USD", "CAD", "GBP", "KRW", "JPY", "CNY", "AZN"].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </SelectInput>
          </Field>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything here uses one currency. We do not convert currencies. Enter
          figures from official fee pages.
        </p>
        <ul className="mt-4 grid gap-3">
          {lines.map((l) => (
            <li
              key={l.id}
              className="grid items-end gap-2 sm:grid-cols-[1fr_9rem_8rem_auto]"
            >
              <Field label="Item" htmlFor={`l-${l.id}`}>
                <TextInput
                  id={`l-${l.id}`}
                  value={l.label}
                  onChange={(e) => setLine(l.id, { label: e.target.value })}
                />
              </Field>
              <Field label={`Amount (${cur})`} htmlFor={`a-${l.id}`}>
                <TextInput
                  id={`a-${l.id}`}
                  inputMode="numeric"
                  value={l.amount || ""}
                  placeholder="0"
                  onChange={(e) =>
                    setLine(l.id, { amount: num(e.target.value) })
                  }
                />
              </Field>
              <Field label="How often" htmlFor={`c-${l.id}`}>
                <SelectInput
                  id={`c-${l.id}`}
                  value={l.cadence}
                  onChange={(e) =>
                    setLine(l.id, {
                      cadence: e.target.value as BudgetLine["cadence"],
                    })
                  }
                >
                  {Object.entries(CADENCE).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove ${l.label || "item"}`}
                onClick={() =>
                  setLines((ls) => ls.filter((x) => x.id !== l.id))
                }
              >
                <Trash2 aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() =>
            setLines((ls) => [
              ...ls,
              { id: newId(), label: "", amount: 0, cadence: "monthly" },
            ])
          }
        >
          Add an item
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Scholarship amounts reduce the total.
        </p>
      </section>

      <aside className="grid content-start gap-5">
        <section
          className="card p-5"
          aria-labelledby="totals"
          aria-live="polite"
        >
          <h2 id="totals" className="text-lg font-bold">
            Totals
          </h2>
          <dl className="mt-3 divide-y divide-border text-sm">
            <div className="flex justify-between gap-3 py-2">
              <dt>One-time</dt>
              <dd className="font-semibold tabular-nums">{fmt(t.oneTime)}</dd>
            </div>
            <div className="flex justify-between gap-3 py-2">
              <dt>Monthly</dt>
              <dd className="font-semibold tabular-nums">{fmt(t.monthly)}</dd>
            </div>
            <div className="flex justify-between gap-3 py-2">
              <dt>Yearly items</dt>
              <dd className="font-semibold tabular-nums">{fmt(t.annual)}</dd>
            </div>
            <div className="flex justify-between gap-3 py-2">
              <dt>Each later year</dt>
              <dd className="font-semibold tabular-nums">{fmt(t.ongoing)}</dd>
            </div>
            <div className="flex justify-between gap-3 py-2 text-base">
              <dt className="font-bold">First year</dt>
              <dd className="font-extrabold tabular-nums">
                {fmt(t.firstYear)}
              </dd>
            </div>
          </dl>
          {limit !== null && tuitionLine && tuitionLine.amount > 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Tuition {tuitionLine.amount <= limit ? "is within" : "is above"}{" "}
              the limit in your profile ({limit.toLocaleString()}{" "}
              {store.profile.budget.currency}).
              {cur !== store.profile.budget.currency
                ? " The currencies differ, so this is not a valid comparison."
                : ""}
            </p>
          ) : null}
        </section>

        <section className="card p-5" aria-labelledby="save-scn">
          <h2 id="save-scn" className="text-lg font-bold">
            Saved scenarios
          </h2>
          <form
            className="mt-3 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              update((s) => ({
                ...s,
                budgetScenarios: [
                  ...s.budgetScenarios,
                  { id: newId(), name: name.trim(), currency: cur, lines },
                ],
              }));
              setSaved(`Saved "${name.trim()}".`);
              setName("");
            }}
          >
            <label htmlFor="scn-name" className="sr-only">
              Scenario name
            </label>
            <TextInput
              id="scn-name"
              className="min-w-0 flex-1"
              placeholder="Name this scenario"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" disabled={!name.trim()}>
              Save
            </Button>
          </form>
          {saved ? (
            <p role="status" className="mt-2 text-sm">
              {saved}
            </p>
          ) : null}
          {store.budgetScenarios.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              None saved yet.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {store.budgetScenarios.map((sc) => (
                <li
                  key={sc.id}
                  className="flex items-center justify-between gap-2 py-2"
                >
                  <span className="font-semibold">
                    {sc.name}{" "}
                    <span className="font-normal text-muted-foreground">
                      ({sc.currency})
                    </span>
                  </span>
                  <span className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrency(sc.currency);
                        setLines(sc.lines);
                      }}
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete scenario ${sc.name}`}
                      onClick={() =>
                        update((s) => ({
                          ...s,
                          budgetScenarios: s.budgetScenarios.filter(
                            (x) => x.id !== sc.id,
                          ),
                        }))
                      }
                    >
                      <Trash2 aria-hidden />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
}
