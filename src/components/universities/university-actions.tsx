"use client";

import { Bookmark, BookmarkCheck, Scale } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { actions, useStore } from "@/lib/store";

export function SaveButton({
  id,
  name,
  size = "sm",
}: {
  id: string;
  name: string;
  size?: "sm" | "md";
}) {
  const saved = useStore().savedUniversities.includes(id);
  const Icon = saved ? BookmarkCheck : Bookmark;
  return (
    <Button
      variant={saved ? "secondary" : "outline"}
      size={size}
      aria-pressed={saved}
      aria-label={`${saved ? "Saved" : "Save"} ${name}`}
      onClick={() => actions.toggleSavedUniversity(id)}
    >
      <Icon aria-hidden className="size-4" />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}

export function CompareButton({
  id,
  name,
  size = "sm",
}: {
  id: string;
  name: string;
  size?: "sm" | "md";
}) {
  const inCompare = useStore().compare.includes(id);
  const [full, setFull] = useState(false);
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button
        variant={inCompare ? "secondary" : "outline"}
        size={size}
        aria-pressed={inCompare}
        aria-label={`${inCompare ? "In comparison" : "Compare"} ${name}`}
        onClick={() => setFull(!actions.toggleCompare(id))}
      >
        <Scale aria-hidden className="size-4" />
        {inCompare ? "In comparison" : "Compare"}
      </Button>
      {full ? (
        <span role="status" className="text-sm text-danger">
          You can compare up to 3. Remove one first.
        </span>
      ) : null}
    </span>
  );
}
