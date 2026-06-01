/**
 * Read tool — path-based dispatch.
 * Replaces: getResultSlice, getCohortSchema (full), getEntityContext, lookupVariant, getEdgeDetail
 */

import { tool } from "ai";
import { z } from "zod";
import { AgentToolError, agentFetch, cohortFetch } from "../lib/api-client";

/** Internal columns to filter from schema */
const INTERNAL_COLUMNS = new Set([
  "variants_vid",
  "variants_chrom_id",
  "variants_position0",
  "variants_hash30",
  "variants_pos_bin_1m",
  "variants_is_hashed",
  "variants_position",
  "row_id",
]);

// ---------------------------------------------------------------------------
// Entity field curation — per-type field maps for LLM-optimized output
// ---------------------------------------------------------------------------

/** Fields to keep per entity type. Any field not listed is dropped. */
const ENTITY_KEEP_FIELDS: Record<string, string[]> = {
  Gene: [
    "gene_symbol",
    "gene_name",
    "chromosome",
    "start_position",
    "end_position",
    "strand",
    "gene_type",
    "cyto_location",
    "aliases",
    // Key identifiers
    "hgnc_id",
    "entrez_id",
    "uniprot_id",
    "omim_id",
    // Scores & flags
    "essentiality",
    "depmap_avg_gene_effect",
    "depmap_is_essential",
    "tp_is_cancer_driver",
    "tp_is_membrane",
    "tp_is_secreted",
    "tp_has_pocket",
    "tp_has_ligand",
    "tp_max_clinical_phase",
    "tp_genetic_constraint",
    "tp_tissue_specificity",
    "tp_tissue_distribution",
    "dgidb_categories",
    "is_canonical",
    // Compact nested (handled specially)
    "constraint_scores",
    "go",
    "pathways",
    "disease_phenotype",
  ],
  Drug: [
    "drug_name",
    "drug_type",
    "max_phase",
    "is_approved",
    "year_first_approval",
    "mechanisms_of_action",
    "action_types",
    "pharmacologic_classes",
    // Key PK
    "molecular_weight",
    "half_life",
    "bioavailability",
    "oral",
    "parenteral",
    // Flags
    "has_been_withdrawn",
    "black_box_warning",
    "has_orphan_designation",
    "is_prodrug",
    "natural_product",
    // Key IDs
    "drugbank_id",
    "pubchem_cid",
    // Counts
    "num_targets",
    "num_indications",
    // Display
    "trade_names",
  ],
  Disease: [
    "disease_name",
    "is_cancer",
    "is_rare_disease",
    "therapeutic_area_names",
    "primary_anatomical_systems",
    "disorder_type",
    "majority_inheritance_mode",
    // Gene & drug counts
    "causal_gene_count",
    "clinical_gene_count",
    "associated_gene_count",
    "drug_count",
    "max_trial_phase",
    // Clinical classification
    "gencc_max_classification",
    "gencc_gene_count",
    // Prevalence (compact)
    "point_prevalence_class",
    "sex_bias",
    // Key IDs
    "mondo_id",
    "omim_id",
    "orphanet_id",
    // Synonyms (capped)
    "synonyms",
  ],
  Variant: [
    "rsid",
    "vid",
    "chromosome",
    "position",
    "ref",
    "alt",
    "consequence",
    "gencode_gene_id",
    // Functional scores
    "cadd_phred",
    "cadd_raw",
    "linsight",
    "fathmm_xf",
    "alphamissense_score",
    // Conservation
    "phylop_primates",
    "phylop_mammals",
    "phylop_vertebrates",
    // Clinical
    "clinvar_significance",
    "clinvar_review_status",
    // Population frequency
    "gnomad_af",
    "gnomad_exome_af",
    "gnomad_genome_af",
    // Regulatory
    "ccre_accessions",
    "ccre_annotations",
  ],
  Phenotype: [
    "phenotype_name",
    "phenotype_definition",
    "ontology_source",
    "synonyms",
    // Counts (useful for LLM to gauge importance)
    "disease_count",
    "gene_count",
    "gwas_variant_count",
    "mapped_entity_count",
    "is_deprecated",
  ],
  Pathway: ["pathway_name", "source", "species", "category", "summary"],
  GOTerm: ["go_name", "namespace", "definition", "is_obsolete"],
  Tissue: ["tissue_name", "source"],
  SideEffect: ["side_effect_name", "meddra_concept_type", "source", "synonyms"],
  Metabolite: [
    "metabolite_name",
    "source",
    "formula",
    "molecular_weight",
    "synonyms",
  ],
  cCRE: ["ccre_name", "ccre_type", "chromosome", "start", "end", "source"],
  Study: [
    "study_title",
    "trait_reported",
    "source",
    "pubmed_id",
    "sample_size",
    "ancestry",
  ],
};

