"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Markdown } from "@/components/ai-elements/markdown";

interface GeneSummaryProps {
  symbol: string;
  modelId?: string;
}

type SummaryStatus = "pending" | "generating" | "completed" | "failed";

interface CacheResponse {
  exists: boolean;
  summary?: string;
  status?: SummaryStatus;
  error?: string;
  timestamp?: string;
}

export function GeneSummary({ symbol, modelId = "gpt-4o-mini" }: GeneSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [status, setStatus] = useState<SummaryStatus>("pending");
  const [error, setError] = useState<string | null>(null);
  const hasTriggeredGeneration = useRef(false);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const checkCache = async (): Promise<CacheResponse | null> => {
    try {
      const response = await fetch(`/api/gene-summary-cache?symbol=${encodeURIComponent(symbol)}`);
      const data: CacheResponse = await response.json();
      console.log("Cache check response:", data);

      if (data.exists && data.status) {
        setStatus(data.status);

        if (data.status === "completed" && data.summary) {
          setSummary(data.summary);
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
          }
        } else if (data.status === "failed") {
          setError(data.error || "Failed to generate summary");
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
          }
        }

        return data;
      }

      console.log("Cache does not exist or no status");
      return null;
    } catch (err) {
      console.error("Error checking cache:", err);
      return null;
    }
  };

  const triggerGeneration = async () => {
    try {
      const response = await fetch("/api/gene-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, model: modelId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to trigger generation");
      }

      const data = await response.json();
      console.log("Gene summary API response:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.status === "completed" && data.summary) {
        setSummary(data.summary);
        setStatus("completed");
      } else if (data.status === "generating") {
        setStatus("generating");
        pollingInterval.current = setInterval(checkCache, 3000);
      } else {
        console.warn("Unexpected API response:", data);
        setError(`Unexpected status: ${data.status || "unknown"}`);
        setStatus("failed");
      }
    } catch (err) {
      console.error("Error triggering generation:", err);
      setError(err instanceof Error ? err.message : "Failed to start summary generation");
      setStatus("failed");
    }
  };

  useEffect(() => {
    const initializeSummary = async () => {
      if (!symbol || hasTriggeredGeneration.current) return;

      const cacheData = await checkCache();

      if (!cacheData || cacheData.status === "pending") {
        hasTriggeredGeneration.current = true;
        await triggerGeneration();
      } else if (cacheData.status === "generating") {
        pollingInterval.current = setInterval(checkCache, 3000);
      }
    };

    initializeSummary();

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    };
  }, [symbol, modelId]);

  const handleOpenChat = () => {
    const chatTrigger = document.getElementById("chatbot-trigger-button");
    if (chatTrigger) {
      chatTrigger.click();
    }
  };

  if (error || status === "failed") {
    return (
      <div className="rounded-lg border border-border/50 bg-card shadow-md text-sm">
        <div className="px-4 pt-5 pb-3 sm:px-6 border-b border-border/40">
          <h2 className="text-xl font-semibold text-foreground">
            AI-Powered Gene Analysis by{" "}
            <button
              onClick={handleOpenChat}
              className="inline-flex items-center rounded-md text-foreground hover:bg-muted/50 hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-border px-1 py-0.5"
            >
              FAVOR-GPT
            </button>
          </h2>
        </div>
        <div className="px-4 pt-5 pb-5 sm:px-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <h3 className="text-destructive font-medium mb-2">Error generating summary</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const isGenerating = status === "pending" || status === "generating";

  return (
    <div className="rounded-lg border border-border/50 bg-card shadow-md text-sm">
      <div className="px-4 pt-5 pb-3 sm:px-6 border-b border-border/40">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            AI-Powered Gene Analysis by{" "}
            <button
              onClick={handleOpenChat}
              className="inline-flex items-center rounded-md text-foreground hover:bg-muted/50 hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-border px-1 py-0.5"
            >
              FAVOR-GPT
            </button>
          </h2>
        </div>
      </div>

      <div className="px-4 pt-5 pb-5 sm:px-6">
        {summary ? (
          <div className="prose prose-sm max-w-none">
            <Markdown>{summary}</Markdown>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>
              {status === "generating"
                ? "Generating summary in background... You can navigate away and come back later."
                : "Starting summary generation..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
