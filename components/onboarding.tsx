"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/form-field";
import {
  countries,
  fields,
  initialState,
  validateStep,
  type Profile,
  type ProfileErrors,
} from "@/lib/profile";
import { useProfile } from "@/lib/use-profile";
const steps = [
  "Your starting point",
  "Your academic story",
  "Your ambitions",
  "Your kind of place",
  "Your next chapter",
];
const intros = [
  "Every good plan starts with you.",
  "Numbers help us find a starting point.",
  "Dream big. Plan realistically.",
  "A good fit goes beyond the classroom.",
  "Let’s make room for the real world.",
];
export function Onboarding() {
  const { state, update } = useProfile();
  const { profile: p, step } = state;
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [storageError, setStorageError] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  const router = useRouter();
  useEffect(() => {
    if (previousStep.current !== step) {
      heading.current?.focus();
      previousStep.current = step;
    }
  }, [step]);
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setStorageError(
      !update((s) => ({ ...s, profile: { ...s.profile, [key]: value } })),
    );
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  function next(e: React.FormEvent) {
    e.preventDefault();
    const found = validateStep(p, step);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLInputElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    if (step < 4) {
      setStorageError(!update({ step: step + 1 }));
      return;
    }
    for (let i = 0; i < 5; i++) {
      const invalid = validateStep(p, i);
      if (Object.keys(invalid).length) {
        update({ step: i });
        setErrors(invalid);
        return;
      }
    }
    update({ completed: true });
    router.push("/dashboard");
  }
  const numberField = (
    key: "age" | "grade" | "ielts" | "sat" | "budget" | "months",
    label: string,
    min: number,
    max: number,
    increment = 1,
    hint?: string,
  ) => (
    <Field key={key} label={label} error={errors[key]} hint={hint}>
      {(props) => (
        <input
          {...props}
          type="number"
          min={min}
          max={max}
          step={increment}
          value={Number.isFinite(p[key]) ? p[key] : ""}
          onChange={(e) =>
            set(key, e.target.value === "" ? NaN : Number(e.target.value))
          }
        />
      )}
    </Field>
  );
  const selectField = (
    key:
      | "citizenship"
      | "educationCountry"
      | "qualification"
      | "field"
      | "city"
      | "teaching"
      | "intake"
      | "worry",
    label: string,
    options: string[],
  ) => (
    <Field key={key} label={label} error={errors[key]}>
      {(props) => (
        <select
          {...props}
          value={p[key]}
          onChange={(e) => set(key, e.target.value as Profile[typeof key])}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      )}
    </Field>
  );
  return (
    <main id="main" className="assessment container">
      <aside className="assessment-sidebar">
        <span className="section-symbol purple">
          <Compass size={26} />
        </span>
        <div className="eyebrow">A LITTLE SELF-DISCOVERY</div>
        <h1>
          Your story.
          <br />
          Your possibilities.
        </h1>
        <p>
          Five small steps toward a clearer picture. Use a fictional nickname
          and demo information to explore.
        </p>
        <ol className="assessment-steps">
          {steps.map((title, i) => (
            <li key={title} aria-current={step === i ? "step" : undefined}>
              <span className={step >= i ? "active" : ""}>
                {step > i ? <Check size={13} /> : i + 1}
              </span>
              {title}
            </li>
          ))}
        </ol>
        <div className="privacy-note">
          <LockKeyhole size={16} />
          <span>
            Saved only in this browser.
            <br />
            No account. No data sent to a server.
          </span>
        </div>
      </aside>
      <section className="assessment-content">
        <div className="assessment-progress">
          <span>STEP {step + 1} OF 5</span>
          <span>{Math.round(((step + 1) / 5) * 100)}%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Assessment progress"
          aria-valuemin={0}
          aria-valuemax={5}
          aria-valuenow={step + 1}
        >
          <motion.div
            animate={{ scaleX: (step + 1) / 5 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
        <h2 ref={heading} tabIndex={-1}>
          {intros[step]}
        </h2>
        <p className="muted">
          {step === 0
            ? "Let’s get to know your starting point. You can change these details later."
            : step === 1
              ? "Scores are starting points, never labels. Enter 0 for exams you haven’t taken."
              : step === 2
                ? "Your annual budget includes tuition and living costs, in euros."
                : step === 3
                  ? "Picture an ordinary Tuesday, not just the graduation photo."
                  : "Preparation takes time. It’s okay to have a few unknowns."}
        </p>
        <form noValidate onSubmit={next}>
          <div className="form-grid" key={step}>
            {step === 0 && (
              <>
                <Field
                  label="What should we call you?"
                  error={errors.name}
                  hint="A fictional nickname is enough."
                >
                  {(props) => (
                    <input
                      {...props}
                      autoComplete="off"
                      maxLength={40}
                      placeholder="e.g. Alex"
                      value={p.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                  )}
                </Field>
                {numberField("age", "Age", 16, 60)}
                {selectField("citizenship", "Citizenship", [
                  "Azerbaijan",
                  "Georgia",
                  "Armenia",
                  "Kazakhstan",
                  "Kyrgyzstan",
                  "Uzbekistan",
                  "Other",
                ])}
                {selectField("educationCountry", "Country of education", [
                  "Azerbaijan",
                  "Georgia",
                  "Armenia",
                  "Kazakhstan",
                  "Kyrgyzstan",
                  "Uzbekistan",
                  "Other",
                ])}
              </>
            )}
            {step === 1 && (
              <>
                {selectField("qualification", "Current qualification", [
                  "School leaving certificate",
                  "A levels",
                  "International Baccalaureate",
                  "Other",
                ])}
                <Field label="Grading scale">
                  {(props) => (
                    <select
                      {...props}
                      value={p.gradeScale}
                      onChange={(e) => {
                        const scale = e.target.value as "100" | "5";
                        update((s) => ({
                          ...s,
                          profile: {
                            ...s.profile,
                            gradeScale: scale,
                            grade:
                              scale === "5"
                                ? Math.round((s.profile.grade / 20) * 10) / 10
                                : s.profile.grade * 20,
                          },
                        }));
                      }}
                    >
                      <option value="100">0–100</option>
                      <option value="5">0–5</option>
                    </select>
                  )}
                </Field>
                {numberField(
                  "grade",
                  "Current average grade",
                  0,
                  p.gradeScale === "5" ? 5 : 100,
                  0.1,
                )}
                {numberField("ielts", "IELTS overall band", 0, 9, 0.5)}
                {numberField(
                  "sat",
                  "SAT score (optional)",
                  0,
                  1600,
                  10,
                  "0 = not taken. Otherwise 400–1600.",
                )}
                <Field
                  label="Achievements & activities (optional)"
                  hint="Projects, sport, competitions, portfolios — anything you’d like to add."
                >
                  {(props) => (
                    <textarea
                      {...props}
                      maxLength={500}
                      value={p.achievements}
                      onChange={(e) => set("achievements", e.target.value)}
                    />
                  )}
                </Field>
              </>
            )}
            {step === 2 && (
              <>
                {selectField("field", "Field of study", [...fields])}
                <Field
                  label="A career you’re curious about"
                  error={errors.career}
                >
                  {(props) => (
                    <input
                      {...props}
                      maxLength={100}
                      value={p.career}
                      onChange={(e) => set("career", e.target.value)}
                    />
                  )}
                </Field>
                {numberField("budget", "Annual budget (€)", 3000, 150000, 500)}
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={p.scholarship}
                    onChange={(e) => set("scholarship", e.target.checked)}
                  />
                  <span>
                    I would need scholarship support
                    <small>
                      Demo costs do not assume any scholarship award.
                    </small>
                  </span>
                </label>
              </>
            )}
            {step === 3 && (
              <>
                <fieldset className="full-width">
                  <legend>Where do you dream of studying?</legend>
                  <div className="choice-grid">
                    {countries.map((c) => (
                      <label
                        key={c}
                        className={`choice ${p.countries.includes(c) ? "selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={p.countries.includes(c)}
                          onChange={() =>
                            set(
                              "countries",
                              p.countries.includes(c)
                                ? p.countries.filter((x) => x !== c)
                                : [...p.countries, c],
                            )
                          }
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                  {errors.countries && (
                    <p role="alert" className="field-error">
                      {errors.countries}
                    </p>
                  )}
                </fieldset>
                {selectField("city", "Your ideal city", [
                  "Balanced",
                  "Big city",
                  "Small city",
                ])}
                {selectField("teaching", "How you like to learn", [
                  "Project-based",
                  "Lecture-based",
                ])}
              </>
            )}
            {step === 4 && (
              <>
                {numberField("months", "Months available to prepare", 1, 36)}
                {selectField("intake", "Target intake", [
                  "Autumn 2028",
                  "Spring 2029",
                  "Autumn 2029",
                ])}
                {selectField("worry", "What feels most uncertain?", [
                  "Finances",
                  "Housing",
                  "Making friends",
                  "Academic expectations",
                  "Independence",
                ])}
                <Field label="What do you hope life abroad will feel like? (optional)">
                  {(props) => (
                    <textarea
                      {...props}
                      maxLength={500}
                      placeholder="A new perspective, independence, a close community…"
                      value={p.expectations}
                      onChange={(e) => set("expectations", e.target.value)}
                    />
                  )}
                </Field>
                <div className="callout full-width">
                  <strong>One useful reminder</strong>
                  <p>
                    This prototype compares fictional programs. It cannot verify
                    eligibility, predict admission, or replace official
                    guidance.
                  </p>
                </div>
              </>
            )}
          </div>
          {Object.keys(errors).some((k) => errors[k as keyof Profile]) && (
            <p role="alert" className="field-error form-summary">
              Please check the highlighted answers.
            </p>
          )}
          {storageError && (
            <p role="status" className="field-error">
              Browser storage is unavailable. You can continue, but changes may
              be lost on refresh.
            </p>
          )}
          <div className="form-actions">
            <Button
              type="button"
              variant="ghost"
              disabled={step === 0}
              onClick={() => {
                update({ step: step - 1 });
                setErrors({});
              }}
            >
              <ArrowLeft size={16} /> Previous
            </Button>
            <Button type="submit">
              {step === 4 ? "See my starting point" : "Continue"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </form>
        <button
          className="reset-link"
          onClick={() => {
            if (
              window.confirm(
                "Clear this browser’s demo assessment and saved plans?",
              )
            ) {
              update(initialState);
              setErrors({});
            }
          }}
        >
          <RotateCcw size={12} /> Start fresh
        </button>
      </section>
    </main>
  );
}
