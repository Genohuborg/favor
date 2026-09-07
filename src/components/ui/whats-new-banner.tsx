"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/general";
import { Badge } from "@/components/ui/badge";

import type { HostingStatus } from "@/lib/platform-status/hosting";

interface WhatsNewBannerProps {
  className?: string;
}

export function WhatsNewBanner({ className }: WhatsNewBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hostingStatus, setHostingStatus] = useState<HostingStatus | null>(
    null,
  );

  // Polls our own origin, never the provider's feed directly. /api/platform-status
  // fetches upstream server-side and strips the provider's name out of every
  // string first -- see src/lib/platform-status/hosting.ts. This previously
  // called nerc.instatus.com straight from the browser, which both named the
  // provider and, after NERC was decommissioned, reported a permanent outage.
  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/platform-status");
        if (response.ok) {
          setHostingStatus((await response.json()) as HostingStatus);
        }
      } catch {
        // Fail silently - platform status is not critical to the page.
      }
    };

    load();
  }, []);

  if (!isVisible) {
    return null;
  }

  const hasPlatformIssues =
    hostingStatus &&
    (hostingStatus.page.status !== "UP" ||
      (hostingStatus.activeIncidents?.length || 0) > 0 ||
      (hostingStatus.activeMaintenances?.length || 0) > 0);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-background border border-border",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10 h-6 w-6 p-0 opacity-50 hover:opacity-100"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="p-4 space-y-3">
        {/* Hosting-platform status - only shown when there are issues */}
        {hasPlatformIssues && (
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium">Service Notice</span>
            </div>

            {(hostingStatus.activeMaintenances || []).map((maintenance) => (
              <div key={maintenance.id} className="text-sm">
                <span className="font-medium">
                  {/* Name is already provider-redacted server-side. */}
                  {maintenance.name}{" "}
                  <a
                    href={maintenance.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    View Details
                  </a>
                </span>
              </div>
            ))}

            {(hostingStatus.activeIncidents || []).map((incident) => (
              <div key={incident.id} className="text-sm">
                <span className="font-medium">{incident.name}</span>
                <div className="text-xs text-muted-foreground mt-1">
                  Service impact: {incident.impact} •{" "}
                  <a
                    href={incident.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    View Updates
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* What's New - always shown, smaller when platform issues are present */}
        <div
          className={cn(
            "flex items-center justify-between pr-8",
            hasPlatformIssues && "pt-2 border-t",
          )}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="flex items-center gap-2">
              <span
                className={cn("font-medium", hasPlatformIssues ? "text-sm" : "")}
              >
                What's New
              </span>
              <Badge variant="secondary" className="text-xs">
                v2025.1
              </Badge>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              "text-primary hover:underline",
              hasPlatformIssues ? "text-xs" : "text-sm",
            )}
          >
            <Link href="/whats-new">View Updates</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
