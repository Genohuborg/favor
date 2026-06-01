import { API_BASE } from "@/config/api";

// =============================================================================
// Entity Reference
// =============================================================================

export interface EntityRef {
  type: string;
  id: string;
  label: string;
  subtitle?: string;
}

// =============================================================================
// Subgraph API
// =============================================================================

export interface SubgraphEdge {
  type: string;
  direction: "out" | "in";
  from: EntityRef;
  to: EntityRef;
  props?: {
    src_symbol?: string;
    dst_symbol?: string;
    sources?: string[];
    num_sources?: number;
    num_experiments?: number;
    confidence_scores?: number[];
    pubmed_ids?: string[];
    pmids?: string[];
    detection_methods?: string[];
    interaction_type?: string;
    [key: string]: unknown;
  };
  evidence?: {
    pubmedIds?: string[];
    sources?: string[];
  };
}

export interface SubgraphApiResponse {
  meta: {
    requestId: string;
    generatedAt: string;
    warnings: string[];
  };
  data: {
    seeds: EntityRef[];
    graph: {
      nodes: EntityRef[];
      edges: SubgraphEdge[];
    };
    summary: {
      nodeCounts: Record<string, number>;
      edgeCounts: Record<string, number>;
      depthReached: number;
    };
  };
}

export interface FetchSubgraphOptions {
  seeds: Array<{ type: string; id: string }>;
  maxDepth?: number;
  edgeTypes?: string[];
  nodeLimit?: number;
  edgeLimit?: number;
  includeProps?: boolean;
}

export async function fetchSubgraph(
  options: FetchSubgraphOptions,
): Promise<SubgraphApiResponse | null> {
  const url = `${API_BASE}/graph/subgraph`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seeds: options.seeds,
        maxDepth: options.maxDepth ?? 1,
        edgeTypes: options.edgeTypes,
        nodeLimit: options.nodeLimit ?? 100,
        edgeLimit: options.edgeLimit ?? 200,
        includeProps: options.includeProps ?? false,
      }),
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`Subgraph fetch failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Subgraph fetch error:", error);
    return null;
  }
}

// =============================================================================
// Entities Preview API
// =============================================================================

export interface PreviewItem {
  entity: EntityRef;
  fields?: Record<string, unknown>;
}

export interface PreviewApiResponse {
  data: {
    items: PreviewItem[];
    counts: { requested: number; found: number };
  };
}

export async function fetchPreview(
  ids: Array<{ type: string; id: string }>,
  fields?: string[],
): Promise<PreviewApiResponse | null> {
  const url = `${API_BASE}/entities/preview`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids,
        fields: fields?.slice(0, 20),
      }),
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`Preview fetch failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Preview fetch error:", error);
    return null;
  }
}

// =============================================================================
// Graph Query API
// =============================================================================

export interface GraphQueryStep {
  edgeTypes: string[];
  direction: "in" | "out" | "both";
  limit?: number;
  sort?: string;
  filters?: Record<string, unknown>;
  overlayOnly?: boolean;
}

export interface GraphQueryBranchStep {
  branch: GraphQueryStep[];
}

export type GraphQueryStepOrBranch = GraphQueryStep | GraphQueryBranchStep;

export interface GraphQueryOptions {
  seeds: Array<{ type: string; id: string }>;
  steps: GraphQueryStepOrBranch[];
  select?: {
    nodeFields?: string[];
    edgeFields?: string[];
    includeEvidence?: boolean;
  };
  limits?: {
    maxNodes?: number;
    maxEdges?: number;
  };
}

export interface GraphQueryResponse {
  meta: {
    requestId: string;
    generatedAt: string;
    warnings: string[];
    cost?: {
      nodesResolved: number;
      edgesReturned: number;
      queriesExecuted: number;
    };
  };
  data: {
    nodes: Record<
      string,
      {
        entity: EntityRef;
        fields?: Record<string, unknown>;
      }
    >;
    edges: Array<{
      type: string;
      direction: string;
      from: string;
      to: string;
      fields?: Record<string, unknown>;
      evidence?: unknown;
    }>;
    steps: Array<{
      stepIndex: number;
      edgeTypes: string[];
      direction: string;
      resultType: string;
      count: number;
    }>;
  };
}

export function parseTypeId(typeId: string): { type: string; id: string } {
  const colonIdx = typeId.indexOf(":");
  if (colonIdx === -1) return { type: "", id: typeId };
  return {
    type: typeId.substring(0, colonIdx),
    id: typeId.substring(colonIdx + 1),
  };
}

