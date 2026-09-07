"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import type { HostingStatus } from "@/lib/platform-status/hosting";

export function WhatsNewButton() {
  const [hostingStatus, setHostingStatus] = useState<HostingStatus | null>(
    null,
  );

  // Same source swap as whats-new-banner: poll our own origin, which fetches
  // upstream server-side and redacts the provider's name. This used to call
  // nerc.instatus.com directly, which after decommissioning meant a dead host.
  // Only the icon depends on it, so a failure just leaves the default sparkle.
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

  const hasPlatformIssues =
    hostingStatus &&
    (hostingStatus.page.status !== "UP" ||
      (hostingStatus.activeIncidents?.length || 0) > 0 ||
      (hostingStatus.activeMaintenances?.length || 0) > 0);

  return (
    <Button
      variant="ghost"
      asChild
      className="relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-auto"
    >
      <Link href="/whats-new" className="flex items-center gap-2">
        {hasPlatformIssues ? (
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary" />
        )}
        <span>What's New</span>
        <Badge variant="secondary" className="text-xs">
          v2025.1
        </Badge>
      </Link>
    </Button>
  );
}