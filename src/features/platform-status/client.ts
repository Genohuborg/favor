import { CORE_API_UNREACHABLE_ID } from "./sources/self";
import type { PlatformStatus } from "./types";

const PROBE_TIMEOUT_MS = 2000;

export async function fetchPlatformStatus(
  signal?: AbortSignal,
): Promise<PlatformStatus> {
  const res = await fetch("/api/platform-status", { signal });
  if (!res.ok) throw new Error(`platform-status ${res.status}`);
  return (await res.json()) as PlatformStatus;
}

/**
 * Pre-flight check used by outbound CTAs that leave the Next.js origin
 * for the API (e.g. login). Forces a fresh aggregate so we don't strand
 * the user on the upstream's error page when the polled status is stale.
 * Returns false on any failure: caller must assume unreachable.
 */
export async function probeApiReachable(): Promise<boolean> {
  try {
    const res = await fetch("/api/platform-status", {
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    if (!res.ok) return false;
    const status = (await res.json()) as PlatformStatus;
    return !status.incidents.some(
      (i) => i.id === CORE_API_UNREACHABLE_ID && i.impact === "major",
    );
  } catch {
    return false;
  }
}
