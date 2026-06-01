import type { EdgeType } from "../types/edge";
import type { EntityType } from "../types/entity";

// =============================================================================
// Variant Trail — multi-step route configs to find Variant nodes
// =============================================================================

export interface VariantTrailStep {
  edgeTypes: EdgeType[];
  direction: "in" | "out" | "both";
  limit: number;
  sort?: string;
}

export interface VariantTrailRoute {
  steps: VariantTrailStep[];
  routeBadge: string;
}

export interface VariantTrailConfig {
  routes: VariantTrailRoute[];
  maxNodes: number;
  maxEdges: number;
}

/**
 * Route definitions per entity type. Each config specifies multi-step query routes,
 * limits, edge fields, and a route badge. Variant type is intentionally excluded.
 */
export const VARIANT_TRAIL_CONFIG: Partial<
  Record<EntityType, VariantTrailConfig>
> = {
  // 1-step routes (Direct)
  Gene: {
    routes: [
      {
        steps: [
          {
            edgeTypes: ["VARIANT_IMPLIES_GENE", "VARIANT_AFFECTS_GENE"],
            direction: "in",
            limit: 25,
          },
        ],
        routeBadge: "Direct",
      },
    ],
    maxNodes: 140,
    maxEdges: 260,
  },
  Disease: {
    routes: [
      {
        steps: [
          {
            edgeTypes: ["VARIANT_ASSOCIATED_WITH_TRAIT"],
            direction: "in",
            limit: 25,
          },
        ],
        routeBadge: "Direct",
      },
    ],
    maxNodes: 140,
    maxEdges: 260,
  },
  Drug: {
    routes: [
      {
        steps: [
          {
            edgeTypes: ["VARIANT_ASSOCIATED_WITH_DRUG"],
            direction: "in",
            limit: 25,
          },
        ],
        routeBadge: "Direct",
      },
    ],
    maxNodes: 140,
    maxEdges: 260,
  },
  cCRE: {
    routes: [
      {
        steps: [
          { edgeTypes: ["VARIANT_OVERLAPS_CCRE"], direction: "in", limit: 25 },
        ],
        routeBadge: "Direct",
      },
    ],
    maxNodes: 140,
    maxEdges: 260,
  },
  SideEffect: {
    routes: [
      {
        steps: [
          {
            edgeTypes: ["VARIANT_LINKED_TO_SIDE_EFFECT"],
            direction: "in",
            limit: 25,
          },
        ],
        routeBadge: "Direct",
      },
    ],
    maxNodes: 140,
    maxEdges: 260,
  },
  Signal: {
    routes: [
      {
        steps: [
          { edgeTypes: ["SIGNAL_HAS_VARIANT"], direction: "out", limit: 25 },
        ],
        routeBadge: "Direct",
      },
    ],
    maxNodes: 140,
    maxEdges: 260,
  },

  // 2-step routes
  Phenotype: {
    routes: [
      {
        steps: [
          { edgeTypes: ["DISEASE_HAS_PHENOTYPE"], direction: "in", limit: 10 },
          {
            edgeTypes: ["VARIANT_ASSOCIATED_WITH_TRAIT"],
            direction: "in",
            limit: 15,
          },
        ],
        routeBadge: "via Disease",
      },
    ],
    maxNodes: 140,
    maxEdges: 260,
  },
  Pathway: {
    routes: [
      {
        steps: [
          {
            edgeTypes: ["GENE_PARTICIPATES_IN_PATHWAY"],
            direction: "in",
            limit: 10,
          },
          {
            edgeTypes: ["VARIANT_IMPLIES_GENE", "VARIANT_AFFECTS_GENE"],
            direction: "in",
            limit: 15,
          },
        ],
        routeBadge: "via Gene",
      },
    ],
    maxNodes: 140,
    maxEdges: 260,
  },
  GOTerm: {
    routes: [
      {
        steps: [
          {
            edgeTypes: ["GENE_ANNOTATED_WITH_GO_TERM"],
            direction: "in",
            limit: 10,
          },
          {
            edgeTypes: ["VARIANT_IMPLIES_GENE", "VARIANT_AFFECTS_GENE"],
            direction: "in",
            limit: 15,
          },
        ],
        routeBadge: "via Gene",
      },
    ],
    maxNodes: 140,
    maxEdges: 260,
  },

  // 3-step route
  Metabolite: {
    routes: [
      {
        steps: [
          {
            edgeTypes: ["PATHWAY_CONTAINS_METABOLITE"],
            direction: "in",
            limit: 8,
          },
          {
            edgeTypes: ["GENE_PARTICIPATES_IN_PATHWAY"],
            direction: "in",
            limit: 8,
          },
          {
            edgeTypes: ["VARIANT_IMPLIES_GENE", "VARIANT_AFFECTS_GENE"],
            direction: "in",
            limit: 10,
          },
        ],
        routeBadge: "via Pathway, Gene",
      },
    ],
    maxNodes: 140,
    maxEdges: 260,
  },
};

/** Check if a given entity type supports the variant trail action. */
export function hasVariantTrail(entityType: EntityType): boolean {
  return entityType !== "Variant" && entityType in VARIANT_TRAIL_CONFIG;
}
