"use client";

import {
  generateGeneSummary,
  getGeneSummary,
} from "@features/gene/actions/ai-summary";
import { subscribeToStream } from "@infra/ai-text";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

interface UseGeneSummaryOptions {
  geneId: string;
  modelId?: string;
  enabled?: boolean;
}

export type GeneSummaryState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "pending"; requestId: string }
  | { status: "generating"; requestId: string; estimatedSeconds?: number }
  | { status: "completed"; summary: string; cachedAt?: string }
  | { status: "failed"; error: string };

export function useGeneSummary({
  geneId,
  modelId = "gpt-5.4-mini",
  enabled = true,
}: UseGeneSummaryOptions) {
  const queryClient = useQueryClient();
  const sseCleanupRef = useRef<(() => void) | null>(null);
  const triggeredForRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);

  const { data: state = { status: "idle" } as GeneSummaryState, isLoading } =
    useQuery({
      queryKey: ["gene-summary", geneId],
      queryFn: async (): Promise<GeneSummaryState> => {
        const response = await getGeneSummary(geneId);

        if (!response.data || !response.data.content) {
          return { status: "idle" };
        }

        return {
          status: "completed",
          summary: response.data.content,
          cachedAt: response.data.completed_at ?? undefined,
        };
      },
      enabled: enabled && !!geneId,
      staleTime: 5 * 60 * 1000,
    });

  const triggerGeneration = useCallback(async () => {
    if (triggeredForRef.current === geneId) return;
    triggeredForRef.current = geneId;

    queryClient.setQueryData<GeneSummaryState>(["gene-summary", geneId], {
      status: "loading",
    });

    try {
      const response = await generateGeneSummary({
        geneId,
        model: modelId,
      });

      if (!isMountedRef.current) return;

      switch (response.status) {
        case "completed":
          queryClient.setQueryData<GeneSummaryState>(["gene-summary", geneId], {
            status: "completed",
            summary: response.content!,
          });
          return;

        case "failed":
          queryClient.setQueryData<GeneSummaryState>(["gene-summary", geneId], {
            status: "failed",
            error: response.error ?? "Generation failed",
          });
          return;

        case "pending":
          queryClient.setQueryData<GeneSummaryState>(["gene-summary", geneId], {
            status: "pending",
            requestId: response.request_id,
          });
          break;

        case "generating":
          queryClient.setQueryData<GeneSummaryState>(["gene-summary", geneId], {
            status: "generating",
            requestId: response.request_id,
            estimatedSeconds: response.estimated_seconds ?? undefined,
          });
          break;
      }

      sseCleanupRef.current?.();
      sseCleanupRef.current = subscribeToStream(
        response.request_id,
        (event) => {
          if (!isMountedRef.current) return;

          switch (event.status) {
            case "pending":
              queryClient.setQueryData<GeneSummaryState>(
                ["gene-summary", geneId],
                { status: "pending", requestId: event.request_id },
              );
              break;
            case "generating":
              queryClient.setQueryData<GeneSummaryState>(
                ["gene-summary", geneId],
                { status: "generating", requestId: event.request_id },
              );
              break;
            case "completed":
              queryClient.setQueryData<GeneSummaryState>(
                ["gene-summary", geneId],
                { status: "completed", summary: event.content },
              );
              break;
            case "failed":
              queryClient.setQueryData<GeneSummaryState>(
                ["gene-summary", geneId],
                { status: "failed", error: event.error },
              );
              break;
          }
        },
        (error) => {
          if (!isMountedRef.current) return;
          console.error("SSE error:", error);
          queryClient.invalidateQueries({
            queryKey: ["gene-summary", geneId],
          });
        },
      );
    } catch (error) {
      if (!isMountedRef.current) return;
      queryClient.setQueryData<GeneSummaryState>(["gene-summary", geneId], {
        status: "failed",
        error:
          error instanceof Error ? error.message : "Failed to generate summary",
      });
    }
  }, [geneId, modelId, queryClient]);

  // Auto-trigger generation when idle and not loading
  useEffect(() => {
    if (enabled && state.status === "idle" && !isLoading) {
      triggerGeneration();
    }
  }, [enabled, state.status, isLoading, triggerGeneration]);

  // Re-subscribe to SSE when component mounts with pending/generating state
  useEffect(() => {
    if (
      !enabled ||
      isLoading ||
      (state.status !== "pending" && state.status !== "generating")
    ) {
      return;
    }

    if (sseCleanupRef.current) return;

    const requestId = state.requestId;

    sseCleanupRef.current = subscribeToStream(
      requestId,
      (event) => {
        if (!isMountedRef.current) return;

        switch (event.status) {
          case "pending":
            queryClient.setQueryData<GeneSummaryState>(
              ["gene-summary", geneId],
              { status: "pending", requestId: event.request_id },
            );
            break;
          case "generating":
            queryClient.setQueryData<GeneSummaryState>(
              ["gene-summary", geneId],
              { status: "generating", requestId: event.request_id },
            );
            break;
          case "completed":
            queryClient.setQueryData<GeneSummaryState>(
              ["gene-summary", geneId],
              { status: "completed", summary: event.content },
            );
            break;
          case "failed":
            queryClient.setQueryData<GeneSummaryState>(
              ["gene-summary", geneId],
              { status: "failed", error: event.error },
            );
            break;
        }
      },
      (error) => {
        if (!isMountedRef.current) return;
        console.error("SSE reconnection error:", error);
        queryClient.invalidateQueries({
          queryKey: ["gene-summary", geneId],
        });
      },
    );
  }, [enabled, isLoading, state, geneId, queryClient]);

  // Cleanup SSE on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      sseCleanupRef.current?.();
      sseCleanupRef.current = null;
    };
  }, []);

  const retry = useCallback(() => {
    sseCleanupRef.current?.();
    sseCleanupRef.current = null;
    triggeredForRef.current = null;
    queryClient.setQueryData<GeneSummaryState>(["gene-summary", geneId], {
      status: "idle",
    });
  }, [geneId, queryClient]);

  return { state, retry };
}
