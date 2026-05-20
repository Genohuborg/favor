import type { ActiveIncident, Impact, IncidentState } from "../types";

const VERCEL_URL = "https://www.vercel-status.com/api/v2/summary.json";

const IMPACT_MAP: Record<string, Impact> = {
  major: "major",
  critical: "major",
};

const STATE_MAP: Record<string, IncidentState> = {
  investigating: "investigating",
  identified: "identified",
  monitoring: "monitoring",
  postmortem: "monitoring",
};

interface RawIncident {
  id: string;
  name: string;
  status: string;
  impact: string;
  shortlink: string;
  started_at: string;
}

interface RawSummary {
  incidents?: RawIncident[];
}

// Vercel's status page covers their entire product surface (build dashboards,
// usage reporting, log delivery, billing tooling). Most "minor" incidents are
// about those internal systems and don't affect a running deployment. Only
// promote major/critical incidents to our banner.
const RUNTIME_IMPACTS = new Set(["major", "critical"]);

export async function fetchVercel(): Promise<ActiveIncident[]> {
  const res = await fetch(VERCEL_URL, {
    signal: AbortSignal.timeout(4000),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`vercel ${res.status}`);
  const json = (await res.json()) as RawSummary;

  const active = (json.incidents ?? []).filter(
    (i) => i.status !== "resolved" && RUNTIME_IMPACTS.has(i.impact),
  );

  return active.map((inc) => ({
    id: `vercel:${inc.id}`,
    source: "vercel" as const,
    name: inc.name,
    impact: IMPACT_MAP[inc.impact] ?? "minor",
    state: STATE_MAP[inc.status] ?? "investigating",
    scopes: ["vercel" as const],
    url: inc.shortlink,
    startedAt: inc.started_at,
  }));
}
