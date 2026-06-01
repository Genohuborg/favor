import {
  fetchGene,
  fetchGeneEdgeRows,
  type GeneEdgeRow,
} from "@features/gene/api";
import {
  FunctionalPartnersView,
  type ModuleRow,
  type PartnerGene,
} from "@features/gene/components/functional-partners";
import { notFound } from "next/navigation";

interface FunctionalPartnersPageProps {
  params: Promise<{ id: string }>;
}

function numOrNull(value: unknown): number | null {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function symbolOf(r: GeneEdgeRow): string {
  return (r.node.gene_symbol as string) ?? r.targetLabel;
}

function toPartner(r: GeneEdgeRow): PartnerGene {
  return { geneId: r.targetId, geneSymbol: symbolOf(r) };
}

export default async function FunctionalPartnersPage({
  params,
}: FunctionalPartnersPageProps) {
  const { id } = await params;

  const geneResponse = await fetchGene(id);
  const gene = geneResponse?.data;
  if (!gene) notFound();

  const geneSymbol = gene.gene_symbol ?? id;
  const geneId = gene.gene_id_versioned?.split(".")[0] || id;
  const nodeFields = ["gene_symbol", "name"];

  const [coexpr, coEss, genInt, tfTargets, tfRegulators] = await Promise.all([
    fetchGeneEdgeRows(geneId, "GENE_COEXPRESSED_WITH_GENE", {
      direction: "out",
      edgeFields: ["z_score"],
      nodeFields,
      limit: 200,
    }),
    fetchGeneEdgeRows(geneId, "GENE_CO_ESSENTIAL_WITH_GENE", {
      direction: "out",
      edgeFields: ["pearson_r"],
      nodeFields,
      limit: 200,
    }),
    fetchGeneEdgeRows(geneId, "GENE_GENETIC_INTERACTION_GENE", {
      direction: "out",
      edgeFields: [],
      nodeFields,
      limit: 200,
    }),
    fetchGeneEdgeRows(geneId, "TF_REGULATES_GENE", {
      direction: "out",
      edgeFields: ["evidence_count"],
      nodeFields,
      sortByEdgeField: "evidence_count",
    }),
    fetchGeneEdgeRows(geneId, "TF_REGULATES_GENE", {
      direction: "in",
      edgeFields: ["evidence_count"],
      nodeFields,
      sortByEdgeField: "evidence_count",
    }),
  ]);

  // Join the three undirected evidence types per partner gene.
  const moduleMap = new Map<string, ModuleRow>();
  const ensure = (r: GeneEdgeRow): ModuleRow => {
    const existing = moduleMap.get(r.targetId);
    if (existing) return existing;
    const created: ModuleRow = {
      geneId: r.targetId,
      geneSymbol: symbolOf(r),
      zScore: null,
      pearsonR: null,
      interacts: false,
      support: 0,
    };
    moduleMap.set(r.targetId, created);
    return created;
  };

  for (const r of coexpr) ensure(r).zScore = numOrNull(r.edge.z_score);
  for (const r of coEss) ensure(r).pearsonR = numOrNull(r.edge.pearson_r);
  for (const r of genInt) ensure(r).interacts = true;

  const module = [...moduleMap.values()].map((m) => ({
    ...m,
    support:
      (m.zScore !== null ? 1 : 0) +
      (m.pearsonR !== null ? 1 : 0) +
      (m.interacts ? 1 : 0),
  }));

  // Rank by convergence, then by strongest single signal.
  module.sort(
    (a, b) =>
      b.support - a.support ||
      (b.zScore ?? Number.NEGATIVE_INFINITY) -
        (a.zScore ?? Number.NEGATIVE_INFINITY),
  );

  return (
    <FunctionalPartnersView
      geneSymbol={geneSymbol}
      module={module}
      regulators={tfRegulators.map(toPartner)}
      targets={tfTargets.map(toPartner)}
    />
  );
}
