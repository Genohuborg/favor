/**
 * Graph command dispatch layer.
 * Shared exports (schema cache, error helpers, edge maps) + mode dispatch.
 */

import { AgentToolError } from "../../../lib/api-client";
import type { GraphSchemaResponse } from "../intent-aliases";
import {
  errorResult as makeErrorResult,
  type RunResultEnvelope,
  type TraceCollector,
} from "../run-result";
import type { EntityRef, RunCommand, RunResult } from "../types";
import { schemaStore } from "./graph-schema-store";

export type { AgentViewSchema, EdgePropertyMeta } from "./graph-schema-store";

import { handleExploreAggregate } from "./graph-explore-aggregate";
import { handleExploreCompare } from "./graph-explore-compare";
import { handleExploreContext } from "./graph-explore-context";
import { handleExploreEnrich } from "./graph-explore-enrich";
// Mode handlers — explore
import { handleExploreNeighbors } from "./graph-explore-neighbors";
import { handleExploreSimilar } from "./graph-explore-similar";
// Query handler (now routed via traverse patterns)
import { handleQuery, type QueryCmd } from "./graph-query";
// Mode handlers — traverse
import { handleTraverseChain } from "./graph-traverse-chain";
import { handleTraversePaths } from "./graph-traverse-paths";

// ---------------------------------------------------------------------------
// Shared: schema cache delegates (backed by SchemaStore)
// ---------------------------------------------------------------------------

export async function getCachedGraphSchema(
  portal?: string,
): Promise<GraphSchemaResponse> {
  return schemaStore.getFull(portal);
}

// ---------------------------------------------------------------------------
// Shared: enrichment edge type mapping
// ---------------------------------------------------------------------------

/** Static edge map for enrichment — keyed by target node type.
 *  Used by explore-enrich (gene seeds) and as fallback for traverse-chain enrich.
 *  Traverse-chain prefers dynamic inference via findEdgesConnecting. */
export const TARGET_EDGE_MAP: Record<string, string> = {
  Pathway: "GENE_PARTICIPATES_IN_PATHWAY",
  Disease: "GENE_ASSOCIATED_WITH_DISEASE",
  GOTerm: "GENE_ANNOTATED_WITH_GO_TERM",
  Phenotype: "GENE_ASSOCIATED_WITH_PHENOTYPE",
  Drug: "DRUG_ACTS_ON_GENE",
  Tissue: "GENE_EXPRESSED_IN_TISSUE",
  SideEffect: "GENE_ASSOCIATED_WITH_SIDE_EFFECT",
  ProteinDomain: "GENE_HAS_PROTEIN_DOMAIN",
};

// ---------------------------------------------------------------------------
// Shared: human-readable labels for edge types and score fields
// ---------------------------------------------------------------------------

/** Map raw edge types → plain-English relationship descriptions.
 * Starts with curated entries; enriched atomically from schema on first fetch. */
let edgeHumanLabels: Record<string, string> = {
  VARIANT_IMPLIES_GENE: "variant-to-gene link",
  GENE_ASSOCIATED_WITH_DISEASE: "gene–disease association",
  GENE_PARTICIPATES_IN_PATHWAY: "pathway membership",
  GENE_ANNOTATED_WITH_GO_TERM: "GO annotation",
  GENE_ASSOCIATED_WITH_PHENOTYPE: "gene–phenotype association",
  DRUG_ACTS_ON_GENE: "drug–gene target interaction",
  GENE_AFFECTS_DRUG_RESPONSE: "pharmacogenomic drug response",
  DRUG_DISPOSITION_BY_GENE: "drug disposition by gene",
  GENE_EXPRESSED_IN_TISSUE: "tissue expression",
  GENE_ASSOCIATED_WITH_SIDE_EFFECT: "side-effect association",
  GENE_HAS_PROTEIN_DOMAIN: "protein domain membership",
  GENE_INTERACTS_WITH_GENE: "protein–protein interaction",
  DISEASE_ASSOCIATED_WITH_PHENOTYPE: "disease–phenotype link",
  DISEASE_HAS_PHENOTYPE: "disease–phenotype association",
  DISEASE_HAS_DRUG: "disease treatment",
  DRUG_INDICATED_FOR_DISEASE: "drug indication for disease",
  DRUG_HAS_ADVERSE_EFFECT: "drug adverse effect",
  DRUG_INTERACTS_WITH_DRUG: "drug–drug interaction",
  DRUG_PAIR_CAUSES_SIDE_EFFECT: "drug-pair side effect",
  VARIANT_OVERLAPS_CCRE: "cis-regulatory element overlap",
  CCRE_REGULATES_GENE: "cis-regulatory element–gene regulation",
  VARIANT_ASSOCIATED_WITH_TRAIT: "variant–disease trait association",
};