export async function fetchGraphQuery(
  options: GraphQueryOptions,
): Promise<GraphQueryResponse | null> {
  const url = `${API_BASE}/graph/query`;

  try {
    const body = {
      seeds: options.seeds,
      steps: options.steps,
      select: options.select,
      limits: options.limits ?? { maxNodes: 200, maxEdges: 500 },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      let detail = "";
      try {
        detail = await response.text();
      } catch {
        /* ignore */
      }
      console.error(`Graph query failed: ${response.status}`, detail);
      console.error("Request body:", JSON.stringify(body, null, 2));
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Graph query error:", error);
    return null;
  }
}

// =============================================================================
// Centrality API
// =============================================================================

export interface CentralityResponse {
  data: {
    entity: { type: string; id: string; label: string };
    degree: { in: number; out: number; total: number };
    percentile: { in: number; out: number; total: number };
    hubScore: number;
  };
}

export async function fetchCentrality(
  type: string,
  id: string,
): Promise<CentralityResponse | null> {
  const url = `${API_BASE}/graph/${encodeURIComponent(type)}/${encodeURIComponent(id)}/centrality`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      console.error(`Centrality fetch failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Centrality fetch error:", error);
    return null;
  }
}

// =============================================================================
// Paths API
// =============================================================================

export interface PathNode {
  type: string;
  id: string;
  label: string;
}

export interface PathEdge {
  type: string;
  from: PathNode;
  to: PathNode;
}

export interface PathResult {
  rank: number;
  length: number;
  pathText: string;
  nodes: PathNode[];
  edges: PathEdge[];
}

export interface PathsResponse {
  data: {
    from: PathNode;
    to: PathNode;
    paths: PathResult[];
  };
}

export interface FetchPathsOptions {
  maxHops?: number;
  limit?: number;
  edgeTypes?: string[];
}

export async function fetchPaths(
  from: string,
  to: string,
  options?: FetchPathsOptions,
): Promise<PathsResponse | null> {
  const params = new URLSearchParams();
  params.set("from", from);
  params.set("to", to);

  if (options?.maxHops) params.set("maxHops", String(options.maxHops));
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.edgeTypes?.length) {
    params.set("edgeTypes", options.edgeTypes.join(","));
  }

  const url = `${API_BASE}/graph/paths?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      const body = await response.text().catch(() => "");
      console.error(`Paths fetch failed: ${response.status}`, body);
      return null;
    }

    const raw = await response.json();
    return parsePathsResponse(raw);
  } catch (error) {
    console.error("Paths fetch error:", error);
    return null;
  }
}

/**
 * The paths API returns a compact format:
 *   nodes: { "Gene:ID": ["Gene","ID","LABEL","subtitle"], ... }
 *   paths[].nodes: ["Gene:ID", ...]
 *   paths[].edges: [["EDGE_TYPE","direction"], ...]
 *
 * Parse into the typed PathResult/PathNode/PathEdge objects.
 */
function parsePathsResponse(raw: Record<string, unknown>): PathsResponse {
  const data = raw.data as Record<string, unknown>;
  const nodeColumns = (data.nodeColumns ?? []) as string[];
  const nodeLookup = (data.nodes ?? {}) as Record<string, unknown[]>;

  const resolveNode = (key: string): PathNode => {
    const row = nodeLookup[key];
    if (row && nodeColumns.length > 0) {
      const typeIdx = nodeColumns.indexOf("type");
      const idIdx = nodeColumns.indexOf("id");
      const labelIdx = nodeColumns.indexOf("label");
      return {
        type: String(row[typeIdx] ?? ""),
        id: String(row[idIdx] ?? key),
        label: String(row[labelIdx] ?? key),
      };
    }
    // Fallback: parse "Type:ID" key
    const [type, ...rest] = key.split(":");
    return { type, id: rest.join(":") || key, label: rest.join(":") || key };
  };

  const rawPaths = (data.paths ?? []) as Array<Record<string, unknown>>;

  const paths: PathResult[] = rawPaths.map((p, i) => {
    const nodeKeys = (p.nodes ?? []) as string[];
    const edgeTuples = (p.edges ?? []) as unknown[][];
    const nodes = nodeKeys.map(resolveNode);

    const edges: PathEdge[] = edgeTuples.map((tuple, ei) => ({
      type: String(tuple[0] ?? ""),
      from: nodes[ei] ?? resolveNode(nodeKeys[ei] ?? ""),
      to: nodes[ei + 1] ?? resolveNode(nodeKeys[ei + 1] ?? ""),
    }));

    return {
      rank: i + 1,
      length: edgeTuples.length,
      pathText: String(p.text ?? ""),
      nodes,
      edges,
    };
  });

  const fromKey = String(data.from ?? "");
  const toKey = String(data.to ?? "");

  return {
    data: {
      from: resolveNode(fromKey),
      to: resolveNode(toKey),
      paths,
    },
  };
}

