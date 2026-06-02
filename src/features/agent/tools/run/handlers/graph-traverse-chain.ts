/**
 * traverse mode: chain — multi-hop traversal with intent-first steps.
 *
 * Strategy: build a single /graph/query request with proper steps (including
 * branches when consecutive types lack a direct edge). Falls back to per-step
 * /graph/ranked-neighbors when the batch query fails.
 *
 * Phase 5: Full trace instrumentation — every decision/call/fallback recorded.
 */

import { agentFetch } from "../../../lib/api-client";
import {
  canonicalizeIntent,
  type EdgeTypeInfo,
  findEdgesConnecting,
  type GraphSchemaResponse,
  resolveIntentType,
} from "../intent-aliases";
import { resolveSeeds, warnPartialResolution } from "../resolve-seeds";
import {
  catchToResult,
  okResult,
  partialResult,
  TraceCollector,
} from "../run-result";
import type {
  EntityRef,
  RunCommand,
  RunResult,
  TargetIntent,
  TraverseStep,
} from "../types";
import {
  applyDefaultKeyFilters,
  edgeTypeAnnotation,
  errorResult,
  getCachedGraphSchema,
  humanEdgeLabel,
  humanScoreLabel,
  pickSortField,
  schemaGuidedRecovery,
  TARGET_EDGE_MAP,
} from "./graph";

type TraverseCmd = Extract<RunCommand, { command: "traverse" }>;

/** Scored entity for chain results */
interface ScoredEntity extends EntityRef {
  rank?: number;
  score?: number;
  edgeProperties?: Record<string, unknown>;
  supportCount?: number;
}

/** Enriched entity for enrichment steps */
interface EnrichedEntity extends EntityRef {
  pValue?: number;
  foldEnrichment?: number;
  overlap?: number;
}

/** Unified step result used across all execution paths */
interface StepResult {
  step: number;
  intent: string;
  edgeType: string;
  edgeDescription?: string;
  scoreField?: string;
  entities: (ScoredEntity | EnrichedEntity)[];
}

/** Annotated "into" step with resolved source depth and edge type */
interface AnnotatedIntoStep {
  userStepIndex: number;
  intent: string;
  targetType: string;
  edgeType: string;
  defaultScoreField?: string;
  sourceDepth: number; // -1 if no edge found
  limit: number;
  sort?: string; // User-specified sort override (e.g. "-score_field")
  filters?: Record<string, unknown>; // User-specified edge filters (field__op format)
  overlayOnly?: boolean; // edges only to existing nodes, no new nodes
  /** All candidate edges for this step — used for cascade fallback in executePerStep */
  allCandidates?: EdgeTypeInfo[];
}

// ---------------------------------------------------------------------------
// Phase 1: Annotate steps — resolve edge types and detect backtrack points
// ---------------------------------------------------------------------------

