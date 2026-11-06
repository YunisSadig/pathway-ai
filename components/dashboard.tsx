"use client";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  Flag,
  Sparkles,
} from "lucide-react";
import { useProfile } from "@/lib/use-profile";
import { euro, recommendations, costs } from "@/lib/planning";
import { Workspace, PageIntro } from "@/components/workspace";
import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/components/program-card";
export function Dashboard() {
  const { state } = useProfile();
  const p = state.profile;
  const matches = recommendations(p);
  const first = matches[0];
  const gaps = matches.find((m) => m.gaps.length)?.gaps || [];
  return (
    <Workspace>
      <PageIntro
        eyebrow="A LITTLE CLARITY GOES A LONG WAY"
        title={`${state.completed ? p.name : "Dream big"}, here’s your starting point.`}
        description="Your ambitions, translated into a few thoughtful next steps."
      >
        <Button asChild variant="outline" size="small">
          <Link href="/onboarding">
            Edit profile <ArrowUpRight size={14} />
          </Link>
        </Button>
      </PageIntro>
      <section className="dashboard-banner">
        <div>
          <span className="eyebrow">YOUR NEXT BEST STEP</span>
          <h2>
            Build the skills.
            <br />
            Keep the dream.
          </h2>
          <p>
            {gaps.length
              ? `Explore what changes when you work toward ${gaps[0]}.`
              : "Your example scores meet the simplified thresholds. Compare cost and lifestyle next."}
          </p>
          <Button asChild>
            <Link href="/improvement">
              Explore my potential <ArrowUpRight size={16} />
            </Link>
          </Button>
        </div>
        <div className="banner-orbit">
          <Compass size={76} strokeWidth={1} />
          <span>YOUR PATH IS TAKING SHAPE</span>
        </div>
      </section>
      <div className="stat-grid">
        <div>
          <span>Academic direction</span>
          <strong>{p.field}</strong>
          <small>{p.career}</small>
        </div>
        <div>
          <span>Annual budget</span>
          <strong>{euro(p.budget)}</strong>
          <small>Tuition + living + preparation</small>
        </div>
        <div>
          <span>Preparation window</span>
          <strong>{p.months} months</strong>
          <small>{p.intake}</small>
        </div>
      </div>
      <div className="content-heading">
        <h2>A few possibilities worth exploring</h2>
        <Link href="/universities" className="text-link">
          See all programs <ArrowRight size={15} />
        </Link>
      </div>
      <div className="program-grid two-col">
        {matches.slice(0, 2).map(({ program }) => (
          <ProgramCard key={program.id} program={program} profile={p} />
        ))}
      </div>
      <div className="dashboard-bottom">
        <section className="panel">
          <span className="panel-icon purple">
            <Sparkles size={18} />
          </span>
          <h2>Your preparation roadmap</h2>
          <ul className="action-list">
            <li>
              <Check size={14} />
              <span>
                Map your starting point
                <strong>
                  {state.completed
                    ? "Assessment complete"
                    : "Try the assessment to personalize"}
                </strong>
              </span>
            </li>
            <li>
              <span className="list-dot" />
              <span>
                Identify your score gaps
                <strong>
                  {gaps[0] ||
                    "Check requirements against official sources later"}
                </strong>
              </span>
            </li>
            <li>
              <span className="list-dot" />
              <span>
                Build a preparation routine
                <strong>
                  {state.goals.length
                    ? `${state.goals.length} saved preparation goal(s)`
                    : "Save your first goal in the Improvement Lab"}
                </strong>
              </span>
            </li>
            <li>
              <span className="list-dot" />
              <span>
                Review budget and backup options
                <strong>Keep a realistic second route</strong>
              </span>
            </li>
          </ul>
          <Link className="text-link" href="/planner">
            Open Pathway Planner <ArrowUpRight size={15} />
          </Link>
        </section>
        <section className="panel">
          <span className="panel-icon coral">
            <Flag size={18} />
          </span>
          <h2>Plan for the less obvious things</h2>
          <p className="muted">
            {first && costs(first.program).total > p.budget
              ? `The top demo match is ${euro(costs(first.program).total - p.budget)} above your annual budget. Explore lower-cost routes before committing.`
              : "An affordable program still needs a housing deposit, a buffer, and time for paperwork."}
          </p>
          <div className="small-divider" />
          <h3>A backup is a smart move.</h3>
          <p className="muted">
            Different destination. Later intake. More preparation. Your ambition
            can have more than one route.
          </p>
          <Link href="/planner" className="text-link">
            Build my plan B <ArrowUpRight size={15} />
          </Link>
          <Link href="/life-abroad" className="text-link secondary-link">
            Prepare for everyday life <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
    </Workspace>
  );
}
