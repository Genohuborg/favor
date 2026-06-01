import { API_BASE } from "@/config/api";
import type { DiseaseEntityResponse } from "../types";

/** Edge types to fetch for the disease detail page */
const DISEASE_EDGE_TYPES = [
  "GENE_ASSOCIATED_WITH_DISEASE",
  "DRUG_INDICATED_FOR_DISEASE",
  "VARIANT_ASSOCIATED_WITH_TRAIT",
  "DISEASE_HAS_PHENOTYPE",
  "DISEASE_SUBCLASS_OF_DISEASE",
];

/**
 * Fetch a disease entity from the knowledge graph with edge data and counts.
 * Uses the graph entity endpoint for richer data than the legacy /diseases/ endpoint.
 */
export async function fetchDiseaseEntity(
  diseaseId: string,
): Promise<DiseaseEntityResponse | null> {
  if (!diseaseId) return null;

  const params = new URLSearchParams({
    mode: "full",
    include: "edges,counts",
    edgeTypes: DISEASE_EDGE_TYPES.join(","),
    limitPerEdgeType: "200",
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(
      `${API_BASE}/graph/Disease/${encodeURIComponent(diseaseId)}?${params}`,
      { signal: controller.signal, next: { revalidate: 300 } },
    );

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