function annotateIntoSteps(
  steps: TraverseStep[],
  seedType: string,
  schema: GraphSchemaResponse,
  tc: TraceCollector,
): { intoSteps: AnnotatedIntoStep[]; enrichIndices: number[] } {
  const typeStack: string[] = [seedType];
  const intoSteps: AnnotatedIntoStep[] = [];
  const enrichIndices: number[] = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if ("into" in step) {
      // Canonicalize deprecated intents (e.g. side_effects → adverse_effects)
      const [canonicalIntent, repairNote] = canonicalizeIntent(step.into);
      if (repairNote) {
        tc.warn("intent_repair", `Step ${i}: ${repairNote}`);
      }

      const targetType = resolveIntentType(canonicalIntent);
      if (!targetType) {
        tc.warn(
          "unknown_intent",
          `Step ${i}: unknown intent "${canonicalIntent}"`,
        );
        continue;
      }

      let found = false;
      for (let d = typeStack.length - 1; d >= 0; d--) {
        const edges = findEdgesConnecting(
          schema,
          typeStack[d],
          targetType,
          canonicalIntent,
        );
        if (edges.length > 0) {
          const edgeType = edges[0].edgeType;
          const sort = pickSortField(schema, edgeType, step.sort);
          const userFilters = step.filters as
            | Record<string, unknown>
            | undefined;
          const { filters: mergedFilters, applied: appliedDefaults } =
            applyDefaultKeyFilters(schema, edgeType, userFilters);

          const ann: AnnotatedIntoStep = {
            userStepIndex: i,
            intent: canonicalIntent,
            targetType,
            edgeType,
            defaultScoreField: edges[0].defaultScoreField,
            sourceDepth: d,
            limit: Math.min(step.top ?? 20, 100),
            sort,
            filters:
              Object.keys(mergedFilters).length > 0 ? mergedFilters : undefined,
            overlayOnly: step.overlay ?? undefined,
            allCandidates: edges.length > 1 ? edges : undefined,
          };
          intoSteps.push(ann);

          const defaultsNote =
            appliedDefaults.length > 0
              ? ` [defaults: ${appliedDefaults.join(", ")}]`
              : "";
          tc.add({
            step: `annotateStep_${i}`,
            kind: "decision",
            message: `${canonicalIntent}: ${typeStack[d]}→${targetType} via ${edgeType} (depth=${d})${defaultsNote}`,
          });

          if (d === typeStack.length - 1) {
            typeStack.push(targetType);
          }
          found = true;
          break;
        }
      }

      if (!found) {
        tc.warn(
          "no_edge",
          `Step ${i}: no edge ${typeStack.at(-1)}→${targetType}`,
        );
        intoSteps.push({
          userStepIndex: i,
          intent: canonicalIntent,
          targetType,
          edgeType: "none",
          sourceDepth: -1,
          limit: step.top ?? 20,
        });
      }
    } else if ("enrich" in step) {
      enrichIndices.push(i);
      tc.add({
        step: `annotateStep_${i}`,
        kind: "decision",
        message: `enrich: ${step.enrich}`,
      });
    }
  }

  return { intoSteps, enrichIndices };
}

// ---------------------------------------------------------------------------
// Phase 2: Build /graph/query steps from annotated into steps
// ---------------------------------------------------------------------------

function buildQuerySteps(
  intoSteps: AnnotatedIntoStep[],
): Array<Record<string, unknown>> {
  const valid = intoSteps.filter((s) => s.sourceDepth >= 0);
  if (valid.length === 0) return [];

  const byDepth = new Map<number, AnnotatedIntoStep[]>();
  for (const s of valid) {
    const group = byDepth.get(s.sourceDepth) ?? [];
    group.push(s);
    byDepth.set(s.sourceDepth, group);
  }

  const sortedDepths = [...byDepth.keys()].sort((a, b) => a - b);
  const querySteps: Array<Record<string, unknown>> = [];

  for (const depth of sortedDepths) {
    const group = byDepth.get(depth)!;
    if (group.length === 1) {
      const s = group[0];
      querySteps.push({
        edgeTypes: [s.edgeType],
        limit: s.limit,
        sort:
          s.sort ??
          (s.defaultScoreField ? `-${s.defaultScoreField}` : undefined),
        ...(s.filters && Object.keys(s.filters).length > 0
          ? { filters: s.filters }
          : {}),
        ...(s.overlayOnly ? { overlayOnly: true } : {}),
      });
    } else {
      querySteps.push({
        branch: group.map((s) => ({
          edgeTypes: [s.edgeType],
          limit: s.limit,
          sort:
            s.sort ??
            (s.defaultScoreField ? `-${s.defaultScoreField}` : undefined),
          ...(s.filters && Object.keys(s.filters).length > 0
            ? { filters: s.filters }
            : {}),
          ...(s.overlayOnly ? { overlayOnly: true } : {}),
        })),
      });
    }
  }

  return querySteps;
}

// ---------------------------------------------------------------------------
// Extract scored entities from batch query edges for a single step
// ---------------------------------------------------------------------------

