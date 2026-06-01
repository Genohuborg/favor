import { fetchGene, fetchGeneEdgeRows } from "@features/gene/api";
import { PharmacogenomicsOverview } from "@features/gene/components";
import {
  type PgxGuidelineRow,
  PgxGuidelinesView,
} from "@features/gene/components/disease-therapeutics";
import { notFound } from "next/navigation";

interface PharmacogenomicsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function numOrNull(value: unknown): number | null {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

export default async function PharmacogenomicsPage({
  params,
}: PharmacogenomicsPageProps) {
  const { id } = await params;

  const geneResponse = await fetchGene(id, {
    include: "counts,edges",
    edgeTypes: "GENE_AFFECTS_DRUG_RESPONSE",
    direction: "out",
    limitPerEdgeType: 500,
    sort: JSON.stringify({ GENE_AFFECTS_DRUG_RESPONSE: "-evidence_count" }),
    neighborMode: "GENE_AFFECTS_DRUG_RESPONSE=summary",
  });

  const gene = geneResponse?.data;

  if (!gene) {
    notFound();
  }

  const relations =
    geneResponse?.relations ?? geneResponse?.included?.relations ?? undefined;
  const edges = geneResponse?.edges;
  const geneId = gene.gene_id_versioned?.split(".")[0] || id;

  const pgxEdges = await fetchGeneEdgeRows(geneId, "GENE_HAS_PGX_GUIDELINE", {
    direction: "out",
    edgeFields: ["n_recommendations", "evidence_count"],
    nodeFields: ["name", "drug_name"],
    sortByEdgeField: "n_recommendations",
  });

  const pgxRows: PgxGuidelineRow[] = pgxEdges.map((r) => ({
    drugId: r.targetId,
    drugLabel:
      (r.node.drug_name as string) ?? (r.node.name as string) ?? r.targetLabel,
    nRecommendations: numOrNull(r.edge.n_recommendations),
    evidenceCount: numOrNull(r.edge.evidence_count),
  }));

  return (
    <div className="space-y-8">
      <PharmacogenomicsOverview
        relations={relations}
        edges={edges}
        geneSymbol={gene.gene_symbol}
      />
      {pgxRows.length > 0 && (
        <PgxGuidelinesView geneSymbol={gene.gene_symbol ?? id} rows={pgxRows} />
      )}
    </div>
  );
}
