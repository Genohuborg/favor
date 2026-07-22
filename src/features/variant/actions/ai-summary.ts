"use server";

import {
  fetchChromBpnetByTissueGroup,
  fetchMethylationByTissueGroup,
  fetchQtlsByTissueGroup,
  fetchRegionSummary,
  fetchSignalsByTissueGroup,
  fetchTargetGenes,
  fetchVariantAllelicImbalanceByTissueGroup,
} from "@features/enrichment/api/region";
import { fetchVariantSignals } from "@features/variant/api/credible-sets-graph";
import { fetchGwasAssociations } from "@features/variant/api/gwas";
import { buildVariantContext } from "@features/variant/utils/build-variant-context";
import { buildVariantPrompt } from "@features/variant/utils/build-variant-prompt";
import { fetchVariantWithCookie } from "@features/variant/utils/fetch-with-cookie";
import { resolveAuthFromCookieStore } from "@infra/auth/server";
import { API_BASE } from "@/config/api";

export interface AITextData {
  content: string | null;
  status: string;
  model?: string;
  completed_at?: string;
}

export interface GenerateResponse {
  status: "pending" | "generating" | "completed" | "failed";
  request_id: string;
  content?: string;
  error?: string;
  estimated_seconds?: number;
}

/**
 * Server action to fetch cached AI summary for a variant
 */
export async function getVariantSummary(
  vcf: string,
): Promise<{ data: AITextData | null }> {
  const searchParams = new URLSearchParams({
    entity_type: "variant",
    entity_id: vcf,
    content_type: "summary",
  });

  const auth = await resolveAuthFromCookieStore();
  if (!auth) return { data: null };

  const response = await fetch(`${API_BASE}/ai-text?${searchParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...auth.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) return { data: null };
    // 401 must NOT be downgraded to "no cache" — that causes the hook to
    // trigger a spurious generation when an entry already exists.
    throw new Error(`Failed to fetch AI text: ${response.status}`);
  }

  const data = await response.json();
  return { data };
}

const MAX_PROMPT_LENGTH = 18000;

/**
 * Server action to trigger AI summary generation for a variant.
 * Fetches variant + regulatory/tissue evidence and builds the prompt server-side
 * so callers don't pay the cost on cache hits.
 */
export async function generateVariantSummary(params: {
  vcf: string;
  model?: string;
}): Promise<GenerateResponse> {
  if (typeof params.vcf !== "string" || params.vcf.length > 64) {
    throw new Error("Invalid vcf identifier");
  }

  const auth = await resolveAuthFromCookieStore();
  if (!auth) throw new Error("Unauthorized");

  const result = await fetchVariantWithCookie(params.vcf).catch(() => null);
  if (!result) {
    throw new Error(`Variant not found: ${params.vcf}`);
  }

  const variant = result.selected;
  const loc = `${variant.chromosome}-${variant.position}-${variant.position}`;

  const catchNull = (label: string) => (err: unknown) => {
    console.error(`[variant-llm] ${label} failed:`, err);
    return null;
  };
  const catchEmpty = (label: string) => (err: unknown) => {
    console.error(`[variant-llm] ${label} failed:`, err);
    return [] as never[];
  };

  const [
    gwas,
    credibleSets,
    targetGenes,
    qtls,
    regionSummary,
    signals,
    chromBpnet,
    allelicImbalance,
    methylation,
  ] = await Promise.all([
    fetchGwasAssociations(variant.variant_vcf, { limit: 10 }).catch(
      catchNull("gwas"),
    ),
    fetchVariantSignals(variant.variant_vcf, 100).catch(
      catchEmpty("credibleSets"),
    ),
    fetchTargetGenes(variant.variant_vcf, 10).catch(catchEmpty("targetGenes")),
    fetchQtlsByTissueGroup(variant.variant_vcf).catch(catchEmpty("qtls")),
    fetchRegionSummary(loc).catch(catchNull("regionSummary")),
    fetchSignalsByTissueGroup(loc).catch(catchEmpty("signals")),
    fetchChromBpnetByTissueGroup(variant.variant_vcf).catch(
      catchEmpty("chromBpnet"),
    ),
    fetchVariantAllelicImbalanceByTissueGroup(variant.variant_vcf).catch(
      catchEmpty("allelicImbalance"),
    ),
    fetchMethylationByTissueGroup(variant.variant_vcf).catch(
      catchEmpty("methylation"),
    ),
  ]);

  const context = buildVariantContext({
    gwas,
    credibleSets,
    targetGenes,
    qtls,
    regionSummary,
    signals,
    chromBpnet,
    allelicImbalance,
    methylation,
  });

  const prompt = buildVariantPrompt(variant, context);

  // Server-side log so we can verify exactly what got sent. Truncate if
  // huge to keep stdout readable; full prompt always reaches the model.
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[variant-llm] prompt for ${params.vcf} (${prompt.length} chars):\n${prompt}`,
    );
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    throw new Error(
      `Prompt must be a string of at most ${MAX_PROMPT_LENGTH} characters`,
    );
  }

  const response = await fetch(`${API_BASE}/ai-text/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...auth.headers,
    },
    body: JSON.stringify({
      entity_type: "variant",
      entity_id: params.vcf,
      content_type: "summary",
      prompt,
      model: params.model ?? "gpt-5.4-mini",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to generate AI text: ${response.status} - ${errorText}`,
    );
  }

  return response.json();
}
