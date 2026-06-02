/**
 * Run tool — command router with pre-gates, post-processing, and anti-spam.
 *
 * Flow: validate → preToolUse (schema + column fix) → handler → postToolUse (fingerprint + empty recovery) → escalateOnFailure
 */

import { tool } from "ai";
import { type ZodError, z } from "zod";
import {
  applyColumnCorrections,
  type ColumnRecovery,
  extractColumnRefs,
  recoverUnknownColumn,
} from "./column-match";
import { compactRunForModel, json } from "./compactify";
import {
  handleAnalytics,
  handleAnalyticsPoll,
  handleViz,
} from "./handlers/analytics";
import {
  handleCompute,
  handleCorrelation,
  handleDerive,
  handleGroupby,
  handlePrioritize,
  handleRows,
} from "./handlers/cohort";
import { handleExplore, handleTraverse } from "./handlers/graph";
import { handlePipeline } from "./handlers/pipeline";
import {
  handleCompareCohorts,
  handleGwasMinimal,
  handleQcSummary,
  handleTopHits,
  handleVariantProfile,
} from "./handlers/workflows";
import {
  handleCreateCohort,
  handleExport,
  handlePin,
  handleRemember,
  handleSetCohort,
} from "./handlers/workspace";
import {
  describeFilter,
  getFilters,
  hasFilters,
  isEmptyData,
  type NextAction,
  type Repair,
  recoverEmptyResult,
} from "./recovery";
import { errorResult } from "./run-result";
import {
  type CohortSchemaCache,
  fetchAndCacheSchema,
  getCachedSchema,
  getFingerprint,
} from "./schema-cache";
import {
  type EntityRef,
  type RunCommand,
  type RunResult,
  runCommandSchema,
} from "./types";

export type { EntityRef, RunCommand, RunResult } from "./types";
export { runCommandSchema } from "./types";

export interface RunContext {
  activeCohortId?: string;
  sessionId?: string;
  resolvedEntities?: Record<string, EntityRef>;
  schemaCache?: CohortSchemaCache;
  /** Per-session failure tracker — prevents cross-session contamination */
  failureTracker?: Map<string, number>;
  /** Number of empty-result probes already run this turn */
  probesThisTurn?: number;
}

type CommandHandler = (cmd: RunCommand, ctx: RunContext) => Promise<RunResult>;

const COMMAND_HANDLERS: Record<string, CommandHandler> = {
  // Cohort
  rows: (cmd, ctx) =>
    handleRows(
      cmd as Extract<RunCommand, { command: "rows" }>,
      ctx.activeCohortId,
    ),
  groupby: (cmd, ctx) =>
    handleGroupby(
      cmd as Extract<RunCommand, { command: "groupby" }>,
      ctx.activeCohortId,
    ),
  correlation: (cmd, ctx) =>
    handleCorrelation(
      cmd as Extract<RunCommand, { command: "correlation" }>,
      ctx.activeCohortId,
    ),
  derive: (cmd, ctx) =>
    handleDerive(
      cmd as Extract<RunCommand, { command: "derive" }>,
      ctx.activeCohortId,
    ),
  prioritize: (cmd, ctx) =>
    handlePrioritize(
      cmd as Extract<RunCommand, { command: "prioritize" }>,
      ctx.activeCohortId,
    ),
  compute: (cmd, ctx) =>
    handleCompute(
      cmd as Extract<RunCommand, { command: "compute" }>,
      ctx.activeCohortId,
    ),

  // Analytics
  analytics: (cmd, ctx) =>
    handleAnalytics(
      cmd as Extract<RunCommand, { command: "analytics" }>,
      ctx.activeCohortId,
    ),
  "analytics.poll": (cmd) =>
    handleAnalyticsPoll(
      cmd as Extract<RunCommand, { command: "analytics.poll" }>,
    ),
  viz: (cmd) => handleViz(cmd as Extract<RunCommand, { command: "viz" }>),

  // Workflow commands
  top_hits: (cmd, ctx) =>
    handleTopHits(cmd as Extract<RunCommand, { command: "top_hits" }>, ctx),
  qc_summary: (cmd, ctx) =>
    handleQcSummary(cmd as Extract<RunCommand, { command: "qc_summary" }>, ctx),
  gwas_minimal: (cmd, ctx) =>
    handleGwasMinimal(
      cmd as Extract<RunCommand, { command: "gwas_minimal" }>,
      ctx,
    ),
  variant_profile: (cmd, ctx) =>
    handleVariantProfile(
      cmd as Extract<RunCommand, { command: "variant_profile" }>,
      ctx,
    ),
  compare_cohorts: (cmd, ctx) =>
    handleCompareCohorts(
      cmd as Extract<RunCommand, { command: "compare_cohorts" }>,
      ctx,
    ),

  // Graph — 2 implicitly-routed primitives
  explore: (cmd, ctx) =>
    handleExplore(
      cmd as Extract<RunCommand, { command: "explore" }>,
      ctx.resolvedEntities,
    ),
  traverse: (cmd, ctx) =>
    handleTraverse(
      cmd as Extract<RunCommand, { command: "traverse" }>,
      ctx.resolvedEntities,
    ),

  // Pipeline
  pipeline: (cmd, ctx) =>
    handlePipeline(
      cmd as Extract<RunCommand, { command: "pipeline" }>,
      ctx,
      executeRun,
    ),

  // Workspace
  pin: (cmd) => handlePin(cmd as Extract<RunCommand, { command: "pin" }>),
  set_cohort: (cmd) =>
    handleSetCohort(cmd as Extract<RunCommand, { command: "set_cohort" }>),
  remember: (cmd, ctx) =>
    handleRemember(
      cmd as Extract<RunCommand, { command: "remember" }>,
      ctx.sessionId,
    ),
  export: (cmd, ctx) =>
    handleExport(
      cmd as Extract<RunCommand, { command: "export" }>,
      ctx.activeCohortId,
    ),
  create_cohort: (cmd) =>
    handleCreateCohort(
      cmd as Extract<RunCommand, { command: "create_cohort" }>,
    ),
};

