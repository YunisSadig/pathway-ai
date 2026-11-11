#!/usr/bin/env node
/**
 * Verifies that a RUNNING backend still matches the TypeScript contracts in src/types.
 *
 *   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 npm run contract:check
 *
 * It reads real responses (list and detail for every program and university it can find) and fails when a key
 * is missing, an unexpected key appears, an enum value is unknown or a type is wrong. It is a manual check, not a
 * CI step, because CI has no backend. It never writes anything.
 */
const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("Set NEXT_PUBLIC_API_BASE_URL to the backend origin.");
  process.exit(2);
}

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

const keys = (where, obj, expected) => {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return fail(where, "expected an object");
  }
  const got = Object.keys(obj).sort();
  const want = [...expected].sort();
  for (const k of want) if (!got.includes(k)) fail(where, `missing key "${k}"`);
  for (const k of got)
    if (!want.includes(k)) fail(where, `unexpected key "${k}"`);
};
const oneOf = (where, v, allowed) => {
  if (!allowed.includes(v))
    fail(where, `unexpected value ${JSON.stringify(v)}`);
};
const type = (where, v, t, nullable = false) => {
  if (v === null) return nullable || fail(where, "unexpected null");
  if (typeof v !== t) fail(where, `expected ${t}, got ${typeof v}`);
};

