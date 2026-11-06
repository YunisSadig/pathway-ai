"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Globe2 } from "lucide-react";
import { Workspace, PageIntro } from "@/components/workspace";
import { useProfile } from "@/lib/use-profile";
import { useHydrated } from "@/lib/use-hydrated";
const topics = [
  {
    name: "Student life",
    expectation: "Every week will feel like an adventure.",
    reality:
      "Some days will be exciting. Others will be laundry, deadlines, and finding your rhythm. Both belong in your next chapter.",
    actions: [
      "Think about a balanced weekly routine",
      "Leave room for rest, not just activities",
      "Explore one society you would enjoy",
    ],
  },
  {
    name: "Independence",
    expectation: "I’ll feel independent as soon as I arrive.",
    reality:
      "Independence is a skill you practice: meals, appointments, time management, and knowing when to ask for help.",
    actions: [
      "Practice a few affordable meals",
      "Try a weekly planning routine",
      "Know where student support would be",
    ],
  },
  {
    name: "Making friends",
    expectation: "A new city means an instant friend group.",
    reality:
      "Connection can take time. Shared classes, societies, and small repeated conversations can make unfamiliar places feel more familiar.",
    actions: [
      "Choose a low-pressure social activity",
      "Keep in touch with people at home",
      "Give yourself time to settle in",
    ],
  },
  {
    name: "Housing",
    expectation: "I’ll sort a room when I get there.",
    reality:
      "Housing takes planning. Availability, contracts, deposits, and travel distance deserve a place on your checklist before you move.",
    actions: [
      "Research verified housing channels",
      "Budget for a deposit and setup",
      "Review the contract with someone you trust",
    ],
  },
  {
    name: "Finances",
    expectation: "Once tuition is covered, the money part is done.",
    reality:
      "A budget also needs everyday spending, upfront costs, and unexpected changes. Plan with confirmed funding, not hoped-for earnings.",
    actions: [
      "Build a full year-one budget",
      "Keep a separate emergency buffer",
      "Revisit your lower-cost route",
    ],
  },
  {
    name: "Career",
    expectation: "An international degree guarantees the job I want.",
    reality:
      "A degree is one part of a career. Practical experience, language, networks, and the local job market also shape opportunities.",
    actions: [
      "Explore career support services",
      "Identify practical skills to develop",
      "Research official work rules later",
    ],
  },
  {
    name: "Academic life",
    expectation: "The same study habits will work everywhere.",
    reality:
      "Learning styles can differ. Independent reading, group projects, unfamiliar assessment formats, and asking questions may take practice.",
    actions: [
      "Explore the program’s teaching style",
      "Practice planning independent study",
      "Find out how academic support works",
    ],
  },
];
export function LifeAbroad() {
  const ready = useHydrated();
  const [topic, setTopic] = useState(0);
  const [show, setShow] = useState(false);
  const { state } = useProfile();
  const current = topics[topic];
  return (
    <Workspace>
      <PageIntro
        eyebrow="THE LIFE BETWEEN THE LECTURES"
        title="A new country. The whole experience."
        description="Keep the excitement. Make space for the everyday. A thoughtful reality check can help you feel more prepared."
      />
      <div className="life-banner">
        <Globe2 size={50} strokeWidth={1} />
        <div>
          <h2>Picture an ordinary Tuesday.</h2>
          <p>
            What would make a place feel like home — and what might take a
            little practice?
          </p>
        </div>
      </div>
      <div className="topic-list" role="group" aria-label="Life abroad topics">
        {topics.map((t, i) => (
          <button
            key={t.name}
            disabled={!ready}
            aria-pressed={i === topic}
            onClick={() => {
              setTopic(i);
              setShow(false);
            }}
          >
            {t.name}
          </button>
        ))}
      </div>
      <section className="expectation-grid">
        <article className="expectation">
          <span className="eyebrow">THE EXPECTATION</span>
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <h2>{current.expectation}</h2>
          <button
            className="button button-outline"
            disabled={!ready}
            aria-expanded={show}
            aria-controls="reality"
            onClick={() => setShow(!show)}
          >
            {show ? "Take another look" : "Let’s look a little closer"}
            <ArrowUpRight size={16} />
          </button>
        </article>
        <article className={`reality ${show ? "revealed" : ""}`} id="reality">
          <span className="eyebrow">A MORE COMPLETE PICTURE</span>
          {show ? (
            <>
              <h2>There’s room for both.</h2>
              <p>{current.reality}</p>
            </>
          ) : (
            <>
              <h2>Curiosity is a good start.</h2>
              <p>
                Reveal a thoughtful perspective, then choose one small
                preparation step.
              </p>
            </>
          )}
        </article>
      </section>
      {show && (
        <section className="panel life-actions">
          <h2>Three small ways to prepare</h2>
          <ul>
            {current.actions.map((a) => (
              <li key={a}>
                <span className="mini-check">
                  <Check size={12} />
                </span>
                {a}
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="personal-reflection">
        <span className="eyebrow">FROM YOUR STARTING POINT</span>
        <h2>
          {state.profile.expectations
            ? "Keep your own hopes in the picture."
            : "What would a good everyday life feel like?"}
        </h2>
        <p>
          {state.profile.expectations ||
            "You can add your hopes and worries in the assessment. There is no perfect answer."}
        </p>
        <p className="fine-print">
          Current area to explore: {state.profile.worry}. These are general
          reflection prompts, not country-specific or professional advice.
        </p>
        <Link href="/onboarding" className="text-link">
          Revisit my expectations <ArrowUpRight size={15} />
        </Link>
      </div>
    </Workspace>
  );
}
