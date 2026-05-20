import type {
  PaginatedResponse,
  TissueGroupRow,
} from "@features/enrichment/api/region";
import { buildParams } from "@features/enrichment/api/region";
import { fetchJson } from "@infra/api";
import { API_BASE } from "@/config/api";
import type {
  CrisprRow,
  DatasetEntry,
  FetchCrisprParams,
  FetchPerturbSeqParams,
  PerturbSeqRow,
} from "./types";

function perturbUrl(
  loc: string,
  endpoint: string,
  params: Record<string, unknown> = {},
): string {
  const qs = buildParams(params);
  return `${API_BASE}/perturbations/${encodeURIComponent(loc)}/${endpoint}${qs ? `?${qs}` : ""}`;
}

export async function fetchCrispr(
  loc: string,
  params: FetchCrisprParams = {},
): Promise<PaginatedResponse<CrisprRow>> {
  return fetchJson(
    perturbUrl(loc, "crispr", params as Record<string, unknown>),
  );
}

export async function fetchPerturbSeq(
  loc: string,
  params: FetchPerturbSeqParams = {},
): Promise<PaginatedResponse<PerturbSeqRow>> {
  return fetchJson(
    perturbUrl(loc, "perturb-seq", params as Record<string, unknown>),
  );
}

export type DatasetAssay = "crispr" | "perturb-seq" | "mave";

export async function fetchDatasets(
  loc: string,
  assay: DatasetAssay,
): Promise<DatasetEntry[]> {
  const url = perturbUrl(loc, "datasets", { assay });
  const res = await fetchJson<{ data: DatasetEntry[] }>(url);
  return res.data;
}

export async function fetchCrisprByTissueGroup(
  loc: string,
): Promise<TissueGroupRow[]> {
  const url = perturbUrl(loc, "crispr", { group_by: "tissue_group" });
  const res = await fetchJson<{
    data: {
      group_key: string;
      max_value: number;
      count: number;
      significant?: number;
    }[];
  }>(url);
  return res.data.map((r) => ({
    tissue_name: r.group_key,
    max_value: r.max_value,
    count: r.count,
    significant: r.significant ?? 0,
  }));
}

export interface CrisprTissueFacet {
  tissue: string;
  count: number;
  significant: number;
}

/**
 * Granular tissue facets for CRISPR. Keys (e.g. "lung", "lymphoid tissue",
 * "central nervous system") are what the `tissue` query parameter expects
 * when filtering rows.
 */
export async function fetchCrisprTissueFacets(
  loc: string,
): Promise<CrisprTissueFacet[]> {
  const url = perturbUrl(loc, "crispr", { group_by: "tissue" });
  const res = await fetchJson<{
    data: { group_key: string; count: number; significant?: number }[];
  }>(url);
  return res.data.map((r) => ({
    tissue: r.group_key,
    count: r.count,
    significant: r.significant ?? 0,
  }));
}
