export type Impact = "operational" | "minor" | "major" | "maintenance";

export type IncidentState =
  | "investigating"
  | "identified"
  | "monitoring"
  | "resolved";

/**
 * "cloud" is the compute/storage provider. It replaced the
 * NERC-era "openshift" and "openstack" scopes on 2026-08-30 — those named a
 * platform FAVOR no longer runs on, and split one concern in two.
 */
export type Scope = "cloud" | "core-api" | "vercel" | "other";

export type SourceId = "hosting" | "vercel" | "self";

export interface ActiveIncident {
  id: string;
  source: SourceId;
  name: string;
  impact: Impact;
  state: IncidentState;
  scopes: Scope[];
  url: string;
  startedAt: string;
}

export interface PlatformStatus {
  overall: Impact;
  byScope: Record<Scope, Impact>;
  incidents: ActiveIncident[];
  sources: Record<SourceId, "ok" | "error">;
  fetchedAt: number;
}

export const IMPACT_RANK: Record<Impact, number> = {
  operational: 0,
  maintenance: 1,
  minor: 2,
  major: 3,
};

export function worst(a: Impact, b: Impact): Impact {
  return IMPACT_RANK[a] >= IMPACT_RANK[b] ? a : b;
}