/** Max chars for any text field in curated output */
const MAX_FIELD_TEXT = 300;

/**
 * Curate a raw entity payload for LLM consumption.
 * Picks only high-signal fields, flattens nested objects, truncates long text.
 */
function curateEntityForLLM(
  type: string,
  raw: Record<string, unknown>,
  counts?: Record<string, unknown>,
): Record<string, unknown> {
  const keepFields = ENTITY_KEEP_FIELDS[type];

  // Unknown entity type — keep only a small set of display/identifier fields
  if (!keepFields) {
    return curateUnknownEntity(type, raw, counts);
  }

  const curated: Record<string, unknown> = { type, id: raw.id };

  for (const field of keepFields) {
    const value = raw[field];
    if (value === null || value === undefined) continue;
    curated[field] = value;
  }

  // Type-specific post-processing
  if (type === "Gene") curateGeneFields(curated);
  if (type === "Drug") curateDrugFields(curated);
  if (type === "Disease") curateDiseaseFields(curated);

  // Truncate any remaining long strings
  truncateStrings(curated);

  // Attach counts (always useful)
  if (counts) curated._counts = counts;

  return curated;
}

/** Flatten Gene nested objects to compact representations */
function curateGeneFields(entity: Record<string, unknown>) {
  // constraint_scores → flatten to key summary values
  const cs = entity.constraint_scores as
    | Record<string, Record<string, unknown>>
    | undefined;
  if (cs) {
    entity.constraint_scores = {
      loeuf: cs.loeuf?.lof_oe_ci_upper ?? null,
      pLI: cs.loeuf?.lof_hc_lc_pLI ?? cs.gnomad?.gnom_ad_p_li ?? null,
      mis_z: cs.loeuf?.mis_z_score ?? null,
      shet: cs.shet?.mean_s_het ?? null,
      pHaplo: cs.posterior?.phaplo ?? null,
      pTriplo: cs.posterior?.ptriplo ?? null,
    };
  }

  // go → keep as semicolon strings but truncate
  const go = entity.go as Record<string, string> | undefined;
  if (go) {
    entity.go = {
      biological_process: truncateText(go.biological_process, MAX_FIELD_TEXT),
      molecular_function: truncateText(go.molecular_function, MAX_FIELD_TEXT),
      cellular_component: truncateText(go.cellular_component, MAX_FIELD_TEXT),
    };
  }

  // pathways → keep only consensus_path_db
  const pathways = entity.pathways as Record<string, unknown> | undefined;
  if (pathways) {
    entity.pathways = pathways.consensus_path_db ?? null;
  }

  // disease_phenotype → keep only mim_disease, truncated
  const dp = entity.disease_phenotype as Record<string, unknown> | undefined;
  if (dp) {
    entity.disease_phenotype = {
      mim_disease: truncateText(
        dp.mim_disease as string | undefined,
        MAX_FIELD_TEXT,
      ),
      hpo_name: truncateText(dp.hpo_name as string | undefined, MAX_FIELD_TEXT),
    };
  }

  // aliases — cap to 5
  if (Array.isArray(entity.aliases)) {
    entity.aliases = (entity.aliases as string[]).slice(0, 5);
  }
}

/** Compact Drug fields */
function curateDrugFields(entity: Record<string, unknown>) {
  // trade_names — cap to 5
  if (Array.isArray(entity.trade_names)) {
    entity.trade_names = (entity.trade_names as string[]).slice(0, 5);
  }
  // mechanisms_of_action — cap to 3
  if (Array.isArray(entity.mechanisms_of_action)) {
    entity.mechanisms_of_action = (
      entity.mechanisms_of_action as string[]
    ).slice(0, 3);
  }
}