function collectStepEntities(
  stepEdges: Array<{
    type: string;
    from: string;
    to: string;
    fields?: Record<string, unknown>;
  }>,
  nodes: Record<
    string,
    { entity: EntityRef; fields?: Record<string, unknown> }
  >,
  ann: { targetType: string; defaultScoreField?: string },
): ScoredEntity[] {
  const targetEntities: ScoredEntity[] = [];
  const seen = new Set<string>();
  const supportMap = new Map<string, Set<string>>();
  const scoreField = ann.defaultScoreField;

  for (const edge of stepEdges) {
    const fromType =
      edge.from.slice(0, Math.max(edge.from.indexOf(":"), 0)) || edge.from;
    const toType =
      edge.to.slice(0, Math.max(edge.to.indexOf(":"), 0)) || edge.to;
    const targetKey =
      toType === ann.targetType
        ? edge.to
        : fromType === ann.targetType
          ? edge.from
          : null;
    if (!targetKey) continue;

    const sourceKey = targetKey === edge.to ? edge.from : edge.to;
    let sources = supportMap.get(targetKey);
    if (!sources) {
      sources = new Set();
      supportMap.set(targetKey, sources);
    }
    sources.add(sourceKey);

    if (seen.has(targetKey)) continue;
    seen.add(targetKey);

    const node = nodes[targetKey];
    if (!node?.entity) continue;

    const f = edge.fields ?? {};
    const score = ((scoreField ? f[scoreField] : undefined) ??
      f.ot_score ??
      f.score ??
      f.evidence_count) as number | undefined;

    const edgeProperties: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(f)) {
      if (v != null) edgeProperties[k] = v;
    }

    targetEntities.push({
      ...node.entity,
      rank: targetEntities.length + 1,
      score: typeof score === "number" ? score : undefined,
      ...(Object.keys(edgeProperties).length > 0 ? { edgeProperties } : {}),
    });
  }

  // Annotate support count and re-sort if any target has > 1 source
  const hasMultiSupport = [...supportMap.values()].some((s) => s.size > 1);
  if (hasMultiSupport) {
    for (const ent of targetEntities) {
      const key = `${ent.type}:${ent.id}`;
      const count = supportMap.get(key)?.size ?? 1;
      if (count > 1) ent.supportCount = count;
    }
    targetEntities.sort((a, b) => {
      const sa = a.supportCount ?? 1;
      const sb = b.supportCount ?? 1;
      if (sb !== sa) return sb - sa;
      return (b.score ?? 0) - (a.score ?? 0);
    });
    for (let r = 0; r < targetEntities.length; r++) {
      targetEntities[r].rank = r + 1;
    }
  }

  return targetEntities;
}

// ---------------------------------------------------------------------------
// Phase 3a: Execute via /graph/query (batch)
// ---------------------------------------------------------------------------

