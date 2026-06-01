// =============================================================================
// Edge Types
// =============================================================================

export type EdgeType =
  // Gene → Disease
  | "GENE_ASSOCIATED_WITH_DISEASE"
  | "GENE_ALTERED_IN_DISEASE"
  // Gene → Drug
  | "GENE_AFFECTS_DRUG_RESPONSE"
  // Gene → Pathway
  | "GENE_PARTICIPATES_IN_PATHWAY"
  // Gene → GOTerm
  | "GENE_ANNOTATED_WITH_GO_TERM"
  // Gene → Phenotype
  | "GENE_ASSOCIATED_WITH_PHENOTYPE"
  // Gene → Gene
  | "GENE_INTERACTS_WITH_GENE"
  | "GENE_PARALOG_OF_GENE"
  // Gene → SideEffect
  | "GENE_ASSOCIATED_WITH_SIDE_EFFECT"
  // Gene → ProteinDomain
  | "GENE_HAS_PROTEIN_DOMAIN"
  // Gene → Tissue
  | "GENE_EXPRESSED_IN_TISSUE"
  // Drug → Gene
  | "DRUG_ACTS_ON_GENE"
  | "DRUG_DISPOSITION_BY_GENE"
  // Drug → Disease
  | "DRUG_INDICATED_FOR_DISEASE"
  // Drug → SideEffect
  | "DRUG_HAS_ADVERSE_EFFECT"
  | "DRUG_PAIR_CAUSES_SIDE_EFFECT"
  // Drug → Drug
  | "DRUG_INTERACTS_WITH_DRUG"
  // Variant → Gene
  | "VARIANT_IMPLIES_GENE"
  | "VARIANT_AFFECTS_GENE"
  // Variant → Disease (trait association; ClinVar/PGx)
  | "VARIANT_ASSOCIATED_WITH_TRAIT"
  // Variant → Drug
  | "VARIANT_ASSOCIATED_WITH_DRUG"
  // Variant → SideEffect
  | "VARIANT_LINKED_TO_SIDE_EFFECT"
  // Variant → cCRE
  | "VARIANT_OVERLAPS_CCRE"
  // cCRE → Gene
  | "CCRE_REGULATES_GENE"
  // Disease → Phenotype
  | "DISEASE_HAS_PHENOTYPE"
  // Phenotype → Phenotype
  | "PHENOTYPE_EQUIVALENT_TO"
  | "PHENOTYPE_HIERARCHY"
  | "PHENOTYPE_CLOSURE"
  // Disease → Disease
  | "DISEASE_SUBCLASS_OF_DISEASE"
  | "DISEASE_ANCESTOR_OF_DISEASE"
  // Pathway → Pathway
  | "PATHWAY_PART_OF_PATHWAY"
  | "PATHWAY_ANCESTOR_OF_PATHWAY"
  // GO → GO
  | "GO_HIERARCHY"
  | "GO_CLOSURE"
  // Metabolite
  | "PATHWAY_CONTAINS_METABOLITE"
  | "METABOLITE_IS_A_METABOLITE"
  // Signal (all new)
  | "SIGNAL_ASSOCIATED_WITH_TRAIT__Disease"
  | "SIGNAL_ASSOCIATED_WITH_TRAIT__Phenotype"
  | "SIGNAL_HAS_VARIANT"
  | "SIGNAL_IMPLIES_GENE"
  // ProteinDomain → ProteinDomain
  | "DOMAIN_SUBCLASS_OF_DOMAIN"
  | "DOMAIN_ANCESTOR_OF_DOMAIN";

/**
 * Static database provenance per edge type.
 * Used as fallback when an edge row has no `source`/`sources` field.
 */
