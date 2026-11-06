"use client";
import { useState } from "react";
import { ArrowUpRight, Wallet } from "lucide-react";
import Link from "next/link";
import { Workspace, PageIntro } from "@/components/workspace";
import { Field } from "@/components/form-field";
import { programs, type Program } from "@/lib/programs";
import { costs, euro, recommendations } from "@/lib/planning";
import { useProfile } from "@/lib/use-profile";
export function Finance() {
  const { state } = useProfile();
  const [id, setId] = useState("");
  const program =
    programs.find((p) => p.id === id) ||
    recommendations(state.profile)[0].program;
  return (
    <Workspace>
      <PageIntro
        eyebrow="BIG DREAMS. CLEARER NUMBERS."
        title="Make room for the whole picture."
        description="Tuition is one part of the story. Explore a fictional year-one budget, including everyday life and a little breathing room."
      />
      <Field label="Explore costs for">
        {(props) => (
          <select
            {...props}
            value={program.id}
            onChange={(e) => setId(e.target.value)}
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.university} · {p.title}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Budget
        key={`${program.id}-${state.profile.budget}`}
        program={program}
        initialBudget={state.profile.budget}
      />
    </Workspace>
  );
}
function Budget({
  program: p,
  initialBudget,
}: {
  program: Program;
  initialBudget: number;
}) {
  const [rent, setRent] = useState(p.rent);
  const [buffer, setBuffer] = useState(10);
  const [budget, setBudget] = useState(initialBudget);
  const c = costs(p, rent, buffer);
  const difference = budget - c.total;
  const rows = [
    { label: "Tuition", amount: c.tuition, tone: "purple" },
    { label: "Housing · 12 months", amount: c.housing, tone: "mint" },
    { label: "Food · 12 months", amount: c.food, tone: "coral" },
    { label: "Transport · 12 months", amount: c.transport, tone: "purple" },
    { label: "Insurance · annual", amount: c.insurance, tone: "mint" },
    { label: "Setup & travel · one time", amount: c.setup, tone: "coral" },
    { label: `Contingency · ${buffer}%`, amount: c.buffer, tone: "purple" },
  ];
  return (
    <>
      <div className="finance-layout">
        <section className="panel budget-breakdown">
          <span className="panel-icon mint">
            <Wallet size={19} />
          </span>
          <span className="eyebrow">A FICTIONAL FIRST YEAR</span>
          <div className="budget-total">
            <span>Total planned cost</span>
            <strong data-testid="total-cost">{euro(c.total)}</strong>
          </div>
          <div className="cost-stack" aria-hidden="true">
            {rows.map((r) => (
              <span
                key={r.label}
                className={r.tone}
                style={{ width: `${(r.amount / c.total) * 100}%` }}
              />
            ))}
          </div>
          <dl className="cost-rows">
            {rows.map((r) => (
              <div key={r.label}>
                <dt>
                  <span className={`cost-dot ${r.tone}`} />
                  {r.label}
                </dt>
                <dd>{euro(r.amount)}</dd>
              </div>
            ))}
          </dl>
          <p className="fine-print">
            All figures are invented, in EUR, with 12 months of living costs. No
            scholarships or employment income are assumed. Visa, tax, and
            official funding requirements are outside this demo.
          </p>
        </section>
        <section className="panel budget-controls">
          <h2>Try a different scenario.</h2>
          <p className="muted">
            These sliders affect this estimate only. Your saved assessment stays
            unchanged.
          </p>
          <label className="range-field">
            <span>
              Monthly rent <strong>{euro(rent)}</strong>
            </span>
            <input
              aria-label="Monthly rent"
              type="range"
              min={200}
              max={1600}
              step={10}
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
            />
            <small>12 months included</small>
          </label>
          <label className="range-field">
            <span>
              Contingency buffer <strong>{buffer}%</strong>
            </span>
            <input
              aria-label="Contingency buffer"
              type="range"
              min={0}
              max={25}
              step={1}
              value={buffer}
              onChange={(e) => setBuffer(Number(e.target.value))}
            />
            <small>A scenario cushion for unexpected expenses</small>
          </label>
          <label className="range-field">
            <span>
              Annual scenario budget <strong>{euro(budget)}</strong>
            </span>
            <input
              aria-label="Annual scenario budget"
              type="range"
              min={3000}
              max={150000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
            <small>Your saved budget: {euro(initialBudget)}</small>
          </label>
          <div
            className={`budget-balance ${difference >= 0 ? "balance-positive" : "balance-negative"}`}
            aria-live="polite"
          >
            <span>
              {difference >= 0
                ? "Room in this scenario"
                : "Funding gap in this scenario"}
            </span>
            <strong>{euro(Math.abs(difference))}</strong>
            <p>
              {difference >= 0
                ? "This example fits the scenario budget. Real costs and funding still need verification."
                : "Try a lower rent, compare a lower-cost program, or revisit your funding assumptions."}
            </p>
          </div>
          <button
            className="reset-link"
            onClick={() => {
              setRent(p.rent);
              setBuffer(10);
              setBudget(initialBudget);
            }}
          >
            Reset budget scenario
          </button>
        </section>
      </div>
      <div className="callout finance-note">
        <strong>A scholarship is a possibility, not a budget line.</strong>
        <p>
          Build a route that works with confirmed funding. This demo does not
          invent scholarship offers or guaranteed student income.
        </p>
        <Link className="text-link" href="/planner">
          Explore a lower-cost backup <ArrowUpRight size={14} />
        </Link>
      </div>
    </>
  );
}
