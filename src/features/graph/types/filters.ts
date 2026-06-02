import type { EdgeType } from "./edge";
import { EDGE_TYPE_CONFIG } from "./edge";
import type { ExplorerSelection } from "./node";
import { DEFAULT_SELECTION } from "./node";

// =============================================================================
// Graph Filters
// =============================================================================

export interface GraphFilters {
  edgeTypes: Set<EdgeType>;
  minSources: number;
  minExperiments: number;
  maxDepth: number;
  showOrphans: boolean;
  /** Per-edge-type filters keyed by edge type, then filter field name → threshold value */
  edgeTypeFilters: Record<string, Record<string, unknown>>;
  /** Score threshold for edge filtering (e.g. ot_score >= 0.5) */
  scoreThreshold: number | null;
  /** The field name to apply scoreThreshold against (e.g. "ot_score") */
  scoreField: string | null;
}

export const DEFAULT_FILTERS: GraphFilters = {
  edgeTypes: new Set(Object.keys(EDGE_TYPE_CONFIG) as EdgeType[]),
  minSources: 0,
  minExperiments: 0,
  maxDepth: 4,
  showOrphans: true,
  edgeTypeFilters: {},
  scoreThreshold: null,
  scoreField: null,
};

export { DEFAULT_SELECTION };
export type { ExplorerSelection };