/** Compact Disease fields */
function curateDiseaseFields(entity: Record<string, unknown>) {
  // synonyms — cap to 5
  if (Array.isArray(entity.synonyms)) {
    entity.synonyms = (entity.synonyms as string[]).slice(0, 5);
  }
}

/** For unknown entity types, keep id + label + display fields only */
function curateUnknownEntity(
  type: string,
  raw: Record<string, unknown>,
  counts?: Record<string, unknown>,
): Record<string, unknown> {
  const curated: Record<string, unknown> = { type, id: raw.id };
  // Keep any field ending in _name, _symbol, or named label/name/title
  for (const [key, val] of Object.entries(raw)) {
    if (val === null || val === undefined) continue;
    if (
      key === "label" ||
      key === "name" ||
      key === "title" ||
      key.endsWith("_name") ||
      key.endsWith("_symbol") ||
      key === "description" ||
      key === "source" ||
      key === "namespace"
    ) {
      curated[key] =
        typeof val === "string" ? truncateText(val, MAX_FIELD_TEXT) : val;
    }
  }
  if (counts) curated._counts = counts;
  return curated;
}

/** Truncate a string to maxLen, adding ellipsis */
function truncateText(
  s: string | undefined | null,
  maxLen: number,
): string | null {
  if (!s) return null;
  return s.length <= maxLen ? s : `${s.slice(0, maxLen).trimEnd()}…`;
}

/** Walk an object and truncate any string values exceeding MAX_FIELD_TEXT */
function truncateStrings(
  obj: Record<string, unknown>,
  maxLen = MAX_FIELD_TEXT,
) {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "string" && val.length > maxLen) {
      obj[key] = `${val.slice(0, maxLen).trimEnd()}…`;
    }
  }
}

export const readTool = tool({
  description: `Read any workspace object by path.

PATHS:
  cohort/{id}/schema            — Full schema with columns, methods, auto_config
  cohort/{id}/sample             — Sample rows (default 2 rows for quick peek)
  cohort/{id}/profile           — Column stats, QC
  run/{cohort_id}/{run_id}      — Analytics run result
  run/{cohort_id}/{run_id}/viz/{chart_id} — Chart data
  artifact/{id}?offset=0&limit=50 — Artifact slice
  entity/{type}/{id}            — Entity profile with edge counts
  entity/{type}/{id}/context    — LLM-ready entity context
  variant/{query}               — Variant lookup (rsID, VCF, or vid)
  graph/schema                  — Graph schema (compact agent view)
  graph/schema/{type}           — Properties for a specific node/edge type`,
  inputSchema: z.object({
    path: z
      .string()
      .describe(
        "Resource path (e.g., 'cohort/abc-123/schema', 'entity/Gene/ENSG00000012048')",
      ),
  }),
  execute: async ({ path }) => {
    try {
      // Parse the path
      const parts = path.split("/").filter(Boolean);
      const root = parts[0];

      // --- cohort/{id}/... ---
      if (root === "cohort" && parts.length >= 3) {
        const cohortId = parts[1];
        const sub = parts[2];

        if (sub === "schema") {
          return await readCohortSchema(cohortId);
        }
        if (sub === "sample") {
          const limit = extractQueryParam(path, "limit", 2);
          return await readCohortSample(cohortId, limit);
        }
        if (sub === "profile") {
          return await readCohortProfile(cohortId);
        }
      }

      // --- run/{cohort_id}/{run_id}[/viz/{chart_id}] ---
      if (root === "run" && parts.length >= 3) {
        const cohortId = parts[1];
        const runId = parts[2];
        if (parts[3] === "viz" && parts[4]) {
          return await readChartData(cohortId, runId, parts[4]);
        }
        return await readRunResult(cohortId, runId);
      }

      // --- artifact/{id} ---
      if (root === "artifact" && parts[1]) {
        const artifactId = parts[1];
        const offset = extractQueryParam(path, "offset", 0);
        const limit = extractQueryParam(path, "limit", 5);
        return await readArtifact(artifactId, offset, limit);
      }

      // --- entity/{type}/{id}[/context] ---
      if (root === "entity" && parts.length >= 3) {
        const type = parts[1];
        const id = parts[2];
        if (parts[3] === "context") {
          return await readEntityContext(type, id);
        }
        return await readEntityProfile(type, id);
      }

      // --- variant/{query} ---
      if (root === "variant" && parts[1]) {
        const query = parts.slice(1).join("/"); // handle VCF notation with slashes
        return await readVariant(query);
      }

      // --- graph/schema[/{type}] ---
      if (root === "graph" && parts[1] === "schema") {
        if (parts[2]) {
          return await readGraphSchemaType(parts[2]);
        }
        return await readGraphSchema();
      }

      return {
        error: true,
        message: `Unknown path: ${path}`,
        hint: "Check the path format in the tool description.",
      };
    } catch (err) {
      if (err instanceof AgentToolError) return err.toToolResult();
      throw err;
    }
  },
  toModelOutput: async (opts: {
    toolCallId: string;
    input: unknown;
    output: unknown;
  }) => {
    const { path } = opts.input as { path: string };
    const parts = path.split("/").filter(Boolean);
    const result = opts.output as Record<string, unknown>;

    // Errors pass through
    if (result.error) return jsonOut(result);

    // Artifact slices can be large — cap items for model
    if (parts[0] === "artifact") {
      return compactArtifactForModel(result);
    }

    // Run results may have large chart data arrays
    if (parts[0] === "run" && parts.length >= 3) {
      return compactRunResultForModel(result);
    }

    // Entity profiles — enforce size cap (safety net in case curation missed something)
    if (parts[0] === "entity" && parts.length >= 3 && !parts[3]) {
      return compactEntityForModel(result);
    }

    // Everything else passes through (schema, sample, profile, variant, graph schema)
    return jsonOut(result);
  },
});

