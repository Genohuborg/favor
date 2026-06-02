"use client";

import { cn } from "@infra/utils";
import { DataSurface } from "@shared/components/ui/data-surface/data-surface";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shared/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { Info } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  EdgeCounts,
  EdgeRelations,
  EdgeRow,
  GraphPhenotype,
} from "../types";

// ============================================================================
// Props
// ============================================================================

interface PhenotypePageProps {
  phenotype: GraphPhenotype;
  counts?: EdgeCounts;
  relations?: EdgeRelations;
}

// ============================================================================
// Shared Helpers
// ============================================================================

function fmtCount(n?: number): string {
  if (n == null) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function getRows(
  relations: EdgeRelations | undefined,
  type: string,
): EdgeRow[] {
  return relations?.[type]?.rows ?? [];
}

function ep<T = unknown>(row: EdgeRow, key: string): T {
  return row.link.props[key] as T;
}

function nb<T = unknown>(row: EdgeRow, key: string): T {
  return (row.neighbor as Record<string, unknown>)[key] as T;
}

const CONFIDENCE_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function ConfidenceBadge({ value }: { value: string }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  const colors: Record<string, string> = {
    high: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    low: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex px-1.5 py-0.5 rounded text-xs font-medium",
        colors[value] ?? colors.low,
      )}
    >
      {value}
    </span>
  );
}

function Hint({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-3 h-3 text-muted-foreground/50 inline-block ml-1 cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-64">{text}</TooltipContent>
    </Tooltip>
  );
}

// ============================================================================
// Profile Tab
// ============================================================================

