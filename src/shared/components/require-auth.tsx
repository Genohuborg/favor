"use client";

import { ServiceUnavailable, useApiReachable } from "@features/platform-status";
import { Button } from "@shared/components/ui/button";
import { useAuth } from "@shared/hooks";
import { LogIn } from "lucide-react";
import { useEffect } from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, login } = useAuth();
  const reachable = useApiReachable();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && reachable) {
      // Auto-redirect after a short delay so users see the message
      const timer = setTimeout(() => login(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, login, reachable]);

  if (!reachable) {
    return <ServiceUnavailable />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <p className="text-lg font-semibold text-foreground">
            Sign in required
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            You need to sign in to access this page. Redirecting&hellip;
          </p>
          <Button onClick={() => login()} className="mt-4">
            <LogIn className="size-4" />
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