// ---------------------------------------------------------------------------
// Path handlers
// ---------------------------------------------------------------------------

async function readCohortSchema(cohortId: string) {
  const resp = await cohortFetch<Record<string, unknown>>(
    `/cohorts/${encodeURIComponent(cohortId)}/schema`,
    { timeout: 30_000 },
  );

  // Filter internal columns
  const columns = Array.isArray(resp.columns)
    ? (
        resp.columns as Array<{ name: string; kind: string; role?: string }>
      ).filter((c) => !INTERNAL_COLUMNS.has(c.name))
    : [];

  const numeric = columns
    .filter((c) => c.kind === "numeric")
    .map((c) => c.name);
  const categorical = columns
    .filter((c) => c.kind === "categorical")
    .map((c) => c.name);
  const identity = columns
    .filter((c) => c.kind === "identity")
    .map((c) => c.name);
  const array = columns.filter((c) => c.kind === "array").map((c) => c.name);

  // Clean available methods — compact for LLM context.
  // auto_config.features lists are redundant (LLM has the column listing).
  // suggested_columns: keep short candidate lists for role-specific hints,
  // drop candidates when hint is generic ("all numeric columns" etc).
  const MAX_ROLE_CANDIDATES = 5;
  const GENERIC_HINT_RE = /^all\s+(numeric|categorical|identity|array)\b/i;
  const methods = Array.isArray(resp.available_methods)
    ? (
        resp.available_methods as Array<{
          method: string;
          available: boolean;
          auto_config?: Record<string, unknown>;
          suggested_columns?: Array<{
            param_name: string;
            candidates: string[];
            reason: string;
          }>;
          [k: string]: unknown;
        }>
      )
        .filter((m) => m.available)
        .map((m) => {
          const trimmed: Record<string, unknown> = {
            method: m.method,
            category: m.category,
            description: m.description,
          };
          // auto_config: keep only scalar hints (target, time_column, etc) — drop feature lists
          if (m.auto_config) {
            const ac: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(m.auto_config)) {
              if (!Array.isArray(v)) ac[k] = v; // keep scalars only
            }
            if (Object.keys(ac).length > 0) trimmed.auto_config = ac;
          }
          // suggested_columns: keep candidates only for role-specific hints
          if (Array.isArray(m.suggested_columns)) {
            trimmed.params = m.suggested_columns.map((sc) => {
              const isGeneric = GENERIC_HINT_RE.test(sc.reason ?? "");
              const entry: Record<string, unknown> = {
                param: sc.param_name,
                hint: sc.reason,
              };
              // Include short candidate list for specific hints (role-based)
              if (!isGeneric && sc.candidates?.length) {
                entry.candidates = sc.candidates.slice(0, MAX_ROLE_CANDIDATES);
              }
              return entry;
            });
          }
          return trimmed;
        })
    : [];

  return {
    cohortId,
    rowCount: resp.row_count,
    dataType: resp.data_type ?? "variant_list",
    columns: { numeric, categorical, identity, array },
    capabilities: resp.capabilities,
    availableMethods: methods,
    summary: resp.text_summary,
    profile: resp.profile,
  };
}