// ---------------------------------------------------------------------------
// Command classification
// ---------------------------------------------------------------------------

const COHORT_COMMANDS = new Set([
  "rows",
  "groupby",
  "correlation",
  "derive",
  "prioritize",
  "compute",
  "analytics",
  "analytics.poll",
  "viz",
  "export",
  "create_cohort",
  "top_hits",
  "qc_summary",
  "gwas_minimal",
  "compare_cohorts",
]);

const NEEDS_SCHEMA = new Set([
  "rows",
  "groupby",
  "correlation",
  "prioritize",
  "compute",
  "analytics",
  "top_hits",
  "gwas_minimal",
]);

// ---------------------------------------------------------------------------
// Pre-gate: preventable error checks BEFORE handler dispatch
// ---------------------------------------------------------------------------

function getCohortIdFromCmd(
  cmd: Record<string, unknown>,
  activeCohortId?: string,
): string | null {
  const raw = (cmd.cohort_id as string) ?? activeCohortId ?? null;
  if (!raw) return null;
  // Strip common prefixes the LLM may echo from user input (e.g. "cohort/UUID")
  return raw.replace(/^cohort\//, "");
}

type PreToolResult =
  | { action: "block"; result: RunResult }
  | { action: "continue"; repairs?: Repair[] }
  | null;

async function preToolUse(
  cmd: RunCommand,
  ctx: RunContext,
): Promise<PreToolResult> {
  const cmdRecord = cmd as unknown as Record<string, unknown>;

  // Gate 1: Cohort required
  if (COHORT_COMMANDS.has(cmd.command)) {
    const cohortId = getCohortIdFromCmd(cmdRecord, ctx.activeCohortId);
    if (!cohortId && cmd.command !== "create_cohort") {
      return {
        action: "block",
        result: errorResult({
          message: "No active cohort.",
          code: "missing_param",
          next_actions: [
            {
              tool: "Run",
              args: { command: "set_cohort" },
              reason: "Set an active cohort first",
              confidence: 0.9,
            },
          ],
        }),
      };
    }

    // Gate 2: Auto-fetch schema if stale/missing
    if (cohortId && NEEDS_SCHEMA.has(cmd.command)) {
      try {
        const cached = getCachedSchema(cohortId);
        if (!cached || cached.cohortId !== cohortId) {
          ctx.schemaCache = await fetchAndCacheSchema(cohortId);
        } else {
          ctx.schemaCache = cached;
        }
      } catch (err) {
        console.warn(
          "[Run] Schema fetch failed, continuing without validation:",
          err instanceof Error ? err.message : err,
        );
      }
    }

    // Gate 3: Column validation + auto-correction
    // Always apply auto-fixable corrections first, then report ambiguities.
    if (ctx.schemaCache) {
      const columns = extractColumnRefs(cmdRecord);
      if (columns.length > 0) {
        const recoveries = columns.map((col) =>
          recoverUnknownColumn(col.name, ctx.schemaCache!, col.expectedKind),
        );

        const needsUser = recoveries.filter((r) => r.action === "needs_user");
        const autoFixed = recoveries.filter(
          (r) => r.action === "auto_corrected",
        );

        // Always apply auto-fixable corrections — even if some are ambiguous
        let repairs: Repair[] | undefined;
        if (autoFixed.length > 0) {
          applyColumnCorrections(cmdRecord, autoFixed);
          repairs = autoFixed
            .filter(
              (
                r,
              ): r is ColumnRecovery & {
                best_match: NonNullable<ColumnRecovery["best_match"]>;
              } => !!r.best_match,
            )
            .map((r) => ({
              field:
                columns.find((c) => c.name === r.input)?.field_path ??
                "unknown",
              received: r.input,
              corrected: r.best_match.column,
            }));
        }

        // If any columns are still ambiguous, report them (with corrections already applied)
        if (needsUser.length > 0) {
          const correctionNote = repairs?.length
            ? ` (auto-corrected: ${repairs.map((r) => `${r.received} → ${r.corrected}`).join(", ")})`
            : "";
          return {
            action: "block",
            result: errorResult({
              message: `Unknown columns: ${needsUser.map((r) => r.input).join(", ")}${correctionNote}`,
              code: "validation_error",
              repairs,
              next_actions: [
                ...needsUser.map(
                  (r): NextAction => ({
                    tool: "AskUser",
                    args: {
                      question: `Which column did you mean by "${r.input}"?`,
                      options: [
                        r.best_match?.column,
                        r.runner_up?.column,
                      ].filter(Boolean),
                    },
                    reason: r.reason,
                    reason_code: "column_ambiguous",
                  }),
                ),
                {
                  tool: "Read",
                  args: { path: `cohort/${cohortId}/schema` },
                  reason: "View all available columns",
                  confidence: 0.5,
                },
              ],
            }),
          };
        }

        // All columns resolved — pass repairs forward
        if (repairs?.length) {
          return { action: "continue", repairs };
        }
      }
    }
  }

  // Gate 4: Analytics feature count limit
  if (cmd.command === "analytics") {
    const analyticsCmd = cmd as Extract<RunCommand, { command: "analytics" }>;
    const params = analyticsCmd.params as { features?: { numeric?: string[] } };
    const numericCount = params?.features?.numeric?.length ?? 0;
    if (numericCount > 20) {
      return {
        action: "block",
        result: errorResult({
          message: `Too many features (${numericCount}, max 20).`,
          code: "validation_error",
          next_actions: [
            {
              tool: "Run",
              args: {
                command: "analytics",
                method: "feature_importance",
                params: { ...analyticsCmd.params, type: "feature_importance" },
              },
              reason:
                "Run feature_importance first to select the best features",
              confidence: 0.8,
            },
          ],
        }),
      };
    }
  }

  return null; // all gates passed
}

// ---------------------------------------------------------------------------
// Post-processing: enrichment (not recovery) AFTER handler success
// ---------------------------------------------------------------------------

async function postToolUse(
  cmd: RunCommand,
  result: RunResult,
  ctx: RunContext,
  repairs?: Repair[],
): Promise<RunResult> {
  // 1. Attach repairs from pre-gate column correction
  if (repairs?.length) {
    result.repairs = repairs;
  }

  // 2. Attach cohort fingerprint
  if (ctx.schemaCache && COHORT_COMMANDS.has(cmd.command) && result.data) {
    result.data._cohort = getFingerprint(ctx.schemaCache);
  }

  // 3. Empty result → probe-based recovery (for filtered commands)
  // Skip probing for exploratory commands or when we've already probed this turn
  const cmdRecord = cmd as unknown as Record<string, unknown>;
  const SKIP_PROBE_COMMANDS = new Set(["explore", "traverse"]);
  const maxProbesPerTurn = 2;
  const probesUsed = ctx.probesThisTurn ?? 0;

  if (
    result.status === "ok" &&
    isEmptyData(result.data) &&
    hasFilters(cmdRecord) &&
    !SKIP_PROBE_COMMANDS.has(cmd.command) &&
    probesUsed < maxProbesPerTurn
  ) {
    const cohortId = getCohortIdFromCmd(cmdRecord, ctx.activeCohortId);
    if (cohortId) {
      try {
        ctx.probesThisTurn = probesUsed + 1;
        const recovery = await recoverEmptyResult(
          cohortId,
          getFilters(cmdRecord),
          cmd.command,
        );
        return {
          ...result,
          status: "empty",
          data: {
            ...result.data,
            empty: true,
            reason: recovery.culprit_filter
              ? `Filter "${describeFilter(recovery.culprit_filter)}" eliminates all results`
              : "No results match these filters",
            probe_results: recovery.probe_results,
          },
          next_actions: recovery.next_actions,
        };
      } catch {
        // Probe failed — return original result with empty status
        return { ...result, status: "empty" };
      }
    }
  }

  // Mark empty even without probing
  if (result.status === "ok" && isEmptyData(result.data)) {
    return { ...result, status: "empty" };
  }

  return result;
}

// ---------------------------------------------------------------------------
// Anti-spam guard: graduated escalation on repeated failures
// ---------------------------------------------------------------------------

function escalateOnFailure(
  cmd: RunCommand,
  result: RunResult,
  ctx: RunContext,
): RunResult {
  if (result.status !== "error") return result;

  const tracker = (ctx.failureTracker ??= new Map());
  const key = cmd.command;
  const prev = tracker.get(key) ?? 0;
  const count = prev + 1;
  tracker.set(key, count);

  const cohortId = getCohortIdFromCmd(
    cmd as unknown as Record<string, unknown>,
    ctx.activeCohortId,
  );

  if (count === 2) {
    result.next_actions = [
      ...(result.next_actions ?? []),
      {
        tool: "Read",
        args: { path: `cohort/${cohortId}/schema` },
        reason: "Check available columns",
        confidence: 0.8,
      },
    ];
  } else if (count >= 3) {
    result.next_actions = [
      {
        tool: "AskUser",
        args: {
          question: `Command "${cmd.command}" failed ${count}× — how to proceed?`,
        },
        reason: "Repeated failures",
        confidence: 1.0,
      },
    ];
  }
  return result;
}

// ---------------------------------------------------------------------------
// Phase 3: Schema-first command validation
// ---------------------------------------------------------------------------

/** Required-field hints per command — shown in validation errors */
const COMMAND_HINTS: Record<string, string> = {
  rows: "Optional: select, filters, sort, desc, limit, offset",
  groupby: "Required: group_by. Optional: metrics, filters, bin_width, limit",
  correlation: "Required: x, y. Optional: filters",
  derive: "Required: filters (min 1). Optional: label",
  prioritize:
    "Required: criteria [{column, desc?, weight?}]. Optional: filters, limit",
  compute:
    "Required: weights [{column, weight}]. Optional: normalize, filters, limit",
  analytics:
    "Required: method, params (with type-specific fields). Optional: cohort_id",
  "analytics.poll": "Required: cohort_id, run_id",
  viz: "Required: cohort_id, run_id, chart_id. Optional: max_points",
  export: "Optional: cohort_id",
  create_cohort: "Required: references (min 1). Optional: label",
  top_hits:
    "Optional: criteria [{column, desc?, weight?}], filters, limit (default 10)",
  qc_summary: "Optional: cohort_id",
  gwas_minimal: "Required: p_column. Optional: effect_column, se_column_name",
  variant_profile: "Required: variants (max 5). Optional: cohort_id",
  compare_cohorts: "Required: cohort_ids [id1, id2], compare_on [columns]",
  explore:
    "Required: seeds (1-10). Routing is automatic from params: into→neighbors, seeds(2+)+into→compare, target→enrich, top_k→similar, sections→context, metric→aggregate",
  traverse:
    "Chain: seed+steps. Paths: from+to. Patterns: pattern/description. Don't combine steps with pattern.",
  pin: "Required: entities [{type, id, label}]",
  set_cohort: "Required: cohort_id",
  remember: "Required: key, content. Optional: value",
  pipeline:
    "Required: goal, plan_steps (min 2, max 8) [{id, command, args, depends_on?, seeds_from?}]. Must have at least one dependency.",
};

/** Format Zod issues into concise error lines */
function formatZodErrors(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
    return `${path}: ${issue.message}`;
  });
}