function ProfileTab({
  phenotype,
  relations,
}: {
  phenotype: GraphPhenotype;
  relations?: EdgeRelations;
}) {
  const [showAllSynonyms, setShowAllSynonyms] = useState(false);

  // Hierarchy: separate parents from children
  const hierarchyRows = getRows(relations, "PHENOTYPE_HIERARCHY");
  const parents: Array<{ id: string; name: string; description?: string }> = [];
  const children: Array<{ id: string; name: string; description?: string }> =
    [];

  for (const row of hierarchyRows) {
    const parentName = String(ep(row, "parent_phenotype_name") ?? "");
    const childName = String(ep(row, "child_phenotype_name") ?? "");
    if (childName.toLowerCase() === phenotype.phenotype_name.toLowerCase()) {
      parents.push({
        id: row.neighbor.id,
        name: String(nb(row, "name") ?? parentName),
        description: String(ep(row, "parent_phenotype_description") ?? ""),
      });
    } else {
      children.push({
        id: row.neighbor.id,
        name: String(nb(row, "name") ?? childName),
        description: String(ep(row, "child_phenotype_description") ?? ""),
      });
    }
  }

  // Cross-references (equivalent phenotypes in other ontologies)
  const equivalentRows = getRows(relations, "PHENOTYPE_EQUIVALENT_TO");
  const crossRefs = equivalentRows.map((row) => ({
    id: row.neighbor.id,
    name: String(
      nb(row, "name") ?? ep(row, "dst_phenotype_name") ?? row.neighbor.id,
    ),
    source: String(nb(row, "source") ?? ""),
  }));

  // Synonyms
  const synonyms = phenotype.synonyms ?? [];
  const visibleSynonyms = showAllSynonyms ? synonyms : synonyms.slice(0, 20);
  const hasMoreSynonyms = synonyms.length > 20;

  return (
    <div className="space-y-8 pt-6">
      {/* Definition */}
      {phenotype.phenotype_definition && (
        <p className="text-[13px] text-muted-foreground leading-relaxed max-w-3xl">
          {phenotype.phenotype_definition}
        </p>
      )}

      {/* Phenotype Hierarchy */}
      {(parents.length > 0 || children.length > 0) && (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 inline-flex items-center">
            Ontology Hierarchy
            <Hint text="Direct parent-child relationships in the HPO/MP ontology tree" />
          </h3>
          <div className="space-y-4">
            {parents.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground/70 mb-1.5 block">
                  Parent terms
                </span>
                <div className="space-y-1.5">
                  {parents.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-baseline gap-2 text-[13px]"
                    >
                      <Link
                        href={`/phenotype/${p.id}`}
                        className="text-primary hover:underline font-medium shrink-0"
                      >
                        {p.name}
                      </Link>
                      {p.description && (
                        <span className="text-muted-foreground/70 truncate">
                          {p.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {children.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground/70 mb-1.5 block">
                  Child terms
                </span>
                <div className="space-y-1.5">
                  {children.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-baseline gap-2 text-[13px]"
                    >
                      <Link
                        href={`/phenotype/${c.id}`}
                        className="text-primary hover:underline font-medium shrink-0"
                      >
                        {c.name}
                      </Link>
                      {c.description && (
                        <span className="text-muted-foreground/70 truncate">
                          {c.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cross-references */}
      {crossRefs.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 inline-flex items-center">
            Cross-references
            <Hint text="Cross-species equivalent phenotypes via uPheno mapping (HP to MP)" />
          </h3>
          <div className="space-y-1.5">
            {crossRefs.map((ref) => (
              <div
                key={ref.id}
                className="flex items-baseline gap-2 text-[13px]"
              >
                <span className="font-mono text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                  {ref.id.replace("_", ":")}
                </span>
                <span className="text-muted-foreground">{ref.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Synonyms */}
      {synonyms.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 inline-flex items-center">
            Synonyms{" "}
            <span className="font-normal text-muted-foreground/70 ml-1">
              {synonyms.length}
            </span>
            <Hint text="Alternative names from the HPO or MP ontology" />
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {visibleSynonyms.map((syn, i) => (
              <span
                key={i}
                className="inline-flex px-2 py-0.5 rounded-md border border-border text-xs"
              >
                {syn}
              </span>
            ))}
            {hasMoreSynonyms && !showAllSynonyms && (
              <button
                onClick={() => setShowAllSynonyms(true)}
                className="text-xs text-primary hover:underline px-1"
              >
                +{synonyms.length - 20} more
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Genes — GENE_ASSOCIATED_WITH_PHENOTYPE
// ============================================================================

interface GeneRow {
  id: string;
  geneSymbol: string;
  geneId: string;
  confidence: string;
  evidenceCount: number;
  evidenceCode: string;
  evidenceOrigin: string;
  modelOrganism: string;
  geneFunction: string;
  phenotypeFrequency: string;
}

function transformGenes(rows: EdgeRow[]): GeneRow[] {
  return rows
    .map((r, i) => ({
      id: `gene-${i}`,
      geneSymbol: String(ep(r, "gene_symbol") ?? ""),
      geneId: r.neighbor.id,
      confidence: String(ep(r, "confidence_class") ?? ""),
      evidenceCount: Number(ep(r, "evidence_count") ?? 0),
      evidenceCode: String(ep(r, "evidence_code") ?? ""),
      evidenceOrigin: String(ep(r, "evidence_origin") ?? ""),
      modelOrganism: String(ep(r, "model_organism") ?? ""),
      geneFunction: String(ep(r, "gene_function") ?? ""),
      phenotypeFrequency: String(ep(r, "phenotype_frequency") ?? ""),
    }))
    .sort((a, b) => {
      const ca = CONFIDENCE_ORDER[a.confidence] ?? 9;
      const cb = CONFIDENCE_ORDER[b.confidence] ?? 9;
      if (ca !== cb) return ca - cb;
      return b.evidenceCount - a.evidenceCount;
    });
}

const geneColumns: ColumnDef<GeneRow>[] = [
  {
    id: "geneSymbol",
    accessorKey: "geneSymbol",
    header: "Gene",
    enableSorting: true,
    cell: ({ row }) => (
      <Link
        href={`/hg38/gene/${row.original.geneId}/gene-level-annotation/summary`}
        className="text-primary hover:underline font-medium"
      >
        {row.original.geneSymbol}
      </Link>
    ),
  },
  {
    id: "confidence",
    accessorKey: "confidence",
    header: () => (
      <span className="inline-flex items-center">
        Confidence
        <Hint text="Confidence tier derived from evidence strength: high = published clinical study, medium = traceable author statement, low = inferred electronic annotation" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => <ConfidenceBadge value={row.original.confidence} />,
  },
  {
    id: "evidenceCount",
    accessorKey: "evidenceCount",
    header: () => (
      <span className="inline-flex items-center">
        Evidence
        <Hint text="Number of distinct diseases linking this gene-phenotype pair" />
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "evidenceCode",
    accessorKey: "evidenceCode",
    header: () => (
      <span className="inline-flex items-center">
        Evidence Code
        <Hint text="PCS = published clinical study (strongest), TAS = traceable author statement, IEA = inferred from electronic annotation (weakest)" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.evidenceCode || "—",
  },
  {
    id: "phenotypeFrequency",
    accessorKey: "phenotypeFrequency",
    header: () => (
      <span className="inline-flex items-center">
        Frequency
        <Hint text="How often this phenotype occurs in affected individuals. Very frequent = >80%, Frequent = 30-79%, Occasional = 5-29%, Very rare = <5%" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.phenotypeFrequency || "—",
  },
  {
    id: "evidenceOrigin",
    accessorKey: "evidenceOrigin",
    header: () => (
      <span className="inline-flex items-center">
        Origin
        <Hint text="Source of the gene-phenotype annotation: HPO for direct HPO annotation, OMIM for OMIM-derived" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.evidenceOrigin || "—",
  },
  {
    id: "modelOrganism",
    accessorKey: "modelOrganism",
    header: () => (
      <span className="inline-flex items-center">
        Model Organism
        <Hint text="Species of the model organism with orthologous phenotype (e.g. Mus musculus)" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.modelOrganism || "—",
  },
  {
    id: "geneFunction",
    accessorKey: "geneFunction",
    header: "Gene Function",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.geneFunction ? (
        <span className="text-[13px] text-muted-foreground line-clamp-2">
          {row.original.geneFunction}
        </span>
      ) : (
        "—"
      ),
  },
];

// ============================================================================
// Diseases — DISEASE_HAS_PHENOTYPE
// ============================================================================

interface DiseaseRow {
  id: string;
  diseaseId: string;
  diseaseName: string;
  evidenceCode: string;
  phenotypeFrequency: string;
  evidenceCount: number;
  isCancer: boolean;
  isRare: boolean;
}

function transformDiseases(rows: EdgeRow[]): DiseaseRow[] {
  return rows
    .map((r, i) => ({
      id: `disease-${i}`,
      diseaseId: r.neighbor.id,
      diseaseName: String(nb(r, "name") ?? ep(r, "disease_name") ?? ""),
      evidenceCode: String(ep(r, "evidence_code") ?? ""),
      phenotypeFrequency: String(ep(r, "phenotype_frequency") ?? ""),
      evidenceCount: Number(ep(r, "evidence_count") ?? 0),
      isCancer: Boolean(nb(r, "is_cancer")),
      isRare: Boolean(nb(r, "is_rare")),
    }))
    .sort((a, b) => b.evidenceCount - a.evidenceCount);
}

const diseaseColumns: ColumnDef<DiseaseRow>[] = [
  {
    id: "diseaseName",
    accessorKey: "diseaseName",
    header: "Disease",
    enableSorting: true,
    cell: ({ row }) => (
      <Link
        href={`/disease/${row.original.diseaseId}`}
        className="text-primary hover:underline font-medium"
      >
        {row.original.diseaseName}
      </Link>
    ),
  },
  {
    id: "evidenceCode",
    accessorKey: "evidenceCode",
    header: () => (
      <span className="inline-flex items-center">
        Evidence Code
        <Hint text="PCS = published clinical study (strongest), TAS = traceable author statement, ICE = individual clinical experience, IEA = inferred electronic annotation (weakest)" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.evidenceCode || "—",
  },
  {
    id: "phenotypeFrequency",
    accessorKey: "phenotypeFrequency",
    header: () => (
      <span className="inline-flex items-center">
        Frequency
        <Hint text="Reported frequency of the phenotype in this disease. Can be an HPO frequency term, a ratio, or a percentage" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.phenotypeFrequency || "—",
  },
  {
    id: "evidenceCount",
    accessorKey: "evidenceCount",
    header: () => (
      <span className="inline-flex items-center">
        Evidence
        <Hint text="Number of annotation rows for this disease-phenotype pair. Higher counts indicate more independent evidence sources" />
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags: string[] = [];
      if (row.original.isCancer) tags.push("Cancer");
      if (row.original.isRare) tags.push("Rare");
      if (!tags.length) return null;
      return (
        <div className="flex gap-1">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      );
    },
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function PhenotypePage({
  phenotype,
  counts,
  relations,
}: PhenotypePageProps) {
  const [activeTab, setActiveTab] = useState("profile");

  const genes = useMemo(
    () => transformGenes(getRows(relations, "GENE_ASSOCIATED_WITH_PHENOTYPE")),
    [relations],
  );
  const diseases = useMemo(
    () => transformDiseases(getRows(relations, "DISEASE_HAS_PHENOTYPE")),
    [relations],
  );

  const tabs = [
    { value: "profile", label: "Profile", count: undefined },
    {
      value: "genes",
      label: "Genes",
      count: counts?.GENE_ASSOCIATED_WITH_PHENOTYPE,
    },
    {
      value: "diseases",
      label: "Diseases",
      count: counts?.DISEASE_HAS_PHENOTYPE,
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
      <div className="border-b border-border overflow-x-auto overflow-y-hidden">
        <TabsList variant="line" className="w-full justify-start p-0 h-auto">
          {tabs.map((tab) => {
            if (
              tab.value !== "profile" &&
              (tab.count == null || tab.count === 0)
            )
              return null;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-[13px] py-2.5 px-3"
              >
                {tab.label}
                {tab.count != null && tab.count > 0 && (
                  <span className="ml-1 text-xs text-muted-foreground font-normal tabular-nums">
                    {fmtCount(tab.count)}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <TabsContent value="profile">
        <ProfileTab phenotype={phenotype} relations={relations} />
      </TabsContent>

      <TabsContent value="genes" className="pt-6">
        <DataSurface
          columns={geneColumns}
          data={genes}
          title="Associated Genes"
          subtitle="Sorted by confidence, then evidence count"
          searchPlaceholder="Search genes..."
          searchColumn="geneSymbol"
          exportable
          exportFilename={`${phenotype.id}-genes`}
          defaultPageSize={25}
          emptyMessage="No gene associations available"
        />
      </TabsContent>

      <TabsContent value="diseases" className="pt-6">
        <DataSurface
          columns={diseaseColumns}
          data={diseases}
          title="Associated Diseases"
          subtitle={
            counts?.DISEASE_HAS_PHENOTYPE && counts.DISEASE_HAS_PHENOTYPE > 200
              ? `Showing 200 of ${fmtCount(counts.DISEASE_HAS_PHENOTYPE)} — sorted by evidence count`
              : "Sorted by evidence count"
          }
          searchPlaceholder="Search diseases..."
          searchColumn="diseaseName"
          exportable
          exportFilename={`${phenotype.id}-diseases`}
          defaultPageSize={25}
          emptyMessage="No disease associations available"
        />
      </TabsContent>
    </Tabs>
  );
}