async function readCohortSample(cohortId: string, limit: number) {
  const result = await cohortFetch<Record<string, unknown>>(
    `/cohorts/${encodeURIComponent(cohortId)}/rows`,
    { method: "POST", body: { limit: Math.min(limit, 100) }, timeout: 60_000 },
  );
  return {
    rows: Array.isArray(result.rows)
      ? (result.rows as unknown[]).slice(0, limit)
      : result.rows,
    total: result.total,
  };
}

async function readCohortProfile(cohortId: string) {
  const resp = await cohortFetch<Record<string, unknown>>(
    `/cohorts/${encodeURIComponent(cohortId)}/schema`,
    { timeout: 30_000 },
  );
  return { profile: resp.profile, summary: resp.text_summary };
}

async function readRunResult(cohortId: string, runId: string) {
  return await cohortFetch<Record<string, unknown>>(
    `/cohorts/${encodeURIComponent(cohortId)}/analytics/runs/${encodeURIComponent(runId)}`,
  );
}

async function readChartData(cohortId: string, runId: string, chartId: string) {
  return await cohortFetch<Record<string, unknown>>(
    `/cohorts/${encodeURIComponent(cohortId)}/analytics/runs/${encodeURIComponent(runId)}/viz?chart_id=${encodeURIComponent(chartId)}`,
  );
}

async function readArtifact(artifactId: string, offset: number, limit: number) {
  return await agentFetch<Record<string, unknown>>(
    `/agent/artifacts/${artifactId}?offset=${offset}&limit=${limit}`,
  );
}

// Node types removed from the graph — /graph/{type}/{id} returns 400 for these.
const UNSUPPORTED_ENTITY_TYPES = new Set(["Study", "Entity"]);

async function readEntityProfile(type: string, id: string) {
  if (UNSUPPORTED_ENTITY_TYPES.has(type)) {
    return {
      error: true,
      message: `Entity type '${type}' is no longer available in the graph.`,
    };
  }
  // M10: Support richer includes — counts, edges, rollups, agreements
  try {
    const resp = await agentFetch<{
      data: Record<string, unknown>;
      included?: Record<string, unknown>;
      meta?: Record<string, unknown>;
    }>(
      `/graph/${encodeURIComponent(type)}/${encodeURIComponent(id)}?include=counts,edges,rollups`,
    );

    const counts = resp.included?.counts as Record<string, unknown> | undefined;
    const edges = resp.included?.edges as Record<string, unknown> | undefined;
    const rollups = resp.included?.rollups as
      | Record<string, unknown>
      | undefined;

    const result: Record<string, unknown> = {
      entity: curateEntityForLLM(type, resp.data ?? {}, counts),
    };

    // Include edge summary if available (compacted)
    if (edges && typeof edges === "object") {
      const edgeSummary: Record<string, unknown> = {};
      for (const [edgeType, detail] of Object.entries(edges)) {
        const d = detail as
          | { count?: number; topNeighbors?: unknown[] }
          | undefined;
        if (d) {
          edgeSummary[edgeType] = {
            count: d.count,
            ...(d.topNeighbors
              ? { topNeighbors: (d.topNeighbors as unknown[]).slice(0, 5) }
              : {}),
          };
        }
      }
      if (Object.keys(edgeSummary).length > 0) {
        result.edges = edgeSummary;
      }
    }

    // Include rollups if available
    if (rollups) {
      result.rollups = rollups;
    }

    return result;
  } catch (err) {
    if (err instanceof AgentToolError && err.status === 404) {
      return { error: true, message: `Entity not found: ${type}:${id}` };
    }
    throw err;
  }
}

