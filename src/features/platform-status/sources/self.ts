import type { ActiveIncident } from "../types";

export const CORE_API_UNREACHABLE_ID = "self:api-unreachable";

function healthUrl(): string | null {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return null;
  try {
    return new URL("health", base.endsWith("/") ? base : `${base}/`).href;
  } catch {
    return null;
  }
}

// Per-attempt timeout (ms). 2500ms was firing on cold-start latency and
// transient network blips. 6s tolerates a slow first response.
const PROBE_TIMEOUT_MS = 6000;
// Probe attempts before declaring the API unreachable. A single failed
// fetch was way too sensitive — the banner went red on every minor blip.
// Three attempts with backoff means we only fire when the API is *really*
// down, not when one packet got dropped.
const PROBE_ATTEMPTS = 3;
const PROBE_BACKOFF_MS = 800;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

async function probeOnce(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchSelf(): Promise<ActiveIncident[]> {
  const url = healthUrl();
  if (!url) return [];

  // Retry loop — return early on the first OK response, only synthesize
  // an incident after all attempts fail.
  for (let i = 0; i < PROBE_ATTEMPTS; i++) {
    if (i > 0) await sleep(PROBE_BACKOFF_MS);
    if (await probeOnce(url)) return [];
  }

  // Three consecutive failures with 800ms backoff is already the hedge
  // against transient blips. Surface a red banner and gate CTAs via
  // useApiReachable().
  return [
    {
      id: CORE_API_UNREACHABLE_ID,
      source: "self",
      name: "FAVOR API unreachable",
      impact: "major",
      state: "investigating",
      scopes: ["core-api"],
      url: "/",
      startedAt: new Date().toISOString(),
    },
  ];
}
