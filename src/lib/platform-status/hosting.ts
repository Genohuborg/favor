/**
 * Hosting-platform status, fetched server-side and stripped of the provider's
 * name before it is handed to the browser.
 *
 * ── WHY THIS EXISTS ──
 *
 * The banner used to `fetch("https://nerc.instatus.com/summary.json")` directly
 * from the client. Two problems, both now fixed here:
 *
 *   1. NERC is decommissioned. That feed reports a permanent fault in a
 *      provider FAVOR no longer runs on, so the banner would have shown a
 *      standing outage forever.
 *   2. The provider's name is not disclosed on our sites. Linking to a public
 *      status page is fine; naming the provider is not. The upstream feed names
 *      it in its OWN component and incident titles ("JETSTREAM2 STORAGE:
 *      degraded"), and those were rendered verbatim -- so redacting only our own
 *      copy would not have been enough.
 *
 * The response keeps the shape the banner already consumed (instatus
 * `summary.json`), so this is a source swap rather than a UI rewrite.
 */

const STATUS_PAGE_ID = "61dc808a7e9a82053ce739d2";
const STATUS_API = `https://api.status.io/1.0/status/${STATUS_PAGE_ID}`;

/** Human-facing status page, used for incident links. Linking is permitted. */
export const HOSTING_STATUS_PAGE = "https://jetstream.status.io/";

/** What we call the provider in the UI, always. */
const PROVIDER_LABEL = "Hosting Platform";

/**
 * Remove the provider's name from any upstream string before rendering.
 * Handles the current provider and the NERC-era naming, then collapses a
 * doubled label and tidied whitespace.
 */
export function redactProvider(text: string): string {
  return text
    .replace(/jetstream\s*2?/gi, PROVIDER_LABEL)
    .replace(/\bNERC\b/gi, PROVIDER_LABEL)
    .replace(new RegExp(`${PROVIDER_LABEL}(\\s+${PROVIDER_LABEL})+`, "gi"), PROVIDER_LABEL)
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** status.io: 100 is the only healthy code; 200 is maintenance. */
const IMPACT_BY_CODE: Record<number, string> = {
  100: "operational",
  200: "maintenance",
  300: "degraded performance",
  400: "partial outage",
  500: "major outage",
  600: "security event",
};

export interface HostingStatus {
  page: { name: string; url: string; status: "UP" | "HASISSUES" | "UNDERMAINTENANCE" };
  activeIncidents: Array<{
    id: string;
    name: string;
    started: string;
    status: string;
    impact: string;
    url: string;
  }>;
  activeMaintenances: Array<{
    id: string;
    name: string;
    start: string;
    status: string;
    duration: string;
    url: string;
  }>;
}

interface RawComponent { name?: string; status?: string; status_code?: number }
interface RawIncident {
  _id?: string;
  name?: string;
  status_code?: number;
  datetime_open?: string;
  components?: Array<{ name?: string }>;
}

export async function fetchHostingStatus(): Promise<HostingStatus> {
  const res = await fetch(STATUS_API, {
    signal: AbortSignal.timeout(4000),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`hosting-status ${res.status}`);

  const body = (await res.json()) as {
    result?: { status?: RawComponent[]; incidents?: RawIncident[] };
  };
  const components = body.result?.status ?? [];
  const incidents = body.result?.incidents ?? [];

  // status.io leaves incidents listed after their components recover, so an
  // incident is only surfaced while at least one of its components is still
  // unhealthy. Without this the banner shows resolved history as live.
  const unhealthy = new Map<string, number>();
  for (const c of components) {
    const code = c.status_code ?? 100;
    if (code !== 100 && c.name) unhealthy.set(c.name.toUpperCase(), code);
  }

  const activeIncidents: HostingStatus["activeIncidents"] = [];
  const activeMaintenances: HostingStatus["activeMaintenances"] = [];

  for (const inc of incidents) {
    const names = (inc.components ?? [])
      .map((c) => c.name)
      .filter((n): n is string => Boolean(n));
    const codes = names
      .map((n) => unhealthy.get(n.toUpperCase()))
      .filter((c): c is number => c !== undefined);
    if (codes.length === 0) continue;

    const worst = codes.reduce((a, b) => (b > a ? b : a), 100);
    const id = String(inc._id ?? inc.name ?? activeIncidents.length);
    const name = redactProvider(inc.name ?? `${PROVIDER_LABEL} incident`);
    const started = inc.datetime_open ?? new Date().toISOString();

    if (worst === 200) {
      activeMaintenances.push({
        id, name, start: started, status: "in progress",
        duration: "", url: HOSTING_STATUS_PAGE,
      });
    } else {
      activeIncidents.push({
        id, name, started, status: "investigating",
        impact: IMPACT_BY_CODE[worst] ?? "minor",
        url: HOSTING_STATUS_PAGE,
      });
    }
  }

  const worstOverall = Array.from(unhealthy.values()).reduce(
    (a, b) => (b > a ? b : a),
    100,
  );
  const status: HostingStatus["page"]["status"] =
    worstOverall === 100 ? "UP" : worstOverall === 200 ? "UNDERMAINTENANCE" : "HASISSUES";

  return {
    page: { name: PROVIDER_LABEL, url: HOSTING_STATUS_PAGE, status },
    activeIncidents,
    activeMaintenances,
  };
}