// =============================================================================
// Intersection API
// =============================================================================

export interface SharedNeighbor {
  neighbor: { type: string; id: string; label: string };
  support: Array<{
    from: { type: string; id: string; label: string };
    edge: { type: string };
  }>;
}

export interface IntersectResponse {
  data: {
    inputs: Array<{ type: string; id: string; label: string }>;
    neighborType: string;
    sharedNeighbors: SharedNeighbor[];
    counts: { shared: number; limit: number };
  };
}

export interface FetchIntersectionOptions {
  direction?: "in" | "out";
  limit?: number;
}

export async function fetchIntersection(
  entities: Array<{ type: string; id: string }>,
  edgeType: string,
  options?: FetchIntersectionOptions,
): Promise<IntersectResponse | null> {
  const url = `${API_BASE}/graph/intersect`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entities,
        edgeType,
        direction: options?.direction ?? "out",
        limit: options?.limit ?? 50,
      }),
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`Intersection fetch failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Intersection fetch error:", error);
    return null;
  }
}

// =============================================================================
// Graph Schema API
// =============================================================================

export interface GraphSchemaResponse {
  data: {
    nodeTypes: Array<
      | string
      | {
          nodeType: string;
          description?: string;
          summaryFields?: string[];
          propertyCount?: number;
          fieldsByCategory?: Record<string, string[]>;
        }
    >;
    edgeTypes: Array<{
      edgeType: string;
      fromType?: string;
      toType?: string;
      label?: string;
      defaultScoreField?: string;
      scoreFields?: string[];
      filterFields?: string[];
      description?: string;
      propertyCount?: number;
    }>;
    lastUpdated?: string;
  };
}

// =============================================================================
// Schema Properties API
// =============================================================================

export interface SchemaPropertyMeta {
  name: string;
  dataType: string;
  category: string;
  filterable?: boolean;
  sortable?: boolean;
  heavy?: boolean;
  // YAML-enriched metadata (present when YAML metadata exists for the field)
  label?: string;
  description?: string;
  fillRate?: number;
  range?: [number, number];
  better?: "higher" | "lower";
  unit?: string;
  thresholds?: Record<string, string>;
  values?: string[];
  // Display hints (driven by YAML → schema → API)
  hidden?: boolean;
  displayOrder?: number;
  displayFormat?: "text" | "number" | "score" | "phase";
  tooltip?: boolean;
}

export interface SchemaPropertiesResponse {
  data: {
    typeName: string;
    kind: "node" | "edge";
    propertyCount: number;
    properties: SchemaPropertyMeta[];
  };
}

export async function fetchSchemaProperties(
  typeName: string,
): Promise<SchemaPropertiesResponse | null> {
  const url = `${API_BASE}/graph/schema/properties/${encodeURIComponent(typeName)}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      console.error(`Schema properties fetch failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Schema properties fetch error:", error);
    return null;
  }
}

export async function fetchGraphSchema(): Promise<GraphSchemaResponse | null> {
  const url = `${API_BASE}/graph/schema`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      console.error(`Graph schema fetch failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Graph schema fetch error:", error);
    return null;
  }
}

// =============================================================================
// Graph Stats API
// =============================================================================

export interface GraphStatsResponse {
  data: {
    totalNodes: number;
    totalEdges: number;
    nodeCounts: Record<string, number>;
    edgeCounts: Record<string, number>;
  };
}

