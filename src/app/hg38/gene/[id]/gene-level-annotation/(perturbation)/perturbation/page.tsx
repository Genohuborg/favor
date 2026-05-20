import { fetchGene } from "@features/gene/api";
import {
  type CrisprTissueFacet,
  fetchCrispr,
  fetchCrisprTissueFacets,
  fetchPerturbSeq,
} from "@features/perturbation/api";
import { PerturbationView } from "@features/perturbation/components/perturbation-view";
import { CRISPR_PAGE_LIMIT } from "@features/perturbation/constants";
import { notFound } from "next/navigation";

const PERTURB_SEQ_DOWNSTREAM_LIMIT = 100;

interface PerturbationPageProps {
  params: Promise<{ id: string }>;
}

/**
 * The paginated CRISPR endpoint does not return total_count, but the tissue
 * facet does. Prefer the facet sum when present, then the page-info total,
 * then the loaded-rows length. Returns 0 only when truly empty.
 */
function resolveCrisprTotal(
  facets: CrisprTissueFacet[],
  pageInfoTotal: number | null | undefined,
  loadedRows: number,
): number {
  const facetSum = facets.reduce((sum, f) => sum + f.count, 0);
  if (facetSum > 0) return facetSum;
  if (typeof pageInfoTotal === "number") return pageInfoTotal;
  return loadedRows;
}

export default async function PerturbationPage({
  params,
}: PerturbationPageProps) {
  const { id } = await params;

  const geneResponse = await fetchGene(id);
  const gene = geneResponse?.data;
  if (!gene) notFound();

  const geneSymbol = gene.gene_symbol || id;

  const [downstreamRes, crisprRes, crisprTissueFacets] = await Promise.all([
    fetchPerturbSeq(geneSymbol, {
      significant_only: true,
      limit: PERTURB_SEQ_DOWNSTREAM_LIMIT,
    }).catch(() => null),
    fetchCrispr(geneSymbol, { limit: CRISPR_PAGE_LIMIT }).catch(() => null),
    fetchCrisprTissueFacets(geneSymbol).catch(() => [] as CrisprTissueFacet[]),
  ]);

  // Sort by magnitude, highest impact first.
  const downstream = (downstreamRes?.data ?? []).sort(
    (a, b) => Math.abs(b.log2fc) - Math.abs(a.log2fc),
  );
  const crispr = (crisprRes?.data ?? []).sort(
    (a, b) => a.score_value - b.score_value,
  );

  const downstreamTotalCount =
    downstreamRes?.page_info?.total_count ?? downstream.length;

  const crisprTotalCount = resolveCrisprTotal(
    crisprTissueFacets,
    crisprRes?.page_info?.total_count,
    crispr.length,
  );
  const crisprFacetSignificant = crisprTissueFacets.reduce(
    (sum, f) => sum + f.significant,
    0,
  );
  const essentialIn =
    crisprFacetSignificant > 0
      ? crisprFacetSignificant
      : crispr.filter((r) => r.is_significant).length;

  return (
    <PerturbationView
      geneSymbol={geneSymbol}
      summary={{
        perturbSeqDatasets: new Set(downstream.map((r) => r.dataset_id)).size,
        downstreamTargets: downstreamTotalCount,
        crisprScreens: crisprTotalCount,
        essentialIn,
      }}
      downstream={downstream}
      crispr={crispr}
      crisprTotalCount={crisprTotalCount}
      downstreamTotalCount={downstreamTotalCount}
      crisprTissueFacets={crisprTissueFacets}
    />
  );
}
