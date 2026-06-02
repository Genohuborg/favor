"use client";

import { cn } from "@infra/utils";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { DataSurface } from "@shared/components/ui/data-surface/data-surface";
import { MoleculeViewer } from "@shared/components/ui/molecule-viewer";
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
import { Copy, Info } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { EdgeCounts, EdgeRelations, EdgeRow, GraphDrug } from "../types";

// ============================================================================
// Props
// ============================================================================

interface DrugPageProps {
  drug: GraphDrug;
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

function phaseLabel(phase: unknown): string {
  const n = Number(phase);
  if (phase == null || Number.isNaN(n)) return "—";
  if (n === 4) return "Phase IV";
  if (n >= 3) return "Phase III";
  if (n >= 2) return "Phase II";
  if (n >= 1) return "Phase I";
  if (n > 0) return "Early Phase I";
  return "Preclinical";
}

const CONFIDENCE_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};
const SEVERITY_ORDER: Record<string, number> = {
  Critical: 0,
  Major: 1,
  Moderate: 2,
  Minor: 3,
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

/** Inline info icon with tooltip — for jargon explanation */
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
// Profile Tab — flat layout, no redundant metrics
// ============================================================================

function ProfileTab({ drug }: { drug: GraphDrug }) {
  const [showAllNames, setShowAllNames] = useState(false);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* noop */
    }
  };

  const visibleNames = showAllNames
    ? drug.known_as
    : drug.known_as?.slice(0, 24);
  const hasMoreNames = (drug.known_as?.length ?? 0) > 24;

  // ATC pairs
  const atcEntries: Array<{ code: string; name?: string }> = [];
  if (drug.atc_codes?.length) {
    for (let i = 0; i < drug.atc_codes.length; i++) {
      atcEntries.push({
        code: drug.atc_codes[i],
        name: drug.atc_names?.[i],
      });
    }
  }

  // Chemistry metadata (shown beneath structure or standalone)
  const hasChemistry =
    drug.molecular_formula || drug.molecular_weight != null || drug.inchi_key;

  return (
    <div className="space-y-8 pt-6">
      {/* Description */}
      {drug.description && (
        <p className="text-[13px] text-muted-foreground leading-relaxed max-w-3xl">
          {drug.description}
        </p>
      )}

      {/* Molecule Structure + Chemistry */}
      {drug.canonical_smiles && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex justify-center py-6 px-4">
            <MoleculeViewer
              smiles={drug.canonical_smiles}
              width={400}
              height={280}
            />
          </div>
          {hasChemistry && (
            <div className="border-t border-border px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
              {drug.molecular_formula && (
                <span>
                  <span className="text-muted-foreground">Formula</span>{" "}
                  <span className="font-mono">{drug.molecular_formula}</span>
                </span>
              )}
              {drug.molecular_weight != null && (
                <span className="inline-flex items-center gap-1">
                  <span className="text-muted-foreground">MW</span>
                  <Hint text="Molecular weight in Daltons" />
                  <span className="font-mono">{drug.molecular_weight} Da</span>
                </span>
              )}
              {drug.inchi_key && (
                <span className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">InChIKey</span>
                  <Hint text="Unique molecular hash for cross-database lookups" />
                  <span className="font-mono text-xs">{drug.inchi_key}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => copyText(drug.inchi_key!)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chemistry fallback — no structure but has formula/MW/InChIKey */}
      {!drug.canonical_smiles && hasChemistry && (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Chemistry
          </h3>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
            {drug.molecular_formula && (
              <span>
                <span className="text-muted-foreground">Formula</span>{" "}
                <span className="font-mono">{drug.molecular_formula}</span>
              </span>
            )}
            {drug.molecular_weight != null && (
              <span className="inline-flex items-center gap-1">
                <span className="text-muted-foreground">MW</span>
                <Hint text="Molecular weight in Daltons" />
                <span className="font-mono">{drug.molecular_weight} Da</span>
              </span>
            )}
            {drug.inchi_key && (
              <span className="flex items-center gap-1.5">
                <span className="text-muted-foreground">InChIKey</span>
                <Hint text="Unique molecular hash for cross-database lookups" />
                <span className="font-mono text-xs">{drug.inchi_key}</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => copyText(drug.inchi_key!)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ATC Classification */}
      {atcEntries.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 inline-flex items-center">
            ATC Classification
            <Hint text="WHO drug classification by therapeutic use and pharmacology" />
          </h3>
          <div className="space-y-1.5">
            {atcEntries.map((e) => (
              <div
                key={e.code}
                className="flex items-baseline gap-2 text-[13px]"
              >
                <span className="font-mono text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                  {e.code}
                </span>
                {e.name && (
                  <span className="text-muted-foreground">{e.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Administration */}
      {drug.routes_of_administration &&
        drug.routes_of_administration.length > 0 && (
          <div>
            <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Administration
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {drug.routes_of_administration.map((r) => (
                <span
                  key={r}
                  className="inline-flex px-2 py-0.5 rounded-md bg-muted text-[13px]"
                >
                  {r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Properties — only noteworthy flags */}
      {(drug.natural_product ||
        drug.is_prodrug ||
        drug.has_orphan_designation ||
        drug.bioavailability != null) && (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Properties
          </h3>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
            {drug.natural_product && (
              <span className="inline-flex items-center">
                Natural product
                <Hint text="Derived from a natural biological source" />
              </span>
            )}
            {drug.is_prodrug && (
              <span className="inline-flex items-center">
                Prodrug
                <Hint text="Inactive compound converted to active form in the body" />
              </span>
            )}
            {drug.has_orphan_designation && (
              <span className="inline-flex items-center">
                Orphan designation
                <Hint text="FDA designation for drugs treating rare diseases" />
              </span>
            )}
            {drug.bioavailability != null && (
              <span className="inline-flex items-center text-muted-foreground">
                Bioavailability:{" "}
                <span className="text-foreground font-medium ml-1">
                  {drug.bioavailability}%
                </span>
                <Hint text="Fraction of dose reaching systemic circulation" />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Known As */}
      {drug.known_as && drug.known_as.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Known As{" "}
            <span className="font-normal text-muted-foreground/70">
              {drug.known_as.length}
            </span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {visibleNames?.map((name, i) => (
              <span
                key={i}
                className="inline-flex px-2 py-0.5 rounded-md border border-border text-xs"
              >
                {name}
              </span>
            ))}
            {hasMoreNames && !showAllNames && (
              <button
                onClick={() => setShowAllNames(true)}
                className="text-xs text-primary hover:underline px-1"
              >
                +{drug.known_as.length - 24} more
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Targets — DRUG_ACTS_ON_GENE
// ============================================================================

interface TargetRow {
  id: string;
  geneSymbol: string;
  geneId: string;
  targetName: string;
  actionType: string;
  moa: string;
  bindingAffinity: number | null;
  assayType: string;
  phase: number | null;
  isPrimary: boolean;
  confidence: string;
  sources: string[];
  evidenceCount: number;
  receptorFamily: string;
}

function transformTargets(rows: EdgeRow[]): TargetRow[] {
  return rows
    .map((r, i) => ({
      id: `target-${i}`,
      geneSymbol: String(ep(r, "gene_symbol") ?? nb(r, "symbol") ?? ""),
      geneId: r.neighbor.id,
      targetName: String(ep(r, "target_name") ?? ""),
      actionType: String(ep(r, "action_type") ?? ""),
      moa: String(ep(r, "mechanism_of_action") ?? ""),
      bindingAffinity:
        ep(r, "binding_affinity") != null
          ? Number(ep(r, "binding_affinity"))
          : null,
      assayType: String(ep(r, "binding_assay_type") ?? ""),
      phase:
        ep(r, "max_clinical_phase") != null
          ? Number(ep(r, "max_clinical_phase"))
          : null,
      isPrimary: Boolean(ep(r, "is_primary_target")),
      confidence: String(ep(r, "confidence_class") ?? ""),
      sources: ep<string[]>(r, "sources") ?? [],
      evidenceCount: Number(ep(r, "evidence_count") ?? 0),
      receptorFamily: String(ep(r, "receptor_family") ?? ""),
    }))
    .sort((a, b) => {
      if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
      const ca = CONFIDENCE_ORDER[a.confidence] ?? 9;
      const cb = CONFIDENCE_ORDER[b.confidence] ?? 9;
      if (ca !== cb) return ca - cb;
      return (b.bindingAffinity ?? 0) - (a.bindingAffinity ?? 0);
    });
}

const targetColumns: ColumnDef<TargetRow>[] = [
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
    id: "targetName",
    accessorKey: "targetName",
    header: "Target Name",
    enableSorting: true,
    cell: ({ row }) => row.original.targetName || "—",
  },
  {
    id: "actionType",
    accessorKey: "actionType",
    header: "Action",
    enableSorting: true,
    cell: ({ row }) => row.original.actionType || "—",
  },
  {
    id: "moa",
    accessorKey: "moa",
    header: "Mechanism",
    enableSorting: true,
    cell: ({ row }) => row.original.moa || "—",
  },
  {
    id: "bindingAffinity",
    accessorKey: "bindingAffinity",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Affinity
        <Hint text="Quantitative binding affinity as -log10(M). ≥9 sub-nM, ≥7 nM, ≥5 µM" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const v = row.original.bindingAffinity;
      if (v == null) return "—";
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-mono text-[13px] cursor-help">
              {v.toFixed(1)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {row.original.assayType}: {v.toFixed(2)} (-log₁₀M)
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "phase",
    accessorKey: "phase",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Phase
        <Hint text="Highest clinical phase for this drug-gene pair. 4 = approved, 3 = late-stage trial" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => phaseLabel(row.original.phase),
  },
  {
    id: "isPrimary",
    accessorKey: "isPrimary",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Primary
        <Hint text="Designated primary mechanism-of-action target by GtoPdb or DrugCentral" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) =>
      row.original.isPrimary ? (
        <Badge variant="secondary" className="text-xs">
          Primary
        </Badge>
      ) : null,
  },
  {
    id: "confidence",
    accessorKey: "confidence",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Confidence
        <Hint text="high = 3+ sources or approved drug. medium = 2 sources or Phase II+. low = single source" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => <ConfidenceBadge value={row.original.confidence} />,
  },
  {
    id: "sources",
    accessorKey: "sources",
    header: "Sources",
    cell: ({ row }) => row.original.sources.join(", ") || "—",
  },
  {
    id: "evidenceCount",
    accessorKey: "evidenceCount",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Evidence
        <Hint text="Source-level evidence records supporting this pair" />
      </span>
    ),
    enableSorting: true,
  },
];

// ============================================================================
// Indications — DRUG_INDICATED_FOR_DISEASE
// ============================================================================

interface IndicationRow {
  id: string;
  diseaseId: string;
  diseaseName: string;
  phase: number | null;
  ttdStatus: string;
  confidence: string;
  sources: string[];
  evidenceCount: number;
  isCancer: boolean;
  isRare: boolean;
}

function transformIndications(rows: EdgeRow[]): IndicationRow[] {
  return rows
    .map((r, i) => ({
      id: `ind-${i}`,
      diseaseId: r.neighbor.id,
      diseaseName: String(nb(r, "name") ?? ep(r, "disease_name") ?? ""),
      phase:
        ep(r, "max_clinical_phase") != null
          ? Number(ep(r, "max_clinical_phase"))
          : null,
      ttdStatus: String(ep(r, "ttd_clinical_status") ?? ""),
      confidence: String(ep(r, "confidence_class") ?? ""),
      sources: ep<string[]>(r, "sources") ?? [],
      evidenceCount: Number(ep(r, "evidence_count") ?? 0),
      isCancer: Boolean(nb(r, "is_cancer")),
      isRare: Boolean(nb(r, "is_rare")),
    }))
    .sort((a, b) => (b.phase ?? -1) - (a.phase ?? -1));
}

const indicationColumns: ColumnDef<IndicationRow>[] = [
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
    id: "phase",
    accessorKey: "phase",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Phase
        <Hint text="Highest clinical phase for this drug-disease pair. 4 = approved indication" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => phaseLabel(row.original.phase),
  },
  {
    id: "ttdStatus",
    accessorKey: "ttdStatus",
    header: () => (
      <span className="inline-flex items-center gap-1">
        TTD Status
        <Hint text="Best clinical status from the Therapeutic Target Database" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.ttdStatus || "—",
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
            <Badge key={t} variant="outline" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "confidence",
    accessorKey: "confidence",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Confidence
        <Hint text="high = 3+ sources or approved. medium = 2 sources or Phase II+. low = single source" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => <ConfidenceBadge value={row.original.confidence} />,
  },
  {
    id: "sources",
    accessorKey: "sources",
    header: "Sources",
    cell: ({ row }) => row.original.sources.join(", ") || "—",
  },
  {
    id: "evidenceCount",
    accessorKey: "evidenceCount",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Evidence
        <Hint text="Number of source-level evidence records supporting this association" />
      </span>
    ),
    enableSorting: true,
  },
];

// ============================================================================
// Pharmacogenomics — DRUG_DISPOSITION_BY_GENE
// ============================================================================

interface DispositionRow {
  id: string;
  geneSymbol: string;
  geneId: string;
  dispositionType: string;
  devLevel: string;
  confidence: string;
  sources: string[];
  evidenceCount: number;
}

function transformDisposition(rows: EdgeRow[]): DispositionRow[] {
  return rows
    .map((r, i) => ({
      id: `disp-${i}`,
      geneSymbol: String(ep(r, "gene_symbol") ?? nb(r, "symbol") ?? ""),
      geneId: r.neighbor.id,
      dispositionType: String(ep(r, "disposition_type") ?? ""),
      devLevel: String(ep(r, "target_development_level") ?? ""),
      confidence: String(ep(r, "confidence_class") ?? ""),
      sources: ep<string[]>(r, "sources") ?? [],
      evidenceCount: Number(ep(r, "evidence_count") ?? 0),
    }))
    .sort((a, b) => b.evidenceCount - a.evidenceCount);
}

const dispositionColumns: ColumnDef<DispositionRow>[] = [
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
    id: "dispositionType",
    accessorKey: "dispositionType",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Disposition Type
        <Hint text="Whether this gene metabolizes or transports the drug" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.dispositionType || "—",
  },
  {
    id: "devLevel",
    accessorKey: "devLevel",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Development Level
        <Hint text="DrugCentral TDL. approved_drug_target = validated, understudied = novel opportunity" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) =>
      row.original.devLevel ? row.original.devLevel.replace(/_/g, " ") : "—",
  },
  {
    id: "confidence",
    accessorKey: "confidence",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Confidence
        <Hint text="high = 3+ sources or approved. medium = 2 sources or Phase II+. low = single source" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => <ConfidenceBadge value={row.original.confidence} />,
  },
  {
    id: "sources",
    accessorKey: "sources",
    header: "Sources",
    cell: ({ row }) => row.original.sources.join(", ") || "—",
  },
  {
    id: "evidenceCount",
    accessorKey: "evidenceCount",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Evidence
        <Hint text="Number of source-level evidence records supporting this association" />
      </span>
    ),
    enableSorting: true,
  },
];

// ============================================================================
// Pharmacogenomics — GENE_AFFECTS_DRUG_RESPONSE
// ============================================================================

interface GeneResponseRow {
  id: string;
  geneSymbol: string;
  geneId: string;
  evidenceOrigin: string;
  bestEvidenceLevel: string;
  confidence: string;
  sources: string[];
  evidenceCount: number;
}

function transformGeneResponse(rows: EdgeRow[]): GeneResponseRow[] {
  return rows
    .map((r, i) => ({
      id: `generesp-${i}`,
      geneSymbol: String(ep(r, "gene_symbol") ?? nb(r, "symbol") ?? ""),
      geneId: r.neighbor.id,
      evidenceOrigin: String(ep(r, "evidence_origin") ?? ""),
      bestEvidenceLevel: String(ep(r, "best_evidence_level") ?? ""),
      confidence: String(ep(r, "confidence_class") ?? ""),
      sources: ep<string[]>(r, "sources") ?? [],
      evidenceCount: Number(ep(r, "evidence_count") ?? 0),
    }))
    .sort((a, b) => b.evidenceCount - a.evidenceCount);
}

const geneResponseColumns: ColumnDef<GeneResponseRow>[] = [
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
    id: "evidenceOrigin",
    accessorKey: "evidenceOrigin",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Origin
        <Hint text="pharmacogenomic (PharmGKB), predictive_evidence (CIViC), or clinical_actionability (CIViC AMP-tiered)" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.evidenceOrigin || "—",
  },
  {
    id: "bestEvidenceLevel",
    accessorKey: "bestEvidenceLevel",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Evidence Level
        <Hint text="CIViC evidence level. A = validated clinical. B = clinical trial. C = case report. D/E = preclinical" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.bestEvidenceLevel || "—",
  },
  {
    id: "confidence",
    accessorKey: "confidence",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Confidence
        <Hint text="high = 3+ sources or approved. medium = 2 sources or Phase II+. low = single source" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => <ConfidenceBadge value={row.original.confidence} />,
  },
  {
    id: "sources",
    accessorKey: "sources",
    header: "Sources",
    cell: ({ row }) => row.original.sources.join(", ") || "—",
  },
  {
    id: "evidenceCount",
    accessorKey: "evidenceCount",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Evidence
        <Hint text="Number of source-level evidence records supporting this association" />
      </span>
    ),
    enableSorting: true,
  },
];

// ============================================================================
// Adverse Effects — DRUG_HAS_ADVERSE_EFFECT
// ============================================================================

interface AdverseEffectRow {
  id: string;
  sideEffectName: string;
  effectType: string;
  fdaReportCount: number | null;
  fdaSignalStrength: number | null;
  confidence: string;
  sources: string[];
  evidenceCount: number;
}

function transformAdverseEffects(rows: EdgeRow[]): AdverseEffectRow[] {
  return rows
    .map((r, i) => ({
      id: `ae-${i}`,
      sideEffectName: String(ep(r, "side_effect_name") ?? nb(r, "name") ?? ""),
      effectType: String(ep(r, "effect_type") ?? ""),
      fdaReportCount:
        ep(r, "fda_report_count") != null
          ? Number(ep(r, "fda_report_count"))
          : null,
      fdaSignalStrength:
        ep(r, "fda_signal_strength") != null
          ? Number(ep(r, "fda_signal_strength"))
          : null,
      confidence: String(ep(r, "confidence_class") ?? ""),
      sources: ep<string[]>(r, "sources") ?? [],
      evidenceCount: Number(ep(r, "evidence_count") ?? 0),
    }))
    .sort((a, b) => (b.fdaReportCount ?? 0) - (a.fdaReportCount ?? 0));
}

const adverseEffectColumns: ColumnDef<AdverseEffectRow>[] = [
  {
    id: "sideEffectName",
    accessorKey: "sideEffectName",
    header: "Side Effect",
    enableSorting: true,
  },
  {
    id: "effectType",
    accessorKey: "effectType",
    header: "Type",
    enableSorting: true,
    cell: ({ row }) => {
      const t = row.original.effectType;
      return t ? t.replace(/_/g, " ") : "—";
    },
  },
  {
    id: "fdaReportCount",
    accessorKey: "fdaReportCount",
    header: () => (
      <span className="inline-flex items-center gap-1">
        FDA Reports
        <Hint text="Number of FAERS reports mentioning this drug-side effect pair" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const v = row.original.fdaReportCount;
      return v != null ? v.toLocaleString() : "—";
    },
  },
  {
    id: "fdaSignalStrength",
    accessorKey: "fdaSignalStrength",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Signal Strength
        <Hint text="FAERS pharmacovigilance disproportionality signal. Higher = stronger signal" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const v = row.original.fdaSignalStrength;
      return v != null ? v.toFixed(1) : "—";
    },
  },
  {
    id: "confidence",
    accessorKey: "confidence",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Confidence
        <Hint text="high = 3+ sources or approved. medium = 2 sources or Phase II+. low = single source" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => <ConfidenceBadge value={row.original.confidence} />,
  },
  {
    id: "sources",
    accessorKey: "sources",
    header: "Sources",
    cell: ({ row }) => row.original.sources.join(", ") || "—",
  },
  {
    id: "evidenceCount",
    accessorKey: "evidenceCount",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Evidence
        <Hint text="Number of source-level evidence records supporting this association" />
      </span>
    ),
    enableSorting: true,
  },
];

// ============================================================================
// Interactions — DRUG_INTERACTS_WITH_DRUG
// ============================================================================

interface InteractionRow {
  id: string;
  drugName: string;
  drugId: string;
  severity: string;
  description: string;
  interactionClasses: string[];
  confidence: string;
  source: string;
}

function transformInteractions(rows: EdgeRow[]): InteractionRow[] {
  return rows
    .map((r, i) => ({
      id: `int-${i}`,
      drugName: String(nb(r, "name") ?? ep(r, "drug_b_name") ?? ""),
      drugId: r.neighbor.id,
      severity: String(ep(r, "severity") ?? ""),
      description: String(ep(r, "interaction_description") ?? ""),
      interactionClasses: ep<string[]>(r, "interaction_classes") ?? [],
      confidence: String(ep(r, "confidence_class") ?? ""),
      source: String(ep(r, "source") ?? ""),
    }))
    .sort((a, b) => {
      const sa = SEVERITY_ORDER[a.severity] ?? 9;
      const sb = SEVERITY_ORDER[b.severity] ?? 9;
      return sa - sb;
    });
}

const interactionColumns: ColumnDef<InteractionRow>[] = [
  {
    id: "drugName",
    accessorKey: "drugName",
    header: "Interacting Drug",
    enableSorting: true,
    cell: ({ row }) => (
      <Link
        href={`/drug/${row.original.drugId}`}
        className="text-primary hover:underline font-medium"
      >
        {row.original.drugName}
      </Link>
    ),
  },
  {
    id: "severity",
    accessorKey: "severity",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Severity
        <Hint text="DrugCentral DDI risk tier. Contraindicated = absolute clinical prohibition" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const s = row.original.severity;
      if (!s) return "—";
      const color =
        s === "Critical"
          ? "text-destructive font-medium"
          : s === "Major"
            ? "text-amber-600 dark:text-amber-400 font-medium"
            : "";
      return <span className={color}>{s}</span>;
    },
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-[13px] text-muted-foreground line-clamp-2">
        {row.original.description || "—"}
      </span>
    ),
  },
  {
    id: "interactionClasses",
    accessorKey: "interactionClasses",
    header: "Classes",
    cell: ({ row }) => row.original.interactionClasses.join(", ") || "—",
  },
  {
    id: "confidence",
    accessorKey: "confidence",
    header: () => (
      <span className="inline-flex items-center gap-1">
        Confidence
        <Hint text="high = 3+ sources or approved. medium = 2 sources or Phase II+. low = single source" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => <ConfidenceBadge value={row.original.confidence} />,
  },
  {
    id: "source",
    accessorKey: "source",
    header: "Source",
    enableSorting: true,
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function DrugPage({ drug, counts, relations }: DrugPageProps) {
  const [activeTab, setActiveTab] = useState("profile");

  const targets = useMemo(
    () => transformTargets(getRows(relations, "DRUG_ACTS_ON_GENE")),
    [relations],
  );
  const indications = useMemo(
    () =>
      transformIndications(getRows(relations, "DRUG_INDICATED_FOR_DISEASE")),
    [relations],
  );
  const disposition = useMemo(
    () => transformDisposition(getRows(relations, "DRUG_DISPOSITION_BY_GENE")),
    [relations],
  );
  const geneResponse = useMemo(
    () =>
      transformGeneResponse(getRows(relations, "GENE_AFFECTS_DRUG_RESPONSE")),
    [relations],
  );
  const adverseEffects = useMemo(
    () =>
      transformAdverseEffects(getRows(relations, "DRUG_HAS_ADVERSE_EFFECT")),
    [relations],
  );
  const interactions = useMemo(
    () => transformInteractions(getRows(relations, "DRUG_INTERACTS_WITH_DRUG")),
    [relations],
  );

  const pgxCount =
    (counts?.DRUG_DISPOSITION_BY_GENE ?? 0) +
    (counts?.GENE_AFFECTS_DRUG_RESPONSE ?? 0);

  const tabs = [
    { value: "profile", label: "Profile", count: undefined },
    { value: "targets", label: "Targets", count: counts?.DRUG_ACTS_ON_GENE },
    {
      value: "indications",
      label: "Indications",
      count: counts?.DRUG_INDICATED_FOR_DISEASE,
    },
    {
      value: "pgx",
      label: "Pharmacogenomics",
      count: pgxCount || undefined,
    },
    {
      value: "adverse",
      label: "Adverse Effects",
      count: counts?.DRUG_HAS_ADVERSE_EFFECT,
    },
    {
      value: "interactions",
      label: "Interactions",
      count: counts?.DRUG_INTERACTS_WITH_DRUG,
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
      <div className="border-b border-border overflow-x-auto overflow-y-hidden">
        <TabsList variant="line" className="w-full justify-start p-0 h-auto">
          {tabs.map((tab) => (
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
          ))}
        </TabsList>
      </div>

      <TabsContent value="profile">
        <ProfileTab drug={drug} />
      </TabsContent>

      <TabsContent value="targets" className="pt-6">
        <DataSurface
          columns={targetColumns}
          data={targets}
          title="Drug Targets"
          subtitle="Sorted by primary target, then binding affinity"
          searchPlaceholder="Search targets..."
          searchColumn="geneSymbol"
          exportable
          exportFilename={`${drug.id}-targets`}
          defaultPageSize={25}
          emptyMessage="No target data available"
        />
      </TabsContent>

      <TabsContent value="indications" className="pt-6">
        <DataSurface
          columns={indicationColumns}
          data={indications}
          title="Indications"
          subtitle="Sorted by clinical phase (approved first)"
          searchPlaceholder="Search diseases..."
          searchColumn="diseaseName"
          exportable
          exportFilename={`${drug.id}-indications`}
          defaultPageSize={25}
          emptyMessage="No indication data available"
        />
      </TabsContent>

      <TabsContent value="pgx" className="space-y-8 pt-6">
        <DataSurface
          columns={dispositionColumns}
          data={disposition}
          title="Drug Disposition"
          subtitle="Genes involved in metabolism, transport, and elimination"
          searchPlaceholder="Search genes..."
          searchColumn="geneSymbol"
          exportable
          exportFilename={`${drug.id}-disposition`}
          defaultPageSize={25}
          emptyMessage="No disposition gene data available"
        />
        <DataSurface
          columns={geneResponseColumns}
          data={geneResponse}
          title="Gene-Drug Response"
          subtitle="FDA companion diagnostics shown first"
          searchPlaceholder="Search genes..."
          searchColumn="geneSymbol"
          exportable
          exportFilename={`${drug.id}-gene-response`}
          defaultPageSize={25}
          emptyMessage="No gene-drug response data available"
        />
      </TabsContent>

      <TabsContent value="adverse" className="pt-6">
        <DataSurface
          columns={adverseEffectColumns}
          data={adverseEffects}
          title="Adverse Effects"
          subtitle={
            counts?.DRUG_HAS_ADVERSE_EFFECT &&
            counts.DRUG_HAS_ADVERSE_EFFECT > 200
              ? `Showing 200 of ${fmtCount(counts.DRUG_HAS_ADVERSE_EFFECT)} — sorted by FDA report count`
              : "Sorted by FDA report count"
          }
          searchPlaceholder="Search side effects..."
          searchColumn="sideEffectName"
          exportable
          exportFilename={`${drug.id}-adverse-effects`}
          defaultPageSize={25}
          emptyMessage="No adverse effect data available"
        />
      </TabsContent>

      <TabsContent value="interactions" className="pt-6">
        <DataSurface
          columns={interactionColumns}
          data={interactions}
          title="Drug-Drug Interactions"
          subtitle="Sorted by severity (critical first)"
          searchPlaceholder="Search drugs..."
          searchColumn="drugName"
          exportable
          exportFilename={`${drug.id}-interactions`}
          defaultPageSize={25}
          emptyMessage="No interaction data available"
        />
      </TabsContent>
    </Tabs>
  );
}
