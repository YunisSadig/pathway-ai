"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Tabs } from "radix-ui";

// General, subjective guidance. Not university facts.
const TOPICS = [
  {
    id: "friends",
    label: "Making friends",
    expectation:
      "You will meet people on the first day and have a group by the first week.",
    reality:
      "Friendships often form slowly, through repeated contact. Clubs, shared housing and study groups help more than one big welcome event.",
  },
  {
    id: "independence",
    label: "Living alone",
    expectation:
      "Independence means freedom and no one telling you what to do.",
    reality:
      "It also means cooking, budgeting, paperwork and illness with no family nearby. Practising some of it before you leave makes the first month easier.",
  },
  {
    id: "language",
    label: "Language",
    expectation: "A certificate score means you will follow every lecture.",
    reality:
      "Fast speech, accents and academic vocabulary take time even with a good score. Many students need a few weeks to feel comfortable.",
  },
  {
    id: "pressure",
    label: "Academic pressure",
    expectation: "University works like school, only harder.",
    reality:
      "You are usually expected to manage your own time and read far more independently. Asking for help early is normal.",
  },
];

export function LifeAbroadPreview() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="border-y border-border bg-muted py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="max-w-2xl text-3xl font-extrabold text-balance sm:text-4xl">
            What you expect and what tends to happen
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            General guidance from common student experience. It is not a fact
            about any one university, and every student&apos;s experience
            differs.
          </p>

          <Tabs.Root defaultValue={TOPICS[0].id} className="mt-10">
            <Tabs.List
              aria-label="Topics"
              className="flex gap-2 overflow-x-auto pb-2"
            >
              {TOPICS.map((t) => (
                <Tabs.Trigger
                  key={t.id}
                  value={t.id}
                  className="min-h-11 shrink-0 rounded-full border border-border-strong px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-150 hover:bg-hover data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {t.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {TOPICS.map((t) => (
              <Tabs.Content key={t.id} value={t.id} className="mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={t.id}
                    className="grid gap-4 md:grid-cols-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="rounded-2xl border border-border bg-surface p-6">
                      <p className="font-display font-bold text-muted-foreground">
                        Expectation
                      </p>
                      <p className="mt-2 text-lg">{t.expectation}</p>
                    </div>
                    <div className="rounded-2xl bg-coral p-6 text-coral-foreground">
                      <p className="font-display font-bold">Reality</p>
                      <p className="mt-2 text-lg">{t.reality}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </div>
      </section>
    </MotionConfig>
  );
}
