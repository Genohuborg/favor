/**
 * compactify.ts — Compact Run tool output for model context.
 *
 * execute() returns full data for the frontend (p.output).
 * toModelOutput calls compactRunForModel to give the model a trimmed view:
 *   - status + text_summary (always)
 *   - top-K preview of large arrays
 *   - _truncation metadata when data was trimmed
 *   - state_delta / artifacts / next_reads pass through
 *   - trace / warnings / candidates / budgets_remaining pass through
 */

import { COMPACT_EDGE_FIELDS } from "./edge-field-constants";
import { humanEdgeLabel, humanScoreLabel } from "./handlers/graph";
import type {
  AggregateResultData,
  ChainResultData,
  CompareResultData,
  ContextResultData,
  NeighborsResultData,
  PatternsResultData,
  SimilarResultData,
} from "./result-data-types";
import type { NextAction, RunResult } from "./types";

interface TruncationInfo {
  truncated: true;
  returned: number;
  total: number;
  reason?: "max_rows" | "max_points" | "token_budget" | "detail_level";
  how_to_get_more?: NextAction;
  hint?: string;
}

/** Cast to satisfy ToolResultOutput's JSONValue constraint */
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue | undefined };
type CompactValue = { type: "json"; value: JSONValue };

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function compactRunForModel(
  command: string,
  result: RunResult,
): CompactValue {
  if (result.status === "error" || result.data?.error) {
    return json(result);
  }

  const compactor = COMPACTORS[command];
  if (!compactor) return json(buildEnvelope(result));

  const compactData = compactor(result.data ?? {});
  return json(buildEnvelope(result, compactData));
}

/** Build the model-facing envelope with all new fields */
function buildEnvelope(
  result: RunResult,
  compactData?: Record<string, unknown>,
): Record<string, unknown> {
  const envelope: Record<string, unknown> = {
    status: result.status,
    text_summary: result.text_summary,
    data: compactData ?? result.data,
    state_delta: result.state_delta,
  };

  if (result.artifacts?.length) envelope.artifacts = result.artifacts;
  if (result.next_reads?.length) envelope.next_reads = result.next_reads;
  if (result.warnings?.length) envelope.warnings = result.warnings;
  if (result.trace?.length) envelope.trace = result.trace;
  if (result.candidates?.length) envelope.candidates = result.candidates;
  if (result.resolved_info) envelope.resolved_info = result.resolved_info;
  if (result.budgets_remaining)
    envelope.budgets_remaining = result.budgets_remaining;
  if (result.error) envelope.error = result.error;
  if (result.repairs?.length) envelope.repairs = result.repairs;
  if (result.next_actions?.length) envelope.next_actions = result.next_actions;
  if (result.incomplete) {
    envelope.incomplete = true;
    if (result.next_cursor != null) envelope.next_cursor = result.next_cursor;
  }

  return envelope;
}

// ---------------------------------------------------------------------------
// Per-command compactors
// ---------------------------------------------------------------------------

type Compactor = (data: Record<string, unknown>) => Record<string, unknown>;

const COMPACTORS: Record<string, Compactor> = {
  rows: compactRows,
  groupby: compactGroupby,
  correlation: compactCorrelation,
  derive: compactDerive,
  prioritize: compactPrioritize,
  compute: compactCompute,
  explore: compactExplore,
  traverse: compactTraverse,
  analytics: compactAnalytics,
  "analytics.poll": compactAnalyticsPoll,
  viz: compactViz,
  // Workflow compactors
  top_hits: compactTopHits,
  qc_summary: passthrough,
  gwas_minimal: compactGwasMinimal,
  variant_profile: compactVariantProfile,
  compare_cohorts: passthrough,
  // Pipeline
  pipeline: compactPipeline,
  // Virtual pipeline steps — small results, pass through
  intersect: passthrough,
  union: passthrough,
  // Workspace compactors — small results, pass through
  pin: passthrough,
  set_cohort: passthrough,
  remember: passthrough,
  export: passthrough,
  create_cohort: passthrough,
};

function compactCorrelation(
  data: Record<string, unknown>,
): Record<string, unknown> {
  // Correlation can return a large matrix — extract top correlations only
  const out: Record<string, unknown> = {
    x: data.x,
    y: data.y,
  };
  if (typeof data.r === "number") out.r = Math.round(data.r * 10000) / 10000;
  if (typeof data.p_value === "number") out.p_value = data.p_value;
  if (typeof data.n === "number") out.n = data.n;

  // If there's a full matrix, extract top 10 pairs by |r|
  const matrix = asArray(data.matrix);
  if (matrix.length > 0) {
    const pairs = matrix as Array<Record<string, unknown>>;
    const sorted = [...pairs]
      .sort(
        (a, b) =>
          Math.abs((b.r as number) ?? 0) - Math.abs((a.r as number) ?? 0),
      )
      .slice(0, 10);
    out.top_correlations = sorted;
    if (matrix.length > 10) {
      out._truncation = truncation(
        10,
        matrix.length,
        "Top correlations by |r|. Use rows to see full data.",
      );
    }
  }
  return out;
}

