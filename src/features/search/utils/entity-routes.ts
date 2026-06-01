import type { EntityType } from "../types/api";

/**
 * Generate URL for an entity based on its type and ID
 */
export function getEntityUrl(
  type: EntityType,
  id: string,
  options?: {
    genome?: "hg38" | "hg19";
    category?: string;
    subcategory?: string;
  },
): string {
  const { genome = "hg38", category, subcategory } = options || {};

  switch (type) {
    case "genes": {
      // Gene pages: /hg38/gene/[ensembl_id]/[category]/[subcategory]
      const geneCategory = category || "gene-level-annotation";
      const geneSubcategory = subcategory || "llm-summary";
      return `/${genome}/gene/${id}/${geneCategory}/${geneSubcategory}`;
    }

    case "variants": {
      // Variant pages: /hg38/variant/[vcf]/[category]/[subcategory]
      const variantCategory = category || "global-annotation";
      const variantSubcategory = subcategory || "llm-summary";
      return `/${genome}/variant/${id}/${variantCategory}/${variantSubcategory}`;
    }

    case "diseases":
      return `/disease/${id}`;

    case "drugs":
      return `/drug/${id}`;

    case "pathways":
      return `/pathway/${id}`;

    case "phenotypes":
      return `/phenotype/${id}`;

    case "go_terms":
      return `/go-term/${id}`;

    case "side_effects":
      return `/side-effect/${id}`;

    case "ccre":
      return `/ccre/${id}`;

    case "metabolites":
      return `/metabolite/${id}`;

    case "signals":
      return `/signal/${id}`;

    case "protein_domains":
      return `/protein-domain/${id}`;

    case "tissues":
      return `/tissue/${id}`;

    case "cell_types":
      return `/cell-type/${id}`;

    default:
      return "/";
  }
}

/** Entity types that have dedicated detail pages */
export const ENTITY_TYPES_WITH_PAGES: EntityType[] = [
  "variants",
  "genes",
  "diseases",
  "drugs",
  "phenotypes",
  "ccre",
];

/**
 * Check if an entity type has a dedicated page
 */
export function hasEntityPage(type: EntityType): boolean {
  return (ENTITY_TYPES_WITH_PAGES as string[]).includes(type);
}

/**
 * Get entity type label (singular or plural)
 */
export function getEntityLabel(type: EntityType, singular = false): string {
  const labels: Record<EntityType, { singular: string; plural: string }> = {
    genes: { singular: "Gene", plural: "Genes" },
    variants: { singular: "Variant", plural: "Variants" },
    diseases: { singular: "Disease", plural: "Diseases" },
    drugs: { singular: "Drug", plural: "Drugs" },
    pathways: { singular: "Pathway", plural: "Pathways" },
    phenotypes: { singular: "Phenotype", plural: "Phenotypes" },
    studies: { singular: "Study", plural: "Studies" },
    entities: { singular: "Entity", plural: "Entities" },
    go_terms: { singular: "GO Term", plural: "GO Terms" },
    side_effects: { singular: "Side Effect", plural: "Side Effects" },
    ccre: { singular: "cCRE", plural: "cCREs" },
    metabolites: { singular: "Metabolite", plural: "Metabolites" },
    signals: { singular: "Signal", plural: "Signals" },
    protein_domains: { singular: "Domain", plural: "Domains" },
    tissues: { singular: "Tissue", plural: "Tissues" },
    cell_types: { singular: "Cell Type", plural: "Cell Types" },
  };

  return singular ? labels[type].singular : labels[type].plural;
}
