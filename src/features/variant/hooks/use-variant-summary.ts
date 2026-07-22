"use client";

import {
  generateVariantSummary,
  getVariantSummary,
} from "@features/variant/actions";
import { subscribeToStream } from "@infra/ai-text";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

interface UseVariantSummaryOptions {
  vcf: string;
  modelId?: string;
  enabled?: boolean;
}

export type VariantSummaryState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "pending"; requestId: string }
  | { status: "generating"; requestId: string; estimatedSeconds?: number }
  | { status: "completed"; summary: string; cachedAt?: string }
  | { status: "failed"; error: string };

/**
 * Custom hook for managing variant summary generation and caching
 *
 * Uses server actions for API calls to keep endpoints secure.
 * SSE streaming remains client-side for real-time updates.
 *
 * Returns a discriminated union state that makes invalid states unrepresentable:
 * - { status: "idle" } - Initial state before any action
 * - { status: "loading" } - Checking cache
 * - { status: "pending", requestId } - Queued for generation
 * - { status: "generating", requestId } - AI is generating
 * - { status: "completed", summary } - Summary available
 * - { status: "failed", error } - Generation failed
 */
export function useVariantSummary({
  vcf,
  modelId = "gpt-5.4-mini",
  enabled = true,
}: UseVariantSummaryOptions) {
  const queryClient = useQueryClient();
  const sseCleanupRef = useRef<(() => void) | null>(null);

  // Track generation trigger per vcf to prevent double-triggering (use ref to avoid effect re-runs)
  const triggeredForRef = useRef<string | null>(null);
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Query for checking cached summary (uses server action)
  const { data: state = { status: "idle" } as VariantSummaryState, isLoading } =
    useQuery({
      queryKey: ["variant-summary", vcf],
      queryFn: async (): Promise<VariantSummaryState> => {
        const response = await getVariantSummary(vcf);

        // No cached content - needs generation
        if (!response.data || !response.data.content) {
          return { status: "idle" };
        }

        // Found cached content
        return {
          status: "completed",
          summary: response.data.content,
          cachedAt: response.data.completed_at ?? undefined,
        };
      },
      enabled: enabled && !!vcf,
      staleTime: 5 * 60 * 1000,
    });

  // Trigger generation (uses server action)
  const triggerGeneration = useCallback(async () => {
    // Prevent double-trigger for same vcf (use ref to avoid deps change)
    if (triggeredForRef.current === vcf) return;
    triggeredForRef.current = vcf;

    // Transition to loading state
    queryClient.setQueryData<VariantSummaryState>(["variant-summary", vcf], {
      status: "loading",
    });

    try {
      const response = await generateVariantSummary({
        vcf,
        model: modelId,
      });

      // Check if still mounted before updating state
      if (!isMountedRef.current) return;

      // Handle response based on status (discriminated union)
      switch (response.status) {
        case "completed":
          queryClient.setQueryData<VariantSummaryState>(
            ["variant-summary", vcf],
            { status: "completed", summary: response.content! },
          );
          return;

        case "failed":
          queryClient.setQueryData<VariantSummaryState>(
            ["variant-summary", vcf],
            { status: "failed", error: response.error ?? "Generation failed" },
          );
          return;

        case "pending":
          queryClient.setQueryData<VariantSummaryState>(
            ["variant-summary", vcf],
            { status: "pending", requestId: response.request_id },
          );
          break;

        case "generating":
          queryClient.setQueryData<VariantSummaryState>(
            ["variant-summary", vcf],
            {
              status: "generating",
              requestId: response.request_id,
              estimatedSeconds: response.estimated_seconds ?? undefined,
            },
          );
          break;
      }

      // Subscribe to SSE for pending/generating states
      sseCleanupRef.current?.();
      sseCleanupRef.current = subscribeToStream(
        response.request_id,
        (event) => {
          // Check if still mounted before updating state (prevents React 19 warnings)
          if (!isMountedRef.current) return;

          switch (event.status) {
            case "pending":
              queryClient.setQueryData<VariantSummaryState>(
                ["variant-summary", vcf],
                { status: "pending", requestId: event.request_id },
              );
              break;
            case "generating":
              queryClient.setQueryData<VariantSummaryState>(
                ["variant-summary", vcf],
                { status: "generating", requestId: event.request_id },
              );
              break;
            case "completed":
              queryClient.setQueryData<VariantSummaryState>(
                ["variant-summary", vcf],
                { status: "completed", summary: event.content },
              );
              break;
            case "failed":
              queryClient.setQueryData<VariantSummaryState>(
                ["variant-summary", vcf],
                { status: "failed", error: event.error },
              );
              break;
          }
        },
        (error) => {
          if (!isMountedRef.current) return;
          console.error("SSE error:", error);
          queryClient.invalidateQueries({ queryKey: ["variant-summary", vcf] });
        },
      );
    } catch (error) {
      if (!isMountedRef.current) return;
      queryClient.setQueryData<VariantSummaryState>(["variant-summary", vcf], {
        status: "failed",
        error:
          error instanceof Error ? error.message : "Failed to generate summary",
      });
    }
  }, [vcf, modelId, queryClient]);

  // Auto-trigger generation when idle and not loading
  // Note: triggerGeneration uses refs internally, so we don't need it in deps
  useEffect(() => {
    if (enabled && state.status === "idle" && !isLoading) {
      triggerGeneration();
    }
  }, [enabled, state.status, isLoading, triggerGeneration]);

  // Re-subscribe to SSE when component mounts with pending/generating state
  // This handles the case where user navigated away and came back
  useEffect(() => {
    if (
      !enabled ||
      isLoading ||
      (state.status !== "pending" && state.status !== "generating")
    ) {
      return;
    }

    // Already have an active SSE subscription
    if (sseCleanupRef.current) {
      return;
    }

    const requestId = state.requestId;

    sseCleanupRef.current = subscribeToStream(
      requestId,
      (event) => {
        if (!isMountedRef.current) return;

        switch (event.status) {
          case "pending":
            queryClient.setQueryData<VariantSummaryState>(
              ["variant-summary", vcf],
              { status: "pending", requestId: event.request_id },
            );
            break;
          case "generating":
            queryClient.setQueryData<VariantSummaryState>(
              ["variant-summary", vcf],
              { status: "generating", requestId: event.request_id },
            );
            break;
          case "completed":
            queryClient.setQueryData<VariantSummaryState>(
              ["variant-summary", vcf],
              { status: "completed", summary: event.content },
            );
            break;
          case "failed":
            queryClient.setQueryData<VariantSummaryState>(
              ["variant-summary", vcf],
              { status: "failed", error: event.error },
            );
            break;
        }
      },
      (error) => {
        if (!isMountedRef.current) return;
        console.error("SSE reconnection error:", error);
        // On SSE error, refetch from server to get current state
        queryClient.invalidateQueries({ queryKey: ["variant-summary", vcf] });
      },
    );
  }, [enabled, isLoading, state, vcf, queryClient]);

  // Cleanup SSE on unmount and track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      sseCleanupRef.current?.();
      sseCleanupRef.current = null;
    };
  }, []);

  // Retry function
  const retry = useCallback(() => {
    sseCleanupRef.current?.();
    sseCleanupRef.current = null;
    triggeredForRef.current = null;
    queryClient.setQueryData<VariantSummaryState>(["variant-summary", vcf], {
      status: "idle",
    });
  }, [vcf, queryClient]);

  return { state, retry };
}
