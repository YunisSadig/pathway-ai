// Checks each official website and records what was actually observed.
// Usage: node scripts/verify-universities.mjs
// Writes src/data/universities.generated.json (identity + reachability only).
import { readFileSync, writeFileSync } from "node:fs";

const seed = JSON.parse(
  readFileSync(new URL("./university-seed.json", import.meta.url), "utf8"),
);
const today = new Date().toISOString().slice(0, 10);

const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

async function check([name, country, region, city, url]) {
  const out = {
    name,
    slug: slugify(name),
    country,
    region,
    city,
    website: url,
    checkedOn: today,
    reachable: false,
    finalUrl: null,
    pageTitle: null,
    description: null,
  };
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; PathwayAI-verifier/1.0)",
        "accept-language": "en",
      },
    });
    out.finalUrl = res.url;
    out.status = res.status;
    out.reachable = res.ok;
    if (res.ok) {
      const html = (await res.text()).slice(0, 400000);
      const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (t) out.pageTitle = decode(t[1]).slice(0, 160);
      const d =
        html.match(
          /<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i,
        ) ||
        html.match(
          /<meta[^>]+content=["']([^"']+)["'][^>]*name=["']description["']/i,
        ) ||
        html.match(
          /<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
        );
      if (d) out.description = decode(d[1]).slice(0, 300);
    }
  } catch (e) {
    out.error = String(e.cause?.code ?? e.message);
  }
  return out;
}

const results = [];
for (let i = 0; i < seed.length; i += 8) {
  results.push(...(await Promise.all(seed.slice(i, i + 8).map(check))));
}
writeFileSync(
  new URL("../src/data/universities.generated.json", import.meta.url),
  JSON.stringify(results, null, 1),
);
for (const r of results) {
  console.log(
    r.reachable ? "OK " : "BAD",
    r.status ?? r.error,
    r.name,
    "|",
    (r.pageTitle ?? "").slice(0, 50),
  );
}
console.log(
  `${results.filter((r) => r.reachable).length}/${results.length} reachable`,
);
