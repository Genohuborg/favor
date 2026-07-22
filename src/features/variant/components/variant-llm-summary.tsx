"use client";

import { useAskFollowUp } from "@features/agent/hooks/use-ask-follow-up";
import { useVariantSummary } from "@features/variant/hooks/use-variant-summary";
import type { Variant } from "@features/variant/types/variant";
import { LLMSummaryCard } from "@shared/components/llm-summary-card";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { useAuth } from "@shared/hooks";
import { LogIn, Sparkles } from "lucide-react";
import { useCallback } from "react";

interface VariantLLMSummaryProps {
  variant: Variant;
  modelId?: string;
}

const TITLE_STRIP = /^#{1,3}\s*Variant Summary[:\s].*?\n+/i;

export function VariantLLMSummary({
  variant,
  modelId = "gpt-5.4-mini",
}: VariantLLMSummaryProps) {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const askFollowUp = useAskFollowUp();

  const { state, retry } = useVariantSummary({
    vcf: variant.variant_vcf,
    modelId,
    enabled: isAuthenticated,
  });

  const onAskFollowUp = useCallback(() => {
    if (state.status !== "completed") return;
    askFollowUp({
      kind: "variant",
      id: variant.variant_vcf,
      displayName: variant.variant_vcf,
      summary: state.summary,
    });
  }, [askFollowUp, state, variant.variant_vcf]);

  if (!authLoading && !isAuthenticated) {
    return (
      <Card className="gap-0 py-0">
        <div className="px-6 py-4 flex items-center justify-between border-b border-border">
          <span className="text-sm text-muted-foreground font-medium">
            Powered by FAVOR-GPT
          </span>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <p className="text-base font-medium text-foreground mb-1">
            Sign in to generate AI summary
          </p>
          <p className="text-sm text-muted-foreground max-w-sm mb-5">
            LLM-powered variant summaries are available to signed-in users.
          </p>
          <Button onClick={() => login()} size="sm" className="gap-2">
            <LogIn className="w-4 h-4" />
            Sign in
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <LLMSummaryCard
      state={state}
      retry={retry}
      onAskFollowUp={onAskFollowUp}
      titleStripPattern={TITLE_STRIP}
    />
  );
}