/** Map raw score field names → what they measure */
export const SCORE_HUMAN_LABEL: Record<string, string> = {
  l2g_score: "locus-to-gene prediction model",
  ot_score: "Open Targets association score",
  evidence_count: "evidence count across sources",
  max_clinical_phase: "most advanced clinical trial phase",
  pValue: "statistical significance (p-value)",
  combined_score: "combined interaction confidence",
  score: "association score",
  max_score: "maximum regulatory evidence score",
  affinity_median: "binding affinity (pKi/pIC50, higher = stronger)",
  faers_llr: "FAERS log-likelihood ratio (adverse effect signal strength)",
  onsides_pred1: "OnSIDES prediction score (side effect confidence)",
  offsides_prr: "off-label proportional reporting ratio (FAERS signal)",
  prr: "proportional reporting ratio (drug-pair signal)",
  max_profile_evidence_score: "max pharmacogenomic evidence score",
  dc_act_value: "DrugCentral activity value (pACT)",
  tpm_median: "median gene expression (TPM)",
  alphamissense_pathogenicity: "AlphaMissense pathogenicity prediction",
  mean_plddt: "AlphaFold structural confidence (pLDDT)",
};

/** Human-readable label for an edge type (fallback: lowercase + de-underscore) */
export function humanEdgeLabel(edgeType: string): string {
  return edgeHumanLabels[edgeType] ?? edgeType.toLowerCase().replace(/_/g, " ");
}

/** Human-readable label for a score field (fallback: lowercase + de-underscore) */
export function humanScoreLabel(scoreField: string): string {
  return (
    SCORE_HUMAN_LABEL[scoreField] ?? scoreField.toLowerCase().replace(/_/g, " ")
  );
}

// ---------------------------------------------------------------------------
// Shared: schema-driven helpers (sort, keyFilters, labels, recovery)
// ---------------------------------------------------------------------------

/** Fill in labels for edge types that lack a curated entry.
 * Builds a new object and swaps atomically — safe across concurrent requests. */
function enrichHumanLabels(schema: GraphSchemaResponse): void {
  const next = { ...edgeHumanLabels };
  let changed = false;
  for (const et of schema.edgeTypes) {
    if (et.agentBriefing && !next[et.edgeType]) {
      next[et.edgeType] = et.agentBriefing;
      changed = true;
    }
  }
  if (changed) edgeHumanLabels = next;
}

// Wire enrichHumanLabels into the store so it runs on every fresh schema fetch
schemaStore.setEnrichFn(enrichHumanLabels);

/**
 * Pick the best sort field for an edge type.
 * Priority: user-specified > first sortStrategy > defaultScoreField fallback.
 */
export function pickSortField(
  schema: GraphSchemaResponse,
  edgeType: string,
  userSort?: string,
): string | undefined {
  if (userSort) return userSort;
  const et = schema.edgeTypes.find((e) => e.edgeType === edgeType);
  if (!et) return undefined;
  const strategy = et.sortStrategies?.[0];
  if (strategy) {
    const dir = strategy.direction === "asc" ? "" : "-";
    return `${dir}${strategy.field}`;
  }
  return et.defaultScoreField ? `-${et.defaultScoreField}` : undefined;
}

/**
 * Merge priority-1 keyFilters into the agent's existing filters.
 * Agent filters always win — if the agent already filters on a field (any __op suffix), skip.
 * Returns merged filters and list of defaults that were applied (for trace metadata).
 */
