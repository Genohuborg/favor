import type { NextRequest } from "next/server";
import type { ElasticsearchResponse } from "@/lib/search/api/elasticsearch";
import { clickHouseClient } from "@/lib/clickhouse/client";

export const dynamic = "force-dynamic";

// Read env INSIDE the handler, never at module scope.
//
// This module used to `throw new Error("Missing Elasticsearch environment
// variables")` at import time. Because Next collects page data by importing
// every route during the build, a missing variable did not degrade the
// typeahead -- it failed `next build` outright with
// "Failed to collect page data for /api/search/suggestions". A missing
// variable should cost you one feature, not the whole deploy.
function esConfig() {
  const host = process.env.ES_HOST;
  const user = process.env.ES_USER;
  const pass = process.env.ES_PASS;
  if (!host || !user || !pass) return null;
  return {
    host,
    auth: `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`,
  };
}

function inferTypeFromValue(value: string): string {
  if (value.startsWith("rs") && /^rs\d+$/i.test(value)) {
    return "rsid";
  }

  // Check for variant VCF format: chromosome-position-ref-alt
  if (/^(chr)?\d{1,2}|X|Y|MT?-\d+-[ATCG]+-[ATCG]+$/i.test(value)) {
    return "variant";
  }

  // Check for region format: chromosome-startPosition-endPosition
  if (/^(chr)?\d{1,2}|X|Y|MT?-\d+-\d+$/i.test(value)) {
    return "region";
  }

  return "gene";
}

interface Suggestion {
  id: string;
  value: string;
  data?: Record<string, unknown>;
  type: string;
  score: number;
}

// Anything that has started to look like an rsid: "rs4", "rs42935", "rs429358".
const RSID_PREFIX = /^rs\d+$/i;

/**
 * rsid suggestions come from ClickHouse, NOT Elasticsearch.
 *
 * There are ~1.3 billion rsids. Indexing them for autocomplete would cost
 * 130-260 GB in Elasticsearch, which has 34 GB free. `production.rsid_lookup`
 * is already ORDER BY rsid, so `LIKE 'rs42935%'` is a range scan on the sort
 * key rather than a table scan -- measured at 33 ms across 1.3 billion rows.
 * No extra storage, and the data is authoritative rather than a copy.
 *
 * `LIMIT 1 BY rsid` collapses multi-allelic sites, which repeat the same rsid
 * once per ALT.
 */
async function rsidSuggestions(prefix: string): Promise<Suggestion[]> {
  const rows = await clickHouseClient.query<{
    rsid: string;
    chromosome: string;
    position: number;
    variant_vcf: string;
  }>({
    query: `
      SELECT rsid, chromosome, position, variant_vcf
      FROM production.rsid_lookup
      WHERE rsid LIKE {prefix:String}
      ORDER BY rsid
      LIMIT 1 BY rsid
      LIMIT 10
    `,
    query_params: { prefix: `${prefix.toLowerCase()}%` },
  });

  return rows.map((r, i) => ({
    id: `rsid:${r.rsid}`,
    value: r.rsid,
    data: {
      variant_vcf: r.variant_vcf,
      chromosome: r.chromosome,
      position: String(r.position),
    },
    type: "rsid",
    // Exact match first, then shortest (closest to what was typed).
    score: r.rsid.toLowerCase() === prefix.toLowerCase() ? 1000 : 100 - i,
  }));
}

/** Gene (and anything non-rsid) suggestions come from the ES autocomplete index. */
async function esSuggestions(prefix: string): Promise<Suggestion[]> {
  const cfg = esConfig();
  if (!cfg) return [];

  const response = await fetch(`${cfg.host}/autocomplete_combined/_search`, {
    method: "POST",
    headers: {
      Authorization: cfg.auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        bool: {
          should: [
            { term: { "value.exact": { value: prefix.toLowerCase(), boost: 100 } } },
            { match: { value: { query: prefix.toLowerCase(), boost: 10 } } },
            { prefix: { value: { value: prefix.toLowerCase(), boost: 70 } } },
          ],
        },
      },
      _source: ["value", "data"],
      sort: [{ _score: { order: "desc" } }],
    }),
  });

  if (!response.ok) {
    console.error(`Elasticsearch error: ${response.status} ${response.statusText}`);
    return [];
  }

  const data = (await response.json()) as ElasticsearchResponse;
  return (data.hits?.hits || []).map((hit) => ({
    id: `${hit._id}`,
    value: hit._source.value,
    data: hit._source.data,
    type: inferTypeFromValue(hit._source.value),
    score: hit._score,
  }));
}

export async function GET(req: NextRequest) {
  const prefix = req.nextUrl.searchParams.get("q");
  if (!prefix || prefix.length < 3) {
    return Response.json([]);
  }

  // Each backend is awaited independently so one being down degrades that half
  // of the typeahead instead of emptying the dropdown. This endpoint is called
  // on every keystroke -- it should never be the reason a page looks broken.
  const wantRsids = RSID_PREFIX.test(prefix);

  const [rsids, genes] = await Promise.all([
    wantRsids
      ? rsidSuggestions(prefix).catch((e) => {
          console.error("rsid suggestions failed:", e);
          return [] as Suggestion[];
        })
      : Promise.resolve([] as Suggestion[]),
    esSuggestions(prefix).catch((e) => {
      console.error("gene suggestions failed:", e);
      return [] as Suggestion[];
    }),
  ]);

  const suggestions = [...rsids, ...genes]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return Response.json(suggestions);
}