/**
 * Hoist pipeline step fields the LLM commonly nests inside args.
 * seeds_from, seeds_filter, depends_on belong at step level, not inside args.
 */
function normalizePipelineInput(flat: Record<string, unknown>): void {
  if (flat.command !== "pipeline") return;
  const steps = flat.plan_steps as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(steps)) return;
  for (const step of steps) {
    const args = step.args as Record<string, unknown> | undefined;
    if (!args || typeof args !== "object") continue;
    for (const field of ["seeds_from", "seeds_filter", "depends_on"]) {
      if (step[field] == null && args[field] != null) {
        step[field] = args[field];
        delete args[field];
      }
    }
  }
}

/**
 * Pre-fill analytics fields the LLM commonly omits.
 * `method` and `params.type` carry the same value — derive one from the other.
 * Also provide sensible defaults for required sub-fields.
 */
function normalizeAnalyticsInput(flat: Record<string, unknown>): void {
  if (flat.command !== "analytics") return;

  const params = flat.params as Record<string, unknown> | undefined;

  // Derive method ↔ params.type
  if (!flat.method && params?.type) {
    flat.method = params.type as string;
  } else if (flat.method && params && !params.type) {
    params.type = flat.method;
  }

  // If LLM sends method but no params at all, construct minimal params
  if (flat.method && !params) {
    flat.params = { type: flat.method };
  }

  const p = flat.params as Record<string, unknown> | undefined;
  if (!p) return;

  // Default features.missing to "median" — prevents backend from dropping all rows
  // with any null value (listwise deletion), which on sparse cohorts leaves < 10 rows.
  const features = p.features as Record<string, unknown> | undefined;
  if (features && !features.missing) {
    features.missing = "median";
  }

  // bootstrap_ci: default statistic to { stat: "mean" }
  if (p.type === "bootstrap_ci" && !p.statistic) {
    p.statistic = { stat: "mean" };
  }

  // Regression methods: default validation to holdout 20% if omitted
  const regressionTypes = new Set([
    "linear_regression",
    "logistic_regression",
    "elastic_net",
  ]);
  if (regressionTypes.has(p.type as string) && !p.validation) {
    p.validation = { split: "holdout", test_fraction: 0.2, seed: 42 };
  }

  // multiple_testing_correction: default method to "bh" if omitted
  if (p.type === "multiple_testing_correction" && !p.method) {
    p.method = "bh";
  }
}

