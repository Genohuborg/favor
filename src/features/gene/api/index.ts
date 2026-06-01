import { fetchOrNull } from "@infra/api";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import type { Gene } from "../types";

// Re-export all graph API functions for backward compatibility
export {
  type CentralityResponse,
  type EntityRef,
  type EntitySearchResponse,
  type FetchIntersectionOptions,
  type FetchPathsOptions,
  type FetchSubgraphOptions,
  fetchCentrality,
  fetchGraphQuery,
  fetchGraphSchema,
  fetchGraphStats,
  fetchIntersection,
  fetchPaths,
  fetchSubgraph,
  type GraphQueryOptions,
  type GraphQueryResponse,
  type GraphQueryStep,
  type GraphSchemaResponse,
  type GraphStatsResponse,
  type IntersectResponse,
  type PathEdge,
  type PathNode,
  type PathResult,
  type PathsResponse,
  parseTypeId,
  type SearchResultEntity,
  type SharedNeighbor,
  type SubgraphApiResponse,
  type SubgraphEdge,
  searchEntities,
} from "@features/graph/api";

import { API_BASE } from "@/config/api";

/**
 * API response structure for gene queries
 */
export interface GeneApiResponse {
  data: Gene;
  meta?: {
    direction?: string;
    limitPerEdgeType?: number;
    edgeTypes?: string[] | string | null;
    nextCursorEdges?: Record<string, string> | null;
    summaryEdgeTypesUsed?: {
      agreements?: string[] | null;
      rollups?: string[] | null;
    } | null;
    warnings?: Array<Record<string, unknown>> | null;
    [key: string]: unknown;
  };
  included?: {
    agreements?: Record<string, unknown> | null;
    counts?: Record<string, unknown> | null;
    relations?: Record<string, unknown> | null;
    rollups?: Record<string, unknown> | null;
    [key: string]: unknown;
  } | null;
  relations?: Record<string, unknown> | null;
  edges?: unknown;
  counts?: Record<string, unknown> | null;
  rollups?: Record<string, unknown> | null;
  agreements?: Record<string, unknown> | null;
}

/**
 * Options for fetching gene data from the graph API
 */
export interface FetchGeneOptions {
  include?: string;
  edgeTypes?: string;
  direction?: string;
  limitPerEdgeType?: number;
  cursorEdges?: string;
  neighborMode?: string;
  sort?: string;
  filter?: string;
  agreementInclude?: string;
  agreementSort?: string;
  limitAgreements?: number;
  cursorAgreements?: string;
}

/** Ensembl gene IDs are `ENSG` followed by digits (optionally `.<version>`). */
const ENSEMBL_GENE_RE = /^ENSG\d+(\.\d+)?$/i;

interface ResolveResult {
  query: string;
  status: string;
  entity?: { type: string; id: string; label?: string };
}

interface ResolveResponse {
  data: { results: ResolveResult[] };
}

/** Strip a versioned Ensembl ID (`ENSG…\.20`) down to its stable form. */
function canonicalEnsemblId(ref: string): string {
  return ref.split(".")[0].toUpperCase();
}

/**
 * Cross-request cache for symbol→ENSG resolution. Symbol/Ensembl mappings are
 * stable in the gene database, so a long TTL is safe; sorted-key composition
 * means {TP53,BRCA1} and {BRCA1,TP53} hit the same entry.
 */
