import type { EntityType } from "../types/entity";

// =============================================================================
// Display-friendly names for EntityType values
// =============================================================================

export const ENTITY_TYPE_DISPLAY_NAMES: Record<EntityType, string> = {
  Gene: "Gene",
  Disease: "Disease",
  Drug: "Drug",
  Pathway: "Pathway",
  Variant: "Variant",
  Phenotype: "Phenotype",
  GOTerm: "GO Term",
  SideEffect: "Side Effect",
  cCRE: "cCRE",
  Metabolite: "Metabolite",
  Signal: "Signal",
  ProteinDomain: "Protein Domain",
  Tissue: "Tissue",
  CellType: "Cell Type",
};

/** Convert an EntityType to a human-readable display name. */
export function displayEntityType(type: EntityType): string {
  return ENTITY_TYPE_DISPLAY_NAMES[type] ?? type;
}

// =============================================================================
// Ontology ID formatting (underscore → colon)
// =============================================================================

const ONTOLOGY_PREFIXES = new Set([
  "MONDO",
  "HP",
  "EFO",
  "GO",
  "DOID",
  "UBERON",
  "CL",
  "CHEBI",
  "SO",
]);

/** Format ontology IDs: "MONDO_0005070" → "MONDO:0005070" */
export function formatNodeId(id: string): string {
  const idx = id.indexOf("_");
  if (idx === -1) return id;
  const prefix = id.substring(0, idx);
  if (ONTOLOGY_PREFIXES.has(prefix))
    return `${prefix}:${id.substring(idx + 1)}`;
  return id;
}
