"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, SelectInput } from "@/components/ui/field";
import { actions, useStore } from "@/lib/store";
import type { PathwayRoute } from "@/lib/domain/types";

export const SLOT_LABEL: Record<PathwayRoute["slot"], string> = {
  primary: "Primary route",
  alt1: "Alternative 1",
  alt2: "Alternative 2",
};

export function AddToPathway({ id, name }: { id: string; name: string }) {
  const store = useStore();
  const [slot, setSlot] = useState<PathwayRoute["slot"]>("primary");
  const [done, setDone] = useState<string | null>(null);
  const current = store.routes.find((r) => r.slot === slot);
  const placed = store.routes.find((r) => r.universityId === id);

  return (
    <div className="flex flex-col gap-3">
      <Field label="Add to pathway as" htmlFor={`slot-${id}`}>
        <SelectInput
          id={`slot-${id}`}
          value={slot}
          onChange={(e) => {
            setSlot(e.target.value as PathwayRoute["slot"]);
            setDone(null);
          }}
        >
          {(Object.keys(SLOT_LABEL) as PathwayRoute["slot"][]).map((s) => (
            <option key={s} value={s}>
              {SLOT_LABEL[s]}
              {store.routes.find((r) => r.slot === s)?.universityId
                ? " (replaces current)"
                : ""}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Button
        onClick={() => {
          actions.setRoute(slot, { universityId: id });
          setDone(`${name} is now your ${SLOT_LABEL[slot].toLowerCase()}.`);
        }}
        disabled={current?.universityId === id}
      >
        {current?.universityId === id ? "Already in this slot" : "Add to plan"}
      </Button>
      {done ? (
        <p role="status" className="text-sm">
          {done}{" "}
          <Link href="/pathway-planner" className="font-semibold underline">
            Open the planner
          </Link>
        </p>
      ) : placed ? (
        <p className="text-sm text-muted-foreground">
          Currently your {SLOT_LABEL[placed.slot].toLowerCase()}.
        </p>
      ) : null}
    </div>
  );
}
