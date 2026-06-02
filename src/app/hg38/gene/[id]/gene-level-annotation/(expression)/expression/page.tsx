import { fetchGene, fetchGeneEdgeRows } from "@features/gene/api";
import { type CellxgeneRow, ExpressionCard } from "@features/gene/components";
import { notFound } from "next/navigation";

interface GeneExpressionPageProps {
  params: Promise<{ id: string }>;
}

function numOrNull(value: unknown): number | null {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

export default async function GeneExpressionPage({
  params,
}: GeneExpressionPageProps) {
  const { id } = await params;

  const geneResponse = await fetchGene(id);
  const gene = geneResponse?.data;

  if (!gene) {
    notFound();
  }

  const geneId = gene.gene_id_versioned?.split(".")[0] || id;
  const cellEdges = await fetchGeneEdgeRows(
    geneId,
    "GENE_EXPRESSED_IN_CELL_TYPE",
    {
      direction: "out",
      edgeFields: [
        "specificity_max",
        "mean_log_norm_max",
        "fraction_expressing_max",
        "n_cells_total",
      ],
      nodeFields: ["name", "cell_type_name"],
      sortByEdgeField: "specificity_max",
    },
  );

  const cellxgene: CellxgeneRow[] = cellEdges.map((r) => ({
    cellTypeId: r.targetId,
    cellType:
      (r.node.cell_type_name as string) ??
      (r.node.name as string) ??
      r.targetLabel,
    meanLogNormMax: numOrNull(r.edge.mean_log_norm_max),
    specificityMax: numOrNull(r.edge.specificity_max),
    fractionExpressing: numOrNull(r.edge.fraction_expressing_max),
    nCells: numOrNull(r.edge.n_cells_total),
  }));

  return <ExpressionCard gtex={gene.gtex} cellxgene={cellxgene} />;
}
