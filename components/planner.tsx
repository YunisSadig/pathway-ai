"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Flag, Route } from "lucide-react";
import { Workspace, PageIntro } from "@/components/workspace";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/use-profile";
import {
  costs,
  euro,
  gaps,
  recommendations,
  scenarioProfile,
  type Scenario,
} from "@/lib/planning";
import { programs } from "@/lib/programs";
import { Field } from "@/components/form-field";
export function Planner() {
  const { state, update } = useProfile();
  const p = state.profile;
  const [scenario, setScenario] = useState<Scenario>("ready");
  const [message, setMessage] = useState("");
  const options = programs.filter((x) => x.field === p.field);
  const ranked = recommendations(p);
  const primary =
    options.find((x) => x.id === state.primary) || ranked[0].program;
  const backup =
    options.find((x) => x.id === state.backup && x.id !== primary.id) ||
    ranked.find((x) => x.program.id !== primary.id)!.program;
  const changed = scenarioProfile(p, scenario);
  const adjusted = recommendations(changed)
    .filter((x) => x.program.id !== primary.id)
    .sort((a, b) => costs(a.program).total - costs(b.program).total)[0];
  function save() {
    const ok = update({ primary: primary.id, backup: backup.id });
    setMessage(
      ok
        ? "Primary and backup pathways saved in this browser."
        : "Pathways saved for this session; browser storage is unavailable.",
    );
  }
  return (
    <Workspace>
      <PageIntro
        eyebrow="ONE AMBITION. MORE THAN ONE WAY THERE."
        title="Give your future a plan B."
        description="Build a primary route, keep another door open, and explore what happens if plans change."
      />
      <div className="plan-grid">
        {[
          {
            program: primary,
            label: "PLAN A",
            title: "Your primary direction",
            icon: Route,
            tone: "purple",
          },
          {
            program: backup,
            label: "PLAN B",
            title: "Your thoughtful backup",
            icon: Flag,
            tone: "mint",
          },
        ].map(({ program, label, title, icon: Icon, tone }) => (
          <section className="panel route-panel" key={label}>
            <span className={`panel-icon ${tone}`}>
              <Icon size={20} />
            </span>
            <span className="eyebrow">{label}</span>
            <h2>{title}</h2>
            <Field
              label={label === "PLAN A" ? "Primary program" : "Backup program"}
            >
              {(props) => (
                <select
                  {...props}
                  value={program.id}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (label === "PLAN A")
                      update({
                        primary: id,
                        backup: id === backup.id ? primary.id : backup.id,
                      });
                    else update({ primary: primary.id, backup: id });
                    setMessage("");
                  }}
                >
                  {options
                    .filter((x) => label === "PLAN A" || x.id !== primary.id)
                    .map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.university} · {x.country}
                      </option>
                    ))}
                </select>
              )}
            </Field>
            <h3>{program.title}</h3>
            <p>
              {program.country} · {program.duration} years
            </p>
            <div className="route-finance">
              <span>Illustrative year one</span>
              <strong>{euro(costs(program).total)}</strong>
            </div>
            <p className="route-gap">
              {gaps(p, program).length
                ? `Preparation: ${gaps(p, program).join("; ")}`
                : "No score gaps in this simplified demo. Verify all eligibility details before a real application."}
            </p>
          </section>
        ))}
      </div>
      <div className="plan-save">
        <Button onClick={save}>
          Save my pathways <ArrowRight size={15} />
        </Button>
        <p role="status">{message}</p>
      </div>
      <section className="panel scenario-panel">
        <div className="content-heading">
          <div>
            <span className="eyebrow">A CHANGE OF PLAN IS STILL A PLAN</span>
            <h2>What if things shift?</h2>
          </div>
        </div>
        <div
          className="scenario-options"
          role="group"
          aria-label="Backup scenario"
        >
          {[
            ["ready", "As planned"],
            ["score", "IELTS is 1 band lower"],
            ["budget", "Budget drops 25%"],
            ["delay", "I need 6 more months"],
          ].map(([value, label]) => (
            <Button
              key={value}
              variant={scenario === value ? "default" : "outline"}
              size="small"
              aria-pressed={scenario === value}
              onClick={() => setScenario(value as Scenario)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="scenario-outcome" aria-live="polite">
          <h3>
            {scenario === "ready"
              ? "Keep both routes moving."
              : scenario === "budget"
                ? `Revised budget: ${euro(changed.budget)}`
                : scenario === "score"
                  ? `Scenario IELTS: ${changed.ielts.toFixed(1)}`
                  : `Preparation window: ${changed.months} months`}
          </h3>
          <p>
            {scenario === "ready"
              ? "Prepare shared documents first. Keep separate requirement checklists and review both routes before any fictional deadline."
              : scenario === "delay"
                ? "Move the intake review six months later, check which illustrative route allows more preparation, and rebuild the milestones. This does not confirm intake availability."
                : `A lower-cost alternative to review: ${adjusted.program.university} (${euro(costs(adjusted.program).total)}). ${costs(adjusted.program).total > changed.budget ? "It still exceeds this scenario’s budget, so this is not yet a funded route." : "Its demo year-one cost fits this scenario budget."} ${gaps(changed, adjusted.program).length} illustrative score/portfolio gaps remain.`}
          </p>
        </div>
      </section>
      <section className="milestone-section">
        <div className="content-heading">
          <h2>A roadmap with room to breathe.</h2>
          <span className="fine-print">
            Illustrative timing, not official deadlines
          </span>
        </div>
        <ol className="timeline">
          {[
            {
              time: "NOW · WEEK 1",
              title: "Find your starting point",
              text: "Review your profile, budget, academic evidence, and both routes.",
            },
            {
              time: `NEXT · MONTHS 1–${Math.max(1, Math.round(changed.months * 0.5))}`,
              title: "Build your preparation rhythm",
              text: state.goals.length
                ? `Your goals: ${state.goals.join("; ")}.`
                : "Choose a language or exam goal. Gather projects and evidence of your interests.",
            },
            {
              time: `REVIEW · MONTH ${Math.max(1, changed.months - 3)}`,
              title: "Check the details before applying",
              text: "A real application needs verified requirements, document translations, official intake dates, and a funding plan.",
            },
            {
              time: `TARGET · ${scenario === "delay" ? "REVISIT INTAKE" : p.intake.toUpperCase()}`,
              title: "Make a considered decision",
              text: "Compare confirmed offers and actual costs. Revisit the backup if your primary route doesn’t work out.",
            },
          ].map((m, i) => (
            <li key={m.title}>
              <span className="timeline-number">{i + 1}</span>
              <div>
                <span className="eyebrow">{m.time}</span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link href="/finance" className="text-link">
          Give both routes a realistic budget <ArrowUpRight size={15} />
        </Link>
      </section>
    </Workspace>
  );
}