/**
 * Validate flat LLM input against the typed RunCommand schema.
 * Returns validated RunCommand or a structured error result.
 */
function validateCommand(
  flat: Record<string, unknown>,
): { ok: true; cmd: RunCommand } | { ok: false; error: RunResult } {
  normalizePipelineInput(flat);
  normalizeAnalyticsInput(flat);

  const result = runCommandSchema.safeParse(flat);
  if (result.success) {
    return { ok: true, cmd: result.data };
  }

  const command = flat.command as string | undefined;
  const issues = formatZodErrors(result.error);
  const hint = command ? COMMAND_HINTS[command] : undefined;

  return {
    ok: false,
    error: errorResult({
      message: `Invalid ${command ?? "unknown"} command: ${issues.join("; ")}`,
      code: "validation_error",
      hint: hint ?? "Check the command documentation for required fields.",
      details: { issues },
    }),
  };
}

/**
 * Execute a Run command.
 * Flow: validate → preToolUse → handler → postToolUse → escalateOnFailure
 */
export async function executeRun(
  command: Record<string, unknown>,
  ctx: RunContext,
): Promise<RunResult> {
  const validated = validateCommand(command);
  if (!validated.ok) return validated.error;

  const cmd = validated.cmd;
  const handler = COMMAND_HANDLERS[cmd.command];
  if (!handler) {
    return errorResult({
      message: `Unknown command: ${cmd.command}`,
      code: "unknown_command",
    });
  }

  // --- Pre-gates (preventable errors only) ---
  const preResult = await preToolUse(cmd, ctx);
  if (preResult?.action === "block") return preResult.result;
  const repairs =
    preResult?.action === "continue" ? preResult.repairs : undefined;

  // --- Execute handler ---
  let result = await handler(cmd, ctx);

  // --- Post-processing (enrichment, not recovery) ---
  result = await postToolUse(cmd, result, ctx, repairs);

  // --- Anti-spam escalation ---
  result = escalateOnFailure(cmd, result, ctx);

  return result;
}

