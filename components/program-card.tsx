"use client";
import { useRef } from "react";
import { ArrowUpRight, BookOpen, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { costs, euro, match } from "@/lib/planning";
import type { Program } from "@/lib/programs";
import type { Profile } from "@/lib/profile";
export function ProgramCard({
  program: p,
  profile,
  selected,
  onCompare,
  compareDisabled = false,
}: {
  program: Program;
  profile: Profile;
  selected?: boolean;
  onCompare?: () => void;
  compareDisabled?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const result = match(profile, p);
  return (
    <article className="program-card">
      <div className={`program-art ${p.color}`}>
        <span className="program-monogram">
          {p.university
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </span>
        <span className="program-art-lines" aria-hidden="true" />
        <span className="demo-badge">FICTIONAL</span>
      </div>
      <div className="program-body">
        <div className="program-location">
          <MapPin size={12} />
          {p.city}, {p.country}
        </div>
        <h2>{p.university}</h2>
        <p className="program-title">{p.title}</p>
        <div className="program-tags">
          <span>{p.duration} years</span>
          <span>English taught · Demo</span>
        </div>
        <div className="program-metrics">
          <div>
            <span>Annual plan incl. buffer</span>
            <strong>{euro(costs(p).total)}</strong>
          </div>
          <div>
            <span>Demo fit index</span>
            <strong className="primary-text">
              {result.score}
              <small>/100</small>
            </strong>
          </div>
        </div>
        <div className="fit-bars">
          <span>
            Academic <b>{result.academic}/100</b>
          </span>
          <div style={{ width: `${result.academic}%` }} />
        </div>
        <div className="program-actions">
          <Button
            variant="ghost"
            size="small"
            onClick={() => dialog.current?.showModal()}
          >
            Explore program <ArrowUpRight size={14} />
          </Button>
          {onCompare && (
            <label className="compare-choice">
              <input
                type="checkbox"
                checked={!!selected}
                disabled={compareDisabled}
                onChange={onCompare}
              />
              Compare
            </label>
          )}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="program-dialog"
        aria-labelledby={`${p.id}-title`}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="dialog-top">
          <span className="eyebrow">FICTIONAL PROGRAM DETAILS</span>
          <button
            className="icon-button"
            aria-label="Close program details"
            onClick={() => dialog.current?.close()}
          >
            <X size={18} />
          </button>
        </div>
        <BookOpen size={28} className="primary-text" />
        <h2 id={`${p.id}-title`}>{p.title}</h2>
        <p className="muted">
          {p.university} · {p.country}
        </p>
        <p>{p.description}</p>
        <dl className="detail-list">
          <div>
            <dt>Focus</dt>
            <dd>{p.focus}</dd>
          </div>
          <div>
            <dt>Learning style</dt>
            <dd>{p.teaching}</dd>
          </div>
          <div>
            <dt>Illustrative thresholds</dt>
            <dd>
              IELTS {p.ielts.toFixed(1)} · Grades {p.grade}/100
              {p.sat ? ` · SAT ${p.sat}` : " · No SAT threshold in this demo"}
            </dd>
          </div>
          <div>
            <dt>Current demo gaps</dt>
            <dd>
              {result.gaps.join("; ") ||
                "No score gaps in this simplified model. Official eligibility would still need verification."}
            </dd>
          </div>
          <div>
            <dt>Year-one estimate</dt>
            <dd>{euro(costs(p).total)} including a 10% contingency</dd>
          </div>
        </dl>
        <div className="callout">
          <p>
            These are invented thresholds and costs. A fit index describes this
            demo’s weighted preferences; it is not an admission probability.
          </p>
        </div>
        <Button variant="outline" onClick={() => dialog.current?.close()}>
          Back to exploring
        </Button>
      </dialog>
    </article>
  );
}