function compactDerive(data: Record<string, unknown>): Record<string, unknown> {
  // Don't send full row data for derived cohorts — just the metadata
  return {
    cohort_id: data.cohort_id ?? data.id,
    label: data.label,
    row_count: data.row_count ?? data.total,
    filters_applied: data.filters,
    parent_id: data.parent_id,
    // Include a small columnar preview if rows are present
    ...(data.rows
      ? (() => {
          const { columns: previewCols, rows: previewRows } = compactCohortRows(
            asArray(data.rows).slice(0, 3),
          );
          return {
            preview_columns: previewCols,
            preview_rows: previewRows,
            _truncation:
              asArray(data.rows).length > 3
                ? truncation(
                    3,
                    asArray(data.rows).length,
                    "Use rows command on the new cohort for full data.",
                  )
                : undefined,
          };
        })()
      : {}),
  };
}

function compactAnalyticsPoll(
  data: Record<string, unknown>,
): Record<string, unknown> {
  if (data.status === "running" || data.status === "queued") {
    return {
      status: data.status,
      run_id: data.run_id ?? data.runId,
      progress: data.progress,
    };
  }
  // Completed — use the analytics compactor
  return compactAnalytics(data);
}

function compactViz(data: Record<string, unknown>): Record<string, unknown> {
  // Viz returns chart data for the frontend — model only needs metadata
  return {
    chart_id: data.chart_id,
    chart_type: data.chart_type,
    title: data.title,
    rendered: true,
    point_count: asArray(
      (data.data as Record<string, unknown>)?.points ??
        (data.data as Record<string, unknown>)?.bars ??
        [],
    ).length,
  };
}

function compactRows(data: Record<string, unknown>): Record<string, unknown> {
  const rows = asArray(data.rows);
  const total = asNumber(data.total, rows.length);
  const { columns, rows: compactData } = compactCohortRows(rows);

  const out: Record<string, unknown> = {
    _format: "columnar",
    columns,
    rows: compactData,
    total,
  };
  if (rows.length > 10) {
    out._truncation = truncation(rows.length, total);
  }
  return out;
}

function compactGroupby(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const buckets = asArray(data.buckets);
  const totalGroups = asNumber(data.total_groups, buckets.length);
  const top = buckets.slice(0, 10);

  const out: Record<string, unknown> = {
    group_by: data.group_by,
    buckets: top,
    total_groups: totalGroups,
  };
  if (buckets.length > 10) {
    out.otherBucketsCount = buckets.length - 10;
    out._truncation = truncation(
      10,
      buckets.length,
      "use groupby with filters to narrow",
    );
  }
  return out;
}

function compactPrioritize(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const rows = asArray(data.rows);
  const totalRanked = asNumber(data.total_ranked, rows.length);
  const { columns, rows: compactData } = compactCohortRows(rows.slice(0, 5));

  const out: Record<string, unknown> = {
    _format: "columnar",
    criteria: data.criteria,
    columns,
    rows: compactData,
    total_ranked: totalRanked,
  };
  if (rows.length > 5) {
    out._truncation = truncation(5, rows.length);
  }
  return out;
}

function compactCompute(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const rows = asArray(data.rows);
  const totalScored = asNumber(data.total_scored, rows.length);
  const { columns, rows: compactData } = compactCohortRows(rows.slice(0, 5));

  const out: Record<string, unknown> = {
    _format: "columnar",
    columns,
    rows: compactData,
    total_scored: totalScored,
  };
  if (rows.length > 5) {
    out._truncation = truncation(5, rows.length);
  }
  return out;
}

function compactExplore(
  data: Record<string, unknown>,
): Record<string, unknown> {
  // Dispatch on _mode discriminator (handlers always set this)
  switch (data._mode) {
    case "neighbors":
      return compactExploreNeighbors(data);
    case "compare":
      return compactExploreCompare(data);
    case "enrich":
      return data; // already compact from handler
    case "similar":
      return compactExploreSimilar(data);
    case "context":
      return compactExploreContext(data);
    case "aggregate":
      return compactExploreAggregate(data);
    default:
      return data;
  }
}