// ---------------------------------------------------------------------------
// Flat input schema for OpenAI compatibility
// OpenAI requires root schema type: "object" — z.discriminatedUnion produces
// oneOf at root which OpenAI rejects. Flatten all unions to plain objects.
// ---------------------------------------------------------------------------

const targetIntents = z.enum([
  "diseases",
  "drugs",
  "pathways",
  "variants",
  "phenotypes",
  "tissues",
  "genes",
  "proteins",
  "compounds",
  "protein_domains",
  "ccres",
  "side_effects",
  "go_terms",
  "metabolites",
  "signals",
  "drug_interactions",
  "adverse_effects",
  "drug_indications",
  "drug_targets",
  "drug_metabolism",
  "drug_response",
]);

const flatSeedRef = z.object({
  type: z
    .string()
    .optional()
    .describe("Entity type (e.g. Gene, Disease) — for exact ref"),
  id: z.string().optional().describe("Entity ID — for exact ref"),
  label: z
    .string()
    .optional()
    .describe("Fuzzy label for search (e.g. 'BRCA1')"),
  from_artifact: z
    .number()
    .optional()
    .describe("Artifact ID to extract entities from"),
  field: z.string().optional().describe("Field within artifact to extract"),
  from_cohort: z
    .string()
    .optional()
    .describe("Cohort ID to extract top entities from"),
  top: z.number().optional().describe("Number of top entities from cohort"),
});

const flatCohortFilter = z.object({
  type: z.enum([
    "chromosome",
    "gene",
    "consequence",
    "clinical_significance",
    "score_above",
    "score_below",
  ]),
  value: z.string().optional().describe("For chromosome filter"),
  values: z
    .array(z.string())
    .optional()
    .describe("For gene/consequence/clinical_significance"),
  field: z
    .string()
    .optional()
    .describe("Column name for score_above/score_below"),
  threshold: z
    .number()
    .optional()
    .describe("Threshold for score_above/score_below"),
});