const resolveSymbolsCached = unstable_cache(
  async (sortedSymbols: string[]): Promise<Record<string, string>> => {
    const response = await fetch(`${API_BASE}/graph/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queries: sortedSymbols }),
    }).catch(() => null);
    if (!response?.ok) return {};
    const body = (await response
      .json()
      .catch(() => null)) as ResolveResponse | null;
    const out: Record<string, string> = {};
    for (const r of body?.data?.results ?? []) {
      if (r.status === "matched" && r.entity?.type === "Gene") {
        out[r.query] = r.entity.id;
      }
    }
    return out;
  },
  ["gene-resolve-symbols"],
  { revalidate: 86400 },
);

/**
 * Batch-resolve gene references (HGNC symbols or Ensembl IDs) to canonical
 * Ensembl gene IDs. Returns a Map keyed by the original input string. Inputs
 * that are already Ensembl IDs are short-circuited locally (no network call).
 * The remaining symbols are sent in a single POST to `/graph/resolve`.
 */
export async function resolveGeneIds(
  refs: readonly string[],
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const symbolSet = new Set<string>();

  for (const raw of refs) {
    if (!raw) continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;
    if (out.has(trimmed)) continue;
    if (ENSEMBL_GENE_RE.test(trimmed)) {
      out.set(trimmed, canonicalEnsemblId(trimmed));
    } else {
      symbolSet.add(trimmed);
    }
  }

  if (symbolSet.size === 0) return out;

  const sorted = [...symbolSet].sort();
  const resolved = await resolveSymbolsCached(sorted);
  for (const [symbol, ensemblId] of Object.entries(resolved)) {
    out.set(symbol, ensemblId);
  }
  return out;
}

/**
 * Resolve a single gene reference. Memoized per-render via React `cache()`
 * so multiple layouts/pages on the same render share a single roundtrip.
 */
export const resolveGeneId = cache(
  async (ref: string): Promise<string | null> => {
    if (!ref) return null;
    const trimmed = ref.trim();
    if (ENSEMBL_GENE_RE.test(trimmed)) return canonicalEnsemblId(trimmed);
    const map = await resolveGeneIds([trimmed]);
    return map.get(trimmed) ?? null;
  },
);

/**
 * Fetches gene data from the graph API. Accepts either an Ensembl gene ID
 * (e.g. `ENSG00000141510`) or an HGNC gene symbol (e.g. `TP53`).
 */
export async function fetchGene(
  id: string,
  options?: FetchGeneOptions,
): Promise<GeneApiResponse | null> {
  if (!id) return null;

  const ensemblId = await resolveGeneId(id);
  if (!ensemblId) return null;

  const params = new URLSearchParams();

  if (options?.include) params.set("include", options.include);
  if (options?.edgeTypes) params.set("edgeTypes", options.edgeTypes);
  if (options?.direction) params.set("direction", options.direction);
  if (options?.limitPerEdgeType)
    params.set("limitPerEdgeType", String(options.limitPerEdgeType));
  if (options?.cursorEdges) params.set("cursorEdges", options.cursorEdges);
  if (options?.neighborMode) params.set("neighborMode", options.neighborMode);
  if (options?.sort) params.set("sort", options.sort);
  if (options?.filter) params.set("filter", options.filter);
  if (options?.agreementInclude)
    params.set("agreementInclude", options.agreementInclude);
  if (options?.agreementSort)
    params.set("agreementSort", options.agreementSort);
  if (options?.limitAgreements)
    params.set("limitAgreements", String(options.limitAgreements));
  if (options?.cursorAgreements)
    params.set("cursorAgreements", options.cursorAgreements);

  const queryString = params.toString();
  const url = `${API_BASE}/graph/gene/${encodeURIComponent(ensemblId)}${queryString ? `?${queryString}` : ""}`;

  const response = await fetchOrNull<GeneApiResponse>(url);
  return response ?? null;
}

// =============================================================================
// Pathway Enrichment API
// =============================================================================

import { fetchSubgraph } from "@features/graph/api";

/**
 * Response structure for pathway enrichment data
 */
export interface PathwayEnrichmentResponse {
  geneCount: number;
  sharedGenes: Array<{ id: string; symbol: string }>;
  relatedDiseases: Array<{ id: string; name: string }>;
  parentPathway: { id: string; name: string } | null;
  childPathways: Array<{ id: string; name: string }>;
}

interface PathwayRelationRows {
  PATHWAY_PART_OF_PATHWAY?: {
    rows: Array<{
      neighbor: { id: string; name?: string; label?: string; type: string };
    }>;
  };
  GENE_PARTICIPATES_IN_PATHWAY?: {
    rows: Array<{
      neighbor: {
        id: string;
        name?: string;
        label?: string;
        symbol?: string;
        type: string;
      };
    }>;
  };
}

interface PathwayRelationsResponse {
  data: {
    pathway_id: string;
    pathway_name: string;
  };
  relations?: PathwayRelationRows;
  included?: {
    relations?: PathwayRelationRows;
  };
}

/** Extract relations from response (API returns at top-level or inside included) */
function getRelations(
  response: PathwayRelationsResponse | null,
): PathwayRelationRows | undefined {
  return response?.relations ?? response?.included?.relations;
}

export async function fetchPathwayEnrichment(
  pathwayId: string,
  seedGeneId: string,
): Promise<PathwayEnrichmentResponse | null> {
  try {
    const base = `${API_BASE}/graph/pathway/${encodeURIComponent(pathwayId)}`;
    const opts = { revalidate: 300 };
    const [parentData, childrenData, genesData] = await Promise.all([
      fetchOrNull<PathwayRelationsResponse>(
        `${base}?include=edges&edgeTypes=PATHWAY_PART_OF_PATHWAY&direction=out&limitPerEdgeType=5`,
        opts,
      ),
      fetchOrNull<PathwayRelationsResponse>(
        `${base}?include=edges&edgeTypes=PATHWAY_PART_OF_PATHWAY&direction=in&limitPerEdgeType=20`,
        opts,
      ),
      fetchOrNull<PathwayRelationsResponse>(
        `${base}?include=edges&edgeTypes=GENE_PARTICIPATES_IN_PATHWAY&direction=in&limitPerEdgeType=100`,
        opts,
      ),
    ]);

    const parentRelations = getRelations(parentData);
    const childRelations = getRelations(childrenData);
    const geneRelations = getRelations(genesData);

    // Extract parent: PATHWAY_PART_OF_PATHWAY direction=out means this pathway is
    // the child (source), neighbors are the parents. Filter out self-references.
    const parentRows = (
      parentRelations?.PATHWAY_PART_OF_PATHWAY?.rows ?? []
    ).filter((row) => row?.neighbor?.id && row.neighbor.id !== pathwayId);
    const firstParent = parentRows[0]?.neighbor;
    const parentPathway = firstParent
      ? {
          id: firstParent.id,
          name: firstParent.name ?? firstParent.label ?? firstParent.id,
        }
      : null;

    // Extract children: PATHWAY_PART_OF_PATHWAY direction=in means this pathway is
    // the parent (target), neighbors are the children. Filter out self-references.
    const childRows = (
      childRelations?.PATHWAY_PART_OF_PATHWAY?.rows ?? []
    ).filter((row) => row?.neighbor?.id && row.neighbor.id !== pathwayId);
    const childPathways = childRows.map((row) => ({
      id: row.neighbor.id,
      name: row.neighbor.name ?? row.neighbor.label ?? row.neighbor.id,
    }));

    const geneRows = geneRelations?.GENE_PARTICIPATES_IN_PATHWAY?.rows ?? [];
    const genes = geneRows.filter((row) => row?.neighbor?.type === "Gene");
    const geneCount = genes.length;

    const sharedGenes = genes
      .filter((g) => g.neighbor.id !== seedGeneId)
      .slice(0, 10)
      .map((g) => ({
        id: g.neighbor.id,
        symbol:
          g.neighbor.symbol ??
          g.neighbor.name ??
          g.neighbor.label ??
          g.neighbor.id,
      }));

    // Pathway→Gene→Disease requires depth 2 via GENE_PARTICIPATES_IN_PATHWAY + GENE_ASSOCIATED_WITH_DISEASE
    const subgraphResponse = await fetchSubgraph({
      seeds: [{ type: "Pathway", id: pathwayId }],
      maxDepth: 2,
      edgeTypes: [
        "GENE_PARTICIPATES_IN_PATHWAY",
        "GENE_ASSOCIATED_WITH_DISEASE",
      ],
      nodeLimit: 50,
      edgeLimit: 100,
      includeProps: false,
    });

    const diseaseNodes = subgraphResponse?.data?.graph?.nodes ?? [];
    const relatedDiseases = diseaseNodes
      .filter((n) => n.type === "Disease")
      .slice(0, 10)
      .map((d) => ({
        id: d.id,
        name: d.label,
      }));

    return {
      geneCount,
      sharedGenes,
      relatedDiseases,
      parentPathway,
      childPathways,
    };
  } catch (error) {
    console.error("Pathway enrichment fetch error:", error);
    return null;
  }
}

// =============================================================================
// Pathway Disease Enrichment API
// =============================================================================

export interface PathwayDiseaseAssociation {
  disease: { id: string; name: string };
  geneCount: number;
  genes: Array<{ id: string; symbol: string }>;
}

export interface PathwayDiseaseEnrichmentResponse {
  totalDiseases: number;
  diseases: PathwayDiseaseAssociation[];
}

export async function fetchPathwayDiseaseEnrichment(
  pathwayId: string,
): Promise<PathwayDiseaseEnrichmentResponse | null> {
  try {
    const subgraphResponse = await fetchSubgraph({
      seeds: [{ type: "Pathway", id: pathwayId }],
      maxDepth: 2,
      edgeTypes: [
        "GENE_PARTICIPATES_IN_PATHWAY",
        "GENE_ASSOCIATED_WITH_DISEASE",
      ],
      nodeLimit: 500,
      edgeLimit: 1000,
      includeProps: false,
    });

    if (!subgraphResponse?.data?.graph) {
      return null;
    }

    const edges = subgraphResponse.data.graph.edges;

    if (edges.length === 0) {
      console.warn(
        `fetchPathwayDiseaseEnrichment: no edges returned for ${pathwayId}`,
      );
      return { totalDiseases: 0, diseases: [] };
    }

    const pathwayGenes = new Set<string>();
    const geneMap = new Map<string, { id: string; symbol: string }>();

    let participatesInCount = 0;
    let participatesInMatchCount = 0;

    for (const edge of edges) {
      if (edge.type === "GENE_PARTICIPATES_IN_PATHWAY") {
        participatesInCount++;
        if (edge.to.id === pathwayId && edge.from.type === "Gene") {
          participatesInMatchCount++;
          pathwayGenes.add(edge.from.id);
          geneMap.set(edge.from.id, {
            id: edge.from.id,
            symbol: edge.from.label,
          });
        }
      }
    }

    if (participatesInCount > 0 && participatesInMatchCount === 0) {
      console.warn(
        `fetchPathwayDiseaseEnrichment: Found ${participatesInCount} PARTICIPATES_IN edges ` +
          `but none matched expected direction (Gene → Pathway with to.id === ${pathwayId}). ` +
          `Check if API returns edges in reverse direction.`,
      );
    }

    const diseaseToGenes = new Map<string, Set<string>>();
    const diseaseMap = new Map<string, { id: string; name: string }>();

    let implicatedInCount = 0;
    let implicatedInMatchCount = 0;

    for (const edge of edges) {
      if (edge.type === "GENE_ASSOCIATED_WITH_DISEASE") {
        implicatedInCount++;
        const geneId = edge.from.id;
        const diseaseNode = edge.to;

        if (pathwayGenes.has(geneId) && diseaseNode.type === "Disease") {
          implicatedInMatchCount++;
          if (!diseaseToGenes.has(diseaseNode.id)) {
            diseaseToGenes.set(diseaseNode.id, new Set());
            diseaseMap.set(diseaseNode.id, {
              id: diseaseNode.id,
              name: diseaseNode.label,
            });
          }
          diseaseToGenes.get(diseaseNode.id)?.add(geneId);
        }
      }
    }

    if (
      implicatedInCount > 0 &&
      implicatedInMatchCount === 0 &&
      pathwayGenes.size > 0
    ) {
      console.warn(
        `fetchPathwayDiseaseEnrichment: Found ${implicatedInCount} ASSOCIATED_WITH_DISEASE edges ` +
          `but none matched pathway genes. Check if API returns edges in reverse direction.`,
      );
    }

    const diseases: PathwayDiseaseAssociation[] = Array.from(
      diseaseToGenes.entries(),
    )
      .map(([diseaseId, geneIds]) => {
        const disease = diseaseMap.get(diseaseId)!;
        const genes = Array.from(geneIds)
          .slice(0, 10)
          .map(
            (geneId) => geneMap.get(geneId) ?? { id: geneId, symbol: geneId },
          );

        return {
          disease,
          geneCount: geneIds.size,
          genes,
        };
      })
      .sort((a, b) => b.geneCount - a.geneCount)
      .slice(0, 20);

    return {
      totalDiseases: diseaseToGenes.size,
      diseases,
    };
  } catch (error) {
    console.error("Pathway disease enrichment fetch error:", error);
    return null;
  }
}