function compactExploreNeighbors(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const d = data as unknown as NeighborsResultData;
  const results = d.results;
  if (!results) return data;

  const compactResults: Record<string, unknown> = {};
  const renderedTables: {
    intent: string;
    relationship: string;
    markdown: string;
    shown: number;
    total: number;
  }[] = [];

  const TABLE_K = 5;
  const LIST_K = 10;

  for (const [key, branch] of Object.entries(results)) {
    const allTop = branch.top as unknown as Ent[];
    const tableTop = allTop.slice(0, TABLE_K);
    const listTop = allTop.slice(0, LIST_K);
    const relationship = humanEdgeLabel(branch.edgeType);

    const table = renderEntityTable(tableTop, {
      scoreField: branch.scoreField,
      showProvenance: true,
    });
    if (table) {
      renderedTables.push({
        intent: key,
        relationship,
        markdown: table,
        shown: tableTop.length,
        total: branch.count,
      });
    }

    const branchObj: Record<string, unknown> = {
      count: branch.count,
      relationship,
      top: listTop.map(minimalEntity),
      ...(allTop.length > LIST_K
        ? {
            _truncation: truncation(
              LIST_K,
              allTop.length,
              "explore with narrower intent for more",
            ),
          }
        : {}),
    };
    if (branch.availableRelationships?.length) {
      branchObj.availableRelationships = branch.availableRelationships;
    }
    compactResults[key] = branchObj;
  }

  const out: Record<string, unknown> = {
    results: compactResults,
    resolved_seeds: d.resolved_seeds,
  };
  if (renderedTables.length) out.rendered = { tables: renderedTables };
  if (d.enrichment)
    out.enrichment = compactEnrichmentBlock(
      d.enrichment as Record<string, unknown>,
    );
  if (d._method) out._method = d._method;
  if (d._proteinDomains) out._proteinDomains = d._proteinDomains;
  return out;
}

/** Compact auto-enrichment block: strip subtitles, map overlapping entities to labels. */
function compactEnrichmentBlock(
  block: Record<string, unknown>,
): Record<string, unknown> {
  const items = asArray(block.enriched);
  if (items.length === 0) return block;

  const compact = items.slice(0, 20).map((raw) => {
    const e = raw as Record<string, unknown>;
    const entity = e.entity as Record<string, unknown> | undefined;
    // Map overlappingEntities (objects or strings) → label strings
    const overlap = asArray(e.overlappingEntities).map((o) =>
      typeof o === "string"
        ? o
        : (((o as Record<string, unknown>).label as string) ?? "?"),
    );
    return {
      entity: entity
        ? { type: entity.type, id: entity.id, label: entity.label }
        : e.entity,
      overlap: e.overlap,
      pValue: e.pValue,
      adjustedPValue: e.adjustedPValue,
      foldEnrichment: e.foldEnrichment,
      overlappingEntities: overlap.slice(0, 5),
    };
  });

  return { enriched: compact };
}

function compactExploreCompare(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const d = data as unknown as CompareResultData;
  const out: Record<string, unknown> = {};
  if (d._method) out._method = d._method;
  if (d.entities) out.entities = d.entities;
  if (d.relationship) out.relationship = d.relationship;

  // Same-type compare: comparisons + overallSimilarity
  if (d.comparisons) out.comparisons = d.comparisons;
  if (d.overallSimilarity) out.overallSimilarity = d.overallSimilarity;

  // Mixed-type compare: sharedNeighbors
  if (d.sharedNeighbors) {
    const shared = d.sharedNeighbors.slice(0, 10) as Ent[];
    out.sharedNeighbors = shared.map(minimalEntity);
    const table = renderEntityTable(shared, {
      scoreField: undefined,
      showProvenance: false,
    });
    if (table)
      out.rendered = {
        tables: [
          {
            intent: "shared",
            relationship: "shared neighbors",
            markdown: table,
            shown: shared.length,
            total: d.sharedNeighbors.length,
          },
        ],
      };
    if (d.sharedNeighbors.length > 10) {
      out._truncation = truncation(10, d.sharedNeighbors.length);
    }
  }
  if (d.counts) out.counts = d.counts;
  return out;
}

function compactExploreSimilar(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const d = data as unknown as SimilarResultData;
  const out: Record<string, unknown> = {};
  if (d._method) out._method = d._method;
  if (d.seed) out.seed = d.seed;
  if (d.method) out.method = d.method;

  const similar = d.similar ?? [];
  out.similar = (similar.slice(0, 5) as Ent[]).map(minimalEntity);
  if (similar.length > 5) {
    out._truncation = truncation(5, similar.length);
  }
  return out;
}

function compactExploreContext(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const d = data as unknown as ContextResultData;
  const entities = d.entities ?? [];
  const out: Record<string, unknown> = {
    entities: (entities.slice(0, 10) as Ent[]).map(minimalEntity),
  };
  if (entities.length > 10) {
    const byType: Record<string, number> = {};
    for (const e of entities) {
      const t = ((e as Ent).type as string) ?? "unknown";
      byType[t] = (byType[t] ?? 0) + 1;
    }
    out.entity_type_counts = byType;
    out._truncation = truncation(
      10,
      entities.length,
      `${entities.length - 10} more entities available. Filter by type for specifics.`,
    );
  }
  return out;
}

function compactExploreAggregate(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const d = data as unknown as AggregateResultData;
  const out: Record<string, unknown> = {};
  if (d.seed) out.seed = d.seed;
  if (d.relationship) out.relationship = d.relationship;
  else if (d.edgeType) out.relationship = humanEdgeLabel(d.edgeType);
  if (d.metric) out.metric = d.metric;
  if (d.value !== undefined) out.value = d.value;
  if (d.buckets) {
    const buckets = d.buckets;
    out.buckets = buckets.slice(0, 10);
    if (buckets.length > 10) {
      out._truncation = truncation(10, buckets.length);
    }
  }
  return out;
}