const flatTraverseStep = z.object({
  into: targetIntents.optional().describe("Target intent for navigation step"),
  enrich: targetIntents.optional().describe("Target for enrichment step"),
  top: z.number().optional().describe("Max results for this step (default 20)"),
  sort: z
    .string()
    .optional()
    .describe(
      "Sort field, prefix '-' for desc (e.g. '-ot_score'). Default: best score for edge type",
    ),
  filters: z
    .record(z.unknown())
    .optional()
    .describe(
      'Edge property filters (field__op format, e.g. {"score__gte": 0.5})',
    ),
  overlay: z
    .boolean()
    .optional()
    .describe(
      "If true, only return edges between existing nodes — no new nodes added. For self-referential queries.",
    ),
  p_cutoff: z
    .number()
    .optional()
    .describe("P-value cutoff for enrichment steps (default 0.05)"),
});

const flatAnalyticsTask = z.object({
  type: z.enum([
    "linear_regression",
    "logistic_regression",
    "elastic_net",
    "cox_regression",
    "pca",
    "kmeans",
    "hierarchical_clustering",
    "feature_importance",
    "bootstrap_ci",
    "permutation_test",
    "multiple_testing_correction",
    "gwas_qc",
    "score_model",
  ]),
  features: z
    .object({
      numeric: z.array(z.string()),
      categorical: z.array(z.string()).optional(),
      transforms: z
        .array(
          z.object({
            type: z.enum(["log1p", "standardize", "min_max_scale"]),
            field: z.string().optional(),
            fields: z.array(z.string()).optional(),
          }),
        )
        .optional(),
      missing: z.enum(["median", "mean", "drop"]).optional(),
    })
    .optional(),
  target: z
    .object({
      field: z.string(),
      positive_values: z
        .array(z.string())
        .optional()
        .describe("For logistic regression binary target"),
    })
    .optional(),
  validation: z
    .object({
      split: z.enum(["holdout", "kfold"]),
      k: z.number().optional(),
      test_fraction: z.number().optional(),
      seed: z.number().optional(),
    })
    .optional(),
  regularization: z
    .object({
      penalty: z.enum(["l1", "l2", "elasticnet"]),
      l1_ratio: z.number().optional(),
      lambda: z.number().optional(),
    })
    .optional(),
  l1_ratio: z.number().optional(),
  lambda: z.number().optional(),
  time_column: z.string().optional(),
  event_column: z.string().optional(),
  n_components: z.number().optional(),
  k: z.number().optional(),
  max_iterations: z.number().optional(),
  seed: z.number().optional(),
  n_clusters: z.number().optional(),
  linkage: z.enum(["ward", "complete", "average", "single"]).optional(),
  method: z.string().optional(),
  n_repeats: z.number().optional(),
  statistic: z
    .object({ stat: z.string() })
    .optional()
    .describe("Bootstrap CI: {stat: 'mean'|'median'}"),
  columns: z.array(z.string()).optional(),
  n_bootstrap: z.number().optional(),
  confidence: z.number().optional(),
  x_column: z.string().optional(),
  y_column: z.string().optional(),
  n_permutations: z.number().optional(),
  p_value_column: z.string().optional(),
  effect_size_column: z.string().optional(),
  se_column: z.string().optional(),
  model_run_id: z.string().optional(),
  output_column: z.string().optional(),
});

const criterion = z.object({
  column: z.string(),
  desc: z.boolean().optional(),
  weight: z.number().optional(),
});

const weight = z.object({
  column: z.string(),
  weight: z.number(),
});

/**
 * Flat input schema (root type: "object").
 * All command fields merged as optional. The `command` enum discriminator
 * tells the model which fields apply. Handlers cast to the narrow type.
 */