export const EDGE_TYPE_DATABASE: Record<EdgeType, string> = {
  // Gene → Disease
  GENE_ASSOCIATED_WITH_DISEASE: "OpenTargets",
  GENE_ALTERED_IN_DISEASE: "COSMIC",
  // Gene → Drug
  GENE_AFFECTS_DRUG_RESPONSE: "PharmGKB",
  // Gene → Pathway
  GENE_PARTICIPATES_IN_PATHWAY: "Reactome",
  // Gene → GOTerm
  GENE_ANNOTATED_WITH_GO_TERM: "GOA",
  // Gene → Phenotype
  GENE_ASSOCIATED_WITH_PHENOTYPE: "HPO",
  // Gene → Gene
  GENE_INTERACTS_WITH_GENE: "BioGRID",
  GENE_PARALOG_OF_GENE: "Ensembl",
  // Gene → SideEffect
  GENE_ASSOCIATED_WITH_SIDE_EFFECT: "PharmGKB",
  // Gene → ProteinDomain
  GENE_HAS_PROTEIN_DOMAIN: "InterPro",
  // Gene → Tissue
  GENE_EXPRESSED_IN_TISSUE: "GTEx",
  // Drug → Gene
  DRUG_ACTS_ON_GENE: "OpenTargets",
  DRUG_DISPOSITION_BY_GENE: "PharmGKB",
  // Drug → Disease
  DRUG_INDICATED_FOR_DISEASE: "OpenTargets",
  // Drug → SideEffect
  DRUG_HAS_ADVERSE_EFFECT: "SIDER",
  DRUG_PAIR_CAUSES_SIDE_EFFECT: "TWOSIDES",
  // Drug → Drug
  DRUG_INTERACTS_WITH_DRUG: "DrugBank",
  // Variant → Gene (multi-source — per-edge `source` field is more accurate)
  VARIANT_IMPLIES_GENE: "ClinVar + OpenTargets",
  VARIANT_AFFECTS_GENE: "GENCODE + AlphaMissense",
  // Variant → Disease (trait association)
  VARIANT_ASSOCIATED_WITH_TRAIT: "ClinVar",
  // Variant → Drug
  VARIANT_ASSOCIATED_WITH_DRUG: "PharmGKB",
  // Variant → SideEffect
  VARIANT_LINKED_TO_SIDE_EFFECT: "PharmGKB",
  // Variant → cCRE
  VARIANT_OVERLAPS_CCRE: "ENCODE",
  // cCRE → Gene
  CCRE_REGULATES_GENE: "ENCODE",
  // Disease → Phenotype
  DISEASE_HAS_PHENOTYPE: "MONDO",
  // Phenotype → Phenotype
  PHENOTYPE_EQUIVALENT_TO: "HPO",
  PHENOTYPE_HIERARCHY: "HPO",
  PHENOTYPE_CLOSURE: "HPO",
  // Disease → Disease
  DISEASE_SUBCLASS_OF_DISEASE: "MONDO",
  DISEASE_ANCESTOR_OF_DISEASE: "MONDO",
  // Pathway → Pathway
  PATHWAY_PART_OF_PATHWAY: "Reactome",
  PATHWAY_ANCESTOR_OF_PATHWAY: "Reactome",
  // GO → GO
  GO_HIERARCHY: "Gene Ontology",
  GO_CLOSURE: "Gene Ontology",
  // Metabolite
  PATHWAY_CONTAINS_METABOLITE: "ConsensusPathDB",
  METABOLITE_IS_A_METABOLITE: "ChEBI",
  // Signal
  SIGNAL_ASSOCIATED_WITH_TRAIT__Disease: "GWAS Catalog",
  SIGNAL_ASSOCIATED_WITH_TRAIT__Phenotype: "GWAS Catalog",
  SIGNAL_HAS_VARIANT: "GWAS Catalog",
  SIGNAL_IMPLIES_GENE: "OpenTargets",
  // ProteinDomain → ProteinDomain
  DOMAIN_SUBCLASS_OF_DOMAIN: "InterPro",
  DOMAIN_ANCESTOR_OF_DOMAIN: "InterPro",
};

/**
 * Get the primary database provenance for an edge type.
 * Used for header chips and tooltips — the high-level "who created this edge".
 */
export function getEdgeDatabase(type: EdgeType): string {
  return EDGE_TYPE_DATABASE[type];
}

export const EDGE_TYPE_CONFIG: Record<
  EdgeType,
  { label: string; color: string; description: string }