const get = async (path) => {
  const res = await fetch(base + path, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
  return res.json();
};

const TEMPORAL = ["CURRENT", "HISTORICAL", "UNKNOWN_YEAR"];
const LEVELS = ["BACHELOR", "MASTER", "DOCTORATE", "DIPLOMA", "CERTIFICATE"];
const MODES = ["FULL_TIME", "PART_TIME", "DISTANCE", "BLENDED"];
const CATEGORIES = ["DOMESTIC", "INTERNATIONAL"];
const PERIODS = ["PER_YEAR", "PER_SEMESTER", "PER_PROGRAM"];
const REQ = [
  "MIN_GPA",
  "LANGUAGE_TEST",
  "ENTRANCE_EXAM",
  "PRIOR_DEGREE",
  "DOCUMENT",
  "OTHER",
];

const source = (w, s) => {
  keys(w, s, ["url", "title", "publisher", "type", "retrievedOn"]);
  type(w + ".url", s.url, "string");
  type(w + ".retrievedOn", s.retrievedOn, "string");
};

const listItemKeys = [
  "identifier",
  "slug",
  "name",
  "degreeLevel",
  "field",
  "studyMode",
  "durationMonths",
  "teachingLanguages",
  "campusCity",
  "university",
  "officialProgramUrl",
  "officialAdmissionsUrl",
  "officialApplicationUrl",
  "verification",
];

const listItem = (w, p) => {
  keys(w, p, listItemKeys);
  oneOf(w + ".degreeLevel", p.degreeLevel, LEVELS);
  if (p.studyMode !== null) oneOf(w + ".studyMode", p.studyMode, MODES);
  if (p.field !== null) keys(w + ".field", p.field, ["slug", "name"]);
  keys(w + ".university", p.university, [
    "slug",
    "name",
    "city",
    "countryCode",
    "countryName",
  ]);
  keys(w + ".verification", p.verification, ["status", "verifiedOn"]);
  oneOf(w + ".verification.status", p.verification.status, [
    "VERIFIED",
    "UNVERIFIED",
  ]);
  if (!Array.isArray(p.teachingLanguages))
    fail(w, "teachingLanguages must be an array");
  if (p.durationMonths !== null)
    type(w + ".durationMonths", p.durationMonths, "number");
  if (p.officialApplicationUrl && p.verification.status !== "VERIFIED") {
    fail(w, "an apply link on an unverified program");
  }
};

const envelope = (w, page) => {
  keys(w, page, ["content", "number", "size", "totalElements", "totalPages"]);
  if (!Array.isArray(page.content)) fail(w, "content must be an array");
};

const main = async () => {
  const programs = await get("/api/v1/programs?size=100");
  envelope("GET /programs", programs);
  programs.content.forEach((p, i) => listItem(`programs[${i}]`, p));

  for (const p of programs.content) {
    const d = await get(`/api/v1/programs/${encodeURIComponent(p.identifier)}`);
    const w = `programs/${p.identifier}`;
    keys(w, d, [
      ...listItemKeys,
      "sources",
      "intakes",
      "tuition",
      "requirements",
    ]);
    d.sources.forEach((s, i) => source(`${w}.sources[${i}]`, s));
    d.intakes.forEach((x, i) => {
      const iw = `${w}.intakes[${i}]`;
      keys(iw, x, [
        "label",
        "academicYear",
        "startDate",
        "applicationDeadline",
        "applicantCategory",
        "temporalStatus",
        "source",
      ]);
      oneOf(iw + ".temporalStatus", x.temporalStatus, TEMPORAL);
      if (x.applicantCategory !== null)
        oneOf(iw + ".applicantCategory", x.applicantCategory, CATEGORIES);
      source(iw + ".source", x.source);
    });
    d.tuition.forEach((t, i) => {
      const tw = `${w}.tuition[${i}]`;
      keys(tw, t, [
        "academicYear",
        "effectiveFrom",
        "effectiveTo",
        "scopeNote",
        "studentCategory",
        "amount",
        "currency",
        "billingPeriod",
        "temporalStatus",
        "source",
      ]);
      oneOf(tw + ".temporalStatus", t.temporalStatus, TEMPORAL);
      oneOf(tw + ".studentCategory", t.studentCategory, CATEGORIES);
      oneOf(tw + ".billingPeriod", t.billingPeriod, PERIODS);
      type(tw + ".amount", t.amount, "number");
      type(tw + ".currency", t.currency, "string");
      source(tw + ".source", t.source);
    });
    d.requirements.forEach((r, i) => {
      const rw = `${w}.requirements[${i}]`;
      keys(rw, r, [
        "applicationCycle",
        "type",
        "description",
        "minimumValue",
        "valueUnit",
        "temporalStatus",
        "source",
      ]);
      oneOf(rw + ".type", r.type, REQ);
      oneOf(rw + ".temporalStatus", r.temporalStatus, TEMPORAL);
      source(rw + ".source", r.source);
    });
  }

  const unis = await get("/api/v1/universities?size=100");
  envelope("GET /universities", unis);
  for (const u of unis.content) {
    keys(`universities/${u.slug}`, u, [
      "slug",
      "name",
      "city",
      "countryCode",
      "countryName",
      "websiteUrl",
    ]);
    const d = await get(`/api/v1/universities/${encodeURIComponent(u.slug)}`);
    keys(`universities/${u.slug} detail`, d, [
      "slug",
      "name",
      "city",
      "countryCode",
      "countryName",
      "websiteUrl",
      "description",
      "programs",
    ]);
    d.programs.forEach((p, i) => {
      keys(`universities/${u.slug}.programs[${i}]`, p, [
        "identifier",
        "slug",
        "name",
        "degreeLevel",
        "fieldOfStudy",
        "durationMonths",
        "teachingLanguage",
      ]);
      oneOf(
        `universities/${u.slug}.programs[${i}].degreeLevel`,
        p.degreeLevel,
        LEVELS,
      );
    });
  }

  // Error body shape (frontend ApiErrorBody)
  const err = await fetch(`${base}/api/v1/programs/no-such--program`);
  if (err.status !== 404) fail("404", `expected 404, got ${err.status}`);
  else
    keys("404 body", await err.json(), [
      "timestamp",
      "status",
      "error",
      "message",
      "path",
    ]);
  const bad = await fetch(`${base}/api/v1/programs?size=0`);
  if (bad.status !== 400) fail("400", `expected 400, got ${bad.status}`);
  else
    keys("400 body", await bad.json(), [
      "timestamp",
      "status",
      "error",
      "message",
      "path",
      "violations",
    ]);

  console.log(
    `Checked ${programs.content.length} programs and ${unis.content.length} universities against ${base}`,
  );
};

main()
  .then(() => {
    if (problems.length) {
      console.error(`CONTRACT MISMATCH (${problems.length}):`);
      for (const p of problems) console.error("  - " + p);
      process.exit(1);
    }
    console.log("Contract OK: frontend types match the backend responses.");
  })
  .catch((e) => {
    console.error("Could not check the contract:", e.message);
    process.exit(2);
  });