async function executeViaQuery(
  seed: EntityRef,
  intoSteps: AnnotatedIntoStep[],
  schema: GraphSchemaResponse,
  tc: TraceCollector,
): Promise<StepResult[] | null> {
  const querySteps = buildQuerySteps(intoSteps);
  if (querySteps.length === 0) return null;

  try {
    tc.add({
      step: "batchQuery",
      kind: "call",
      message: `POST /graph/query with ${querySteps.length} steps`,
    });

    const resp = await agentFetch<{
      data: {
        nodes: Record<
          string,
          { entity: EntityRef; fields?: Record<string, unknown> }
        >;
        edges: Array<{
          type: string;
          from: string;
          to: string;
          fields?: Record<string, unknown>;
        }>;
      };
      meta?: { nodeCount?: number; edgeCount?: number; warnings?: unknown[] };
    }>("/graph/query", {
      method: "POST",
      body: {
        seeds: [{ type: seed.type, id: seed.id }],
        steps: querySteps,
        limits: {
          maxNodes: Math.min(
            intoSteps.reduce((s, a) => s + a.limit, 0) * 2 + 10,
            1000,
          ),
          maxEdges: Math.min(
            intoSteps.reduce((s, a) => s + a.limit, 0) * 3,
            5000,
          ),
        },
        mode: "compact",
      },
    });

    tc.mergeApiWarnings(resp.meta?.warnings);
    tc.add({
      step: "batchQueryResult",
      kind: "timing",
      message: `Got ${resp.meta?.nodeCount ?? 0} nodes, ${resp.meta?.edgeCount ?? 0} edges`,
    });

    const nodes = resp.data?.nodes ?? {};
    const edges = resp.data?.edges ?? [];

    const results: StepResult[] = [];
    for (const ann of intoSteps) {
      if (ann.edgeType === "none") {
        results.push({
          step: ann.userStepIndex,
          intent: ann.intent,
          edgeType: "none",
          entities: [],
        });
        continue;
      }
      const stepEdges = edges.filter((e) => e.type === ann.edgeType);
      const targetEntities = collectStepEntities(stepEdges, nodes, ann);
      const annotation = await edgeTypeAnnotation(ann.edgeType);
      results.push({
        step: ann.userStepIndex,
        intent: ann.intent,
        edgeType: ann.edgeType,
        edgeDescription: annotation ?? undefined,
        scoreField: ann.defaultScoreField,
        entities: targetEntities.slice(0, ann.limit),
      });
    }

    return results;
  } catch (err) {
    // Try schema-guided recovery for 400 errors before falling back
    const recovered = schemaGuidedRecovery(err, schema, tc);
    if (recovered) {
      tc.add({
        step: "batchQueryRecovery",
        kind: "fallback",
        message: "Schema-guided recovery applied",
      });
      // Return null to trigger per-step fallback with corrective info logged
    }
    const msg = err instanceof Error ? err.message : String(err);
    tc.add({
      step: "batchQueryFailed",
      kind: "fallback",
      message: `Query failed: ${msg}`,
    });
    tc.warn(
      "batch_query_failed",
      `Batch query failed, falling back to per-step: ${msg}`,
    );
    return null;
  }
}

// ---------------------------------------------------------------------------
// Phase 3b: Fallback — per-step ranked-neighbors
// ---------------------------------------------------------------------------

