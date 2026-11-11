"use client";

import { useId, useState } from "react";

/** Long published text is clamped to a few lines with an accessible expand control. Text is never altered. */
export function ClampText({
  text,
  limit = 260,
}: {
  text: string;
  limit?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const long = text.length > limit;
  return (
    <div>
      <p id={id} className={long && !open ? "line-clamp-3" : undefined}>
        {text}
      </p>
      {long ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="mt-1 min-h-6 text-sm font-semibold text-primary-soft-foreground underline underline-offset-4 hover:no-underline"
        >
          {open ? "Show less" : "Read in full"}
        </button>
      ) : null}
    </div>
  );
}
