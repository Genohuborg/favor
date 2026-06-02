/**
 * Shared point shape for the trait / credible-set scatter plots.
 *
 * GWAS Catalog points come from the REST `/gwas/{ref}` endpoint (it carries
 * the p-values); credible-set points come from the graph SIGNAL_HAS_VARIANT
 * edge. The old graph-sourced GWAS fetcher was removed when the variant-trait
 * edges collapsed into a single ClinVar edge that has no p-value.
 */
export interface TraitPoint {
  id: string;
  traitName: string;
  category: string;
  /** Numeric value plotted on the y-axis. For GWAS Catalog this is
   *  -log₁₀(p); for credible sets it's the posterior inclusion probability. */
  yValue: number | null;
  orBeta: number | null;
  riskAlleleFreq: number | null;
  mappedGene: string | null;
  /** Number of variants in the source credible set. Only populated by the
   *  credible-sets fetcher. */
  variantCount?: number | null;
  /** Fine-mapping method (e.g. "SuSiE", "PICS"). Only set by credible sets. */
  method?: string | null;
  /** Study accession or signal id (e.g. "GCST001392" or "OT_abc123"). */
  studyId?: string | null;
}
