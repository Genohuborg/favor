import { fetchGene, fetchSubgraph } from "@features/gene/api";
import {
  type PathwayHierarchyEdge,
  PathwayLeverageView,
  parsePathwayFromNode,
} from "@features/gene/components/pathway-map";
import { fetchPreview } from "@features/graph/api";
import { notFound } from "next/navigation";

interface PathwayLeverageMapPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PathwayLeverageMapPage({
  params,
}: PathwayLeverageMapPageProps) {
  const { id } = await params;

  // Fetch gene data
  const geneResponse = await fetchGene(id);
  const gene = geneResponse?.data;

  if (!gene) {
    notFound();
  }

  const geneId = gene.gene_id_versioned?.split(".")[0] || id;
  const geneSymbol = gene.gene_symbol ?? geneId;

  // Get pathways from graph edges (single source of truth)
  // maxDepth: 3 for deeper hierarchy, increased limits for richer visualization
  const subgraphResponse = await fetchSubgraph({
    seeds: [{ type: "Gene", id: geneId }],
    maxDepth: 3,
    edgeTypes: ["GENE_PARTICIPATES_IN_PATHWAY", "PATHWAY_PART_OF_PATHWAY"],
    nodeLimit: 300,
    edgeLimit: 600,
    includeProps: true,
  });

  const nodes = subgraphResponse?.data?.graph?.nodes ?? [];
  const edges = subgraphResponse?.data?.graph?.edges ?? [];

  // Extract pathways from PARTICIPATES_IN edges (Gene → Pathway)
  const participatingPathwayIds = new Set<string>();

  for (const edge of edges) {
    if (
      edge.type === "GENE_PARTICIPATES_IN_PATHWAY" &&
      edge.from.id === geneId
    ) {
      participatingPathwayIds.add(edge.to.id);
    }
  }

  // Batch-fetch category and source fields for participating pathways
  const pathwayNodes = nodes.filter(
    (n) => n.type === "Pathway" && participatingPathwayIds.has(n.id),
  );
  const previewResponse = await fetchPreview(
    pathwayNodes.map((n) => ({ type: "Pathway", id: n.id })),
    ["category", "source"],
  );

  // Build lookup: pathway id -> { category, source }
  const pathwayFields = new Map<
    string,
    { category?: string; source?: string }
  >();
  for (const item of previewResponse?.data?.items ?? []) {
    pathwayFields.set(item.entity.id, {
      category: item.fields?.category as string | undefined,
      source: item.fields?.source as string | undefined,
    });
  }

  // Build pathway nodes with API-provided category and source
  const pathways = pathwayNodes.map((n) =>
    parsePathwayFromNode(n, undefined, pathwayFields.get(n.id)),
  );

  // Extract hierarchy edges from PART_OF relationships
  const hierarchyEdges: PathwayHierarchyEdge[] = edges
    .filter((e) => e.type === "PATHWAY_PART_OF_PATHWAY")
    .map((e) => ({
      childId: e.from.id,
      parentId: e.to.id,
    }));

  return (
    <PathwayLeverageView
      seedGeneId={geneId}
      seedGeneSymbol={geneSymbol}
      pathways={pathways}
      hierarchyEdges={hierarchyEdges}
    />
  );
}
