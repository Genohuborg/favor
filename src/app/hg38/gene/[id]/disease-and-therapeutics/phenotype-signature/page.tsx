import { fetchGene, fetchGeneEdgeRows } from "@features/gene/api";
import { PhenotypeSignatureOverview } from "@features/gene/components";
import {
  VcpPrioritizationView,
  type VcpRow,
} from "@features/gene/components/disease-therapeutics";
import { notFound } from "next/navigation";

interface PhenotypeSignaturePageProps {
  params: Promise<{
    id: string;
  }>;
}

function numOrNull(value: unknown): number | null {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

export default async function PhenotypeSignaturePage({
  params,
}: PhenotypeSignaturePageProps) {
  const { id } = await params;

  const geneResponse = await fetchGene(id, {
    include: "counts,edges",
    edgeTypes: "GENE_ASSOCIATED_WITH_PHENOTYPE",
    direction: "out",
    limitPerEdgeType: 500,
    sort: JSON.stringify({ GENE_ASSOCIATED_WITH_PHENOTYPE: "-evidence_count" }),
    neighborMode: "GENE_ASSOCIATED_WITH_PHENOTYPE=summary",
  });

  const gene = geneResponse?.data;

  if (!gene) {
    notFound();
  }

  const relations =
    geneResponse?.relations ?? geneResponse?.included?.relations ?? undefined;
  const edges = geneResponse?.edges;
  const geneId = gene.gene_id_versioned?.split(".")[0] || id;

  const vcpEdges = await fetchGeneEdgeRows(
    geneId,
    "GENE_PRIORITIZED_BY_VCP__Phenotype",
    {
      direction: "out",
      edgeFields: ["max_vcp_score", "n_variants", "n_variants_vcp_high"],
      nodeFields: ["name"],
      sortByEdgeField: "max_vcp_score",
    },
  );

  const vcpRows: VcpRow[] = vcpEdges.map((r) => ({
    targetId: r.targetId,
    targetLabel: (r.node.name as string) ?? r.targetLabel,
    maxVcpScore: numOrNull(r.edge.max_vcp_score),
    nVariants: numOrNull(r.edge.n_variants),
    nVariantsHigh: numOrNull(r.edge.n_variants_vcp_high),
  }));

  return (
    <div className="space-y-8">
      <PhenotypeSignatureOverview
        relations={relations}
        edges={edges}
        geneSymbol={gene.gene_symbol}
      />
      {vcpRows.length > 0 && (
        <VcpPrioritizationView
          geneSymbol={gene.gene_symbol ?? id}
          rows={vcpRows}
          targetKind="phenotype"
        />
      )}
    </div>
  );
}