export function applyDefaultKeyFilters(
  schema: GraphSchemaResponse,
  edgeType: string,
  agentFilters?: Record<string, unknown>,
): { filters: Record<string, unknown>; applied: string[] } {
  const et = schema.edgeTypes.find((e) => e.edgeType === edgeType);
  const defaults = et?.keyFilters?.filter((kf) => kf.priority === 1) ?? [];
  if (defaults.length === 0)
    return { filters: agentFilters ?? {}, applied: [] };

  const merged = { ...(agentFilters ?? {}) };
  const applied: string[] = [];

  for (const kf of defaults) {
    // Check if agent already filters on this field (any __op suffix)
    const hasAgentFilter = Object.keys(merged).some(
      (k) => k === kf.field || k.startsWith(`${kf.field}__`),
    );
    if (hasAgentFilter) continue;

    const key = `${kf.field}__${kf.op}`;
    merged[key] = kf.value;
    applied.push(kf.label ?? `${kf.field} ${kf.op} ${String(kf.value)}`);
  }

  return { filters: merged, applied };
}

/**
 * Schema-guided error recovery: parse 400 errors and suggest valid options.
 * Returns an error result with next_actions, or null for non-correctable errors.
 */
export function schemaGuidedRecovery(
  err: unknown,
  schema: GraphSchemaResponse,
  tc?: TraceCollector,
): RunResultEnvelope | null {
  if (!(err instanceof AgentToolError) || err.status !== 400) return null;

  const msg = err.detail.toLowerCase();

  // Unknown edge type → list valid edge types
  if (
    msg.includes("edge type") ||
    msg.includes("edgetype") ||
    msg.includes("unknown edge")
  ) {
    const validEdges = schema.edgeTypes.map((e) => e.edgeType);
    return makeErrorResult({
      message: err.detail,
      code: "invalid_edge_type",
      hint: `Valid edge types: ${validEdges.slice(0, 15).join(", ")}`,
      http_status: 400,
      tc,
      next_actions: [
        {
          tool: "Run",
          args: {},
          reason: `Retry with a valid edge type. Available: ${validEdges.slice(0, 10).join(", ")}`,
          reason_code: "schema_correction",
        },
      ],
    });
  }

  // Unknown field → list valid fields for the mentioned edge type
  if (
    msg.includes("field") ||
    msg.includes("property") ||
    msg.includes("sort")
  ) {
    const edgeType = schema.edgeTypes.find((e) =>
      msg.includes(e.edgeType.toLowerCase()),
    );
    if (edgeType?.properties?.length) {
      return makeErrorResult({
        message: err.detail,
        code: "invalid_field",
        hint: `Valid fields for ${edgeType.edgeType}: ${edgeType.properties.slice(0, 15).join(", ")}`,
        http_status: 400,
        tc,
      });
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Shared: error helpers (delegates to run-result.ts)
// ---------------------------------------------------------------------------

/** Simple error result with a message string */
export function errorResult(
  message: string,
  tc?: TraceCollector,
): RunResultEnvelope {
  return makeErrorResult({ message, tc });
}

// ---------------------------------------------------------------------------
// Shared: edge type annotation helper
// ---------------------------------------------------------------------------

const MAX_TEXT_LENGTH = 150;

function trimText(s: string, max = MAX_TEXT_LENGTH): string {
  return s.length <= max ? s : `${s.slice(0, max).trimEnd()}…`;
}

/**
 * Trim subtitle on an entity object in-place.
 * Handles both { subtitle } and nested { entity: { subtitle } } shapes.
 */
export function trimEntitySubtitles<T>(items: T[]): T[] {
  for (const item of items) {
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      if (typeof obj.subtitle === "string") {
        obj.subtitle = trimText(obj.subtitle);
      }
      // nested { entity: { subtitle } }
      if (obj.entity && typeof obj.entity === "object") {
        const ent = obj.entity as Record<string, unknown>;
        if (typeof ent.subtitle === "string") {
          ent.subtitle = trimText(ent.subtitle);
        }
      }
    }
  }
  return items;
}

/**
 * Look up edge type label + description from cached schema.
 * Returns a single annotation line: "EDGE_TYPE: <full description>"
 * or null if the edge type is not found.
 */
export async function edgeTypeAnnotation(
  edgeType: string,
): Promise<string | null> {
  const schema = await getCachedGraphSchema();
  const entry = schema.edgeTypes.find((e) => e.edgeType === edgeType);
  if (!entry?.description) return null;
  return `${humanEdgeLabel(edgeType)}: ${entry.description}`;
}

// ---------------------------------------------------------------------------
// Explore dispatch — implicit routing from params
// ---------------------------------------------------------------------------

type ExploreCmd = Extract<RunCommand, { command: "explore" }>;

type ExploreHandler = (
  cmd: ExploreCmd,
  cache?: Record<string, EntityRef>,
) => Promise<RunResult>;

const EXPLORE_DISPATCH: Record<string, ExploreHandler> = {
  neighbors: handleExploreNeighbors,
  compare: handleExploreCompare,
  enrich: handleExploreEnrich,
  similar: handleExploreSimilar,
  context: handleExploreContext,
  aggregate: handleExploreAggregate,
};

/** Infer explore mode from params — priority order, most specific signal first. */
function routeExplore(cmd: ExploreCmd): string {
  if (cmd.metric) return "aggregate";
  if (cmd.target) return "enrich";
  if (cmd.seeds.length === 2 && cmd.into?.length) return "compare";
  if (cmd.seeds.length >= 3 && cmd.into?.length) return "neighbors";
  if (cmd.into?.length) return "neighbors";
  if (cmd.sections || cmd.context_depth) return "context";
  if (cmd.top_k || (cmd.edge_types && !cmd.into?.length)) return "similar";
  if (cmd.seeds.length >= 2) return "compare";
  return "context";
}

export async function handleExplore(
  cmd: ExploreCmd,
  resolvedCache?: Record<string, EntityRef>,
): Promise<RunResult> {
  const mode = routeExplore(cmd);
  const handler = EXPLORE_DISPATCH[mode];
  if (!handler) {
    return errorResult(`Unknown explore mode: ${mode}`);
  }
  return handler(cmd, resolvedCache);
}

// ---------------------------------------------------------------------------
// Traverse dispatch — implicit routing from params
// ---------------------------------------------------------------------------

type TraverseCmd = Extract<RunCommand, { command: "traverse" }>;

type TraverseHandler = (
  cmd: TraverseCmd,
  cache?: Record<string, EntityRef>,
) => Promise<RunResult>;

/** Adapter: route traverse patterns mode to the query handler */
async function handleTraversePatterns(
  cmd: TraverseCmd,
  cache?: Record<string, EntityRef>,
): Promise<RunResult> {
  return handleQuery(
    {
      description: cmd.description,
      seeds: cmd.seeds,
      pattern: cmd.pattern,
      return_vars: cmd.return_vars,
      filters: cmd.filters as Record<string, unknown> | undefined,
      limit: cmd.limit,
      select: cmd.select,
    } satisfies QueryCmd,
    cache,
  );
}

const TRAVERSE_DISPATCH: Record<string, TraverseHandler> = {
  chain: handleTraverseChain,
  paths: handleTraversePaths,
  patterns: handleTraversePatterns,
};

/** Infer traverse mode from params — with conflict validation. */
function routeTraverse(cmd: TraverseCmd): string | { error: string } {
  if ((cmd.pattern || cmd.description) && cmd.steps) {
    return {
      error:
        "Cannot combine pattern/description with steps. Use pattern OR steps, not both.",
    };
  }
  if (cmd.pattern || cmd.description) return "patterns";
  if (cmd.from && cmd.to) return "paths";
  return "chain";
}

export async function handleTraverse(
  cmd: TraverseCmd,
  resolvedCache?: Record<string, EntityRef>,
): Promise<RunResult> {
  const mode = routeTraverse(cmd);
  if (typeof mode === "object") {
    return errorResult(mode.error);
  }
  const handler = TRAVERSE_DISPATCH[mode];
  if (!handler) {
    return errorResult(`Unknown traverse mode: ${mode}`);
  }
  return handler(cmd, resolvedCache);
}
