"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_SEARCH_LENGTH, type UniversityView } from "@/lib/university-query";

const field =
  "h-11 rounded-lg border border-border-strong bg-surface px-3 text-sm text-foreground";

type Props = {
  view: UniversityView;
  onChange: (next: Partial<UniversityView>) => void;
};

/** Name search and sorting. Changes are pushed to the URL by the parent. */
export function UniversityToolbar(props: Props) {
  // Re-mounts when the URL's search text changes (back button, clear search).
  return <ToolbarForm key={props.view.q} {...props} />;
}

function ToolbarForm({ view, onChange }: Props) {
  const [text, setText] = useState(view.q);
  return (
    <form
      role="search"
      aria-label="Search universities"
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onChange({ q: text.trim() });
      }}
    >
      <label className="grid min-w-0 flex-1 gap-1 text-sm font-semibold sm:min-w-64">
        University name
        <input
          type="search"
          name="q"
          value={text}
          maxLength={MAX_SEARCH_LENGTH}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search by name"
          className={field}
        />
      </label>
      <Button type="submit">
        <Search aria-hidden /> Search
      </Button>
      <label className="grid gap-1 text-sm font-semibold">
        Sort by
        <select
          value={`${view.sort}:${view.direction}`}
          onChange={(e) => {
            const [sort, direction] = e.target.value.split(":");
            onChange({
              sort: sort as UniversityView["sort"],
              direction: direction as UniversityView["direction"],
            });
          }}
          className={field}
        >
          <option value="name:asc">Name (A–Z)</option>
          <option value="name:desc">Name (Z–A)</option>
          <option value="city:asc">City (A–Z)</option>
          <option value="city:desc">City (Z–A)</option>
        </select>
      </label>
    </form>
  );
}
