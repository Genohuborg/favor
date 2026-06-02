import type { EdgeType } from "../types/edge";
import type { EdgeTypeStats, GraphSchema } from "../types/schema";

// =============================================================================
// Schema Map — O(1) lookup by edge type
// =============================================================================

export type EdgeTypeStatsMap = Map<EdgeType, EdgeTypeStats>;

/**
 * Build an O(1) lookup map from the schema's edgeTypes array.
 * Returns an empty map if schema is null/undefined.
 */
export function buildEdgeTypeStatsMap(
  schema: GraphSchema | null | undefined,
): EdgeTypeStatsMap {
  const map = new Map<EdgeType, EdgeTypeStats>();
  if (!schema?.edgeTypes) return map;
  for (const stats of schema.edgeTypes) {
    map.set(stats.edgeType, stats);
  }
  return map;
}

// =============================================================================
// Sort Field Resolution
// =============================================================================

/**
 * Resolve the sort field for an edge type using the schema's `defaultScoreField`.
 * Returns a sort string like `"-ot_score"` or `undefined` if none.
 * The backend gracefully skips sort when undefined.
 */
export function resolveSortField(
  edgeType: EdgeType,
  schemaMap: EdgeTypeStatsMap,
  fallbackSort?: string,
): string | undefined {
  const stats = schemaMap.get(edgeType);
  if (stats?.defaultScoreField) {
    return `-${stats.defaultScoreField}`;
  }
  return fallbackSort;
}

// =============================================================================
// Score & Filter Field Resolution
// =============================================================================

/**
 * Returns the schema's `scoreFields` for an edge type, or an empty array.
 * Used by the inspector panel to order fields by importance.
 */
export function resolveScoreFields(
  edgeType: EdgeType,
  schemaMap: EdgeTypeStatsMap,
): string[] {
  return schemaMap.get(edgeType)?.scoreFields ?? [];
}

/**
 * Returns the schema's `filterFields` for an edge type, or an empty array.
 * Used by the controls drawer for per-edge-type filter UI.
 */
export function resolveFilterFields(
  edgeType: EdgeType,
  schemaMap: EdgeTypeStatsMap,
): string[] {
  return schemaMap.get(edgeType)?.filterFields ?? [];
}

// =============================================================================
// Edge Select Fields Resolution
// =============================================================================

/**
 * Compute the union of score + filter fields across multiple edge types,
 * capped at 20 (API limit). Returns minimal fallback when schema is empty.
 */
export function resolveEdgeSelectFields(
  edgeTypes: EdgeType[],
  schemaMap: EdgeTypeStatsMap,
): string[] {
  // If schema is empty, return minimal fallback
  if (schemaMap.size === 0) {
    return ["source"];
  }

  const fieldSet = new Set<string>();

  for (const et of edgeTypes) {
    const stats = schemaMap.get(et);
    if (stats) {
      for (const f of stats.scoreFields ?? []) fieldSet.add(f);
      for (const f of stats.filterFields ?? []) fieldSet.add(f);
    }
  }

  // Always include "source" for provenance display
  fieldSet.add("source");

  return Array.from(fieldSet).slice(0, 20);
}

// =============================================================================
// Collect All Edge Types from Template Steps
// =============================================================================

interface StepLike {
  edgeTypes?: EdgeType[] | string[];
  branch?: StepLike[];
}

/**
 * Extract all unique edge types from a list of template steps.
 * Handles both flat steps and branch steps.
 */
export function collectEdgeTypesFromSteps(steps: StepLike[]): EdgeType[] {
  const types = new Set<EdgeType>();
  for (const step of steps) {
    if (step.branch) {
      for (const sub of step.branch) {
        for (const et of (sub.edgeTypes ?? []) as EdgeType[]) types.add(et);
      }
    } else {
      for (const et of (step.edgeTypes ?? []) as EdgeType[]) types.add(et);
    }
  }
  return Array.from(types);
}

/**
 * Inject schema-driven sort fields into template steps.
 * Mutates nothing — returns new step objects.
 * Only adds `sort` when a valid sort string is resolved; never sets `sort: undefined`.
 */
export function injectSortFields<
  T extends
    | { edgeTypes: (EdgeType | string)[]; sort?: string; branch?: undefined }
    | { branch: Array<{ edgeTypes: (EdgeType | string)[]; sort?: string }> },
>(steps: T[], schemaMap: EdgeTypeStatsMap): T[] {
  return steps.map((step) => {
    if ("branch" in step && step.branch) {
      return {
        ...step,
        branch: step.branch.map((sub) => {
          if (sub.sort) return sub; // already has a sort
          const resolved = resolveSortField(
            sub.edgeTypes[0] as EdgeType,
            schemaMap,
          );
          return resolved ? { ...sub, sort: resolved } : sub;
        }),
      } as T;
    }
    const flatStep = step as {
      edgeTypes: (EdgeType | string)[];
      sort?: string;
    };
    if (flatStep.sort) return step; // already has a sort
    const resolved = resolveSortField(
      flatStep.edgeTypes[0] as EdgeType,
      schemaMap,
    );
    return resolved ? ({ ...step, sort: resolved } as T) : step;
  });
}
