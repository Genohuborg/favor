/**
 * RunCommand tagged union — the command DSL for the Run tool.
 * Each command maps to 1+ backend API calls.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared sub-schemas
// ---------------------------------------------------------------------------

const cohortFilterSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("chromosome"),
    value: z.string(),
  }),
  z.object({
    type: z.literal("gene"),
    values: z.array(z.string()),
  }),
  z.object({
    type: z.literal("consequence"),
    values: z.array(z.string()),
  }),
  z.object({
    type: z.literal("clinical_significance"),
    values: z.array(z.string()),
  }),
  z.object({
    type: z.literal("score_above"),
    field: z.string(),
    threshold: z.number(),
  }),
  z.object({
    type: z.literal("score_below"),
    field: z.string(),
    threshold: z.number(),
  }),
]);

export type CohortFilter = z.infer<typeof cohortFilterSchema>;

const seedRefSchema = z.union([
  z.object({ type: z.string(), id: z.string() }),
  z.object({ label: z.string() }),
  z.object({ from_artifact: z.number(), field: z.string().optional() }),
  z.object({ from_cohort: z.string(), top: z.number().optional() }),
]);

export type SeedRef = z.infer<typeof seedRefSchema>;

const targetIntentSchema = z.enum([
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

export type TargetIntent = z.infer<typeof targetIntentSchema>;

const traverseStepSchema = z.union([
  z.object({
    into: targetIntentSchema,
    top: z.number().min(1).optional(),
    sort: z.string().optional(),
    filters: z.record(z.unknown()).optional(),
    overlay: z.boolean().optional(),
  }),
  z.object({
    enrich: targetIntentSchema,
    p_cutoff: z.number().optional(),
    top: z.number().min(1).optional(),
  }),
]);

export type TraverseStep = z.infer<typeof traverseStepSchema>;

const criterionSchema = z.object({
  column: z.string(),
  desc: z.boolean().optional(),
  weight: z.number().optional(),
});

const weightSchema = z.object({
  column: z.string(),
  weight: z.number(),
});

// ---------------------------------------------------------------------------
// Pipeline step schema
// ---------------------------------------------------------------------------

const seedsFilterSchema = z
  .object({
    type: z.string().optional(),
  })
  .optional();

const pipelineStepSchema = z.object({
  id: z.string(),
  command: z.string(),
  args: z.record(z.unknown()),
  description: z.string().optional(),
  depends_on: z.array(z.string()).optional(),
  seeds_from: z.string().optional(),
  seeds_filter: seedsFilterSchema,
});

export type PipelineStep = z.infer<typeof pipelineStepSchema>;

// ---------------------------------------------------------------------------
// Analytics task schema (reuse from cohort-analytics)
// ---------------------------------------------------------------------------

const featureSpec = z.object({
  numeric: z.array(z.string()).min(1),
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
});

const targetSpec = z.object({ field: z.string() });

const binaryTargetSpec = z.object({
  field: z.string(),
  positive_values: z.array(z.string()),
});

const validationSpec = z
  .object({
    split: z.enum(["holdout", "kfold"]),
    k: z.number().optional(),
    test_fraction: z.number().optional(),
    seed: z.number().optional(),
  })
  .optional();

const analyticsTaskSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("linear_regression"),
    target: targetSpec,
    features: featureSpec,
    validation: validationSpec,
  }),
  z.object({
    type: z.literal("logistic_regression"),
    target: binaryTargetSpec,
    features: featureSpec,
    regularization: z
      .object({
        penalty: z.enum(["l1", "l2", "elasticnet"]),
        l1_ratio: z.number().optional(),
        lambda: z.number().optional(),
      })
      .optional(),
    validation: validationSpec,
  }),
  z.object({
    type: z.literal("elastic_net"),
    target: targetSpec,
    features: featureSpec,
    l1_ratio: z.number(),
    lambda: z.number(),
    validation: validationSpec,
  }),
  z.object({
    type: z.literal("cox_regression"),
    time_column: z.string(),
    event_column: z.string(),
    features: featureSpec,
  }),
  z.object({
    type: z.literal("pca"),
    features: featureSpec,
    n_components: z.number().max(50).optional(),
  }),
  z.object({
    type: z.literal("kmeans"),
    features: featureSpec,
    k: z.number().min(1).max(50),
    max_iterations: z.number().optional(),
    seed: z.number().optional(),
  }),
  z.object({
    type: z.literal("hierarchical_clustering"),
    features: featureSpec,
    n_clusters: z.number().min(1).max(50),
    linkage: z.enum(["ward", "complete", "average", "single"]).optional(),
  }),
  z.object({
    type: z.literal("feature_importance"),
    target: targetSpec,
    features: featureSpec,
    method: z.string().optional(),
    n_repeats: z.number().optional(),
    seed: z.number().optional(),
  }),
  z.object({
    type: z.literal("bootstrap_ci"),
    statistic: z.object({ stat: z.string() }).optional(),
    columns: z.array(z.string()),
    n_bootstrap: z.number().max(10000).optional(),
    confidence: z.number().optional(),
    seed: z.number().optional(),
  }),
  z.object({
    type: z.literal("permutation_test"),
    x_column: z.string(),
    y_column: z.string(),
    statistic: z.string().optional(),
    n_permutations: z.number().max(10000).optional(),
    seed: z.number().optional(),
  }),
  z.object({
    type: z.literal("multiple_testing_correction"),
    p_value_column: z.string(),
    method: z.enum(["bh", "bonferroni", "holm"]).optional(),
  }),
  z.object({
    type: z.literal("gwas_qc"),
    p_value_column: z.string(),
    effect_size_column: z.string(),
    se_column: z.string(),
  }),
  z.object({
    type: z.literal("score_model"),
    model_run_id: z.string(),
    output_column: z.string().optional(),
  }),
]);

// ---------------------------------------------------------------------------
// Run command schema — tagged union on `command`
// ---------------------------------------------------------------------------

export const runCommandSchema = z.discriminatedUnion("command", [
  // Cohort commands
  z.object({
    command: z.literal("rows"),
    cohort_id: z
      .string()
      .optional()
      .describe("Cohort ID (uses active cohort if omitted)"),
    select: z.array(z.string()).optional(),
    filters: z.array(cohortFilterSchema).optional(),
    sort: z.string().optional(),
    desc: z.boolean().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
  z.object({
    command: z.literal("groupby"),
    cohort_id: z.string().optional(),
    group_by: z.string(),
    metrics: z.array(z.string()).optional(),
    filters: z.array(cohortFilterSchema).optional(),
    bin_width: z.number().optional(),
    limit: z.number().optional(),
  }),
  z.object({
    command: z.literal("correlation"),
    cohort_id: z.string().optional(),
    x: z.string(),
    y: z.string(),
    filters: z.array(cohortFilterSchema).optional(),
  }),
  z.object({
    command: z.literal("derive"),
    cohort_id: z.string().optional(),
    filters: z.array(cohortFilterSchema).min(1),
    label: z.string().optional(),
  }),
  z.object({
    command: z.literal("prioritize"),
    cohort_id: z.string().optional(),
    criteria: z.array(criterionSchema).min(1),
    filters: z.array(cohortFilterSchema).optional(),
    limit: z.number().optional(),
  }),
  z.object({
    command: z.literal("compute"),
    cohort_id: z.string().optional(),
    weights: z.array(weightSchema).min(1),
    filters: z.array(cohortFilterSchema).optional(),
    normalize: z.boolean().optional(),
    limit: z.number().optional(),
  }),
  z.object({
    command: z.literal("analytics"),
    cohort_id: z.string().optional(),
    method: z.string(),
    params: analyticsTaskSchema,
  }),
  z.object({
    command: z.literal("analytics.poll"),
    cohort_id: z.string(),
    run_id: z.string(),
  }),
  z.object({
    command: z.literal("viz"),
    cohort_id: z.string(),
    run_id: z.string(),
    chart_id: z.string(),
    max_points: z.number().optional(),
  }),
  z.object({
    command: z.literal("export"),
    cohort_id: z.string().optional(),
  }),
  z.object({
    command: z.literal("create_cohort"),
    references: z.array(z.string()).min(1),
    label: z.string().optional(),
  }),

  // Workflow commands — multi-step in one call
  z.object({
    command: z.literal("top_hits"),
    cohort_id: z.string().optional(),
    criteria: z.array(criterionSchema).optional(),
    filters: z.array(cohortFilterSchema).optional(),
    limit: z.number().optional(),
  }),
  z.object({
    command: z.literal("qc_summary"),
    cohort_id: z.string().optional(),
  }),
  z.object({
    command: z.literal("gwas_minimal"),
    cohort_id: z.string().optional(),
    p_column: z.string(),
    effect_column: z.string().optional(),
    se_column_name: z.string().optional(),
  }),
  z.object({
    command: z.literal("variant_profile"),
    cohort_id: z.string().optional(),
    variants: z.array(z.string()).min(1).max(5),
  }),
  z.object({
    command: z.literal("compare_cohorts"),
    cohort_ids: z.array(z.string()).length(2),
    compare_on: z.array(z.string()).min(1),
  }),

  // Graph commands — 3 mode-dispatched primitives
  z.object({
    command: z.literal("explore"),
    seeds: z.array(seedRefSchema).min(1).max(10),
    // neighbors
    into: z.array(targetIntentSchema).optional(),
    limit: z.number().min(1).optional(),
    // compare (intersect)
    edge_type: z.string().optional(),
    direction: z.enum(["in", "out"]).optional(),
    // enrich
    target: targetIntentSchema.optional(),
    p_cutoff: z.number().optional(),
    // similar
    edge_types: z.array(z.string()).optional(),
    top_k: z.number().min(1).optional(),
    // context
    sections: z
      .array(z.enum(["summary", "neighbors", "evidence", "ontology"]))
      .optional(),
    context_depth: z.enum(["minimal", "standard", "detailed"]).optional(),
    // aggregate
    metric: z.enum(["count", "avg", "sum", "min", "max"]).optional(),
    group_by: z.string().optional(),
    score_field: z.string().optional(),
    filters: z.record(z.unknown()).optional(),
  }),
  z.object({
    command: z.literal("traverse"),
    // chain
    seed: seedRefSchema.optional(),
    steps: z.array(traverseStepSchema).max(5).optional(),
    // paths
    from: z.string().optional().describe("Entity ref: 'Type:ID'"),
    to: z.string().optional().describe("Entity ref: 'Type:ID'"),
    max_hops: z.number().min(1).optional(),
    limit: z.number().min(1).optional(),
    // patterns (merged from query)
    description: z
      .string()
      .optional()
      .describe("Natural language description of the pattern"),
    seeds: z.array(seedRefSchema).optional(),
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
      .optional(),
    return_vars: z.array(z.string()).optional(),
    filters: z.record(z.unknown()).optional(),
    select: z
      .object({
        includeEvidence: z.boolean().optional(),
      })
      .optional(),
  }),

  // Pipeline — multi-step execution
  z.object({
    command: z.literal("pipeline"),
    cohort_id: z.string().optional(),
    goal: z.string(),
    plan_steps: z.array(pipelineStepSchema).min(2).max(8),
  }),

  // Workspace commands
  z.object({
    command: z.literal("pin"),
    entities: z
      .array(
        z.object({
          type: z.string(),
          id: z.string(),
          label: z.string(),
        }),
      )
      .min(1),
  }),
  z.object({
    command: z.literal("set_cohort"),
    cohort_id: z.string(),
  }),
  z.object({
    command: z.literal("remember"),
    key: z.string(),
    content: z.string(),
    value: z.record(z.unknown()).optional(),
  }),
]);

export type RunCommand = z.infer<typeof runCommandSchema>;

// ---------------------------------------------------------------------------
// Run result — output contract (canonical envelope)
// ---------------------------------------------------------------------------

export interface EntityRef {
  type: string;
  id: string;
  label: string;
  subtitle?: string;
}

export type { ToolErrorCode } from "./error-classify";
export type { GraphResultData } from "./result-data-types";
export type {
  BudgetsRemaining,
  Candidate,
  NextAction,
  Repair,
  ResolvedInfo,
  RunResultEnvelope as RunResult,
  ToolError,
  ToolStatus,
  ToolWarning,
  TraceEntry,
} from "./run-result";
