import type { TraitPoint } from "./gwas-graph";
import { ep, fetchVariantGraph, getEdgeRows, nb } from "./variant-graph";

/**
 * Fetch fine-mapped credible set memberships for a variant.
 *
 * One call: /graph/Variant/{vcf}?edgeTypes=SIGNAL_HAS_VARIANT&neighborMode=full
 * returns every edge with the full Signal node inlined (method_name,
 * num_credible_95, study_id, study_type, region, log_bayes_factor, …).
 * The Study node type was removed from the graph, so the reported trait is no
 * longer resolvable; callers fall back to the study id.
 */

// ---------------------------------------------------------------------------
// Row for table consumption
// ---------------------------------------------------------------------------

export interface CredibleSetSignal {
  signalId: string;
  studyId: string;
  studyType: string;
  reportedTrait: string | null;
  methodName: string | null;
  numCredible95: number | null;
  numVariants: number | null;
  region: string | null;
  logBayesFactor: number | null;
  posteriorProbability: number | null;
  confidence: string | null;
  isLead: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function strOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v);
  return s.length > 0 ? s : null;
}

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

/**
 * Plot-facing fetcher: returns TraitPoint[] with y = PIP.
 * Categorized by study_type (gwas/eqtl/pqtl/sqtl/tuqtl/sceqtl).
 */
export async function fetchVariantCredibleSets(
  vcf: string,
  limit = 500,
): Promise<TraitPoint[]> {
  const signals = await fetchVariantSignals(vcf, limit);
  return signals.map((s, i) => ({
    id: `Signal-${s.signalId}-${i}`,
    traitName: s.reportedTrait ?? s.studyId,
    category: s.studyType || "other",
    yValue: s.posteriorProbability,
    orBeta: null,
    riskAlleleFreq: null,
    mappedGene: null,
    variantCount: s.numCredible95,
    method: s.methodName,
    studyId: s.studyId,
  }));
}

/**
 * Table-facing fetcher: returns the full Signal row shape with trait
 * resolved from the underlying Study.
 */
export async function fetchVariantSignals(
  vcf: string,
  limit = 500,
): Promise<CredibleSetSignal[]> {
  if (!vcf) return [];

  // One call — Signal fields inlined via neighborMode=full.
  const graph = await fetchVariantGraph(vcf, ["SIGNAL_HAS_VARIANT"], limit, {
    SIGNAL_HAS_VARIANT: "full",
  });
  if (!graph) return [];

  const edgeRows = getEdgeRows(graph, "SIGNAL_HAS_VARIANT");
  if (edgeRows.length === 0) return [];

  return edgeRows.map((row) => {
    const n = row.neighbor;
    const studyId = nb<string>(row, "study_id") ?? n.id;
    const leadVariant =
      nb<string>(row, "lead_variant") ?? nb<string>(row, "lead");
    return {
      signalId: n.id,
      studyId,
      studyType:
        nb<string>(row, "study_type") ?? nb<string>(row, "type") ?? "other",
      reportedTrait: null,
      methodName: strOrNull(nb(row, "method_name")),
      numCredible95: numOrNull(nb(row, "num_credible_95")),
      numVariants: numOrNull(nb(row, "num_variants")),
      region: strOrNull(nb(row, "region")),
      logBayesFactor:
        numOrNull(nb(row, "log_bayes_factor")) ??
        numOrNull(ep(row, "log_bayes_factor")),
      posteriorProbability: numOrNull(ep(row, "posterior_probability")),
      confidence: strOrNull(nb(row, "confidence")),
      isLead: leadVariant === vcf || leadVariant === `chr${vcf}`,
    };
  });
}
