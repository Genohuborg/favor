import type { EdgeType } from "../types/edge";
import type { EdgeTypeStatsMap } from "../utils/schema-fields";

/**
 * A field to display in the edge tooltip.
 */
export interface TooltipField {
  key: string;
  label: string;
  format?: "number" | "score" | "text" | "phase";
}

/**
 * Schema-aware field picking for edge tooltips.
 * Shows the 2-3 most informative fields per edge type.
 * Database provenance ("Source") is auto-appended by edge-tooltip.tsx — don't include here.
 */
export const EDGE_TOOLTIP_FIELDS: Record<EdgeType, TooltipField[]> = {
  // ── Gene → Disease ──────────────────────────────────────────────────────
  GENE_ASSOCIATED_WITH_DISEASE: [
    { key: "ot_score", label: "Score", format: "score" },
    { key: "evidence_count", label: "Evidence", format: "number" },
    { key: "ot_num_datatypes", label: "Data Types", format: "number" },
  ],
  GENE_ALTERED_IN_DISEASE: [
    { key: "alteration_type", label: "Alteration" },
    { key: "frequency", label: "Frequency", format: "score" },
    { key: "sample_count", label: "Samples", format: "number" },
  ],

  // ── Gene → Drug ─────────────────────────────────────────────────────────
  GENE_AFFECTS_DRUG_RESPONSE: [
    { key: "clinical_significance", label: "Significance" },
    { key: "evidence_level", label: "Evidence Level" },
    { key: "n_evidence", label: "Evidence Count", format: "number" },
  ],

  // ── Gene → Pathway ─────────────────────────────────────────────────────
  GENE_PARTICIPATES_IN_PATHWAY: [
    { key: "pathway_source", label: "Source" },
    { key: "pathway_category", label: "Category" },
    { key: "relation_subtype", label: "Role" },
  ],

  // ── Gene → GO Term ─────────────────────────────────────────────────────
  GENE_ANNOTATED_WITH_GO_TERM: [
    { key: "go_namespace", label: "Namespace" },
    { key: "evidence_code", label: "Evidence" },
    { key: "qualifier", label: "Qualifier" },
  ],

  // ── Gene → Phenotype ───────────────────────────────────────────────────
  GENE_ASSOCIATED_WITH_PHENOTYPE: [
    { key: "evidence_code", label: "Evidence" },
    { key: "frequency", label: "Frequency", format: "score" },
  ],

  // ── Gene → Gene ────────────────────────────────────────────────────────
  GENE_INTERACTS_WITH_GENE: [
    { key: "combined_score", label: "Score", format: "score" },
    { key: "confidence", label: "Confidence", format: "score" },
    { key: "num_sources", label: "Sources", format: "number" },
    { key: "detection_methods", label: "Detection Methods" },
    { key: "relation_subtype", label: "Type" },
  ],
  GENE_PARALOG_OF_GENE: [
    { key: "identity_pct", label: "Identity %", format: "score" },
    { key: "alignment_length", label: "Alignment", format: "number" },
  ],

  // ── Gene → Side Effect ─────────────────────────────────────────────────
  GENE_ASSOCIATED_WITH_SIDE_EFFECT: [
    { key: "significance", label: "Significance" },
    { key: "drug_name", label: "Drug" },
    { key: "n_evidence", label: "Evidence", format: "number" },
  ],

  // ── Gene → Protein Domain ──────────────────────────────────────────────
  GENE_HAS_PROTEIN_DOMAIN: [
    { key: "domain_name", label: "Domain" },
    { key: "score", label: "Score", format: "score" },
  ],

  // ── Gene → Tissue ──────────────────────────────────────────────────────
  GENE_EXPRESSED_IN_TISSUE: [
    { key: "expression_level", label: "Expression" },
    { key: "tpm", label: "TPM", format: "score" },
    { key: "tissue_name", label: "Tissue" },
  ],

  // ── Drug → Gene ────────────────────────────────────────────────────────
  DRUG_ACTS_ON_GENE: [
    { key: "action_type", label: "Action" },
    { key: "mechanism_of_action", label: "Mechanism" },
    { key: "max_clinical_phase", label: "Phase", format: "phase" },
  ],
  DRUG_DISPOSITION_BY_GENE: [
    { key: "disposition_type", label: "Disposition" },
    { key: "mechanism", label: "Mechanism" },
  ],

  // ── Drug → Disease ─────────────────────────────────────────────────────
  DRUG_INDICATED_FOR_DISEASE: [
    { key: "max_clinical_phase", label: "Phase", format: "phase" },
    { key: "num_sources", label: "Sources", format: "number" },
  ],

  // ── Drug → Side Effect ─────────────────────────────────────────────────
  DRUG_HAS_ADVERSE_EFFECT: [
    { key: "frequency_description", label: "Frequency" },
    { key: "report_count", label: "Reports", format: "number" },
    { key: "llr", label: "LLR", format: "score" },
  ],
  DRUG_PAIR_CAUSES_SIDE_EFFECT: [
    { key: "report_count", label: "Reports", format: "number" },
    { key: "confidence", label: "Confidence", format: "score" },
  ],

  // ── Drug → Drug ────────────────────────────────────────────────────────
  DRUG_INTERACTS_WITH_DRUG: [
    { key: "interaction_type", label: "Type" },
    { key: "severity", label: "Severity" },
    { key: "description", label: "Description" },
  ],

  // ── Variant → Gene ─────────────────────────────────────────────────────
  VARIANT_IMPLIES_GENE: [
    { key: "max_l2g_score", label: "L2G Score", format: "score" },
    { key: "confidence", label: "Confidence", format: "score" },
    { key: "n_loci", label: "Loci", format: "number" },
  ],
  VARIANT_AFFECTS_GENE: [
    { key: "clinical_significance", label: "Significance" },
    { key: "max_pathogenicity", label: "Pathogenicity", format: "score" },
    { key: "review_status", label: "Review" },
  ],

  // ── Variant → Disease (trait association) ──────────────────────────────
  VARIANT_ASSOCIATED_WITH_TRAIT: [
    { key: "clinical_significance", label: "Significance" },
    { key: "review_status", label: "Review" },
    { key: "significance", label: "Direction" },
  ],

  // ── Variant → Drug ─────────────────────────────────────────────────────
  VARIANT_ASSOCIATED_WITH_DRUG: [
    { key: "significance", label: "Significance" },
    { key: "evidence_level", label: "Evidence Level" },
    { key: "direction_of_effect", label: "Effect Direction" },
  ],

  // ── Variant → Side Effect ──────────────────────────────────────────────
  VARIANT_LINKED_TO_SIDE_EFFECT: [
    { key: "significance", label: "Significance" },
    { key: "drug_name", label: "Drug" },
    { key: "gene_symbol", label: "Gene" },
  ],

  // ── Variant → cCRE ────────────────────────────────────────────────────
  VARIANT_OVERLAPS_CCRE: [
    { key: "annotation_label", label: "Annotation" },
    { key: "distance_to_center", label: "Distance", format: "number" },
    { key: "ccre_size", label: "cCRE Size", format: "number" },
  ],

  // ── cCRE → Gene ────────────────────────────────────────────────────────
  CCRE_REGULATES_GENE: [
    { key: "max_score", label: "Score", format: "score" },
    { key: "n_tissues", label: "Tissues", format: "number" },
    { key: "method", label: "Method" },
  ],

  // ── Disease → Phenotype ────────────────────────────────────────────────
  DISEASE_HAS_PHENOTYPE: [
    { key: "match_count", label: "Matches", format: "number" },
    { key: "match_types", label: "Match Types" },
  ],

  // ── Phenotype ──────────────────────────────────────────────────────────
  PHENOTYPE_EQUIVALENT_TO: [
    { key: "match_count", label: "Matches", format: "number" },
    { key: "match_types", label: "Match Types" },
  ],
  PHENOTYPE_HIERARCHY: [
    { key: "distance", label: "Distance", format: "number" },
  ],
  PHENOTYPE_CLOSURE: [
    { key: "distance", label: "Distance", format: "number" },
    { key: "relationship_type", label: "Relation" },
  ],

  // ── Disease hierarchy ──────────────────────────────────────────────────
  DISEASE_SUBCLASS_OF_DISEASE: [
    { key: "distance", label: "Distance", format: "number" },
    { key: "relationship_type", label: "Relation" },
  ],
  DISEASE_ANCESTOR_OF_DISEASE: [
    { key: "distance", label: "Distance", format: "number" },
    { key: "relationship_type", label: "Relation" },
  ],

  // ── Pathway hierarchy ──────────────────────────────────────────────────
  PATHWAY_PART_OF_PATHWAY: [
    { key: "distance", label: "Distance", format: "number" },
  ],
  PATHWAY_ANCESTOR_OF_PATHWAY: [
    { key: "distance", label: "Distance", format: "number" },
    { key: "relationship_type", label: "Relation" },
  ],

  // ── GO hierarchy ───────────────────────────────────────────────────────
  GO_HIERARCHY: [{ key: "distance", label: "Distance", format: "number" }],
  GO_CLOSURE: [
    { key: "distance", label: "Distance", format: "number" },
    { key: "relationship_type", label: "Relation" },
  ],

  // ── Metabolite ─────────────────────────────────────────────────────────
  PATHWAY_CONTAINS_METABOLITE: [
    { key: "metabolite_name", label: "Metabolite" },
    { key: "pathway_name", label: "Pathway" },
  ],
  METABOLITE_IS_A_METABOLITE: [
    { key: "src_name", label: "From" },
    { key: "dst_name", label: "To" },
  ],

  // ── Signal ─────────────────────────────────────────────────────────────
  SIGNAL_ASSOCIATED_WITH_TRAIT__Disease: [
    { key: "p_value_mlog", label: "-log10(p)", format: "score" },
    { key: "or_beta", label: "Beta", format: "score" },
  ],
  SIGNAL_ASSOCIATED_WITH_TRAIT__Phenotype: [
    { key: "p_value_mlog", label: "-log10(p)", format: "score" },
    { key: "or_beta", label: "Beta", format: "score" },
  ],
  SIGNAL_HAS_VARIANT: [
    { key: "posterior_probability", label: "PIP", format: "score" },
    { key: "lead_variant", label: "Lead Variant" },
  ],
  SIGNAL_IMPLIES_GENE: [
    { key: "l2g_score", label: "L2G Score", format: "score" },
    { key: "confidence", label: "Confidence", format: "score" },
  ],

  // ── Protein Domain hierarchy ───────────────────────────────────────────
  DOMAIN_SUBCLASS_OF_DOMAIN: [
    { key: "distance", label: "Distance", format: "number" },
  ],
  DOMAIN_ANCESTOR_OF_DOMAIN: [
    { key: "distance", label: "Distance", format: "number" },
    { key: "relationship_type", label: "Relation" },
  ],
};

