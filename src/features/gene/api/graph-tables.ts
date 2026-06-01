import { fetchGraphQuery, parseTypeId } from "@features/graph/api";

// =============================================================================
// Gene edge-table fetch helper
// =============================================================================
//
// Single-step Gene -> X graph queries rendered as curated tables.
// Parses the keyed-node / edge-array response into flat typed rows at the
// boundary so view components stay presentational.
//
// Direction is "out" | "in" only — /graph/query rejects "both" (HTTP 422).
// Select fields must be explicit — ["*"] returns empty.

export interface GeneEdgeRow {
  /** Target node type, e.g. "Gene", "Drug", "Disease". */
  targetType: string;
  /** Target node id without the type prefix, e.g. "ENSG…", "CHEMBL…". */
  targetId: string;
  /** Human label for the target node. */
  targetLabel: string;
  /** Edge property values requested via edgeFields. */
  edge: Record<string, unknown>;
  /** Target node property values requested via nodeFields. */
  node: Record<string, unknown>;
}

export interface GeneEdgeRowsOptions {
  direction?: "out" | "in";
  edgeFields?: string[];
  nodeFields?: string[];
  limit?: number;
  /** Edge field to rank rows by, descending. Non-numeric values sort last. */
  sortByEdgeField?: string;
}

function numeric(value: unknown): number {
  return typeof value === "number" && !Number.isNaN(value)
    ? value
    : Number.NEGATIVE_INFINITY;
}

/**
 * Fetch the targets of a single Gene -> X edge type as flat rows.
 * Returns [] on error or empty result (callers render an empty state).
 */
export async function fetchGeneEdgeRows(
  geneId: string,
  edgeType: string,
  options: GeneEdgeRowsOptions = {},
): Promise<GeneEdgeRow[]> {
  const {
    direction = "out",
    edgeFields = [],
    nodeFields = [],
    limit = 100,
    sortByEdgeField,
  } = options;

  const response = await fetchGraphQuery({
    seeds: [{ type: "Gene", id: geneId }],
    steps: [{ edgeTypes: [edgeType], direction, limit }],
    select: { nodeFields, edgeFields },
    limits: { maxNodes: limit + 1, maxEdges: limit * 2 },
  });

  if (!response?.data) return [];

  const { nodes, edges } = response.data;
  const rows: GeneEdgeRow[] = [];

  for (const edge of edges) {
    // For "out" the target is edge.to; for "in" it is edge.from.
    const targetKey = direction === "in" ? edge.from : edge.to;
    const node = nodes[targetKey];
    const { type, id } = parseTypeId(targetKey);

    rows.push({
      targetType: node?.entity?.type ?? type,
      targetId: node?.entity?.id ?? id,
      targetLabel: node?.entity?.label ?? id,
      edge: edge.fields ?? {},
      node: node?.fields ?? {},
    });
  }

  if (sortByEdgeField) {
    rows.sort(
      (a, b) =>
        numeric(b.edge[sortByEdgeField]) - numeric(a.edge[sortByEdgeField]),
    );
  }

  return rows;
}
