"use client";

import { useSyncExternalStore } from "react";
import type {
  PathwayRoute,
  PathwayStore,
  StudentProfile,
} from "./domain/types";

export const STORE_KEY = "pathway-ai:store";
export const STORE_VERSION = 1;

export const emptyProfile = (): StudentProfile => ({
  stage: null,
  citizenship: "",
  currentCountry: "",
  targetDegree: null,
  gradingScale: "",
  grade: "",
  intakeYear: null,
  intakeSeason: null,
  language: { test: "None", score: null, plannedDate: null },
  budget: {
    currency: "EUR",
    maxAnnualTuition: null,
    monthlyLiving: null,
    totalFunding: null,
    needsScholarship: null,
  },
  preferences: {
    fields: [],
    careerInterests: "",
    teachingLanguage: "",
    preferredRegions: [],
    avoidedRegions: [],
    citySize: "any",
    priorities: [],
  },
  examinations: [],
  achievements: "",
  willingToPostpone: null,
  willingToChangeField: null,
});

export const emptyRoute = (slot: PathwayRoute["slot"]): PathwayRoute => ({
  slot,
  universityId: null,
  program: "",
  intake: "",
  scholarshipIds: [],
  milestones: [],
  notes: "",
});

export const initialStore = (): PathwayStore => ({
  version: STORE_VERSION,
  onboarding: { step: 0, completed: false },
  profile: emptyProfile(),
  savedUniversities: [],
  savedScholarships: [],
  compare: [],
  routes: [emptyRoute("primary"), emptyRoute("alt1"), emptyRoute("alt2")],
  budgetScenarios: [],
  improvement: { ieltsOverride: null, budgetOverride: null },
  improvementReq: { lang: null, tuition: null },
});

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Merge stored data over defaults; discard anything with the wrong version or shape. */
export function parseStore(raw: string | null): PathwayStore {
  const base = initialStore();
  if (!raw) return base;
  try {
    const data: unknown = JSON.parse(raw);
    if (!isObj(data) || data.version !== STORE_VERSION) return base;
    const profile = isObj(data.profile) ? data.profile : {};
    const strings = (v: unknown) =>
      Array.isArray(v)
        ? v.filter((x): x is string => typeof x === "string")
        : [];
    return {
      ...base,
      ...(data as Partial<PathwayStore>),
      version: STORE_VERSION,
      profile: {
        ...base.profile,
        ...(profile as Partial<StudentProfile>),
        language: {
          ...base.profile.language,
          ...(isObj(profile.language) ? profile.language : {}),
        },
        budget: {
          ...base.profile.budget,
          ...(isObj(profile.budget) ? profile.budget : {}),
        },
        preferences: {
          ...base.profile.preferences,
          ...(isObj(profile.preferences) ? profile.preferences : {}),
        },
      },
      savedUniversities: strings(data.savedUniversities),
      savedScholarships: strings(data.savedScholarships),
      compare: strings(data.compare).slice(0, 3),
      routes:
        Array.isArray(data.routes) && data.routes.length === 3
          ? (data.routes as PathwayRoute[])
          : base.routes,
      budgetScenarios: Array.isArray(data.budgetScenarios)
        ? data.budgetScenarios
        : [],
    };
  } catch {
    return base;
  }
}

/* ---- external store ---- */
let cache: PathwayStore | null = null;
const listeners = new Set<() => void>();
const SERVER = initialStore();

function read(): PathwayStore {
  if (cache) return cache;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORE_KEY);
  } catch {
    /* storage blocked: run in memory */
  }
  cache = parseStore(raw);
  return cache;
}

export function update(fn: (s: PathwayStore) => PathwayStore) {
  cache = fn(read());
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore quota or blocked storage */
  }
  listeners.forEach((l) => l());
}

export function clearAll() {
  cache = initialStore();
  try {
    window.localStorage.removeItem(STORE_KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORE_KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};

/** Server render and first client render use the empty store; real data arrives after hydration. */
export function useStore(): PathwayStore {
  return useSyncExternalStore(subscribe, read, () => SERVER);
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/* ---- helpers ---- */
const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

export const actions = {
  toggleSavedUniversity: (id: string) =>
    update((s) => ({
      ...s,
      savedUniversities: toggle(s.savedUniversities, id),
    })),
  toggleSavedScholarship: (id: string) =>
    update((s) => ({
      ...s,
      savedScholarships: toggle(s.savedScholarships, id),
    })),
  /** Returns false when the comparison is full (3). */
  toggleCompare: (id: string): boolean => {
    const s = read();
    if (!s.compare.includes(id) && s.compare.length >= 3) return false;
    update((st) => ({ ...st, compare: toggle(st.compare, id) }));
    return true;
  },
  setProfile: (patch: Partial<StudentProfile>) =>
    update((s) => ({ ...s, profile: { ...s.profile, ...patch } })),
  setRoute: (slot: PathwayRoute["slot"], patch: Partial<PathwayRoute>) =>
    update((s) => ({
      ...s,
      routes: s.routes.map((r) => (r.slot === slot ? { ...r, ...patch } : r)),
    })),
};