async function readEntityContext(type: string, id: string) {
  // POST /graph/context — LLM-optimized entity context
  const resp = await agentFetch<{
    data: { entities: Array<Record<string, unknown>> };
  }>("/graph/context", {
    method: "POST",
    body: {
      entities: [{ type, id }],
      sections: ["summary", "neighbors", "evidence"],
      depth: "standard",
    },
  });
  return resp.data?.entities?.[0] ?? { type, id };
}

async function readVariant(query: string) {
  // Resolve the variant
  const resolveResult = await agentFetch<{
    results: Array<{
      query: string;
      status: string;
      entity?: { type: string; id: string; label: string };
    }>;
  }>("/graph/resolve", {
    method: "POST",
    body: { queries: [query] },
  });

  const match = resolveResult.results?.[0];
  if (!match || match.status.toLowerCase() !== "matched" || !match.entity) {
    return {
      error: true,
      message: `Variant not found: ${query}`,
      hint: "Check variant ID format (rs123, 1-12345-A-T, vid:123).",
    };
  }

  // Fetch full entity profile for the resolved variant
  try {
    return await readEntityProfile(match.entity.type, match.entity.id);
  } catch {
    // Fall back to minimal resolve data if profile fetch fails
    return { variant: match.entity };
  }
}

async function readGraphSchema() {
  const resp = await agentFetch<Record<string, unknown>>(
    "/graph/schema?agent_view=true",
  );
  return resp;
}

async function readGraphSchemaType(type: string) {
  const resp = await agentFetch<{ data: Record<string, unknown> }>(
    `/graph/schema/properties/${type}`,
  );
  return resp.data;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractQueryParam(
  path: string,
  param: string,
  defaultValue: number,
): number {
  const match = path.match(new RegExp(`[?&]${param}=(\\d+)`));
  return match ? parseInt(match[1], 10) : defaultValue;
}

// ---------------------------------------------------------------------------
// toModelOutput compactors
// ---------------------------------------------------------------------------

/** Type-safe JSON output for toModelOutput — avoids Record<string, unknown> vs JSONValue mismatch */
function jsonOut(value: unknown) {
  return { type: "json" as const, value: value as null };
}

function compactArtifactForModel(data: Record<string, unknown>) {
  const items = Array.isArray(data.items) ? (data.items as unknown[]) : [];
  if (items.length <= 5) return jsonOut(data);

  return jsonOut({
    ...data,
    items: items.slice(0, 5),
    _truncation: { truncated: true, returned: 5, total: items.length },
  });
}

function compactEntityForModel(data: Record<string, unknown>) {
  // Safety net: if curated entity is still too large, truncate
  const json = JSON.stringify(data);
  if (json.length <= 4000) return jsonOut(data);

  // Strip any remaining large nested objects
  const entity = data.entity as Record<string, unknown> | undefined;
  if (!entity) return jsonOut(data);

  const compact: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(entity)) {
    if (val === null || val === undefined) continue;
    const valStr = JSON.stringify(val);
    if (valStr.length > 500) {
      // Truncate large values
      if (typeof val === "string") {
        compact[key] = `${val.slice(0, 300).trimEnd()}…`;
      }
      // Skip large nested objects/arrays
      continue;
    }
    compact[key] = val;
  }

  return jsonOut({ entity: compact });
}

function compactRunResultForModel(data: Record<string, unknown>) {
  // Strip large chart point arrays from analytics results
  const result = data.result as Record<string, unknown> | undefined;
  if (!result) return jsonOut(data);

  const charts = result.charts as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(charts)) return jsonOut(data);

  const compactCharts = charts.map((chart) => {
    const points = Array.isArray(chart.data) ? (chart.data as unknown[]) : [];
    if (points.length <= 20) return chart;
    return {
      ...chart,
      data: points.slice(0, 20),
      _truncation: { truncated: true, returned: 20, total: points.length },
    };
  });

  return jsonOut({
    ...data,
    result: { ...result, charts: compactCharts },
  });
}
