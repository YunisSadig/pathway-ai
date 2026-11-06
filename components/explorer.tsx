"use client";
import { useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
import { ArrowDownUp, Search, SlidersHorizontal, X } from "lucide-react";
import { programs } from "@/lib/programs";
import { countries, fields } from "@/lib/profile";
import { costs, euro, match } from "@/lib/planning";
import { useProfile } from "@/lib/use-profile";
import { Workspace, PageIntro } from "@/components/workspace";
import { ProgramCard } from "@/components/program-card";
import { Button } from "@/components/ui/button";
export function Explorer() {
  const ready = useHydrated();
  const { state } = useProfile();
  const p = state.profile;
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [field, setField] = useState("");
  const [affordable, setAffordable] = useState(false);
  const [sort, setSort] = useState("fit");
  const [selected, setSelected] = useState<string[]>([]);
  const visible = programs
    .filter(
      (x) =>
        `${x.university} ${x.title} ${x.city}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (!country || x.country === country) &&
        (!field || x.field === field) &&
        (!affordable || costs(x).total <= p.budget),
    )
    .sort((a, b) =>
      sort === "cost"
        ? costs(a).total - costs(b).total
        : match(p, b).score - match(p, a).score || a.id.localeCompare(b.id),
    );
  const compared = selected.map((id) => programs.find((x) => x.id === id)!);
  function toggle(id: string) {
    setSelected((s) =>
      s.includes(id)
        ? s.filter((x) => x !== id)
        : s.length < 3
          ? [...s, id]
          : s,
    );
  }
  return (
    <Workspace>
      <PageIntro
        eyebrow="A WORLD OF POSSIBILITIES"
        title="Find a place to become you."
        description="Look beyond the name. Explore how a program fits your life, goals, and budget."
      />
      <div className="explorer-controls">
        <label className="search-field">
          <Search size={17} />
          <span className="sr-only">Search programs</span>
          <input
            disabled={!ready}
            placeholder="University, program, or city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Destination filter</span>
          <select
            className="filter-input"
            value={country}
            disabled={!ready}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">All destinations</option>
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Study field filter</span>
          <select
            className="filter-input"
            value={field}
            disabled={!ready}
            onChange={(e) => setField(e.target.value)}
          >
            <option value="">All study fields</option>
            {fields.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="results-row">
        <div>
          <SlidersHorizontal size={15} />
          <label className="compare-choice">
            <input
              type="checkbox"
              checked={affordable}
              disabled={!ready}
              onChange={(e) => setAffordable(e.target.checked)}
            />
            Within my {euro(p.budget)} budget
          </label>
        </div>
        <label className="sort-label">
          <ArrowDownUp size={13} />
          <span className="sr-only">Sort programs</span>
          <select
            disabled={!ready}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="fit">Best demo fit</option>
            <option value="cost">Lowest total cost</option>
          </select>
        </label>
      </div>
      <p role="status" className="results-count">
        {visible.length} fictional programs · Compare up to 3 · Fit indices are
        not admission probabilities.
      </p>
      {visible.length ? (
        <div className="program-grid">
          {visible.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              profile={p}
              selected={selected.includes(program.id)}
              onCompare={() => toggle(program.id)}
              compareDisabled={
                !ready ||
                (selected.length === 3 && !selected.includes(program.id))
              }
            />
          ))}
        </div>
      ) : (
        <section className="empty-state">
          <Search size={30} />
          <h2>A wider search might open a door.</h2>
          <p>No fictional programs match these filters.</p>
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setCountry("");
              setField("");
              setAffordable(false);
            }}
          >
            Clear filters
          </Button>
        </section>
      )}
      {selected.length > 0 && (
        <>
          <div className="compare-dock">
            <span aria-live="polite">
              {selected.length} of 3 programs selected
            </span>
            <Button
              size="small"
              disabled={selected.length < 2}
              onClick={() => {
                const target = document.getElementById("program-comparison");
                target?.scrollIntoView({
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "instant"
                    : "smooth",
                  block: "start",
                });
                target?.focus({ preventScroll: true });
              }}
            >
              Compare programs
            </Button>
            <button
              type="button"
              className="icon-button"
              aria-label="Clear comparison selection"
              onClick={() => setSelected([])}
            >
              <X size={16} />
            </button>
          </div>
          <section
            className="comparison panel"
            id="program-comparison"
            tabIndex={-1}
            aria-label="Program comparison"
          >
            <div className="content-heading">
              <div>
                <h2>Side by side. A clearer picture.</h2>
                <p className="muted">
                  {selected.length}/3 selected. Choose at least two to compare.
                </p>
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setSelected([])}
              >
                Clear <X size={14} />
              </Button>
            </div>
            {selected.length >= 2 && (
              <div className="table-scroll">
                <table>
                  <caption className="sr-only">
                    Fictional program comparison
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">What matters</th>
                      {compared.map((x) => (
                        <th key={x.id} scope="col">
                          {x.university}
                          <small>{x.title}</small>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "Year-one total",
                        ...compared.map((x) => euro(costs(x).total)),
                      ],
                      [
                        "Academic fit",
                        ...compared.map((x) => `${match(p, x).academic}/100`),
                      ],
                      [
                        "Affordability",
                        ...compared.map(
                          (x) => `${match(p, x).affordability}/100`,
                        ),
                      ],
                      [
                        "Lifestyle fit",
                        ...compared.map((x) => `${match(p, x).lifestyle}/100`),
                      ],
                      [
                        "Career relevance",
                        ...compared.map((x) => `${match(p, x).career}/100`),
                      ],
                      [
                        "Illustrative IELTS",
                        ...compared.map((x) => x.ielts.toFixed(1)),
                      ],
                      ["Learning style", ...compared.map((x) => x.teaching)],
                    ].map(([label, ...values]) => (
                      <tr key={label}>
                        <th scope="row">{label}</th>
                        {values.map((v, i) => (
                          <td key={i}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {selected.length === 3 && (
              <p className="field-hint">
                Comparison is full. Uncheck a program to add another.
              </p>
            )}
          </section>
        </>
      )}
    </Workspace>
  );
}
