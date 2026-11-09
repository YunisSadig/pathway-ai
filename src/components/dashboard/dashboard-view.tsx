"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { UNIVERSITY_BY_SLUG } from "@/data/universities";
import { profileCompletion } from "@/lib/domain/evaluate";
import { DEGREE_LABEL, REGION_LABEL } from "@/lib/domain/types";
import { useHydrated, useStore } from "@/lib/store";
import { SLOT_LABEL } from "@/components/universities/add-to-pathway";

export function DashboardView() {
  const store = useStore();
  const hydrated = useHydrated();
  if (!hydrated)
    return <p className="text-muted-foreground">Loading your dashboard…</p>;

  const { profile: p, routes } = store;
  const comp = profileCompletion(p);
  const started = p.stage !== null || store.onboarding.step > 0;
  const primary = routes[0];
  const openTasks = primary.milestones.filter((m) => !m.done);
  const hasAlt = routes.slice(1).some((r) => r.universityId);

  // One clear next step, chosen deterministically.
  let next: { text: string; href: string; cta: string };
  if (!store.onboarding.completed) {
    next = {
      text: started
        ? "Finish your profile so suggestions can use it."
        : "Start with a short profile. It takes a few minutes.",
      href: "/onboarding",
      cta: started ? "Continue profile" : "Build my profile",
    };
  } else if (comp.missing.length) {
    next = {
      text: `Your profile is missing: ${comp.missing.map((m) => m.label.toLowerCase()).join(", ")}.`,
      href: "/profile",
      cta: "Complete profile",
    };
  } else if (store.savedUniversities.length === 0) {
    next = {
      text: "You have not saved any universities yet.",
      href: "/universities",
      cta: "Browse universities",
    };
  } else if (!primary.universityId) {
    next = {
      text: `You have saved ${store.savedUniversities.length} ${store.savedUniversities.length === 1 ? "university" : "universities"} but have not chosen a primary route.`,
      href: "/pathway-planner",
      cta: "Choose a primary route",
    };
  } else if (primary.milestones.length === 0) {
    next = {
      text: "Your primary route has no preparation tasks yet.",
      href: "/pathway-planner",
      cta: "Add tasks",
    };
  } else if (openTasks.length) {
    next = {
      text: `Next preparation task: ${openTasks[0].title}`,
      href: "/pathway-planner",
      cta: "Open planner",
    };
  } else if (!hasAlt) {
    next = {
      text: "You have no alternative route yet. Add one in case plans change.",
      href: "/pathway-planner",
      cta: "Add an alternative",
    };
  } else {
    next = {
      text: "Your plan has a primary route and an alternative. Check what happens if something changes.",
      href: "/pathway-planner",
      cta: "Try a scenario",
    };
  }

  const goal = [
    p.targetDegree ? DEGREE_LABEL[p.targetDegree] : null,
    p.preferences.fields.join(", ") || null,
  ]
    .filter(Boolean)
    .join(" in ");

  return (
    <div className="grid gap-6">
      <section
        className="card border-primary p-6 sm:p-8"
        aria-labelledby="next-title"
      >
        <h2
          id="next-title"
          className="text-sm font-semibold text-muted-foreground"
        >
          Your next step
        </h2>
        <p className="mt-2 text-xl font-bold sm:text-2xl">{next.text}</p>
        <Button asChild className="mt-5">
          <Link href={next.href}>
            {next.cta} <ArrowRight aria-hidden />
          </Link>
        </Button>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <section
          className="card p-5 lg:col-span-2"
          aria-labelledby="goal-title"
        >
          <h2 id="goal-title" className="text-lg font-bold">
            Your goal
          </h2>
          {goal ? (
            <dl className="mt-3 divide-y divide-border text-sm">
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-muted-foreground">Study</dt>
                <dd className="text-right font-semibold">{goal}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-muted-foreground">Destinations</dt>
                <dd className="text-right font-semibold">
                  {p.preferences.preferredRegions
                    .map((r) => REGION_LABEL[r])
                    .join(", ") || "Not chosen"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-muted-foreground">Intake</dt>
                <dd className="text-right font-semibold">
                  {p.intakeYear ?? "Not chosen"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-muted-foreground">Yearly tuition limit</dt>
                <dd className="text-right font-semibold">
                  {p.budget.maxAnnualTuition !== null
                    ? `${p.budget.maxAnnualTuition.toLocaleString()} ${p.budget.currency}`
                    : "Not set"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-2 text-muted-foreground">
              Your goal appears here after you answer the first questions.
            </p>
          )}
        </section>

        <section className="card p-5" aria-labelledby="comp-title">
          <h2 id="comp-title" className="text-lg font-bold">
            Profile
          </h2>
          <p className="mt-2 text-3xl font-extrabold tabular-nums">
            {comp.done}
            <span className="text-lg font-semibold text-muted-foreground">
              {" "}
              / {comp.total}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">essentials answered</p>
          {comp.missing.length ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {comp.missing.slice(0, 4).map((m) => (
                <li key={m.key}>{m.label}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm">Nothing missing.</p>
          )}
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/profile">View profile</Link>
          </Button>
        </section>
      </div>

      <section className="card p-5" aria-labelledby="routes-title">
        <h2 id="routes-title" className="text-lg font-bold">
          Your routes
        </h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {routes.map((r) => {
            const u = r.universityId
              ? UNIVERSITY_BY_SLUG.get(r.universityId)
              : null;
            const done = r.milestones.filter((m) => m.done).length;
            return (
              <li key={r.slot} className="rounded-lg border border-border p-4">
                <p className="text-sm font-semibold text-muted-foreground">
                  {SLOT_LABEL[r.slot]}
                </p>
                {u ? (
                  <>
                    <p className="mt-1 font-bold">{u.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {u.city}, {u.country}
                    </p>
                    <p className="mt-2 text-sm">
                      {r.milestones.length
                        ? `${done} of ${r.milestones.length} tasks done`
                        : "No tasks yet"}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-muted-foreground">Empty</p>
                )}
              </li>
            );
          })}
        </ul>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/pathway-planner">Open planner</Link>
        </Button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2" aria-label="Saved items">
        <div className="card p-5">
          <h2 className="text-lg font-bold">Saved universities</h2>
          <p className="mt-1 text-3xl font-extrabold tabular-nums">
            {store.savedUniversities.length}
          </p>
          {store.savedUniversities.length > 0 ? (
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <StatusBadge status="unknown">
                Program research needed
              </StatusBadge>
            </p>
          ) : null}
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/saved">View saved</Link>
          </Button>
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-bold">Saved scholarships</h2>
          <p className="mt-1 text-3xl font-extrabold tabular-nums">
            {store.savedScholarships.length}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/scholarships">Browse scholarships</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
