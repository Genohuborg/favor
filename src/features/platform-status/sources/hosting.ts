import type { ActiveIncident, Impact, IncidentState, Scope } from "../types";

/**
 * Hosting-platform infrastructure status.
 *
 * Replaced the NERC source on 2026-08-30, when the API, databases and object
 * storage moved to the current platform. NERC terminated 2026-09-15, after
 * which its status feed would have reported a permanent fault in a provider
 * FAVOR no longer uses.
 *
 * The platform publishes a status.io page; `61dc808a…` is its statuspage id.
 * The v1 API returns `result.status` (per-component) and `result.incidents`.
 *
 * ── DO NOT NAME THE PROVIDER IN ANYTHING THAT REACHES A BROWSER ──
 *
 * Deliberate policy: the hosting provider is not disclosed in the UI. Linking
 * to the public status page is fine, but every *string* we render is passed
 * through `redactProvider()` below, because the upstream feed names the
 * provider in its own component and incident titles (e.g. "JETSTREAM2 CPU").
 * Without that pass those titles would have rendered verbatim in the status
 * banner. Anything new that surfaces upstream text must go through it too.
 */
const STATUS_PAGE_ID = "61dc808a7e9a82053ce739d2";
const STATUS_URL = `https://api.status.io/1.0/status/${STATUS_PAGE_ID}`;

/** Human-facing status page, for incident links. Linking is fine; naming is not. */
export const HOSTING_STATUS_PAGE = "https://jetstream.status.io/";

/** What we call the provider in the UI, always. */
const PROVIDER_LABEL = "Hosting Platform";

/**
 * Strip the provider's name out of any upstream string before it is rendered.
 *
 * The feed's own titles carry the brand ("JETSTREAM2 STORAGE: degraded"), and
 * the pre-migration source carried "NERC". Both collapse to PROVIDER_LABEL.
 * The final pass collapses a doubled label, which "Jetstream2 Cloud" would
 * otherwise produce.
 */
export function redactProvider(text: string): string {
  return text
    .replace(/jetstream\s*2?/gi, PROVIDER_LABEL)
    .replace(/\bNERC\b/gi, PROVIDER_LABEL)
    .replace(
      new RegExp(`${PROVIDER_LABEL}(\\s+${PROVIDER_LABEL})+`, "gi"),
      PROVIDER_LABEL,
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * status.io status codes. 100 is the only healthy one; the rest map onto our
 * four-level Impact. 600 (security event) is treated as major — it is not
 * "minor" by any reading.
 */
const IMPACT_BY_CODE: Record<number, Impact> = {
  100: "operational",
  200: "maintenance",
  300: "minor", // degraded performance
  400: "minor", // partial service disruption
  500: "major", // service disruption
  600: "major", // security event
};

const STATE_BY_CODE: Record<number, IncidentState> = {
  100: "investigating",
  200: "identified",
  300: "monitoring",
  400: "resolved",
};

/**
 * Which hosting-platform components FAVOR actually depends on.
 *
 * The page lists 14. FAVOR's allocation (BIO260320) is in the **IU region** —
 * "Primary Cloud" here — running a K3s node on CPU instances with MinIO, the
 * ClickHouse volume and Elasticsearch on Jetstream2 storage. So three
 * components are load-bearing:
 *
 *   Primary Cloud       the IU region itself
 *   Jetstream2 CPU      the instance family the node runs on
 *   Jetstream2 Storage  MinIO objects and the attached volumes
 *
 * Everything else is a real platform component that carries no FAVOR
 * traffic — the regional clouds (ASU, Cornell, Hawaii, TACC), GPU and Large
 * Memory instances FAVOR does not allocate, and the docs, website, support and
 * LLM-inference services. Those map to "other": still surfaced, but they do not
 * raise a core alarm. Without the split, an ASU-only outage or a docs-site blip
 * would tell FAVOR users their data was down.
 */
// Matched against the upstream feed's own component names, so these keep the
// provider's spelling. They are match keys only -- never rendered. Anything
// derived from them goes through redactProvider() first.
const CORE_COMPONENTS = [
  "PRIMARY CLOUD",
  "JETSTREAM2 CPU",
  "JETSTREAM2 STORAGE",
];

function scopeForComponent(name: string): Scope {
  const n = name.toUpperCase();
  return CORE_COMPONENTS.some((c) => n.includes(c)) ? "cloud" : "other";
}

interface RawStatus {
  id?: string;
  name?: string;
  status?: string;
  status_code?: number;
  containers?: { name?: string; status_code?: number }[];
}

interface RawIncident {
  _id?: string;
  name?: string;
  status_code?: number;
  datetime_open?: string;
  components?: { name?: string }[];
  messages?: { datetime?: string }[];
}

interface RawResponse {
  result?: {
    status?: RawStatus[];
    incidents?: RawIncident[];
  };
}

export async function fetchHostingStatus(): Promise<ActiveIncident[]> {
  const res = await fetch(STATUS_URL, {
    signal: AbortSignal.timeout(4000),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`hosting-status ${res.status}`);
  const body = (await res.json()) as RawResponse;
  const components = body.result?.status ?? [];
  const incidents = body.result?.incidents ?? [];

  // Which components are actually unhealthy right now. status.io keeps
  // incidents listed after the components recover, so — as with the NERC
  // source before it — an incident is only surfaced while at least one of its
  // components is still non-operational.
  const unhealthy = new Map<string, number>();
  for (const c of components) {
    const code = c.status_code ?? 100;
    if (code !== 100 && c.name) unhealthy.set(c.name.toUpperCase(), code);
  }

  const out: ActiveIncident[] = [];

  for (const inc of incidents) {
    const names = (inc.components ?? [])
      .map((c) => c.name)
      .filter((n): n is string => Boolean(n));

    const liveCodes = names
      .map((n) => unhealthy.get(n.toUpperCase()))
      .filter((c): c is number => c !== undefined);
    if (liveCodes.length === 0) continue;

    const worstCode = liveCodes.reduce((a, b) => (b > a ? b : a), 100);
    const scopes = Array.from(new Set(names.map(scopeForComponent)));

    out.push({
      id: `hosting:${inc._id ?? inc.name ?? String(out.length)}`,
      source: "hosting",
      name: redactProvider(inc.name ?? `${PROVIDER_LABEL} incident`),
      impact: IMPACT_BY_CODE[worstCode] ?? "minor",
      state: STATE_BY_CODE[inc.status_code ?? 100] ?? "investigating",
      scopes: scopes.length > 0 ? scopes : ["other"],
      url: HOSTING_STATUS_PAGE,
      startedAt: inc.datetime_open ?? new Date().toISOString(),
    });
  }

  // A component can be degraded with no incident opened against it. That is
  // still worth surfacing, and the NERC source used to miss this case.
  const covered = new Set(
    out.flatMap((i) =>
      (
        incidents.find((x) => i.id.endsWith(String(x._id)))?.components ?? []
      ).map((c) => c.name?.toUpperCase() ?? ""),
    ),
  );
  for (const [name, code] of unhealthy) {
    if (covered.has(name)) continue;
    const original = components.find((c) => c.name?.toUpperCase() === name);
    out.push({
      id: `hosting:component:${name}`,
      source: "hosting",
      name: redactProvider(
        `${original?.name ?? name}: ${original?.status ?? "degraded"}`,
      ),
      impact: IMPACT_BY_CODE[code] ?? "minor",
      state: "monitoring",
      scopes: [scopeForComponent(name)],
      url: HOSTING_STATUS_PAGE,
      startedAt: new Date().toISOString(),
    });
  }

  return out;
}