async function executePerStep(
  seed: EntityRef,
  intoSteps: AnnotatedIntoStep[],
  _schema: GraphSchemaResponse,
  tc: TraceCollector,
): Promise<StepResult[]> {
  tc.add({
    step: "perStepFallback",
    kind: "fallback",
    message: `Executing ${intoSteps.length} steps individually`,
  });

  const results: StepResult[] = [];
  const entitiesAtDepth = new Map<number, EntityRef[]>();
  entitiesAtDepth.set(0, [seed]);

  for (const ann of intoSteps) {
    if (ann.edgeType === "none") {
      results.push({
        step: ann.userStepIndex,
        intent: ann.intent,
        edgeType: "none",
        entities: [],
      });
      continue;
    }

    const stepSeeds = (entitiesAtDepth.get(ann.sourceDepth) ?? [seed]).slice(
      0,
      10,
    );

    // Edge cascade: try candidates in preference order, stop at first with results
    const edgesToTry = ann.allCandidates?.slice(0, 3) ?? [
      {
        edgeType: ann.edgeType,
        fromType: "",
        toType: "",
        propertyCount: 0,
        defaultScoreField: ann.defaultScoreField,
      },
    ];
    let stepResult: StepResult | null = null;

    for (const edge of edgesToTry) {
      try {
        tc.add({
          step: `perStep_${ann.userStepIndex}`,
          kind: "call",
          message: `ranked-neighbors: ${edge.edgeType}`,
        });

        const data = await agentFetch<{
          data: {
            neighbors: Array<{
              entity: EntityRef;
              rank: number;
              score?: number;
            }>;
          };
          meta?: { resolved?: { scoreField?: string }; warnings?: unknown[] };
        }>("/graph/ranked-neighbors", {
          method: "POST",
          body: {
            seed: { type: stepSeeds[0].type, id: stepSeeds[0].id },
            edgeType: edge.edgeType,
            limit: ann.limit,
          },
        });

        tc.mergeApiWarnings(data.meta?.warnings);

        const entities: ScoredEntity[] = (data.data?.neighbors ?? []).map(
          (n) => ({
            ...n.entity,
            rank: n.rank,
            score: n.score,
          }),
        );

        if (
          entities.length > 0 ||
          edgesToTry.indexOf(edge) === edgesToTry.length - 1
        ) {
          const annotation = await edgeTypeAnnotation(edge.edgeType);
          stepResult = {
            step: ann.userStepIndex,
            intent: ann.intent,
            edgeType: edge.edgeType,
            edgeDescription: annotation ?? undefined,
            scoreField:
              data.meta?.resolved?.scoreField ?? edge.defaultScoreField,
            entities,
          };

          const resultDepth = ann.sourceDepth + 1;
          if (entities.length > 0 && !entitiesAtDepth.has(resultDepth)) {
            entitiesAtDepth.set(resultDepth, entities);
          }
          break;
        }

        tc.add({
          step: `perStep_${ann.userStepIndex}`,
          kind: "fallback",
          message: `0 via ${edge.edgeType}, trying next`,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        tc.warn(
          "step_failed",
          `Step ${ann.userStepIndex} (${ann.intent}/${edge.edgeType}): ${msg}`,
        );
      }
    }

    results.push(
      stepResult ?? {
        step: ann.userStepIndex,
        intent: ann.intent,
        edgeType: ann.edgeType,
        entities: [],
      },
    );
  }

  return results;
}

// ---------------------------------------------------------------------------
// Enrichment step execution
// ---------------------------------------------------------------------------

async function executeEnrichStep(
  step: Extract<TraverseStep, { enrich: string }>,
  userStepIndex: number,
  inputEntities: EntityRef[],
  tc: TraceCollector,
): Promise<StepResult | null> {
  const targetType = resolveIntentType(step.enrich);
  if (!targetType) return null;

  if (inputEntities.length < 3) {
    tc.add({
      step: `enrich_${userStepIndex}`,
      kind: "decision",
      message: `Only ${inputEntities.length} entities — too few for enrichment, will fallback`,
    });
    return null;
  }

  const inputType = inputEntities[0].type;
  let expectedEdge: string | undefined;

  const schema = await getCachedGraphSchema();
  const dynamicEdges = findEdgesConnecting(schema, inputType, targetType);
  if (dynamicEdges.length > 0) {
    expectedEdge = dynamicEdges[0].edgeType;
    tc.add({
      step: `enrich_${userStepIndex}`,
      kind: "decision",
      message: `Schema edge: ${expectedEdge}`,
    });
  } else {
    expectedEdge = TARGET_EDGE_MAP[targetType];
    tc.add({
      step: `enrich_${userStepIndex}`,
      kind: "fallback",
      message: `Static map fallback: ${expectedEdge}`,
    });
  }

  if (!expectedEdge) return null;

  const annotation = await edgeTypeAnnotation(expectedEdge);

  tc.add({
    step: `enrich_${userStepIndex}`,
    kind: "call",
    message: `POST /graph/enrichment`,
  });

  const data = await agentFetch<{
    data: {
      enriched: Array<{
        entity: EntityRef;
        overlap: number;
        pValue: number;
        adjustedPValue: number;
        foldEnrichment: number;
      }>;
    };
    meta?: { warnings?: unknown[] };
  }>("/graph/enrichment", {
    method: "POST",
    body: {
      inputSet: inputEntities
        .slice(0, 200)
        .map((e) => ({ type: e.type, id: e.id })),
      targetType,
      edgeType: expectedEdge,
      pValueCutoff: step.p_cutoff ?? 0.05,
      limit: step.top ?? 20,
    },
  });

  tc.mergeApiWarnings(data.meta?.warnings);

  const entities: EnrichedEntity[] = (data.data?.enriched ?? []).map((e) => ({
    ...e.entity,
    pValue: e.pValue,
    foldEnrichment: e.foldEnrichment,
    overlap: e.overlap,
  }));

  return {
    step: userStepIndex,
    intent: step.enrich,
    edgeType: expectedEdge,
    edgeDescription: annotation ?? undefined,
    scoreField: "Fisher's exact test p-value",
    entities,
  };
}

// ---------------------------------------------------------------------------
// Fallback: enrich → connectivity when input set is too small
// ---------------------------------------------------------------------------

async function executeFallbackInto(
  intent: TargetIntent,
  userStepIndex: number,
  inputEntities: EntityRef[],
  schema: GraphSchemaResponse,
  limit: number,
  tc: TraceCollector,
): Promise<StepResult | null> {
  const targetType = resolveIntentType(intent);
  if (!targetType) return null;

  const inputType = inputEntities[0].type;
  const edges = findEdgesConnecting(schema, inputType, targetType);
  if (edges.length === 0) return null;

  const edgeInfo = edges[0];
  const annotation = await edgeTypeAnnotation(edgeInfo.edgeType);

  try {
    tc.add({
      step: `enrichFallback_${userStepIndex}`,
      kind: "fallback",
      message: `Enrichment unavailable, using ranked-neighbors: ${edgeInfo.edgeType}`,
    });

    const data = await agentFetch<{
      data: {
        neighbors: Array<{
          entity: EntityRef;
          rank: number;
          score?: number;
        }>;
      };
      meta?: { resolved?: { scoreField?: string }; warnings?: unknown[] };
    }>("/graph/ranked-neighbors", {
      method: "POST",
      body: {
        seed: { type: inputEntities[0].type, id: inputEntities[0].id },
        edgeType: edgeInfo.edgeType,
        limit: Math.min(limit, 100),
      },
    });

    tc.mergeApiWarnings(data.meta?.warnings);

    const entities: ScoredEntity[] = (data.data?.neighbors ?? []).map((n) => ({
      ...n.entity,
      rank: n.rank,
      score: n.score,
    }));

    return {
      step: userStepIndex,
      intent,
      edgeType: edgeInfo.edgeType,
      edgeDescription: annotation ?? undefined,
      scoreField: data.meta?.resolved?.scoreField ?? edgeInfo.defaultScoreField,
      entities,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    tc.warn("fallback_failed", `Enrichment fallback ${userStepIndex}: ${msg}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export async function handleTraverseChain(
  cmd: TraverseCmd,
  resolvedCache?: Record<string, EntityRef>,
): Promise<RunResult> {
  const tc = new TraceCollector();

  try {
    if (!cmd.seed)
      return errorResult("chain mode requires a 'seed' entity.", tc);
    if (!cmd.steps?.length)
      return errorResult("chain mode requires at least one step.", tc);

    const resolvedSeeds = await resolveSeeds([cmd.seed], resolvedCache);
    warnPartialResolution(1, resolvedSeeds.length, tc);
    if (!resolvedSeeds.length)
      return errorResult("Could not resolve seed entity.", tc);

    const seed = resolvedSeeds[0];
    const schema = await getCachedGraphSchema();

    // Phase 1: Annotate steps — resolve edges and detect backtracks
    tc.add({
      step: "annotateSteps",
      kind: "decision",
      message: `Annotating ${cmd.steps.length} steps from ${seed.type}`,
    });
    const { intoSteps, enrichIndices } = annotateIntoSteps(
      cmd.steps,
      seed.type,
      schema,
      tc,
    );

    // Phase 2+3: Execute into steps via batch query, fall back to per-step.
    // If the batch has empty steps with alternative edge candidates, the batch
    // picked the wrong edge and downstream steps have a stale frontier —
    // fall back to per-step which handles cascade + depth chaining correctly.
    let intoResults = await executeViaQuery(seed, intoSteps, schema, tc);
    const needsCascade =
      intoResults &&
      intoSteps.some(
        (ann, i) =>
          intoResults?.[i].entities.length === 0 &&
          ann.allCandidates &&
          ann.allCandidates.length > 1,
      );
    if (!intoResults || needsCascade) {
      if (needsCascade) {
        tc.add({
          step: "cascadeFallback",
          kind: "fallback",
          message:
            "Batch has empty steps with alternatives — falling back to per-step cascade",
        });
      }
      intoResults = await executePerStep(seed, intoSteps, schema, tc);
    }

    // Phase 4: Execute enrich steps (with auto-fallback to connectivity)
    const enrichResults: StepResult[] = [];
    for (const idx of enrichIndices) {
      const step = cmd.steps[idx] as Extract<TraverseStep, { enrich: string }>;

      const allSoFar = [...intoResults, ...enrichResults].sort(
        (a, b) => a.step - b.step,
      );
      const prevStep = allSoFar
        .filter((r) => r.step < idx && r.entities.length > 0)
        .at(-1);
      const inputEntities = prevStep?.entities.length
        ? prevStep.entities
        : [seed];

      let result = await executeEnrichStep(step, idx, inputEntities, tc);

      if (!result) {
        result = await executeFallbackInto(
          step.enrich,
          idx,
          inputEntities,
          schema,
          step.top ?? 20,
          tc,
        );
      }

      if (result) enrichResults.push(result);
    }

    // Merge and sort by user step index
    const allResults = [...intoResults, ...enrichResults].sort(
      (a, b) => a.step - b.step,
    );

    // Build informative summary with human-readable context
    const stepSummaries = allResults.map((r) => {
      const n = r.entities.length;
      const names = r.entities
        .slice(0, 3)
        .map((e) => e.label)
        .filter(Boolean);
      const preview =
        names.length > 0
          ? ` (${names.join(", ")}${n > names.length ? ", …" : ""})`
          : "";
      const relationship = humanEdgeLabel(r.edgeType);
      const scoreInfo = r.scoreField
        ? `, ranked by ${humanScoreLabel(r.scoreField)}`
        : "";
      return `Step ${r.step + 1} → ${n} ${r.intent}${preview} — ${relationship}${scoreInfo}`;
    });

    // Determine if any steps failed
    const failedSteps = allResults.filter((r) => r.entities.length === 0);
    const hasPartialFailure =
      failedSteps.length > 0 && allResults.some((r) => r.entities.length > 0);

    const resultFn = hasPartialFailure ? partialResult : okResult;

    const seedContext = seed.subtitle ? ` (${seed.subtitle})` : "";
    return resultFn({
      text_summary: `Traversal from ${seed.label}${seedContext}:\n${stepSummaries.join("\n")}`,
      data: {
        _mode: "chain" as const,
        seed,
        steps: allResults.map((r) => ({
          intent: r.intent,
          edgeType: r.edgeType,
          edgeDescription: r.edgeDescription,
          scoreField: r.scoreField,
          count: r.entities.length,
          top: r.entities,
        })),
      },
      state_delta: { pinned_entities: [seed] },
      tc,
    });
  } catch (err) {
    return catchToResult(err, tc);
  }
}

/** Extract entities from chain result data for pipeline forwarding. */
export function extractChainEntities(
  data: Record<string, unknown>,
): EntityRef[] {
  const steps = data.steps as Array<{ top?: unknown[] }> | undefined;
  if (!steps) return [];
  // Take entities from last non-empty step
  for (let i = steps.length - 1; i >= 0; i--) {
    const top = steps[i].top;
    if (!top || top.length === 0) continue;
    const out: EntityRef[] = [];
    for (const e of top) {
      const ent = e as Record<string, unknown>;
      if (ent.type && ent.id && ent.label) {
        out.push({
          type: String(ent.type),
          id: String(ent.id),
          label: String(ent.label),
        });
      }
    }
    return out;
  }
  return [];
}
