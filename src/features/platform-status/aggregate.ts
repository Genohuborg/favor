import { fetchHostingStatus } from "./sources/hosting";
import { fetchSelf } from "./sources/self";
import { fetchVercel } from "./sources/vercel";
import {
  type ActiveIncident,
  type Impact,
  type PlatformStatus,
  type Scope,
  type SourceId,
  worst,
} from "./types";

const SCOPES: Scope[] = ["cloud", "core-api", "vercel", "other"];

async function settle<T>(
  id: SourceId,
  fn: () => Promise<T[]>,
): Promise<{ id: SourceId; incidents: T[]; ok: boolean }> {
  try {
    return { id, incidents: await fn(), ok: true };
  } catch {
    return { id, incidents: [], ok: false };
  }
}

export async function aggregate(): Promise<PlatformStatus> {
  const results = await Promise.all([
    settle("hosting", fetchHostingStatus),
    settle("vercel", fetchVercel),
    settle("self", fetchSelf),
  ]);

  const sources: Record<SourceId, "ok" | "error"> = {
    hosting: "ok",
    vercel: "ok",
    self: "ok",
  };
  const incidents: ActiveIncident[] = [];
  for (const r of results) {
    sources[r.id] = r.ok ? "ok" : "error";
    incidents.push(...r.incidents);
  }

  const byScope: Record<Scope, Impact> = Object.fromEntries(
    SCOPES.map((s) => [s, "operational" as Impact]),
  ) as Record<Scope, Impact>;

  for (const inc of incidents) {
    for (const scope of inc.scopes) {
      byScope[scope] = worst(byScope[scope], inc.impact);
    }
  }

  const overall = Object.values(byScope).reduce<Impact>(
    (acc, cur) => worst(acc, cur),
    "operational",
  );

  return { overall, byScope, incidents, sources, fetchedAt: Date.now() };
}
