/**
 * Shared per-edge-type field allow-lists.
 *
 * HANDLER_EDGE_FIELDS: superset — used by handlers (variant_profile) for frontend display.
 * COMPACT_EDGE_FIELDS: subset — used by compactify for model-facing output.
 *
 * Both are derived from a single source of truth (this file) to prevent drift.
 */

/** Full field list per edge type — handlers keep all of these. */
export const HANDLER_EDGE_FIELDS: Record<string, string[] | null> = {
  VARIANT_OVERLAPS_CCRE: [
    "annotation",
    "annotation_label",
    "distance_to_center",
    "ccre_size",
    "source",
  ],
  VARIANT_IMPLIES_GENE: [
    "implication_mode",
    "l2g_score",
    "confidence_class",
    "n_loci",
    "gene_symbol",
  ],
  VARIANT_AFFECTS_GENE: [
    "variant_consequence",
    "region_type",
    "gene_symbol",
    "gene_full_name",
    "sources",
  ],
  VARIANT_ASSOCIATED_WITH_TRAIT: [
    "p_value_mlog",
    "or_beta",
    "risk_allele",
    "clinical_significance",
    "review_status",
    "trait_name",
  ],
  VARIANT_ASSOCIATED_WITH_DRUG: [
    "clinical_significance",
    "evidence_count",
    "direction_of_effect",
    "drug_name",
  ],
  VARIANT_LINKED_TO_SIDE_EFFECT: [
    "side_effect_name",
    "drug_name",
    "gene_symbol",
    "confidence_class",
  ],
  CCRE_REGULATES_GENE: ["max_score", "n_tissues", "method"],
  SIGNAL_HAS_VARIANT: null, // skip entirely — huge count, never useful
};

/**
 * Compact subset per edge type — compactify keeps only these (no display-only fields).
 * Derived from HANDLER_EDGE_FIELDS minus handler-specific extras.
 */
export const COMPACT_EDGE_FIELDS: Record<string, string[]> = {
  VARIANT_OVERLAPS_CCRE: [
    "annotation",
    "annotation_label",
    "distance_to_center",
    "ccre_size",
  ],
  VARIANT_IMPLIES_GENE: [
    "implication_mode",
    "l2g_score",
    "confidence_class",
    "n_loci",
    "gene_symbol",
  ],
  VARIANT_AFFECTS_GENE: ["variant_consequence", "region_type", "gene_symbol"],
  VARIANT_ASSOCIATED_WITH_TRAIT: [
    "p_value_mlog",
    "clinical_significance",
    "review_status",
  ],
  VARIANT_ASSOCIATED_WITH_DRUG: [
    "clinical_significance",
    "evidence_count",
    "direction_of_effect",
    "drug_name",
  ],
  VARIANT_LINKED_TO_SIDE_EFFECT: [
    "side_effect_name",
    "drug_name",
    "gene_symbol",
    "confidence_class",
  ],
  CCRE_REGULATES_GENE: ["max_score", "n_tissues", "method"],
};
