import { fetchGene, fetchGeneEdgeRows } from "@features/gene/api";
import {
  ProteinHeader,
  ProteinPanels,
  ProteinStructureView,
} from "@features/gene/components/protein-structure";
import { assignDomainColors } from "@features/gene/components/protein-structure/colors";
import type {
  ComplexRow,
  ProteinDomain,
  ProteinSummary,
  TranscriptRow,
} from "@features/gene/components/protein-structure/types";
import { fetchGraphQuery, parseTypeId } from "@features/graph/api";
import { notFound } from "next/navigation";

interface ProteinStructurePageProps {
  params: Promise<{ id: string }>;
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}
function num(value: unknown): number | null {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}
function bool(value: unknown): boolean {
  return value === true;
}

async function fetchComplexes(geneId: string): Promise<ComplexRow[]> {
  const response = await fetchGraphQuery({
    seeds: [{ type: "Gene", id: geneId }],
    steps: [
      { edgeTypes: ["GENE_ENCODES_PROTEIN"], direction: "out", limit: 5 },
      { edgeTypes: ["PROTEIN_PART_OF_COMPLEX"], direction: "out", limit: 50 },
    ],
    select: {
      nodeFields: ["complex_name", "name", "complex_assembly", "n_components"],
      edgeFields: ["stoichiometry"],
    },
    limits: { maxNodes: 100, maxEdges: 200 },
  });

  if (!response?.data) return [];
  const { nodes, edges } = response.data;
  const complexes: ComplexRow[] = [];

  for (const edge of edges) {
    if (edge.type !== "PROTEIN_PART_OF_COMPLEX") continue;
    const node = nodes[edge.to];
    const { id: complexId } = parseTypeId(edge.to);
    complexes.push({
      complexId,
      name:
        str(node?.fields?.complex_name) ??
        str(node?.fields?.name) ??
        node?.entity?.label ??
        complexId,
      assembly: str(node?.fields?.complex_assembly),
      nComponents: num(node?.fields?.n_components),
      stoichiometry: str(edge.fields?.stoichiometry),
    });
  }
  return complexes;
}

export default async function GeneProteinStructurePage({
  params,
}: ProteinStructurePageProps) {
  const { id } = await params;

  const geneResponse = await fetchGene(id);
  const gene = geneResponse?.data;
  if (!gene) notFound();

  const uniprotId = gene.uniprot_id;
  const geneSymbol = gene.gene_symbol ?? id;
  const geneId = gene.gene_id_versioned?.split(".")[0] || id;

  const [domainResponse, proteinRows, transcriptRows, complexes] =
    await Promise.all([
      fetchGraphQuery({
        seeds: [{ type: "Gene", id: geneId }],
        steps: [
          {
            edgeTypes: ["GENE_HAS_PROTEIN_DOMAIN"],
            direction: "out",
            limit: 50,
          },
        ],
        select: {
          nodeFields: ["domain_name", "description", "domain_type"],
          edgeFields: ["start_residue", "end_residue", "mean_plddt"],
        },
        limits: { maxNodes: 100, maxEdges: 200 },
      }),
      fetchGeneEdgeRows(geneId, "GENE_ENCODES_PROTEIN", {
        direction: "out",
        edgeFields: ["evidence_count"],
        nodeFields: [
          "protein_name",
          "uniprot_mnemonic",
          "length_aa",
          "mass_da",
          "function_description",
        ],
      }),
      fetchGeneEdgeRows(geneId, "GENE_HAS_TRANSCRIPT", {
        direction: "out",
        edgeFields: [
          "transcript_name",
          "is_canonical",
          "is_mane_select",
          "transcript_type",
        ],
        nodeFields: [
          "transcript_type",
          "is_canonical",
          "is_mane_select",
          "support_level",
        ],
      }),
      fetchComplexes(geneId),
    ]);

  // Parse protein domains (existing behavior)
  const domains: ProteinDomain[] = [];
  let proteinLength = 0;

  if (domainResponse?.data) {
    const { nodes, edges } = domainResponse.data;
    const domainNames: string[] = [];
    const rawDomains: Array<{
      id: string;
      name: string;
      start: number;
      end: number;
      type?: string;
    }> = [];

    for (const edge of edges) {
      const start = Number(edge.fields?.start_residue);
      const end = Number(edge.fields?.end_residue);
      if (!start || !end) continue;

      const node = nodes[edge.to];
      const { id: domainId } = parseTypeId(edge.to);
      const name =
        (node?.fields?.domain_name as string) ??
        node?.entity?.label ??
        domainId;

      domainNames.push(name);
      rawDomains.push({
        id: domainId,
        name,
        start,
        end,
        type: (node?.fields?.domain_type as string) ?? undefined,
      });
      if (end > proteinLength) proteinLength = end;
    }

    const colorMap = assignDomainColors(domainNames);
    for (const d of rawDomains) {
      domains.push({ ...d, color: colorMap.get(d.name) ?? "#2563eb" });
    }
  }

  // Protein summary (first encoded protein)
  const firstProtein = proteinRows[0];
  const protein: ProteinSummary | null = firstProtein
    ? {
        uniprotId: firstProtein.targetId,
        name: str(firstProtein.node.protein_name),
        mnemonic: str(firstProtein.node.uniprot_mnemonic),
        lengthAa: num(firstProtein.node.length_aa),
        massDa: num(firstProtein.node.mass_da),
        functionDescription: str(firstProtein.node.function_description),
      }
    : null;

  // Prefer the real UniProt length; fall back to the domain-derived estimate.
  if (protein?.lengthAa) {
    proteinLength = protein.lengthAa;
  } else if (proteinLength > 0) {
    proteinLength = Math.ceil(proteinLength * 1.05);
  }

  const transcripts: TranscriptRow[] = transcriptRows.map((r) => ({
    transcriptId: r.targetId,
    name: str(r.edge.transcript_name) ?? r.targetLabel,
    transcriptType: str(r.node.transcript_type) ?? str(r.edge.transcript_type),
    isCanonical: bool(r.node.is_canonical) || bool(r.edge.is_canonical),
    isManeSelect: bool(r.node.is_mane_select) || bool(r.edge.is_mane_select),
    supportLevel: str(r.node.support_level),
  }));

  // Surface the principal isoform first: MANE Select, then canonical, then
  // protein-coding, then the rest.
  const transcriptRank = (t: TranscriptRow) =>
    t.isManeSelect
      ? 0
      : t.isCanonical
        ? 1
        : t.transcriptType === "protein_coding"
          ? 2
          : 3;
  transcripts.sort(
    (a, b) =>
      transcriptRank(a) - transcriptRank(b) || a.name.localeCompare(b.name),
  );

  return (
    <div className="space-y-6">
      {protein && <ProteinHeader protein={protein} />}
      <ProteinStructureView
        uniprotId={uniprotId}
        geneSymbol={geneSymbol}
        domains={domains}
        proteinLength={proteinLength}
      />
      <ProteinPanels isoforms={transcripts} complexes={complexes} />
    </div>
  );
}