const runInputSchema = z.object({
  command: z.enum([
    "rows",
    "groupby",
    "correlation",
    "derive",
    "prioritize",
    "compute",
    "analytics",
    "analytics.poll",
    "viz",
    "export",
    "create_cohort",
    "top_hits",
    "qc_summary",
    "gwas_minimal",
    "variant_profile",
    "compare_cohorts",
    "explore",
    "traverse",
    "pin",
    "set_cohort",
    "remember",
    "pipeline",
  ]),

  // --- Cohort common ---
  cohort_id: z
    .string()
    .optional()
    .describe("Cohort ID (uses active cohort if omitted)"),

  // --- rows ---
  select: z.array(z.string()).optional().describe("Columns to return (rows)"),
  filters: z.array(flatCohortFilter).optional().describe("Cohort filters"),
  sort: z.string().optional().describe("Sort column (rows, explore)"),
  desc: z.boolean().optional().describe("Sort descending (rows)"),
  limit: z
    .number()
    .optional()
    .describe(
      "Max results (default 10 for rows; only increase when user asks)",
    ),
  offset: z.number().optional().describe("Pagination offset (rows)"),

  // --- groupby ---
  group_by: z.string().optional().describe("Column to group by"),
  metrics: z
    .array(z.string())
    .optional()
    .describe("Aggregate metrics (groupby)"),
  bin_width: z.number().optional().describe("Numeric bin width (groupby)"),

  // --- correlation ---
  x: z.string().optional().describe("X column (correlation)"),
  y: z.string().optional().describe("Y column (correlation)"),

  // --- derive / create_cohort ---
  label: z
    .string()
    .optional()
    .describe("Label for derived cohort or created cohort"),

  // --- prioritize ---
  criteria: z
    .array(criterion)
    .optional()
    .describe("Ranking criteria [{column, desc?, weight?}]"),

  // --- compute ---
  weights: z
    .array(weight)
    .optional()
    .describe("Weighted score [{column, weight}]"),
  normalize: z
    .boolean()
    .optional()
    .describe("Normalize before scoring (compute)"),

  // --- analytics ---
  method: z.string().optional().describe("Analytics method name"),
  params: flatAnalyticsTask.optional().describe("Analytics task parameters"),

  // --- analytics.poll / viz ---
  run_id: z.string().optional().describe("Analytics run ID"),
  chart_id: z.string().optional().describe("Chart ID (viz)"),
  max_points: z.number().optional().describe("Max chart points (viz)"),

  // --- create_cohort ---
  references: z
    .array(z.string())
    .optional()
    .describe("Variant references (rsIDs or chr-pos-ref-alt)"),

  // --- workflow: top_hits ---
  // criteria (reused from prioritize), filters, limit

  // --- workflow: gwas_minimal ---
  p_column: z
    .string()
    .optional()
    .describe("P-value column name (gwas_minimal)"),
  effect_column: z
    .string()
    .optional()
    .describe("Effect size column name (gwas_minimal)"),
  se_column_name: z
    .string()
    .optional()
    .describe("Standard error column name (gwas_minimal)"),

  // --- workflow: variant_profile ---
  variants: z
    .array(z.string())
    .optional()
    .describe("Variant IDs to profile (max 5, variant_profile)"),

  // --- workflow: compare_cohorts ---
  cohort_ids: z
    .array(z.string())
    .optional()
    .describe("Two cohort IDs to compare (compare_cohorts)"),
  compare_on: z
    .array(z.string())
    .optional()
    .describe("Columns to compare on (compare_cohorts)"),

  // --- explore (auto-routed from params) ---
  seeds: z
    .array(flatSeedRef)
    .optional()
    .describe("Seed entity refs (explore, traverse patterns)"),
  into: z
    .array(targetIntents)
    .optional()
    .describe("Target intents (explore neighbors)"),
  edge_type: z
    .string()
    .optional()
    .describe("Edge type (explore compare/aggregate)"),
  direction: z
    .enum(["in", "out"])
    .optional()
    .describe("Edge direction (explore compare/aggregate)"),
  target: targetIntents.optional().describe("Target intent (explore enrich)"),
  p_cutoff: z.number().optional().describe("P-value cutoff (explore enrich)"),
  edge_types: z
    .array(z.string())
    .optional()
    .describe("Edge types filter (explore similar)"),
  top_k: z
    .number()
    .optional()
    .describe("Top K similar entities (explore similar)"),
  sections: z
    .array(z.string())
    .optional()
    .describe("Context sections (explore context)"),
  context_depth: z
    .enum(["minimal", "standard", "detailed"])
    .optional()
    .describe("Context depth (explore context)"),
  metric: z
    .enum(["count", "avg", "sum", "min", "max"])
    .optional()
    .describe("Aggregation metric (explore aggregate)"),
  score_field: z
    .string()
    .optional()
    .describe("Score field for aggregation (explore aggregate)"),

  // --- traverse (auto-routed: seed+steps→chain, from+to→paths, pattern/description→patterns) ---
  seed: flatSeedRef.optional().describe("Single seed ref (traverse chain)"),
  steps: z
    .array(flatTraverseStep)
    .max(5)
    .optional()
    .describe("Traversal steps (traverse chain, max 5)"),
  from: z
    .string()
    .optional()
    .describe("Source entity 'Type:ID' (traverse paths)"),
  to: z
    .string()
    .optional()
    .describe("Target entity 'Type:ID' (traverse paths)"),
  max_hops: z.number().optional().describe("Max path hops (traverse paths)"),
  // --- traverse patterns (structural pattern matching) ---
  description: z
    .string()
    .optional()
    .describe("Natural language pattern description (traverse patterns)"),
  pattern: z
    .array(
      z.object({
        var: z.string(),
        type: z.string().optional(),
        edge: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
      }),
    )
    .optional()
    .describe("Structural pattern (traverse patterns)"),
  return_vars: z
    .array(z.string())
    .optional()
    .describe("Variables to return (traverse patterns)"),

  // --- pin ---
  entities: z
    .array(flatSeedRef)
    .optional()
    .describe("For pin: [{type, id, label}]"),

  // --- remember ---
  key: z.string().optional().describe("Memory key (remember)"),
  content: z.string().optional().describe("Memory content (remember)"),
  value: z
    .record(z.unknown())
    .optional()
    .describe("Structured value (remember)"),

  // --- pipeline ---
  goal: z.string().optional().describe("Pipeline goal (pipeline only)"),
  plan_steps: z
    .array(
      z.object({
        id: z.string(),
        command: z.string(),
        args: z.record(z.unknown()),
        description: z.string().optional(),
        depends_on: z.array(z.string()).optional(),
        seeds_from: z.string().optional(),
        seeds_filter: z
          .object({
            type: z
              .string()
              .optional()
              .describe("Entity type to forward (e.g. 'cCRE', 'Gene', 'Drug')"),
          })
          .optional()
          .describe("Filter entities forwarded from seeds_from by type"),
      }),
    )
    .optional()
    .describe("Pipeline steps (min 2, max 8, pipeline only)"),
});

