"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChoiceCard,
  Field,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/ui/field";
import { SLOT_LABEL } from "@/components/universities/add-to-pathway";
import { SCHOLARSHIPS } from "@/data/scholarships";
import { UNIVERSITIES, UNIVERSITY_BY_SLUG } from "@/data/universities";
import { SCENARIOS, runScenario } from "@/lib/domain/evaluate";
import type { PathwayRoute, ScenarioKind } from "@/lib/domain/types";
import { actions, emptyRoute, useHydrated, useStore } from "@/lib/store";

const SUGGESTED = [
  "Read the program page on the official website",
  "Confirm the application deadline for your intake",
  "Check the language requirement and plan a test date",
  "Gather transcripts and other required documents",
  "Check tuition and living costs, then update your budget",
  "Look for scholarships you can apply for",
];

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
const nameOf = (id: string | null) =>
  id
    ? (UNIVERSITY_BY_SLUG.get(id)?.name ?? "your chosen university")
    : "no university chosen";

function RouteCard({ route }: { route: PathwayRoute }) {
  const uid = useId();
  const store = useStore();
  const [task, setTask] = useState("");
  const set = (patch: Partial<PathwayRoute>) =>
    actions.setRoute(route.slot, patch);
  const ms = route.milestones;
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= ms.length) return;
    const copy = [...ms];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    set({ milestones: copy });
  };
  const addTask = (title: string) => {
    if (!title.trim()) return;
    set({
      milestones: [
        ...route.milestones,
        { id: newId(), title: title.trim(), done: false },
      ],
    });
  };
  const saved = SCHOLARSHIPS.filter((s) =>
    store.savedScholarships.includes(s.id),
  );
  const universityOptions = [
    ...UNIVERSITIES.filter((u) => store.savedUniversities.includes(u.id)),
    ...UNIVERSITIES.filter((u) => !store.savedUniversities.includes(u.id)),
  ];

  return (
    <section className="card p-5" aria-labelledby={`${uid}-h`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id={`${uid}-h`} className="text-xl font-bold">
          {SLOT_LABEL[route.slot]}
        </h3>
        {route.universityId || route.milestones.length ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => actions.setRoute(route.slot, emptyRoute(route.slot))}
          >
            <Trash2 aria-hidden /> Clear route
            <span className="sr-only">: {SLOT_LABEL[route.slot]}</span>
          </Button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field
          label="University"
          htmlFor={`${uid}-u`}
          className="sm:col-span-2"
          hint={
            store.savedUniversities.length
              ? "Saved universities are listed first."
              : undefined
          }
        >
          <SelectInput
            id={`${uid}-u`}
            value={route.universityId ?? ""}
            aria-describedby={
              store.savedUniversities.length ? `${uid}-u-hint` : undefined
            }
            onChange={(e) => set({ universityId: e.target.value || null })}
          >
            <option value="">Not chosen</option>
            {universityOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.country})
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Program (if you know it)" htmlFor={`${uid}-p`}>
          <TextInput
            id={`${uid}-p`}
            value={route.program}
            onChange={(e) => set({ program: e.target.value })}
          />
        </Field>
        <Field label="Target intake" htmlFor={`${uid}-i`}>
          <TextInput
            id={`${uid}-i`}
            value={route.intake}
            placeholder="For example autumn 2027"
            onChange={(e) => set({ intake: e.target.value })}
          />
        </Field>
      </div>

      <fieldset className="mt-5">
        <legend className="font-semibold">Scholarships for this route</legend>
        {saved.length === 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Save scholarships first, then attach them here.{" "}
            <Link href="/scholarships" className="underline">
              Browse scholarships
            </Link>
          </p>
        ) : (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {saved.map((s) => (
              <ChoiceCard
                key={s.id}
                type="checkbox"
                name={`${uid}-sch`}
                title={s.name}
                checked={route.scholarshipIds.includes(s.id)}
                onChange={() =>
                  set({
                    scholarshipIds: route.scholarshipIds.includes(s.id)
                      ? route.scholarshipIds.filter((x) => x !== s.id)
                      : [...route.scholarshipIds, s.id],
                  })
                }
              />
            ))}
          </div>
        )}
      </fieldset>

      <div className="mt-5">
        <h4 className="font-semibold">Preparation tasks</h4>
        {ms.length === 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">No tasks yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
            {ms.map((m, i) => (
              <li key={m.id} className="flex items-center gap-2 p-2">
                <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3 px-1">
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={m.done}
                    onChange={() =>
                      set({
                        milestones: ms.map((x) =>
                          x.id === m.id ? { ...x, done: !x.done } : x,
                        ),
                      })
                    }
                  />
                  <span
                    className={
                      m.done ? "text-muted-foreground line-through" : ""
                    }
                  >
                    {m.title}
                  </span>
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Move up: ${m.title}`}
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUp aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Move down: ${m.title}`}
                  disabled={i === ms.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove task: ${m.title}`}
                  onClick={() =>
                    set({ milestones: ms.filter((x) => x.id !== m.id) })
                  }
                >
                  <Trash2 aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        )}
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addTask(task);
            setTask("");
          }}
        >
          <label htmlFor={`${uid}-t`} className="sr-only">
            New task for {SLOT_LABEL[route.slot]}
          </label>
          <TextInput
            id={`${uid}-t`}
            className="min-w-0 flex-1"
            value={task}
            placeholder="Add a task"
            onChange={(e) => setTask(e.target.value)}
          />
          <Button type="submit" variant="outline" disabled={!task.trim()}>
            Add task
          </Button>
        </form>
        {ms.length === 0 ? (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() =>
              set({
                milestones: SUGGESTED.map((title) => ({
                  id: newId(),
                  title,
                  done: false,
                })),
              })
            }
          >
            Add suggested starter tasks
          </Button>
        ) : null}
      </div>

      <Field label="Notes" htmlFor={`${uid}-n`} className="mt-5">
        <TextArea
          id={`${uid}-n`}
          value={route.notes}
          onChange={(e) => set({ notes: e.target.value })}
        />
      </Field>
    </section>
  );
}

function Scenarios({ routes }: { routes: PathwayRoute[] }) {
  const [kind, setKind] = useState<ScenarioKind | "">("");
  const result = kind ? runScenario(kind, routes, nameOf) : null;
  const primary = routes[0];
  return (
    <section className="card p-5" aria-labelledby="scn">
      <h2 id="scn" className="text-xl font-bold">
        What if something changes?
      </h2>
      <p className="mt-1 text-muted-foreground">
        Pick a situation to see which parts of your plan it touches. This shows
        dependencies, not outcomes.
      </p>
      <Field label="Situation" htmlFor="scn-kind" className="mt-4 max-w-md">
        <SelectInput
          id="scn-kind"
          value={kind}
          onChange={(e) => setKind(e.target.value as ScenarioKind | "")}
        >
          <option value="">Choose a situation…</option>
          {SCENARIOS.map((s) => (
            <option key={s.kind} value={s.kind}>
              {s.label}
            </option>
          ))}
        </SelectInput>
      </Field>
      {result ? (
        <div
          className="mt-5 grid gap-4 lg:grid-cols-2"
          role="region"
          aria-live="polite"
          aria-label="Scenario result"
        >
          <div className="rounded-xl border border-border p-4">
            <h3 className="font-bold">Original plan</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Primary route: {nameOf(primary.universityId)}
              {primary.intake ? `, ${primary.intake}` : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              {routes.slice(1).filter((r) => r.universityId).length} alternative
              route(s) set
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-border-strong p-4">
            <h3 className="font-bold">{result.title}</h3>
            {(
              [
                ["What changes", result.changes],
                ["What it affects", result.affected],
                ["Still unknown", result.unknown],
                ["What you can do", result.alternatives],
              ] as const
            ).map(([h, items]) => (
              <div key={h} className="mt-3">
                <p className="text-sm font-semibold">{h}</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function PlannerView() {
  const store = useStore();
  const hydrated = useHydrated();
  if (!hydrated)
    return <p className="text-muted-foreground">Loading your plan…</p>;
  return (
    <div className="grid gap-6">
      <div className="card p-5">
        <h2 className="text-lg font-bold">Your plan in four questions</h2>
        <ul className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>
            <strong className="text-foreground">
              What am I trying to achieve?
            </strong>{" "}
            Choose a primary route.
          </li>
          <li>
            <strong className="text-foreground">What must I prepare?</strong>{" "}
            Add tasks and tick them off.
          </li>
          <li>
            <strong className="text-foreground">What could stop this?</strong>{" "}
            Try the scenarios below.
          </li>
          <li>
            <strong className="text-foreground">What will I do instead?</strong>{" "}
            Fill Alternative 1 and 2.
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Routes are labelled Primary and Alternative. We never label a
          university safe or easy, because we have no verified basis for that.
        </p>
      </div>
      {store.routes.map((r) => (
        <RouteCard key={r.slot} route={r} />
      ))}
      <Scenarios routes={store.routes} />
    </div>
  );
}
