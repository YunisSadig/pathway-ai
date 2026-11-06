"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, FlaskConical } from "lucide-react";
import { motion } from "motion/react";
import { Workspace, PageIntro } from "@/components/workspace";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/use-profile";
import { recommendations, whatIf } from "@/lib/planning";
import type { Profile } from "@/lib/profile";
export function Improvement() {
  const { state } = useProfile();
  return (
    <Workspace>
      <Lab
        key={`${state.profile.ielts}-${state.profile.sat}`}
        profile={state.profile}
      />
    </Workspace>
  );
}
function Lab({ profile: p }: { profile: Profile }) {
  const { state, update } = useProfile();
  const [ielts, setIelts] = useState(p.ielts);
  const [sat, setSat] = useState(p.sat);
  const [message, setMessage] = useState("");
  const current = recommendations(p);
  const projected = whatIf(p, ielts, sat);
  const goal = `IELTS ${ielts.toFixed(1)} · SAT ${sat || "not planned"}`;
  return (
    <>
      <PageIntro
        eyebrow="YOUR POTENTIAL IS A WORK IN PROGRESS"
        title="Small steps. Different possibilities."
        description="Try a hypothetical score. See what changes in the demo, then turn an ambition into a preparation goal."
      />
      <div className="lab-layout">
        <section className="panel lab-controls">
          <span className="panel-icon purple">
            <FlaskConical size={20} />
          </span>
          <h2>A little “what if?”</h2>
          <p className="muted">
            Your actual profile stays unchanged. Sliders explore a scenario, not
            a predicted result.
          </p>
          <label className="range-field">
            <span>
              IELTS target <strong>{ielts.toFixed(1)}</strong>
            </span>
            <input
              aria-label="IELTS target"
              type="range"
              min={0}
              max={9}
              step={0.5}
              value={ielts}
              onChange={(e) => {
                setIelts(Number(e.target.value));
                setMessage("");
              }}
            />
            <small>Current: {p.ielts.toFixed(1)} · Scale 0–9</small>
          </label>
          <label className="range-field">
            <span>
              SAT target <strong>{sat || "Not planned"}</strong>
            </span>
            <input
              aria-label="SAT target"
              type="range"
              min={400}
              max={1600}
              step={10}
              value={sat || 400}
              onChange={(e) => {
                setSat(Number(e.target.value));
                setMessage("");
              }}
            />
            <small>Current: {p.sat || "Not taken"} · Optional</small>
          </label>
          <Button variant="ghost" size="small" onClick={() => setSat(0)}>
            No SAT planned
          </Button>
          <Button
            className="wide-button"
            disabled={state.goals.includes(goal)}
            onClick={() => {
              const saved = update((s) => ({
                ...s,
                goals: [...s.goals, goal].slice(-20),
              }));
              setMessage(
                saved
                  ? "Preparation goal saved in this browser."
                  : "Goal saved for this session; browser storage is unavailable.",
              );
            }}
          >
            {state.goals.includes(goal) ? (
              <>
                <Check size={15} />
                Goal saved
              </>
            ) : (
              "Save preparation goal"
            )}
          </Button>
          <p role="status" className="field-hint">
            {message}
          </p>
          <button
            className="reset-link"
            onClick={() => {
              setIelts(p.ielts);
              setSat(p.sat);
              setMessage("");
            }}
          >
            Reset scenario
          </button>
        </section>
        <section className="lab-results">
          <div className="content-heading">
            <h2>Your possibilities, reimagined</h2>
            <span className="demo-badge">HYPOTHETICAL</span>
          </div>
          <p className="muted explanation">
            Fit is a weighted demo index. Higher exam scores can close score
            gaps; they do not guarantee admission.
          </p>
          <div className="scenario-results" aria-live="polite">
            {projected.map((item) => {
              const before = current.find(
                (c) => c.program.id === item.program.id,
              )!;
              return (
                <motion.article
                  layout="position"
                  key={item.program.id}
                  className="scenario-result"
                >
                  <div>
                    <span className="eyebrow">{item.program.country}</span>
                    <h3>{item.program.university}</h3>
                    <p>{item.program.title}</p>
                  </div>
                  <div className="score-change">
                    <span>{before.score}</span>
                    <ArrowRight size={16} />
                    <strong>
                      {item.score}
                      <small>/100</small>
                    </strong>
                  </div>
                  <div className="scenario-gaps">
                    <span>
                      {before.gaps.length} score/portfolio gaps{" "}
                      <ArrowRight size={12} /> {item.gaps.length} after scenario
                    </span>
                    <p>
                      {item.gaps.length
                        ? item.gaps.join(" · ")
                        : "No score gaps in this simplified scenario. Other requirements would still need verification."}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      </div>
      <section className="panel saved-goals">
        <div className="content-heading">
          <h2>Your preparation goals</h2>
          <Link href="/planner" className="text-link">
            Build them into a pathway <ArrowUpRight size={15} />
          </Link>
        </div>
        {state.goals.length ? (
          <ul>
            {state.goals.map((g) => (
              <li key={g}>
                <Check size={15} />
                <span>{g}</span>
                <button
                  className="reset-link"
                  aria-label={`Remove goal ${g}`}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      goals: s.goals.filter((x) => x !== g),
                    }))
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            No goals saved yet. Explore a scenario above to create your first
            one.
          </p>
        )}
      </section>
    </>
  );
}
