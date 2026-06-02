import { fetchGene } from "@features/gene/api";
import { ProteinStructureView } from "@features/gene/components/protein-structure";
import { assignDomainColors } from "@features/gene/components/protein-structure/colors";
import type { ProteinDomain } from "@features/gene/components/protein-structure/types";
import {
  fetchGraphQuery,
  parseTypeId,
  searchEntities,
} from "@features/graph/api";
import { fetchVariantWithCookie } from "@features/variant/utils/fetch-with-cookie";
import { notFound } from "next/navigation";

interface VariantProteinStructurePageProps {
  params: Promise<{ vcf: string; category: string }>;
}

export default async function VariantProteinStructurePage({
  params,
}: VariantProteinStructurePageProps) {
  const { vcf } = await params;

  const result = await fetchVariantWithCookie(vcf);
  if (!result) notFound();

  const variant = result.selected;

  // Extract variant protein change and amino acid position
  // Sources: alphamissense protein_variant (e.g. "C130R") or genecode hgvsp (e.g. "p.C130R")
  const proteinVariant =
    variant.alphamissense?.predictions?.[0]?.protein_variant ?? null;
  const hgvsp =
    variant.genecode?.transcripts?.[0]?.hgvsp ??
    variant.refseq?.exonic_details?.[0]?.hgvsp;

  // Parse label and position from protein variant notation
  const rawLabel = proteinVariant ?? hgvsp?.replace(/^p\./, "") ?? null;
  const variantLabel = rawLabel ?? undefined;
  // Extract position number from notation like "C130R" or "Cys130Arg"
  const posMatch = rawLabel?.match(/(\d+)/);
  const aapos = posMatch ? Number(posMatch[1]) : undefined;

  // Get gene symbol to look up gene data
  const geneSymbol = variant.genecode?.genes?.[0];
  if (!geneSymbol) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">
          No gene associated with this variant — protein structure unavailable
        </p>
      </div>
    );
  }

  // Get UniProt ID from AlphaMissense predictions
  let uniprotId = variant.alphamissense?.predictions?.[0]?.uniprot_id ?? null;
  let geneId: string | null = null;

  // Search for the gene by symbol to get the Ensembl ID
  // (the gene API only accepts Ensembl IDs, not symbols)
  const searchResult = await searchEntities(geneSymbol, ["Gene"], 1);
  const geneMatch = searchResult?.data?.results?.[0] as
    | { entity?: { id?: string }; id?: string }
    | undefined;
  const matchedId = geneMatch?.entity?.id ?? geneMatch?.id ?? null;

  if (matchedId) {
    geneId = matchedId;

    // Fetch full gene data to get uniprot_id if we don't have it
    if (!uniprotId) {
      const geneResponse = await fetchGene(geneId);
      if (geneResponse?.data) {
        uniprotId = geneResponse.data.uniprot_id ?? null;
      }
    }
  }

  if (!uniprotId && !geneId) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">
          No protein structure data available for {geneSymbol}
        </p>
      </div>
    );
  }

  // Fetch protein domains via graph
  const domains: ProteinDomain[] = [];
  let proteinLength = 0;

  if (geneId) {
    const graphResponse = await fetchGraphQuery({
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
    });

    if (graphResponse?.data) {
      const { nodes, edges } = graphResponse.data;

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

        const targetKey = edge.to;
        const node = nodes[targetKey];
        const { id: domainId } = parseTypeId(targetKey);
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
  }

  if (proteinLength > 0) {
    proteinLength = Math.ceil(proteinLength * 1.05);
  }

  return (
    <ProteinStructureView
      uniprotId={uniprotId ?? ""}
      geneSymbol={geneSymbol}
      domains={domains}
      proteinLength={proteinLength}
      variantPosition={aapos}
      variantLabel={variantLabel}
    />
  );
}