/**
 * Create the Run tool for the AI SDK.
 */
export function createRunTool(getContext: () => RunContext) {
  return tool({
    description: `Execute work against the knowledge graph or cohort data.

COMMANDS:
  COHORT (needs active cohort): rows, groupby, correlation, derive, prioritize, compute, export, create_cohort
  ANALYTICS: analytics { method, params }
  WORKFLOWS (needs active cohort): top_hits, qc_summary, gwas_minimal, compare_cohorts
  GRAPH (no cohort needed): explore, traverse
  ENTITY LOOKUP: variant_profile (uses "variants" field, NOT "references")
  WORKSPACE: pin, set_cohort, remember

EXPLORE — auto-routed from params:
  seeds+into → neighbors, 2 seeds+into → compare, target → enrich,
  top_k → similar, sections/context_depth → context, metric+edge_type → aggregate

TRAVERSE — auto-routed from params:
  seed+steps → chain, from+to → paths, pattern/description → patterns
  Step fields: into, top, sort, filters (EDGE properties only: {field__op: value}), overlay (boolean), enrich, p_cutoff

SEEDS: {label:"BRCA1"} for fuzzy lookup. {type:"Gene",id:"ENSG..."} for exact. Never combine label with type/id.

DRUG INTENTS: Pharmacogenes (CYP*, UGT*, ABC*) → drug_metabolism. Drug targets (EGFR, BRAF) → drug_targets. Unsure → drugs (cascades all three).

ANALYTICS: method must match params.type.
  features: { numeric: [...] } (object). target: { field: "..." } (object).
  gwas_qc: { p_value_column, effect_size_column, se_column } — no features/target.

PIPELINE: { goal, plan_steps: [{id, command, args, depends_on?, seeds_from?, seeds_filter?}] }
  seeds_from and seeds_filter go at STEP level, NOT inside args.
  seeds_filter: {type?} — filter piped entities by entity type.
  INTERSECT step: {"id":"overlap","command":"intersect","args":{},"depends_on":["step1","step2"]}
    Virtual step — zero API calls. Computes entity ID intersection across depends_on steps.
    Downstream steps use seeds_from:"overlap" to continue from shared entities.
  UNION step: {"id":"merged","command":"union","args":{},"depends_on":["step1","step2"]}
    Virtual step — zero API calls. Merges entities from all depends_on steps (deduplicated).

INTENTS: diseases, drugs, pathways, variants, phenotypes, tissues, genes, proteins, compounds,
  protein_domains, ccres, go_terms, metabolites, studies, signals,
  drug_targets, drug_metabolism, drug_response, adverse_effects, drug_indications, drug_interactions

EXAMPLE — trace gene through diseases to drugs:
{"command":"traverse","seed":{"label":"BRCA1"},"steps":[{"into":"diseases","top":10},{"into":"drug_indications"}]}

See system prompt for: intent selection by seed type, drug intent decision tree, pattern examples, recovery rules.`,
    inputSchema: runInputSchema,
    execute: async (cmd) => {
      const ctx = getContext();
      return executeRun(cmd as Record<string, unknown>, ctx);
    },
    toModelOutput: async (opts: {
      toolCallId: string;
      input: unknown;
      output: unknown;
    }) => {
      const cmd = opts.input as { command: string };
      const result = opts.output as RunResult;
      // Pass through errors, disambiguation, and empty results uncompacted (LLM needs full context)
      if (
        result.status === "error" ||
        result.status === "needs_user" ||
        result.status === "empty" ||
        result.data?.error
      ) {
        return json(result);
      }
      return compactRunForModel(cmd.command, result);
    },
  });
}