/**
 * Get tooltip fields for an edge type with schema fallback.
 * Uses hardcoded fields if available, otherwise falls back to schema scoreFields[0..2].
 */
export function getTooltipFields(
  edgeType: EdgeType,
  schemaMap?: EdgeTypeStatsMap,
): TooltipField[] {
  // Prefer curated tooltip fields (with labels and formats)
  const curated = EDGE_TOOLTIP_FIELDS[edgeType];
  if (curated && curated.length > 0) return curated;

  // Fall back to schema scoreFields (first 2-3 fields)
  if (schemaMap) {
    const stats = schemaMap.get(edgeType);
    if (stats?.scoreFields && stats.scoreFields.length > 0) {
      return stats.scoreFields.slice(0, 3).map((field) => ({
        key: field,
        label: field
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        format: "score" as const,
      }));
    }
  }

  return [];
}

/**
 * Format a field value for tooltip display.
 */
export function formatTooltipValue(
  value: unknown,
  format?: TooltipField["format"],
): string {
  if (value === null || value === undefined) return "\u2014";

  switch (format) {
    case "score":
      return typeof value === "number" ? value.toFixed(3) : String(value);
    case "number":
      return typeof value === "number" ? value.toLocaleString() : String(value);
    case "phase":
      return typeof value === "number" ? `Phase ${value}` : String(value);
    default:
      return String(value);
  }
}
