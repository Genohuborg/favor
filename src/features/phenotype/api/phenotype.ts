import { API_BASE } from "@/config/api";
import type { PhenotypeEntityResponse } from "../types";

/** Edge types to fetch for the phenotype detail page */
const PHENOTYPE_EDGE_TYPES = [
  "GENE_ASSOCIATED_WITH_PHENOTYPE",
  "DISEASE_HAS_PHENOTYPE",
  "PHENOTYPE_HIERARCHY",
  "PHENOTYPE_EQUIVALENT_TO",
];

/**
 * Fetch a phenotype entity from the knowledge graph with edge data and counts.
 */
export async function fetchPhenotypeEntity(
  phenotypeId: string,
): Promise<PhenotypeEntityResponse | null> {
  if (!phenotypeId) return null;

  const params = new URLSearchParams({
    mode: "full",
    include: "edges,counts",
    edgeTypes: PHENOTYPE_EDGE_TYPES.join(","),
    limitPerEdgeType: "200",
  });

  try {
    const response = await fetch(
      `${API_BASE}/graph/Phenotype/${encodeURIComponent(phenotypeId)}?${params}`,
      { next: { revalidate: 300 } },
    );

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