export async function fetchGraphStats(): Promise<GraphStatsResponse | null> {
  const url = `${API_BASE}/graph/stats`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      console.error(`Graph stats fetch failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Graph stats fetch error:", error);
    return null;
  }
}

// =============================================================================
// Entity Search API
// =============================================================================

export interface SearchResultEntity {
  type: string;
  id: string;
  label: string;
  score: number;
}

export interface EntitySearchResponse {
  data: {
    results: SearchResultEntity[];
    totalCount: number;
  };
}

export async function searchEntities(
  query: string,
  types?: string[],
  limit: number = 20,
): Promise<EntitySearchResponse | null> {
  const params = new URLSearchParams();
  params.set("q", query);
  params.set("limit", String(limit));
  if (types?.length) {
    params.set("types", types.join(","));
  }

  const url = `${API_BASE}/graph/search?${params.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`Entity search failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Entity search error:", error);
    return null;
  }
}

// =============================================================================
// Connections API (client-side only, no caching)
// =============================================================================

export interface ConnectionsEdgeItem {
  /** Present on /graph/query edges; on /graph/connections comes from the group's edgeType */
  type?: string;
  /** Present on /graph/query edges; on /graph/connections comes from data.from */
  from?: { type: string; id: string; label: string };
  /** Present on /graph/query edges; on /graph/connections comes from data.to */
  to?: { type: string; id: string; label: string };
  /** /graph/query nests data here; /graph/connections puts props at top level */
  fields?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Keys that are structural (not user-data) on a ConnectionsEdgeItem */
const STRUCTURAL_KEYS = new Set([
  "type",
  "from",
  "to",
  "direction",
  "fields",
  "evidence",
  "props",
]);

/**
 * Normalise edge fields from any of the API response formats:
 *  - `/graph/query`       → data in `item.fields`
 *  - `/graph/connections`  → data in `item.props`  (+ `item.evidence`)
 *  - `/graph/edge`         → data in `item.props`  (+ `item.evidence`)
 *  - some endpoints        → data at top level (fallback)
 */
export function extractEdgeFields(
  item: ConnectionsEdgeItem,
): Record<string, unknown> {
  // Prefer explicit `fields` sub-object (graph/query format)
  if (item.fields && Object.keys(item.fields).length > 0) return item.fields;
  // Then try `props` sub-object (connections/edge format)
  const props = item.props as Record<string, unknown> | undefined;
  if (props && typeof props === "object" && Object.keys(props).length > 0)
    return props;
  // Fallback: collect top-level non-structural keys
  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(item)) {
    if (!STRUCTURAL_KEYS.has(k) && v !== null && v !== undefined) fields[k] = v;
  }
  return Object.keys(fields).length > 0 ? fields : (item.fields ?? {});
}

export interface ConnectionsApiResponse {
  data: {
    from: EntityRef;
    to: EntityRef;
    connections: Array<{
      edgeType: string;
      direction: "out" | "in";
      label?: string;
      count: number;
      edges: ConnectionsEdgeItem[];
      hasMore?: boolean;
    }>;
    summary?: { totalEdgeTypes: number; totalEdges: number };
  };
  fieldMeta?: Record<string, SchemaPropertyMeta[]>;
}

export async function fetchConnections(options: {
  from: { type: string; id: string };
  to: { type: string; id: string };
  limitPerType?: number;
  includeReverse?: boolean;
  signal?: AbortSignal;
}): Promise<ConnectionsApiResponse | null> {
  const url = `${API_BASE}/graph/connections`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        from: options.from,
        to: options.to,
        limitPerType: options.limitPerType ?? 10,
        includeReverse: options.includeReverse ?? true,
        includeFieldMeta: true,
      }),
      signal: options.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`Connections fetch failed: ${response.status}`, body);
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      return null;
    console.error("Connections fetch error:", error);
    return null;
  }
}

// =============================================================================
// Edge Page API (cursor-based pagination, client-side only)
// =============================================================================

export interface EdgePageApiResponse {
  data: {
    from: EntityRef;
    to: EntityRef;
    edgeType: string;
    edges: ConnectionsEdgeItem[];
    count: number;
    hasMore?: boolean;
    nextCursor?: string;
  };
  fieldMeta?: Record<string, SchemaPropertyMeta[]>;
}

export async function fetchEdgePage(options: {
  from: string;
  to: string;
  edgeType: string;
  limit?: number;
  cursor?: string;
  signal?: AbortSignal;
}): Promise<EdgePageApiResponse | null> {
  const params = new URLSearchParams();
  params.set("from", options.from);
  params.set("to", options.to);
  params.set("edge_type", options.edgeType);
  params.set("limit", String(options.limit ?? 25));
  params.set("includeFieldMeta", "true");
  if (options.cursor) params.set("cursor", options.cursor);

  const url = `${API_BASE}/graph/edge?${params.toString()}`;

  try {
    const response = await fetch(url, {
      credentials: "include",
      signal: options.signal,
    });

    if (!response.ok) {
      console.error(`Edge page fetch failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      return null;
    console.error("Edge page fetch error:", error);
    return null;
  }
}