/** Passthrough entity — keep all fields, just trim long strings and round numbers. */
function minimalEntity(e: Ent): Ent {
  const out: Ent = {};
  for (const [k, v] of Object.entries(e)) {
    if (v == null) continue;
    // Drop text-heavy display fields (rendered table already covers these)
    if (TEXT_HEAVY_KEYS.has(k)) continue;
    if (typeof v === "number") {
      out[k] = Number.isInteger(v) ? v : Math.round(v * 10000) / 10000;
    } else if (typeof v === "object" && !Array.isArray(v)) {
      // edgeProperties — pass through, just cap field count
      out[k] = capEdgeProperties(v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** Keys whose values are long display strings — already in rendered tables. */
const TEXT_HEAVY_KEYS = new Set([
  "subtitle",
  "description",
  "summary",
  "definition",
  "edgeDescription",
  "function",
  "abstract",
]);

function compactTraverse(
  data: Record<string, unknown>,
): Record<string, unknown> {
  // Dispatch on _mode discriminator
  switch (data._mode) {
    case "patterns":
      return compactPatterns(data);
    case "paths":
      return data; // paths are already compact (path nodes are essential)
    case "chain":
      return compactTraverseChain(data);
    default:
      break; // fall through for legacy (no _mode)
  }

  // Legacy fallback: field-sniffing for results without _mode
  if (asArray(data.matches).length > 0) return compactPatterns(data);
  if (data.steps) return compactTraverseChain(data);
  return data;
}

function compactTraverseChain(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const d = data as unknown as ChainResultData;
  const steps = d.steps;
  if (!steps) return data;

  const TOP_K = 10;
  const renderedTables: {
    step: string;
    relationship: string;
    markdown: string;
    shown: number;
    total: number;
  }[] = [];

  const compactSteps = steps.map((s, i) => {
    const relationship = s.edgeDescription
      ? s.edgeDescription.replace(/:.*$/, "").trim()
      : s.edgeType
        ? humanEdgeLabel(s.edgeType)
        : undefined;
    const scoreContext = s.scoreField
      ? humanScoreLabel(s.scoreField)
      : undefined;

    const topEntities = asArray(s.top)
      .slice(0, TOP_K)
      .map((e) => {
        const ent = e as Ent;
        const out: Ent = {};
        for (const [k, v] of Object.entries(ent)) {
          if (v == null) continue;
          if (typeof v === "string") {
            out[k] = TEXT_HEAVY_KEYS.has(k) ? truncateStr(v, 80) : v;
          } else if (typeof v === "number") {
            out[k] = Number.isInteger(v) ? v : Math.round(v * 10000) / 10000;
          } else if (
            k === "edgeProperties" &&
            typeof v === "object" &&
            !Array.isArray(v)
          ) {
            out[k] = capEdgeProperties(v as Record<string, unknown>);
          } else {
            out[k] = v;
          }
        }
        return out;
      });

    const table = renderEntityTable(topEntities, {
      scoreField: s.scoreField,
      showProvenance: true,
      showSupport: true,
    });
    if (table) {
      renderedTables.push({
        step: `Step ${i + 1}: ${s.intent} (via ${relationship ?? s.edgeType ?? "?"})`,
        relationship: relationship ?? s.intent,
        markdown: table,
        shown: topEntities.length,
        total: s.count,
      });
    }

    const slimEntities = topEntities.map(minimalEntity);

    return {
      intent: s.intent,
      count: s.count,
      ...(relationship ? { relationship } : {}),
      ...(scoreContext ? { scoreContext } : {}),
      top: slimEntities,
      ...(s.top.length > TOP_K
        ? { _truncation: truncation(TOP_K, s.top.length) }
        : {}),
    };
  });

  return {
    seed: d.seed,
    steps: compactSteps,
    ...(renderedTables.length ? { rendered: { tables: renderedTables } } : {}),
  };
}

function compactPatterns(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const d = data as unknown as PatternsResultData;
  const matches = d.matches ?? [];
  const totalMatches = d.totalMatches ?? matches.length;
  const top = matches.slice(0, 5);

  const out: Record<string, unknown> = {
    pattern: d.pattern,
    matches: top,
    totalMatches,
  };
  if (matches.length > 5) {
    out._truncation = truncation(
      5,
      matches.length,
      "add filters or narrow pattern for more",
    );
  }
  // Strip the large `nodes` map — model doesn't need it
  return out;
}

function compactAnalytics(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const charts = asArray(data.charts);
  // Keep chart metadata (type, title, chart_id) but strip raw point arrays
  // The frontend already has the full data from p.output; model only needs summaries
  const compactCharts = charts.map((c) => {
    const chart = c as Record<string, unknown>;
    const chartData = chart.data as Record<string, unknown> | undefined;
    const pointCount = chartData
      ? asArray(chartData.points).length || asArray(chartData.bars).length || 0
      : 0;
    return {
      chart_id: chart.chart_id,
      chart_type: chart.chart_type,
      title: chart.title,
      point_count: pointCount,
    };
  });

  return {
    taskType: data.taskType,
    runId: data.runId,
    summary: data.summary,
    metrics: data.metrics,
    charts: compactCharts,
    _cohort: data._cohort,
  };
}

// ---------------------------------------------------------------------------
// Workflow compactors
// ---------------------------------------------------------------------------

function passthrough(data: Record<string, unknown>): Record<string, unknown> {
  return data;
}

function compactTopHits(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const rows = asArray(data.rows);
  const totalRanked = asNumber(data.total_ranked, rows.length);
  const { columns, rows: compactData } = compactCohortRows(rows.slice(0, 10));

  const out: Record<string, unknown> = {
    _format: "columnar",
    criteria: data.criteria,
    columns,
    rows: compactData,
    total_ranked: totalRanked,
  };
  if (data.filtered_count !== undefined)
    out.filtered_count = data.filtered_count;
  if (rows.length > 10) {
    out._truncation = truncation(10, totalRanked, "max_rows", {
      tool: "Run",
      args: { command: "rows", sort: "composite_score", desc: true, limit: 50 },
      reason: "Fetch more ranked variants",
    });
  }
  return out;
}

function compactGwasMinimal(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const { columns, rows: compactData } = compactCohortRows(
    asArray(data.top_hits).slice(0, 10),
  );
  return {
    _format: "columnar",
    p_column: data.p_column,
    correction: data.correction,
    qc: data.qc,
    top_hits_columns: columns,
    top_hits: compactData,
    total_variants: data.total_variants,
  };
}

function compactVariantProfile(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const profiles = asArray(data.profiles).slice(0, 5).map(compactOneProfile);
  const out: Record<string, unknown> = { profiles };
  if (data.cohort_rows) {
    const { columns, rows } = compactCohortRows(
      asArray(data.cohort_rows).slice(0, 5),
    );
    out.cohort_rows_columns = columns;
    out.cohort_rows = rows;
  }
  return out;
}

/** Extract a structured, LLM-friendly summary from a single variant profile. */
function compactOneProfile(raw: unknown): Record<string, unknown> {
  const p = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {
    variant: p.variant,
    ...(p.resolvedId ? { resolvedId: p.resolvedId } : {}),
    ...(p.label ? { label: p.label } : {}),
    ...(p.error ? { error: p.error } : {}),
  };

  const entity = p.entity as Record<string, unknown> | undefined;
  if (!entity) return out;

  const d = (entity.data ?? {}) as Record<string, unknown>;
  const included = (entity.included ?? {}) as Record<string, unknown>;
  const counts = (included.counts ?? {}) as Record<string, number>;
  // API returns relations (with rows[].neighbor + rows[].link), not edges
  const relations = (included.relations ?? {}) as Record<
    string,
    { rows?: unknown[] }
  >;

  // — Identity
  if (d.chromosome) out.chromosome = d.chromosome;
  if (d.position) out.position = d.position;
  if (d.ref) out.ref = d.ref;
  if (d.alt) out.alt = d.alt;

  // — Gene context
  if (d.gencode_gene_id) out.gene = d.gencode_gene_id;

  // — Key scores
  const scores = stripNulls({
    gnomad_af: d.gnomad_af,
    cadd_phred: d.cadd_phred,
    linsight: d.linsight,
    fathmm_xf: d.fathmm_xf,
    phylop_mammals: d.phylop_mammals,
    phylop_vertebrates: d.phylop_vertebrates,
  });
  if (Object.keys(scores).length) out.scores = scores;

  // — cCRE
  if (d.ccre_accessions) {
    out.ccre = stripNulls({
      accession: d.ccre_accessions,
      annotation: d.ccre_annotations,
    });
  }

  // — ClinVar
  const clinvar = stripNulls({
    significance: d.clinvar_significance ?? d.clinvar_clnsig,
    review_status: d.clinvar_review_status,
  });
  if (Object.keys(clinvar).length) out.clinvar = clinvar;

  // — Relation counts (compact: type → count)
  const relationCounts: Array<{ type: string; count: number }> = [];
  for (const [k, v] of Object.entries(counts)) {
    if (v > 0) relationCounts.push({ type: k, count: v });
  }
  relationCounts.sort((a, b) => b.count - a.count);
  if (relationCounts.length) out.relationCounts = relationCounts;

  // — Top relations per edge type (from included.relations)
  // Skip noisy edge types that waste context budget
  const SKIP_EDGE_TYPES = new Set(["SIGNAL_HAS_VARIANT"]);
  const topRelations: Record<string, unknown[]> = {};
  for (const [edgeType, group] of Object.entries(relations)) {
    if (SKIP_EDGE_TYPES.has(edgeType)) continue;
    const rows = asArray(group?.rows);
    if (!rows.length) continue;

    const seen = new Set<string>();
    const compact: Record<string, unknown>[] = [];
    for (const row of rows) {
      const r = row as Record<string, unknown>;
      const neighbor = r.neighbor as Record<string, unknown> | undefined;
      const link = r.link as Record<string, unknown> | undefined;
      if (!neighbor) continue;

      const nId = String(neighbor.id ?? "");
      if (!nId || seen.has(nId)) continue;
      seen.add(nId);

      const item: Record<string, unknown> = {
        name: neighbor.label ?? neighbor.name ?? nId,
        type: neighbor.type,
        id: nId,
      };

      // Extract curated edge props from link.props
      const props = (link?.props ?? {}) as Record<string, unknown>;
      const edgeProps = compactEdgeProps(edgeType, props);
      if (edgeProps) item.evidence = edgeProps;

      compact.push(item);
      if (compact.length >= 3) break;
    }

    if (compact.length) {
      topRelations[edgeType] = compact;
    }
  }
  if (Object.keys(topRelations).length) out.topRelations = topRelations;
  out.totalNeighborTypes = Object.keys(counts).filter(
    (k) => counts[k] > 0,
  ).length;

  return out;
}

/** Pick only informative edge props per edge type. */
function compactEdgeProps(
  edgeType: string,
  props: Record<string, unknown>,
): Record<string, unknown> | null {
  const keepFields = COMPACT_EDGE_FIELDS[edgeType];
  if (!keepFields) return null;

  const out: Record<string, unknown> = {};
  for (const field of keepFields) {
    if (props[field] != null) out[field] = props[field];
  }
  return Object.keys(out).length > 0 ? out : null;
}

function stripNulls(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null));
}

// ---------------------------------------------------------------------------
// Pipeline compactor
// ---------------------------------------------------------------------------

function compactPipeline(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const stepResults = asArray(data.step_results);
  const compactSteps = stepResults.map((sr) => {
    const step = sr as Record<string, unknown>;
    if (step.status === "error" || step.status === "skipped") {
      return {
        id: step.id,
        command: step.command,
        status: step.status,
        summary: step.summary,
        skip_reason: step.skip_reason,
      };
    }
    const cmd = step.command as string;
    // Depth guard: never recurse into another pipeline compactor
    if (cmd === "pipeline") {
      return {
        id: step.id,
        command: cmd,
        status: "error",
        summary: "Nested pipeline rejected",
      };
    }
    const compactor: Compactor | undefined = COMPACTORS[cmd];
    const stepData = step.data as Record<string, unknown> | undefined;
    const compactData =
      compactor != null && stepData ? compactor(stepData) : stepData;
    return {
      id: step.id,
      command: cmd,
      status: step.status,
      summary: step.summary,
      data: compactData,
      ...(step.entities
        ? { entities: asArray(step.entities).slice(0, 5) }
        : {}),
      ...(step.entities_meta ? { entities_meta: step.entities_meta } : {}),
    };
  });
  return {
    goal: data.goal,
    steps_ok: stepResults.filter(
      (s) => (s as Record<string, unknown>).status === "ok",
    ).length,
    steps_total: stepResults.length,
    step_results: compactSteps,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Cohort row compaction — columnar format, strip nulls/empties/internals
// ---------------------------------------------------------------------------

/** Fields the model never needs (internal IDs, redundant positional/annotation data). */
const COHORT_ROW_DROP_KEYS = new Set([
  // Internal IDs & positional
  "row_id",
  "raw_ref",
  "ref_type",
  "status",
  "error",
  "vid",
  "chrom_id",
  "position0",
  "is_hashed",
  "hash30",
  "pos_bin_1m",
  // Redundant with rsid / genecode
  "dbsnp_rsid_all",
  "ucsc_region_type",
  "ucsc_transcripts",
  "ucsc_consequence",
  "ucsc_exonic_details",
  "refseq_region_type",
  "refseq_transcripts",
  "refseq_consequence",
  "refseq_exonic_details",
]);

/** Returns true if a value is "empty" (null, "", [], {}). */
function isEmpty(v: unknown): boolean {
  if (v == null) return true;
  if (typeof v === "string" && v === "") return true;
  if (Array.isArray(v) && v.length === 0) return true;
  if (
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.keys(v as object).length === 0
  )
    return true;
  return false;
}

/** Round floats to 4 decimal places. */
function compactValue(v: unknown): unknown {
  if (typeof v === "number" && !Number.isInteger(v)) {
    return Math.round(v * 10000) / 10000;
  }
  return v;
}

interface ColumnarRows {
  /** Column names — key for each positional value in rows */
  columns: string[];
  /** Array of value-tuples, one per row, positionally matching columns */
  rows: unknown[][];
}

/**
 * Convert an array of cohort row objects into columnar format.
 * Strips null/empty values, internal keys, and rounds floats.
 *
 * { columns: ["variant_vcf","chromosome","linsight"], rows: [["10-1315797-G-A","10",33.49], ...] }
 *
 * ~6-8x more token-efficient than repeating keys per row.
 */
function compactCohortRows(rawRows: unknown[]): ColumnarRows {
  // Pass 1: strip each row, collect union of surviving keys (preserving order)
  const cleaned: Record<string, unknown>[] = [];
  const columnSet = new Map<string, number>(); // key → insertion order
  for (const raw of rawRows) {
    const row = raw as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) {
      if (COHORT_ROW_DROP_KEYS.has(k)) continue;
      if (isEmpty(v)) continue;
      out[k] = compactValue(v);
      if (!columnSet.has(k)) columnSet.set(k, columnSet.size);
    }
    cleaned.push(out);
  }

  const columns = [...columnSet.keys()];

  // Pass 2: build positional value arrays
  const rows = cleaned.map((row) => columns.map((col) => row[col] ?? null));

  return { columns, rows };
}

export function json(value: unknown): CompactValue {
  return { type: "json", value: value as JSONValue };
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function asNumber(v: unknown, fallback: number): number {
  return typeof v === "number" ? v : fallback;
}

function truncateStr(s: string | undefined, max: number): string | undefined {
  if (!s || s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

/** Keep at most 12 edge properties, prioritising score/evidence fields. */
const PRIORITY_EDGE_PATTERNS = [
  /score/i,
  /evidence/i,
  /p_value/i,
  /confidence/i,
  /phase/i,
  /mechanism/i,
  /causality/i,
  /level/i,
  /source/i,
  /affinity/i,
];

function capEdgeProperties(
  props: Record<string, unknown>,
): Record<string, unknown> {
  const MAX = 12;
  const entries = Object.entries(props).filter(
    ([k, v]) => v != null && !TEXT_HEAVY_KEYS.has(k),
  );
  if (entries.length <= MAX) return Object.fromEntries(entries);

  // Partition into priority vs rest
  const priority: [string, unknown][] = [];
  const rest: [string, unknown][] = [];
  for (const entry of entries) {
    if (PRIORITY_EDGE_PATTERNS.some((p) => p.test(entry[0]))) {
      priority.push(entry);
    } else {
      rest.push(entry);
    }
  }
  const kept = [...priority, ...rest].slice(0, MAX);
  return Object.fromEntries(kept);
}

function truncation(
  returned: number,
  total: number,
  reason?: TruncationInfo["reason"] | string,
  how_to_get_more?: NextAction,
): TruncationInfo {
  // When called with old 3-arg signature (returned, total, hint_string)
  if (
    typeof reason === "string" &&
    !["max_rows", "max_points", "token_budget", "detail_level"].includes(reason)
  ) {
    return { truncated: true, returned, total, hint: reason };
  }
  return {
    truncated: true,
    returned,
    total,
    ...(reason ? { reason: reason as TruncationInfo["reason"] } : {}),
    ...(how_to_get_more ? { how_to_get_more } : {}),
  };
}

// ---------------------------------------------------------------------------
// Pre-rendering: score interpretation + markdown tables
// ---------------------------------------------------------------------------

interface ScoreThreshold {
  min: number;
  label: string;
}

/** Score field → ordered thresholds (highest first). */
const SCORE_THRESHOLDS: Record<string, ScoreThreshold[]> = {
  ot_score: [
    { min: 0.8, label: "very strong" },
    { min: 0.5, label: "strong" },
    { min: 0.3, label: "moderate" },
    { min: 0, label: "weak" },
  ],
  l2g_score: [
    { min: 0.5, label: "high confidence" },
    { min: 0.2, label: "moderate" },
    { min: 0, label: "low confidence" },
  ],
  cadd_phred: [
    { min: 30, label: "top 0.1% deleterious" },
    { min: 20, label: "top 1% deleterious" },
    { min: 10, label: "top 10%" },
    { min: 0, label: "benign-range" },
  ],
  alphamissense_pathogenicity: [
    { min: 0.564, label: "pathogenic" },
    { min: 0.34, label: "ambiguous" },
    { min: 0, label: "benign" },
  ],
  max_clinical_phase: [
    { min: 4, label: "approved" },
    { min: 3, label: "phase III" },
    { min: 2, label: "phase II" },
    { min: 1, label: "phase I" },
    { min: 0, label: "preclinical" },
  ],
  affinity_median: [
    { min: 9, label: "sub-nM" },
    { min: 7, label: "nM-range" },
    { min: 5, label: "µM-range" },
    { min: 0, label: "weak" },
  ],
  combined_score: [
    { min: 0.9, label: "highest confidence" },
    { min: 0.7, label: "high confidence" },
    { min: 0.4, label: "medium confidence" },
    { min: 0, label: "low confidence" },
  ],
  score: [
    { min: 0.8, label: "very strong" },
    { min: 0.5, label: "strong" },
    { min: 0.3, label: "moderate" },
    { min: 0, label: "weak" },
  ],
  max_score: [
    { min: 0.8, label: "very strong" },
    { min: 0.5, label: "strong" },
    { min: 0.3, label: "moderate" },
    { min: 0, label: "weak" },
  ],
  gnomad_af: [
    { min: 0.01, label: "common" },
    { min: 0.0001, label: "rare" },
    { min: 0, label: "ultra-rare" },
  ],
  gwas_p_mlog: [
    { min: 7.3, label: "genome-wide significant" },
    { min: 5, label: "suggestive" },
    { min: 0, label: "not significant" },
  ],
};

/** Render a numeric score with its human-readable meaning. */
function renderScore(score: number, scoreField?: string): string {
  const rounded = Math.round(score * 10000) / 10000;
  if (!scoreField) return `${rounded}`;
  const thresholds = SCORE_THRESHOLDS[scoreField];
  if (!thresholds) return `${rounded}`;
  for (const t of thresholds) {
    if (score >= t.min) return `${rounded} (${t.label})`;
  }
  return `${rounded}`;
}

/** Extract a short provenance string from edge properties. */
function extractProvenance(
  edgeProps: Record<string, unknown> | undefined,
): string {
  if (!edgeProps) return "";
  const parts: string[] = [];
  if (edgeProps.causality_level) parts.push(String(edgeProps.causality_level));
  if (edgeProps.mechanism_of_action)
    parts.push(String(edgeProps.mechanism_of_action));
  if (edgeProps.implication_mode)
    parts.push(String(edgeProps.implication_mode));
  if (edgeProps.variant_consequence)
    parts.push(String(edgeProps.variant_consequence));
  if (
    typeof edgeProps.evidence_count === "number" &&
    edgeProps.evidence_count > 1
  ) {
    parts.push(`${edgeProps.evidence_count} sources`);
  }
  if (typeof edgeProps.max_clinical_phase === "number") {
    parts.push(renderScore(edgeProps.max_clinical_phase, "max_clinical_phase"));
  }
  if (typeof edgeProps.l2g_score === "number") {
    parts.push(`L2G ${renderScore(edgeProps.l2g_score, "l2g_score")}`);
  }
  if (Array.isArray(edgeProps.sources) && edgeProps.sources.length > 0) {
    const names = edgeProps.sources as string[];
    parts.push(
      names.length <= 3
        ? names.join(", ")
        : `${names.slice(0, 3).join(", ")} +${names.length - 3}`,
    );
  }
  return parts.join(" — ");
}

type Ent = Record<string, unknown>;

/** Build a markdown table from entities. Columns adapt to what data is present. */
function renderEntityTable(
  entities: Ent[],
  opts: {
    scoreField?: string;
    showProvenance?: boolean;
    showSupport?: boolean;
  },
): string {
  if (entities.length === 0) return "";

  // Determine which optional columns have data
  const hasScore = entities.some((e) => typeof e.score === "number");
  const hasPValue = entities.some((e) => typeof e.pValue === "number");
  const hasFold = entities.some((e) => typeof e.foldEnrichment === "number");
  const hasSupport =
    opts.showSupport &&
    entities.some((e) => typeof e.supportCount === "number");
  const hasProvenance =
    opts.showProvenance && entities.some((e) => e.edgeProperties);

  // Build header — use the actual field names so the column self-identifies.
  // Score column carries the data field's name (e.g. "ot_score", "l2g_score",
  // "cadd_phred"); only generic "score" stays generic. No hand-curated label
  // map — the field name IS the label, and humanScoreLabel covers any prose
  // gloss the agent needs separately via scoreContext.
  const entityType = entities[0]?.type;
  const cols: string[] = [entityType ? String(entityType) : "Name"];
  if (hasScore) cols.push(opts.scoreField ?? "score");
  if (hasPValue) cols.push("p-value");
  if (hasFold) cols.push("fold enrichment");
  if (hasSupport) cols.push("source seeds");
  if (hasProvenance) cols.push("provenance");
  cols.push("subtitle");

  const header = `| ${cols.join(" | ")} |`;
  const sep = `|${cols.map(() => "---").join("|")}|`;

  const rows = entities.map((e) => {
    const cells: string[] = [String(e.label ?? e.id ?? "?")];
    if (hasScore)
      cells.push(
        typeof e.score === "number"
          ? renderScore(e.score, opts.scoreField)
          : "–",
      );
    if (hasPValue)
      cells.push(
        typeof e.pValue === "number" ? e.pValue.toExponential(1) : "–",
      );
    if (hasFold)
      cells.push(
        typeof e.foldEnrichment === "number"
          ? `${Math.round(e.foldEnrichment * 10) / 10}×`
          : "–",
      );
    if (hasSupport)
      cells.push(
        typeof e.supportCount === "number" ? `${e.supportCount}` : "–",
      );
    if (hasProvenance)
      cells.push(
        extractProvenance(
          e.edgeProperties as Record<string, unknown> | undefined,
        ),
      );
    cells.push(truncateStr(String(e.subtitle ?? ""), 60) ?? "");
    return `| ${cells.join(" | ")} |`;
  });

  return [header, sep, ...rows].join("\n");
}
