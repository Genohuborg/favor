"use client";

import { cn } from "@infra/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePlatformStatus } from "../hooks/use-platform-status";
import { CORE_API_UNREACHABLE_ID } from "../sources/self";
import {
  type ActiveIncident,
  IMPACT_RANK,
  type Impact,
  type Scope,
} from "../types";

const DISMISSED_KEY = "platform-status:dismissed:v2";
const BANNER_HEIGHT = 36;

type DismissedMap = Record<string, Impact>;

function readDismissed(): DismissedMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as DismissedMap;
    }
    return {};
  } catch {
    return {};
  }
}

function writeDismissed(map: DismissedMap): void {
  try {
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

const IMPACT_TONE: Record<Impact, { bar: string; dot: string; label: string }> =
  {
    operational: {
      bar: "bg-emerald-950 text-emerald-50 border-emerald-500/30",
      dot: "bg-emerald-400",
      label: "All systems operational",
    },
    minor: {
      bar: "bg-amber-950 text-amber-50 border-amber-500/30",
      dot: "bg-amber-400",
      label: "Degraded service",
    },
    major: {
      bar: "bg-red-950 text-red-50 border-red-500/40",
      dot: "bg-red-400",
      label: "Service disruption",
    },
    maintenance: {
      bar: "bg-sky-950 text-sky-50 border-sky-500/30",
      dot: "bg-sky-400",
      label: "Scheduled maintenance",
    },
  };

function scopeCopy(scopes: Scope[]): string {
  const coreSet = new Set<Scope>(["openshift", "core-api", "vercel"]);
  const hasCore = scopes.some((s) => coreSet.has(s));
  const hasForums = scopes.includes("openstack");
  if (hasCore && hasForums) return "platform-wide";
  if (hasCore) return "affects core services";
  if (hasForums) return "affects Forums";
  return "NERC infrastructure";
}

function isSuppressed(incident: ActiveIncident, dismissed: DismissedMap) {
  const at = dismissed[incident.id];
  if (!at) return false;
  return IMPACT_RANK[at] >= IMPACT_RANK[incident.impact];
}

export function StatusBanner() {
  const { data } = usePlatformStatus();
  const [dismissed, setDismissed] = useState<DismissedMap>({});
  const [hydrated, setHydrated] = useState(false);
  const queryClient = useQueryClient();
  const wasUnreachableRef = useRef(false);

  useEffect(() => {
    setDismissed(readDismissed());
    setHydrated(true);
  }, []);

  // Auto-recovery: when the core-api-unreachable incident clears, refetch
  // every other query so features rehydrate without a manual reload.
  useEffect(() => {
    if (!data) return;
    const unreachable = data.incidents.some(
      (i) => i.id === CORE_API_UNREACHABLE_ID && i.impact === "major",
    );
    if (wasUnreachableRef.current && !unreachable) {
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] !== "platform-status",
      });
    }
    wasUnreachableRef.current = unreachable;
  }, [data, queryClient]);

  const visible: ActiveIncident[] =
    hydrated && data
      ? data.incidents
          .filter((i) => !isSuppressed(i, dismissed))
          .sort(
            (a, b) =>
              IMPACT_RANK[b.impact] - IMPACT_RANK[a.impact] ||
              new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
          )
      : [];

  const lead = visible[0];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--status-banner-h",
      lead ? `${BANNER_HEIGHT}px` : "0px",
    );
    return () => {
      root.style.setProperty("--status-banner-h", "0px");
    };
  }, [lead]);

  const dismiss = (incident: ActiveIncident) => {
    setDismissed((prev) => {
      const next = { ...prev, [incident.id]: incident.impact };
      writeDismissed(next);
      return next;
    });
  };

  if (!lead) return null;

  const tone = IMPACT_TONE[lead.impact];
  const extraCount = visible.length - 1;
  const isExternal = lead.url.startsWith("http");

  return (
    <output
      aria-live="polite"
      style={{ height: BANNER_HEIGHT }}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] flex items-center border-b",
        tone.bar,
      )}
    >
      <div className="mx-auto flex w-full max-w-page items-center gap-3 px-6 text-[13px] lg:px-12">
        <span
          className={cn("h-2 w-2 shrink-0 rounded-full", tone.dot)}
          aria-hidden
        />
        <span className="shrink-0 font-semibold tracking-tight">
          {tone.label}
        </span>
        <span className="hidden shrink-0 opacity-40 sm:inline">·</span>
        <span className="min-w-0 flex-1 truncate opacity-90">
          <span className="hidden sm:inline">{lead.name}</span>
          <span className="ml-1.5 hidden rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide opacity-80 md:inline">
            {scopeCopy(lead.scopes)}
          </span>
          {extraCount > 0 && (
            <span className="ml-2 text-[11px] opacity-70">
              +{extraCount} more
            </span>
          )}
        </span>
        {isExternal && (
          <a
            href={lead.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium opacity-90 transition hover:bg-white/10 hover:opacity-100"
          >
            Details
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}
        <button
          type="button"
          onClick={() => dismiss(lead)}
          className="shrink-0 rounded-full p-1 opacity-70 transition hover:bg-white/10 hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </output>
  );
}