> = {
  // Gene → Disease (Red family)
  GENE_ASSOCIATED_WITH_DISEASE: {
    label: "Gene–Disease Association",
    color: "#ef4444",
    description: "Gene associated with disease (scored, curated, causal)",
  },
  GENE_ALTERED_IN_DISEASE: {
    label: "Gene Altered in Disease",
    color: "#dc2626",
    description: "Gene somatically altered in disease",
  },
  // Gene → Drug (Cyan family)
  GENE_AFFECTS_DRUG_RESPONSE: {
    label: "Gene Affects Drug Response",
    color: "#06b6d4",
    description: "Pharmacogenomic gene–drug interaction",
  },
  // Gene → Pathway (Purple family)
  GENE_PARTICIPATES_IN_PATHWAY: {
    label: "Participates in Pathway",
    color: "#8b5cf6",
    description: "Gene participates in pathway",
  },
  // Gene → GOTerm (Green family)
  GENE_ANNOTATED_WITH_GO_TERM: {
    label: "GO Annotation",
    color: "#a78bfa",
    description: "Gene annotated with GO term",
  },
  // Gene → Phenotype (Pink family)
  GENE_ASSOCIATED_WITH_PHENOTYPE: {
    label: "Gene–Phenotype Association",
    color: "#ec4899",
    description: "Gene associated with phenotype",
  },
  // Gene → Gene (Blue family)
  GENE_INTERACTS_WITH_GENE: {
    label: "Gene–Gene Interaction",
    color: "#3b82f6",
    description: "Protein-protein or functional interaction",
  },
  GENE_PARALOG_OF_GENE: {
    label: "Paralog",
    color: "#60a5fa",
    description: "Paralogous gene pair",
  },
  // Gene → SideEffect
  GENE_ASSOCIATED_WITH_SIDE_EFFECT: {
    label: "Gene–Side Effect",
    color: "#c084fc",
    description: "Gene associated with side effect",
  },
  // Gene → ProteinDomain
  GENE_HAS_PROTEIN_DOMAIN: {
    label: "Has Protein Domain",
    color: "#7c3aed",
    description: "Gene encodes protein domain",
  },
  // Gene → Tissue
  GENE_EXPRESSED_IN_TISSUE: {
    label: "Expressed in Tissue",
    color: "#14b8a6",
    description: "Gene expressed in tissue",
  },
  // Drug → Gene (Green family)
  DRUG_ACTS_ON_GENE: {
    label: "Drug Acts on Gene",
    color: "#22c55e",
    description: "Drug targets or acts on gene",
  },
  DRUG_DISPOSITION_BY_GENE: {
    label: "Drug Disposition by Gene",
    color: "#16a34a",
    description: "Drug disposition mediated by gene",
  },
  // Drug → Disease
  DRUG_INDICATED_FOR_DISEASE: {
    label: "Indicated for Disease",
    color: "#15803d",
    description: "Drug indicated for disease",
  },
  // Drug → SideEffect
  DRUG_HAS_ADVERSE_EFFECT: {
    label: "Adverse Effect",
    color: "#4ade80",
    description: "Drug has adverse effect",
  },
  DRUG_PAIR_CAUSES_SIDE_EFFECT: {
    label: "Drug Pair Side Effect",
    color: "#86efac",
    description: "Drug pair causes side effect",
  },
  // Drug → Drug
  DRUG_INTERACTS_WITH_DRUG: {
    label: "Drug–Drug Interaction",
    color: "#34d399",
    description: "Drug-drug interaction (DrugBank)",
  },
  // Variant → Gene (Amber-orange family)
  VARIANT_IMPLIES_GENE: {
    label: "Variant Implies Gene",
    color: "#fb923c",
    description: "Variant-to-gene causal assignment",
  },
  VARIANT_AFFECTS_GENE: {
    label: "Variant Affects Gene",
    color: "#ea580c",
    description: "Variant molecular impact on gene",
  },
  // Variant → Disease (Yellow family)
  VARIANT_ASSOCIATED_WITH_TRAIT: {
    label: "Variant–Disease Association",
    color: "#d97706",
    description: "Variant associated with disease (ClinVar/PGx)",
  },
  // Variant → Drug
  VARIANT_ASSOCIATED_WITH_DRUG: {
    label: "Variant–Drug Response",
    color: "#fbbf24",
    description: "Variant associated with drug response",
  },
  // Variant → SideEffect
  VARIANT_LINKED_TO_SIDE_EFFECT: {
    label: "Variant–Side Effect",
    color: "#fde047",
    description: "Variant linked to side effect",
  },
  // Variant → cCRE
  VARIANT_OVERLAPS_CCRE: {
    label: "Overlaps cCRE",
    color: "#facc15",
    description: "Variant overlaps cCRE",
  },
  // cCRE → Gene (Teal family)
  CCRE_REGULATES_GENE: {
    label: "Regulates Gene",
    color: "#0f766e",
    description: "cCRE regulates gene expression",
  },
  // Disease → Phenotype (Rose family)
  DISEASE_HAS_PHENOTYPE: {
    label: "Disease Has Phenotype",
    color: "#f43f5e",
    description: "Disease presents with phenotype",
  },
  // Phenotype → Phenotype
  PHENOTYPE_EQUIVALENT_TO: {
    label: "Phenotype Equivalent",
    color: "#d946ef",
    description: "Equivalent phenotype mapping",
  },
  PHENOTYPE_HIERARCHY: {
    label: "Phenotype Hierarchy",
    color: "#6b7280",
    description: "Phenotype subclass of",
  },
  PHENOTYPE_CLOSURE: {
    label: "Phenotype Closure",
    color: "#9ca3af",
    description: "Phenotype ancestor of",
  },
  // Disease → Disease (Gray family)
  DISEASE_SUBCLASS_OF_DISEASE: {
    label: "Disease Subclass",
    color: "#6b7280",
    description: "Disease subclass of",
  },
  DISEASE_ANCESTOR_OF_DISEASE: {
    label: "Disease Ancestor",
    color: "#9ca3af",
    description: "Disease ancestor of",
  },
  // Pathway → Pathway (Indigo family)
  PATHWAY_PART_OF_PATHWAY: {
    label: "Part of Pathway",
    color: "#6366f1",
    description: "Pathway part of parent",
  },
  PATHWAY_ANCESTOR_OF_PATHWAY: {
    label: "Pathway Ancestor",
    color: "#818cf8",
    description: "Pathway ancestor of",
  },
  // GO → GO
  GO_HIERARCHY: {
    label: "GO Hierarchy",
    color: "#6b7280",
    description: "GO term subclass hierarchy",
  },
  GO_CLOSURE: {
    label: "GO Closure",
    color: "#9ca3af",
    description: "GO term ancestor (transitive closure)",
  },
  // Metabolite (Pink family)
  PATHWAY_CONTAINS_METABOLITE: {
    label: "Contains Metabolite",
    color: "#db2777",
    description: "Pathway contains metabolite",
  },
  METABOLITE_IS_A_METABOLITE: {
    label: "Metabolite Is A",
    color: "#be185d",
    description: "Metabolite is a subclass",
  },
  // Signal (Indigo-blue family)
  SIGNAL_ASSOCIATED_WITH_TRAIT__Disease: {
    label: "Signal–Disease",
    color: "#4f46e5",
    description: "Signal associated with disease",
  },
  SIGNAL_ASSOCIATED_WITH_TRAIT__Phenotype: {
    label: "Signal–Phenotype",
    color: "#818cf8",
    description: "Signal associated with phenotype",
  },
  SIGNAL_HAS_VARIANT: {
    label: "Signal Has Variant",
    color: "#a5b4fc",
    description: "Signal contains variant",
  },
  SIGNAL_IMPLIES_GENE: {
    label: "Signal Implies Gene",
    color: "#c7d2fe",
    description: "Signal implicates gene",
  },
  // ProteinDomain → ProteinDomain
  DOMAIN_SUBCLASS_OF_DOMAIN: {
    label: "Domain Subclass",
    color: "#6b7280",
    description: "Domain subclass of",
  },
  DOMAIN_ANCESTOR_OF_DOMAIN: {
    label: "Domain Ancestor",
    color: "#9ca3af",
    description: "Domain ancestor of",
  },
};
