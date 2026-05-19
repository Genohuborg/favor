"use client";

import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { useState } from "react";
import { probeApiReachable } from "../client";

const DEFAULT_DESCRIPTION = "FAVOR API is unreachable. Try again shortly.";

export function ServiceUnavailable() {
  const [checking, setChecking] = useState(false);

  async function retry() {
    setChecking(true);
    await probeApiReachable();
    setChecking(false);
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <div className="text-center max-w-md">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          Service unavailable
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {DEFAULT_DESCRIPTION}
        </p>
        <Button
          variant="outline"
          onClick={retry}
          disabled={checking}
          className="mt-6 rounded-full"
        >
          {checking ? "Checking" : "Try again"}
        </Button>
      </div>
    </div>
  );
}

interface ServiceUnavailableDialogProps {
  open: boolean;
  feature: string;
  onOpenChange: (open: boolean) => void;
  onRecovered?: () => void;
}

export function ServiceUnavailableDialog({
  open,
  feature,
  onOpenChange,
  onRecovered,
}: ServiceUnavailableDialogProps) {
  const [checking, setChecking] = useState(false);

  async function retry() {
    if (checking) return;
    setChecking(true);
    const ok = await probeApiReachable();
    setChecking(false);
    if (!ok) return;
    // Fire the recovery callback before closing the dialog so callers
    // can read any pending state they cleared in onOpenChange.
    onRecovered?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{feature} unavailable</DialogTitle>
          <DialogDescription>{DEFAULT_DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={checking}
          >
            Close
          </Button>
          <Button onClick={retry} disabled={checking}>
            {checking ? "Checking" : "Try again"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
