/**
 * SchemaStore — single cache owner for graph schema, agent view, and edge properties.
 *
 * Consolidates the 3 independent caches (schemaCache, agentViewCache, edgePropCache)
 * that previously lived in graph.ts. Same TTL, single invalidation point.
 */

import { agentFetch } from "../../../lib/api-client";
import type { GraphSchemaResponse } from "../intent-aliases";
import { mergeSchemaAliases } from "../intent-aliases";

const CACHE_TTL = 10 * 60 * 1000; // 10 min

// ---------------------------------------------------------------------------
// Agent view types
// ---------------------------------------------------------------------------

export interface AgentViewSchema {
  nodes: string[] | Record<string, unknown>;
  edges: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Edge property metadata
// ---------------------------------------------------------------------------

export interface EdgePropertyMeta {
  name: string;
  tooltip?: boolean;
  displayOrder?: number;
  hidden?: boolean;
}

// ---------------------------------------------------------------------------
// Schema store
// ---------------------------------------------------------------------------

/** Callback to enrich human labels — injected by graph.ts to avoid circular dep */
type EnrichFn = (schema: GraphSchemaResponse) => void;

/** Module-level singleton — persists across warm serverless invocations (free caching),
 * resets on cold starts (safe fallback). Graph schema is shared, not user-specific. */
class SchemaStore {
  private full: { data: GraphSchemaResponse; ts: number } | null = null;
  private view: { data: AgentViewSchema | null; ts: number } = {
    data: null,
    ts: 0,
  };
  private edgeProps = new Map<
    string,
    { fields: EdgePropertyMeta[]; ts: number }
  >();
  private enrichFn: EnrichFn | null = null;

  setEnrichFn(fn: EnrichFn): void {
    this.enrichFn = fn;
  }

  async getFull(portal?: string): Promise<GraphSchemaResponse> {
    const _key = portal ?? "default";
    if (this.full && Date.now() - this.full.ts < CACHE_TTL)
      return this.full.data;

    const resp = await agentFetch<{ data: GraphSchemaResponse }>(
      "/graph/schema",
    );
    const schema = resp.data;
    this.full = { data: schema, ts: Date.now() };

    // Enrich runtime maps from schema metadata
    mergeSchemaAliases(schema);
    this.enrichFn?.(schema);

    return schema;
  }

  async getAgentView(): Promise<AgentViewSchema | null> {
    if (this.view.data && Date.now() - this.view.ts < CACHE_TTL) {
      return this.view.data;
    }
    try {
      const resp = await agentFetch<{
        nodes: Record<
          string,
          {
            aliases?: string[];
            highRoiFields?: Record<
              string,
              {
                type?: string;
                hint?: string;
                better?: string;
                thresholds?: Record<string, string>;
              }
            >;
          }
        >;
        edges: Record<
          string,
          {
            from?: string;
            to?: string;
            briefing?: string;
            defaultSort?: string;
            sortStrategies?: Array<{ field: string; label?: string }>;
            keyFilters?: Array<{
              field: string;
              op: string;
              value: unknown;
              priority: number;
              label?: string;
            }>;
            highRoiFields?: Record<
              string,
              {
                type?: string;
                hint?: string;
                better?: string;
                thresholds?: Record<string, string>;
              }
            >;
          }
        >;
        meta?: unknown;
      }>("/graph/schema?agent_view=true");

      const nodeTypes = Object.keys(resp.nodes);

      const DOMAIN_MAP: Record<string, string> = {
        GENE_ASSOCIATED_WITH_DISEASE: "disease",
        GENE_ALTERED_IN_DISEASE: "disease",
        DISEASE_HAS_PHENOTYPE: "disease",
        GENE_ASSOCIATED_WITH_PHENOTYPE: "disease",
        DRUG_ACTS_ON_GENE: "drug",
        DRUG_DISPOSITION_BY_GENE: "drug",
        GENE_AFFECTS_DRUG_RESPONSE: "drug",
        DRUG_INDICATED_FOR_DISEASE: "drug",
        DRUG_HAS_ADVERSE_EFFECT: "drug",
        DRUG_INTERACTS_WITH_DRUG: "drug",
        DRUG_PAIR_CAUSES_SIDE_EFFECT: "drug",
        VARIANT_ASSOCIATED_WITH_DRUG: "drug",
        VARIANT_LINKED_TO_SIDE_EFFECT: "drug",
        GENE_ASSOCIATED_WITH_SIDE_EFFECT: "drug",
        VARIANT_IMPLIES_GENE: "variant",
        VARIANT_AFFECTS_GENE: "variant",
        VARIANT_ASSOCIATED_WITH_TRAIT: "variant",
        SIGNAL_IMPLIES_GENE: "variant",
        SIGNAL_HAS_VARIANT: "variant",
        GENE_PARTICIPATES_IN_PATHWAY: "pathway",
        GENE_ANNOTATED_WITH_GO_TERM: "pathway",
        GENE_HAS_PROTEIN_DOMAIN: "pathway",
        PATHWAY_CONTAINS_METABOLITE: "pathway",
        GENE_EXPRESSED_IN_TISSUE: "expression",
        CCRE_REGULATES_GENE: "regulatory",
        VARIANT_OVERLAPS_CCRE: "regulatory",
        GENE_INTERACTS_WITH_GENE: "interaction",
        GENE_PARALOG_OF_GENE: "interaction",
      };

      const edgeDomains: Record<string, Record<string, unknown>> = {};

      for (const [k, v] of Object.entries(resp.edges)) {
        const domain = DOMAIN_MAP[k];
        if (!domain) continue;

        if (!edgeDomains[domain]) edgeDomains[domain] = {};

        const entry: Record<string, unknown> = {};
        if (v.from && v.to) entry.path = `${v.from}→${v.to}`;

        const strat = v.sortStrategies?.[0];
        if (strat) entry.sort = strat.field;

        if (v.keyFilters?.length) {
          const kf: Record<string, unknown> = {};
          for (const f of v.keyFilters) {
            kf[`${f.field}__${f.op}`] = f.value;
          }
          entry.filters = kf;
        }

        if (v.highRoiFields) {
          entry.fields = Object.keys(v.highRoiFields);
        }

        edgeDomains[domain][k] = entry;
      }

      const viewData: AgentViewSchema = {
        nodes: nodeTypes,
        edges: edgeDomains,
      };
      this.view = { data: viewData, ts: Date.now() };
      return viewData;
    } catch {
      return null;
    }
  }

  async getEdgeDisplayFields(edgeType: string): Promise<string[]> {
    const cached = this.edgeProps.get(edgeType);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return cached.fields.filter((f) => f.tooltip).map((f) => f.name);
    }

    try {
      const resp = await agentFetch<{
        data: { properties: EdgePropertyMeta[] };
      }>(`/graph/schema/properties/${edgeType}`);
      const fields = resp.data?.properties ?? [];
      this.edgeProps.set(edgeType, { fields, ts: Date.now() });
      return fields.filter((f) => f.tooltip && !f.hidden).map((f) => f.name);
    } catch {
      return [];
    }
  }

  invalidate(): void {
    this.full = null;
    this.view = { data: null, ts: 0 };
    this.edgeProps.clear();
  }
}

export const schemaStore = new SchemaStore();
