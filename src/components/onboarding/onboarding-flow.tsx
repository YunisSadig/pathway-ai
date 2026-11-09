"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChoiceCard,
  Field,
  SelectInput,
  TextArea,
  TextInput,
  describedBy,
} from "@/components/ui/field";
import {
  DEGREE_LABEL,
  REGION_LABEL,
  type DegreeLevel,
  type EducationStage,
  type Region,
  type StudentProfile,
} from "@/lib/domain/types";
import { actions, update, useHydrated, useStore } from "@/lib/store";

export const FIELDS = [
  "Computer science and IT",
  "Engineering",
  "Natural sciences",
  "Medicine and health",
  "Business and economics",
  "Social sciences",
  "Law",
  "Arts and design",
  "Humanities",
  "Education",
  "Not sure yet",
];

export const STAGE_LABEL: Record<EducationStage, string> = {
  "high-school": "In high school",
  "bachelor-student": "In a bachelor's program",
  "bachelor-graduate": "Finished a bachelor's degree",
  "master-student": "In a master's program",
  working: "Working or taking a break",
};

const STAGES = Object.keys(STAGE_LABEL) as EducationStage[];
const STEPS = [
  "About you",
  "Your studies",
  "Destinations and budget",
  "Timing",
  "Qualifications",
  "Review",
];
const LAST = STEPS.length - 1;
const THIS_YEAR = new Date().getFullYear();

const toggleIn = <T,>(list: T[], v: T) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
const num = (v: string) =>
  v.trim() === "" || Number.isNaN(Number(v)) ? null : Number(v);

function validate(step: number, p: StudentProfile): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (!p.stage) e.stage = "Choose where you are in your education.";
    if (!p.currentCountry.trim())
      e.country = "Enter the country where you study or live now.";
    if (!p.targetDegree) e.degree = "Choose the degree you want.";
  }
  if (step === 1) {
    if (p.preferences.fields.length === 0)
      e.fields = "Choose at least one field, or pick Not sure yet.";
    if (!p.grade.trim())
      e.grade = "Enter your average grade, or write Not available yet.";
  }
  if (step === 2) {
    if (p.preferences.preferredRegions.length === 0)
      e.regions = "Choose at least one destination.";
    if (p.budget.maxAnnualTuition === null)
      e.tuition =
        "Enter a yearly tuition limit, or 0 if you cannot pay tuition.";
    else if (p.budget.maxAnnualTuition < 0)
      e.tuition = "Tuition cannot be negative.";
  }
  if (step === 3) {
    if (p.intakeYear === null) e.year = "Choose the year you want to start.";
  }
  return e;
}

