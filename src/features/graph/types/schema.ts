import type { EdgeType } from "./edge";
import type { EntityType } from "./entity";

// =============================================================================
// Fetch State (Generic Discriminated Union)
// =============================================================================

export type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; data: T }
  | { status: "error"; error: string };

export function idleState<T>(): FetchState<T> {
  return { status: "idle" };
}

export function loadingState<T>(): FetchState<T> {
  return { status: "loading" };
}

export function loadedState<T>(data: T): FetchState<T> {
  return { status: "loaded", data };
}

export function errorState<T>(error: string): FetchState<T> {
  return { status: "error", error };
}

// =============================================================================
// Graph Schema & Stats
// =============================================================================

export interface EdgeTypeStats {
  edgeType: EdgeType;
  label?: string;
  defaultScoreField?: string;
  scoreFields?: string[];
  filterFields?: string[];
  fromType?: EntityType;
  toType?: EntityType;
  description?: string;
  propertyCount?: number;
}

export interface NodeTypeStats {
  nodeType: EntityType;
  description?: string;
  summaryFields?: string[];
  propertyCount?: number;
  fieldsByCategory?: Record<string, string[]>;
}

export interface GraphSchema {
  nodeTypes: NodeTypeStats[];
  edgeTypes: EdgeTypeStats[];
  lastUpdated?: string;
}

/** Extract plain EntityType[] from the rich NodeTypeStats array. */
export function getNodeTypeNames(
  schema: GraphSchema | null | undefined,
): EntityType[] {
  if (!schema?.nodeTypes) return [];
  return schema.nodeTypes.map((nt) => nt.nodeType);
}

export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  nodeCounts: Record<EntityType, number>;
  edgeCounts: Record<EdgeType, number>;
}
