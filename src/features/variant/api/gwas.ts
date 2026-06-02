import { fetchOrNull } from "@infra/api";
import { API_BASE } from "@/config/api";
import type {
  GwasApiResponse,
  GwasApiRow,
  GwasAssociationRow,
  GwasMeta,
} from "../types/gwas";

/**
 * Filter options for GWAS API queries
 */
export interface GwasFilterOptions {
  /** Number of results per page (1-100, default 100) */
  limit?: number;
  /** Cursor for pagination */
  cursor?: string;
  /** Minimum -log10(p-value) threshold (e.g., 8.0 for genome-wide significance) */
  pvalueMlogMin?: number;
  /** Case-insensitive substring match on trait */
  traitContains?: string;
  /** Exact match on GWAS Catalog study accession */
  studyAccession?: string;
  /** Exact match on PubMed ID */
  pubmedId?: string;
}

/**
 * Transform API snake_case to camelCase for table display
 */
function transformGwasRow(row: GwasApiRow): GwasAssociationRow {
  return {
    vid: row.vid,
    rsid: row.rsid,
    variantVcf: row.variant_vcf,
    chromosome: row.chromosome,
    position: row.position,
    mappedGene: row.mapped_gene,
    reportedGenes: row.reported_genes,
    snpGeneIds: row.snp_gene_ids,
    trait: row.trait,
    diseaseTrait: row.disease_trait,
    pvalue: row.pvalue,
    pvalueMlog: row.pvalue_mlog,
    effectSize: row.effect_size,
    confidenceInterval: row.confidence_interval,
    riskAlleleFrequency: row.risk_allele_frequency,
    riskAllele: row.risk_allele,
    pubmedId: row.pubmedid,
    firstAuthor: row.first_author,
    publicationDate: row.publication_date,
    journal: row.journal,
    studyTitle: row.study_title,
    studyAccession: row.study_accession,
    variantContext: row.variant_context,
    intergenic: row.intergenic,
    region: row.region,
  };
}

/**
 * Build URL with query parameters for GWAS API
 */
function buildGwasUrl(vcf: string, options: GwasFilterOptions = {}): string {
  // The endpoint accepts an rsID or a VCF (with or without a "chr" prefix).
  // Pass the reference through as-is; prefixing "chr" onto an rsID (e.g.
  // "chrrs7412") makes the API reject it.
  const params = new URLSearchParams();

  params.set("limit", String(options.limit ?? 100));

  if (options.cursor) {
    params.set("cursor", options.cursor);
  }
  if (options.pvalueMlogMin !== undefined) {
    params.set("pvalue_mlog_min", String(options.pvalueMlogMin));
  }
  if (options.traitContains) {
    params.set("trait_contains", options.traitContains);
  }
  if (options.studyAccession) {
    params.set("study_accession", options.studyAccession);
  }
  if (options.pubmedId) {
    params.set("pubmedid", options.pubmedId);
  }

  return `${API_BASE}/gwas/${encodeURIComponent(vcf)}?${params.toString()}`;
}

/**
 * Page info from API response
 */
export interface PageInfo {
  next_cursor: string | null;
  count: number;
  has_more: boolean;
  total_count?: number;
}

/**
 * Result from GWAS fetch including metadata and pagination info
 */
export interface GwasResult {
  data: GwasAssociationRow[];
  meta: GwasMeta | null;
  pageInfo: PageInfo | null;
}

/**
 * Fetch GWAS associations for a variant.
 * Accepts VCF format (e.g., "19-44908822-C-T" or "chr19-44908822-C-T")
 *
 * @param vcf - Variant in VCF format
 * @param options - Filter options for the query
 * @returns Data rows, metadata, and pagination info
 */
export async function fetchGwasAssociations(
  vcf: string,
  options: GwasFilterOptions = {},
): Promise<GwasResult> {
  try {
    const url = buildGwasUrl(vcf, options);
    const response = await fetchOrNull<GwasApiResponse>(url);

    if (!response?.data) return { data: [], meta: null, pageInfo: null };

    const meta: GwasMeta | null =
      response.page_info.total_count !== undefined && response.meta
        ? {
            totalCount: response.page_info.total_count,
            uniqueTraits: response.meta.unique_traits,
            uniqueStudies: response.meta.unique_studies,
          }
        : null;

    const pageInfo: PageInfo = {
      next_cursor: response.page_info.next_cursor,
      count: response.page_info.count,
      has_more: response.page_info.has_more,
      total_count: response.page_info.total_count,
    };

    return {
      data: response.data.map(transformGwasRow),
      meta,
      pageInfo,
    };
  } catch (error) {
    console.error("GWAS fetch error:", error);
    return { data: [], meta: null, pageInfo: null };
  }
}

/**
 * Fetch all GWAS associations with pagination support.
 * Continues fetching until all pages are retrieved.
 *
 * @param vcf - Variant in VCF format
 * @param options - Filter options for the query
 * @param maxResults - Maximum total results to fetch (default 1000)
 */
export async function fetchAllGwasAssociations(
  vcf: string,
  options: GwasFilterOptions = {},
  maxResults = 1000,
): Promise<GwasAssociationRow[]> {
  try {
    // Pass the reference as-is (rsID or VCF); prefixing "chr" onto an rsID
    // makes the API reject it. See buildGwasUrl.
    const allRows: GwasAssociationRow[] = [];
    let cursor: string | null = null;
    const pageSize = 100;

    // Build base params
    const baseParams = new URLSearchParams();
    baseParams.set("limit", String(pageSize));
    if (options.pvalueMlogMin !== undefined) {
      baseParams.set("pvalue_mlog_min", String(options.pvalueMlogMin));
    }
    if (options.traitContains) {
      baseParams.set("trait_contains", options.traitContains);
    }
    if (options.studyAccession) {
      baseParams.set("study_accession", options.studyAccession);
    }
    if (options.pubmedId) {
      baseParams.set("pubmedid", options.pubmedId);
    }

    while (allRows.length < maxResults) {
      const params = new URLSearchParams(baseParams);
      if (cursor) {
        params.set("cursor", cursor);
      }

      const fetchUrl = `${API_BASE}/gwas/${encodeURIComponent(vcf)}?${params.toString()}`;
      const response: GwasApiResponse | null =
        await fetchOrNull<GwasApiResponse>(fetchUrl);

      if (!response?.data || response.data.length === 0) break;

      allRows.push(...response.data.map(transformGwasRow));

      if (!response.page_info.has_more || !response.page_info.next_cursor) {
        break;
      }

      cursor = response.page_info.next_cursor;
    }

    return allRows.slice(0, maxResults);
  } catch (error) {
    console.error("GWAS fetch all error:", error);
    return [];
  }
}