export function OnboardingFlow() {
  const router = useRouter();
  const store = useStore();
  const hydrated = useHydrated();
  const p = store.profile;
  const step = Math.min(store.onboarding.step, LAST);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const heading = useRef<HTMLHeadingElement>(null);

  const go = (n: number) => {
    update((s) => ({ ...s, onboarding: { ...s.onboarding, step: n } }));
    setErrors({});
    requestAnimationFrame(() => heading.current?.focus());
  };
  const next = () => {
    const e = validate(step, p);
    setErrors(e);
    if (Object.keys(e).length) return;
    go(step + 1);
  };
  const finish = () => {
    for (let i = 0; i < 4; i++) {
      if (Object.keys(validate(i, p)).length) {
        go(i);
        setErrors(validate(i, p));
        return;
      }
    }
    update((s) => ({ ...s, onboarding: { step: LAST, completed: true } }));
    router.push("/dashboard");
  };

  if (!hydrated)
    return <p className="text-muted-foreground">Loading your progress…</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Step {step + 1} of {STEPS.length}
          {step >= 4 ? " (optional details)" : ""}
        </p>
        <p>Saved on this device as you go</p>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-valuenow={step + 1}
        aria-label="Onboarding progress"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <h2
        ref={heading}
        tabIndex={-1}
        className="mt-6 text-2xl font-extrabold outline-none"
      >
        {STEPS[step]}
      </h2>

      <div className="mt-5 grid gap-6">
        {step === 0 && (
          <>
            <fieldset
              aria-describedby={errors.stage ? "stage-error" : undefined}
            >
              <legend className="font-semibold">
                Where are you in your education?
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {STAGES.map((s) => (
                  <ChoiceCard
                    key={s}
                    type="radio"
                    name="stage"
                    title={STAGE_LABEL[s]}
                    checked={p.stage === s}
                    onChange={() => actions.setProfile({ stage: s })}
                  />
                ))}
              </div>
              {errors.stage ? (
                <p
                  id="stage-error"
                  role="alert"
                  className="mt-1 text-sm font-medium text-danger"
                >
                  {errors.stage}
                </p>
              ) : null}
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Country you study or live in now"
                htmlFor="country"
                error={errors.country}
              >
                <TextInput
                  id="country"
                  value={p.currentCountry}
                  aria-invalid={!!errors.country}
                  aria-describedby={describedBy(
                    "country",
                    undefined,
                    errors.country,
                  )}
                  onChange={(e) =>
                    actions.setProfile({ currentCountry: e.target.value })
                  }
                />
              </Field>
              <Field
                label="Citizenship (optional)"
                htmlFor="citizenship"
                hint="Some scholarships depend on it."
              >
                <TextInput
                  id="citizenship"
                  value={p.citizenship}
                  aria-describedby="citizenship-hint"
                  onChange={(e) =>
                    actions.setProfile({ citizenship: e.target.value })
                  }
                />
              </Field>
            </div>
            <fieldset>
              <legend className="font-semibold">
                Which degree do you want to start?
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {(Object.keys(DEGREE_LABEL) as DegreeLevel[]).map((d) => (
                  <ChoiceCard
                    key={d}
                    type="radio"
                    name="degree"
                    title={DEGREE_LABEL[d]}
                    checked={p.targetDegree === d}
                    onChange={() => actions.setProfile({ targetDegree: d })}
                  />
                ))}
              </div>
              {errors.degree ? (
                <p
                  role="alert"
                  className="mt-1 text-sm font-medium text-danger"
                >
                  {errors.degree}
                </p>
              ) : null}
            </fieldset>
          </>
        )}

        {step === 1 && (
          <>
            <fieldset>
              <legend className="font-semibold">
                Which fields interest you? Choose any number.
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <ChoiceCard
                    key={f}
                    type="checkbox"
                    name="fields"
                    title={f}
                    checked={p.preferences.fields.includes(f)}
                    onChange={() =>
                      actions.setProfile({
                        preferences: {
                          ...p.preferences,
                          fields: toggleIn(p.preferences.fields, f),
                        },
                      })
                    }
                  />
                ))}
              </div>
              {errors.fields ? (
                <p
                  role="alert"
                  className="mt-1 text-sm font-medium text-danger"
                >
                  {errors.fields}
                </p>
              ) : null}
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Average grade"
                htmlFor="grade"
                error={errors.grade}
                hint="For example 4.2 or 85. Write Not available yet if you have none."
              >
                <TextInput
                  id="grade"
                  value={p.grade}
                  aria-invalid={!!errors.grade}
                  aria-describedby={describedBy("grade", "x", errors.grade)}
                  onChange={(e) =>
                    actions.setProfile({ grade: e.target.value })
                  }
                />
              </Field>
              <Field
                label="Grading scale (optional)"
                htmlFor="scale"
                hint="For example out of 5, out of 100, or GPA 4.0."
              >
                <TextInput
                  id="scale"
                  value={p.gradingScale}
                  aria-describedby="scale-hint"
                  onChange={(e) =>
                    actions.setProfile({ gradingScale: e.target.value })
                  }
                />
              </Field>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <fieldset>
              <legend className="font-semibold">
                Where would you consider studying? Choose any number.
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {(Object.keys(REGION_LABEL) as Region[]).map((r) => (
                  <ChoiceCard
                    key={r}
                    type="checkbox"
                    name="regions"
                    title={REGION_LABEL[r]}
                    checked={p.preferences.preferredRegions.includes(r)}
                    onChange={() =>
                      actions.setProfile({
                        preferences: {
                          ...p.preferences,
                          preferredRegions: toggleIn(
                            p.preferences.preferredRegions,
                            r,
                          ),
                        },
                      })
                    }
                  />
                ))}
              </div>
              {errors.regions ? (
                <p
                  role="alert"
                  className="mt-1 text-sm font-medium text-danger"
                >
                  {errors.regions}
                </p>
              ) : null}
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Currency" htmlFor="currency">
                <SelectInput
                  id="currency"
                  value={p.budget.currency}
                  onChange={(e) =>
                    actions.setProfile({
                      budget: { ...p.budget, currency: e.target.value },
                    })
                  }
                >
                  {["EUR", "USD", "CAD", "GBP", "KRW", "JPY", "CNY", "AZN"].map(
                    (c) => (
                      <option key={c}>{c}</option>
                    ),
                  )}
                </SelectInput>
              </Field>
              <Field
                label={`Yearly tuition limit (${p.budget.currency})`}
                htmlFor="tuition"
                error={errors.tuition}
                hint="Per year, tuition only."
              >
                <TextInput
                  id="tuition"
                  inputMode="numeric"
                  value={p.budget.maxAnnualTuition ?? ""}
                  aria-invalid={!!errors.tuition}
                  aria-describedby={describedBy("tuition", "x", errors.tuition)}
                  onChange={(e) =>
                    actions.setProfile({
                      budget: {
                        ...p.budget,
                        maxAnnualTuition: num(e.target.value),
                      },
                    })
                  }
                />
              </Field>
              <Field
                label={`Monthly living budget (${p.budget.currency}, optional)`}
                htmlFor="living"
                hint="Per month."
              >
                <TextInput
                  id="living"
                  inputMode="numeric"
                  value={p.budget.monthlyLiving ?? ""}
                  aria-describedby="living-hint"
                  onChange={(e) =>
                    actions.setProfile({
                      budget: {
                        ...p.budget,
                        monthlyLiving: num(e.target.value),
                      },
                    })
                  }
                />
              </Field>
            </div>
            <fieldset>
              <legend className="font-semibold">
                Do you need a scholarship to study abroad?
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {(
                  [
                    [true, "Yes"],
                    [false, "No"],
                    [null, "I don't know yet"],
                  ] as const
                ).map(([v, label]) => (
                  <ChoiceCard
                    key={label}
                    type="radio"
                    name="needsSch"
                    title={label}
                    checked={p.budget.needsScholarship === v}
                    onChange={() =>
                      actions.setProfile({
                        budget: { ...p.budget, needsScholarship: v },
                      })
                    }
                  />
                ))}
              </div>
            </fieldset>
          </>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Year you want to start"
              htmlFor="year"
              error={errors.year}
            >
              <SelectInput
                id="year"
                value={p.intakeYear ?? ""}
                aria-invalid={!!errors.year}
                aria-describedby={describedBy("year", undefined, errors.year)}
                onChange={(e) =>
                  actions.setProfile({
                    intakeYear: e.target.value ? Number(e.target.value) : null,
                  })
                }
              >
                <option value="">Choose…</option>
                {[0, 1, 2, 3, 4].map((i) => (
                  <option key={i} value={THIS_YEAR + i}>
                    {THIS_YEAR + i}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Intake" htmlFor="season">
              <SelectInput
                id="season"
                value={p.intakeSeason ?? ""}
                onChange={(e) =>
                  actions.setProfile({
                    intakeSeason: (e.target.value ||
                      null) as StudentProfile["intakeSeason"],
                  })
                }
              >
                <option value="">Not chosen</option>
                <option value="autumn">Autumn</option>
                <option value="spring">Spring</option>
                <option value="unsure">I don&rsquo;t know yet</option>
              </SelectInput>
            </Field>
          </div>
        )}

        {step === 4 && (
          <>
            <p className="text-muted-foreground">
              Everything on this page is optional. You can skip it and add
              details later from your profile.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Language test" htmlFor="lang-test">
                <SelectInput
                  id="lang-test"
                  value={p.language.test}
                  onChange={(e) =>
                    actions.setProfile({
                      language: {
                        ...p.language,
                        test: e.target
                          .value as StudentProfile["language"]["test"],
                        score:
                          e.target.value === "None" ? null : p.language.score,
                      },
                    })
                  }
                >
                  <option value="None">Not taken yet</option>
                  <option value="IELTS">IELTS</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="Other">Other</option>
                </SelectInput>
              </Field>
              {p.language.test !== "None" ? (
                <Field label="Score" htmlFor="lang-score">
                  <TextInput
                    id="lang-score"
                    inputMode="decimal"
                    value={p.language.score ?? ""}
                    onChange={(e) =>
                      actions.setProfile({
                        language: { ...p.language, score: num(e.target.value) },
                      })
                    }
                  />
                </Field>
              ) : (
                <Field label="Planned test date (optional)" htmlFor="lang-date">
                  <TextInput
                    id="lang-date"
                    type="month"
                    value={p.language.plannedDate ?? ""}
                    onChange={(e) =>
                      actions.setProfile({
                        language: {
                          ...p.language,
                          plannedDate: e.target.value || null,
                        },
                      })
                    }
                  />
                </Field>
              )}
            </div>
            <Field
              label="Exams, awards or projects (optional)"
              htmlFor="ach"
              hint="National exams, SAT, olympiads, research, portfolio. Only what applies to you."
            >
              <TextArea
                id="ach"
                value={p.achievements}
                aria-describedby="ach-hint"
                onChange={(e) =>
                  actions.setProfile({ achievements: e.target.value })
                }
              />
            </Field>
            <Field label="Career interests (optional)" htmlFor="career">
              <TextInput
                id="career"
                value={p.preferences.careerInterests}
                onChange={(e) =>
                  actions.setProfile({
                    preferences: {
                      ...p.preferences,
                      careerInterests: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <fieldset>
              <legend className="font-semibold">Preferred city size</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-4">
                {(
                  [
                    ["any", "No preference"],
                    ["large", "Large city"],
                    ["medium", "Medium city"],
                    ["small", "Small town"],
                  ] as const
                ).map(([v, l]) => (
                  <ChoiceCard
                    key={v}
                    type="radio"
                    name="citySize"
                    title={l}
                    checked={p.preferences.citySize === v}
                    onChange={() =>
                      actions.setProfile({
                        preferences: { ...p.preferences, citySize: v },
                      })
                    }
                  />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="font-semibold">
                Would you consider changing your plan if needed?
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <ChoiceCard
                  type="checkbox"
                  name="postpone"
                  title="Starting a later intake"
                  checked={p.willingToPostpone === true}
                  onChange={() =>
                    actions.setProfile({
                      willingToPostpone:
                        p.willingToPostpone === true ? null : true,
                    })
                  }
                />
                <ChoiceCard
                  type="checkbox"
                  name="changefield"
                  title="A related field"
                  checked={p.willingToChangeField === true}
                  onChange={() =>
                    actions.setProfile({
                      willingToChangeField:
                        p.willingToChangeField === true ? null : true,
                    })
                  }
                />
              </div>
            </fieldset>
          </>
        )}

        {step === 5 && <Review p={p} onEdit={go} />}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <Button
          variant="outline"
          onClick={() => go(step - 1)}
          disabled={step === 0}
        >
          Back
        </Button>
        <div className="flex gap-2">
          {step === 4 ? (
            <Button variant="ghost" onClick={() => go(step + 1)}>
              Skip this step
            </Button>
          ) : null}
          {step < LAST ? (
            <Button onClick={step === 4 ? () => go(step + 1) : next}>
              Continue
            </Button>
          ) : (
            <Button onClick={finish}>Save profile and open dashboard</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  step,
  onEdit,
}: {
  label: string;
  value: string;
  step: number;
  onEdit: (n: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 py-3">
      <div>
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <dd className="font-semibold">{value || "Not provided"}</dd>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(step)}
        aria-label={`Edit ${label}`}
      >
        Edit
      </Button>
    </div>
  );
}

export function Review({
  p,
  onEdit,
}: {
  p: StudentProfile;
  onEdit: (n: number) => void;
}) {
  const b = p.budget;
  return (
    <div className="card p-5">
      <p className="text-muted-foreground">
        Check your answers. Nothing is sent anywhere; it stays in this browser.
      </p>
      <dl className="mt-2 divide-y divide-border">
        <Row
          label="Education stage"
          value={p.stage ? STAGE_LABEL[p.stage] : ""}
          step={0}
          onEdit={onEdit}
        />
        <Row
          label="Country now"
          value={p.currentCountry}
          step={0}
          onEdit={onEdit}
        />
        <Row
          label="Intended degree"
          value={p.targetDegree ? DEGREE_LABEL[p.targetDegree] : ""}
          step={0}
          onEdit={onEdit}
        />
        <Row
          label="Fields"
          value={p.preferences.fields.join(", ")}
          step={1}
          onEdit={onEdit}
        />
        <Row
          label="Average grade"
          value={[p.grade, p.gradingScale].filter(Boolean).join(" · ")}
          step={1}
          onEdit={onEdit}
        />
        <Row
          label="Destinations"
          value={p.preferences.preferredRegions
            .map((r) => REGION_LABEL[r])
            .join(", ")}
          step={2}
          onEdit={onEdit}
        />
        <Row
          label="Yearly tuition limit"
          value={
            b.maxAnnualTuition !== null
              ? `${b.maxAnnualTuition.toLocaleString()} ${b.currency} per year`
              : ""
          }
          step={2}
          onEdit={onEdit}
        />
        <Row
          label="Monthly living budget"
          value={
            b.monthlyLiving !== null
              ? `${b.monthlyLiving.toLocaleString()} ${b.currency} per month`
              : ""
          }
          step={2}
          onEdit={onEdit}
        />
        <Row
          label="Target intake"
          value={
            p.intakeYear
              ? `${p.intakeSeason && p.intakeSeason !== "unsure" ? p.intakeSeason + " " : ""}${p.intakeYear}`
              : ""
          }
          step={3}
          onEdit={onEdit}
        />
        <Row
          label="Language test"
          value={
            p.language.test === "None"
              ? "Not taken yet"
              : `${p.language.test} ${p.language.score ?? ""}`
          }
          step={4}
          onEdit={onEdit}
        />
      </dl>
    </div>
  );
}
