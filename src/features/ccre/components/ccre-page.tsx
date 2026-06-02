"use client";

import { BrowserPage } from "@features/genome-browser";
import { cn } from "@infra/utils";
import {
  PLOTLY_CONFIG_STATIC,
  PLOTLY_FONT,
  Plot,
} from "@shared/components/ui/charts";
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
import { Check, Info } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { EdgeCounts, EdgeRelations, EdgeRow, GraphCcre } from "../types";

// ============================================================================
// Props
// ============================================================================

interface CcrePageProps {
  ccre: GraphCcre;
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

function fmtScore(v: number | null | undefined): string {
  if (v == null) return "—";
  if (v >= 100) return v.toFixed(0);
  if (v >= 1) return v.toFixed(2);
  if (v >= 0.01) return v.toFixed(3);
  return v.toExponential(2);
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

/** Reusable tooltip hint icon — text sourced from /graph/schema/properties */
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
// Hero Metric
// ============================================================================

function StatMetric({
  label,
  value,
  hint,
  unit,
  onClick,
}: {
  label: string;
  value: string | number;
  hint?: string;
  unit?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      className={cn(
        "rounded-lg border border-border bg-card p-4 text-left transition-colors",
        onClick && "hover:border-foreground/20 cursor-pointer",
        !onClick && "cursor-default",
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[11px] font-medium text-muted-foreground">
          {label}
        </span>
        {hint && <Hint text={hint} />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
        {unit && (
          <span className="text-[11px] text-muted-foreground">{unit}</span>
        )}
      </div>
    </button>
  );
}

// ============================================================================
// Epigenomic Signal Chart
// ============================================================================

const ASSAY_LABELS: Record<string, string> = {
  max_dnase_signal: "DNase",
  max_atac_signal: "ATAC",
  max_h3k27ac_signal: "H3K27ac",
  max_h3k4me3_signal: "H3K4me3",
  max_ctcf_signal: "CTCF",
};

const ASSAY_COLORS: Record<string, string> = {
  max_dnase_signal: "#3b82f6",
  max_atac_signal: "#8b5cf6",
  max_h3k27ac_signal: "#f59e0b",
  max_h3k4me3_signal: "#ef4444",
  max_ctcf_signal: "#10b981",
};

function SignalChart({ ccre }: { ccre: GraphCcre }) {
  const assays = Object.entries(ASSAY_LABELS)
    .map(([key, label]) => ({
      key,
      label,
      value: (ccre as unknown as Record<string, unknown>)[key] as number,
      color: ASSAY_COLORS[key],
    }))
    .filter((a) => a.value != null && a.value > 0);

  if (assays.length === 0) return null;

  // Sort by signal value descending
  assays.sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 pt-4 pb-2">
        <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider inline-flex items-center">
          Max Epigenomic Signal
          <Hint text="Maximum Z-score across all biosamples for each epigenomic assay. Z > 1.64 (95th percentile) defines active signal." />
        </h3>
      </div>
      <Plot
        data={[
          {
            type: "bar" as const,
            orientation: "h" as const,
            y: assays.map((a) => a.label),
            x: assays.map((a) => a.value),
            marker: {
              color: assays.map((a) => a.color),
            },
            text: assays.map((a) => a.value.toFixed(2)),
            textposition: "outside" as const,
            hovertemplate: "%{y}: %{x:.2f}<extra></extra>",
          },
        ]}
        layout={{
          font: PLOTLY_FONT,
          height: 180 + assays.length * 4,
          margin: { l: 70, r: 50, t: 10, b: 30 },
          xaxis: {
            title: { text: "Z-score", font: { size: 11 } },
            gridcolor: "#e5e5e5",
            zeroline: true,
            zerolinecolor: "#e5e5e5",
          },
          yaxis: {
            automargin: true,
          },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
        }}
        config={PLOTLY_CONFIG_STATIC}
        style={{ width: "100%" }}
      />
    </div>
  );
}

// ============================================================================
// Profile Tab
// ============================================================================

function ProfileTab({
  ccre,
  onTabChange,
}: {
  ccre: GraphCcre;
  onTabChange: (tab: string) => void;
}) {
  // Hero metrics — only data NOT already shown in header or tab counts
  const metrics: Array<{
    label: string;
    value: string | number;
    hint?: string;
    unit?: string;
    tab?: string;
  }> = [];

  if (ccre.biosample_count)
    metrics.push({
      label: "Biosamples",
      value: ccre.biosample_count,
      hint: "Number of distinct biosamples with epigenomic signal",
    });
  if (ccre.abc_supported_gene_count)
    metrics.push({
      label: "ABC Genes",
      value: ccre.abc_supported_gene_count,
      hint: "Non-null = ABC-validated enhancer-gene link exists. Higher = pleiotropic enhancer.",
    });
  if (ccre.conservation_score_mean != null)
    metrics.push({
      label: "Conservation",
      value: ccre.conservation_score_mean.toFixed(3),
      hint: "Mean PhyloP conservation score. Conserved cCREs (> 0) are more likely functional.",
    });

  // Functional evidence — only show TRUE flags (no negative-state noise)
  const evidenceFlags = [
    {
      value: ccre.vista_enhancer_overlap,
      label: "VISTA Enhancer",
      hint: "Gold standard for enhancer validation. Experimentally confirmed in vivo.",
    },
    {
      value: ccre.super_enhancer_overlap,
      label: "Super-Enhancer",
      hint: "Super-enhancers are critical for cell identity. Disruption often pathogenic.",
    },
    {
      value: ccre.loop_anchor_overlap,
      label: "Hi-C Loop Anchor",
      hint: "Overlaps a Hi-C chromatin loop anchor from ENCODE (12 cell types).",
    },
    {
      value: ccre.is_dynamic_enhancer,
      label: "Dynamic Enhancer",
      hint: "Bound by MAFF/MAFK (stress-poised enhancer) in K562/HepG2.",
      detail: ccre.dynamic_enhancer_cell_types?.join(", "),
    },
    {
      value: ccre.is_silencer,
      label: "Silencer",
      hint: "Silencers are rare and understudied. TRUE is noteworthy.",
      detail: ccre.silencer_study_count
        ? `${ccre.silencer_study_count} studies`
        : undefined,
    },
  ].filter((f) => f.value);

  const experimentalFlags = [
    {
      value: ccre.mpra_tested,
      label: "MPRA Tested",
      hint: "Functional evidence from Massively Parallel Reporter Assay.",
      detail: ccre.mpra_experiment_count
        ? `${ccre.mpra_experiment_count} experiments`
        : undefined,
    },
    {
      value: ccre.capra_tested,
      label: "CAPRA Tested",
      hint: "CRISPR perturbation evidence. Check p-adj for significance (< 0.05 = confirmed).",
      detail:
        ccre.capra_min_padj != null
          ? `min p-adj = ${ccre.capra_min_padj.toExponential(2)}`
          : undefined,
    },
  ].filter((f) => f.value);

  // Assay support — NOT shown in header, relevant to profile
  const assaySupport = ccre.assay_support_types;

  return (
    <div className="space-y-8 pt-6">
      {/* Hero Metrics */}
      {metrics.length > 0 && (
        <div
          className={cn(
            "grid gap-3",
            metrics.length <= 3
              ? "grid-cols-2 sm:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
          )}
        >
          {metrics.map((m) => (
            <StatMetric
              key={m.label}
              label={m.label}
              value={m.value}
              hint={m.hint}
              unit={m.unit}
              onClick={m.tab ? () => onTabChange(m.tab!) : undefined}
            />
          ))}
        </div>
      )}

      {/* Description */}
      {ccre.ccre_description && (
        <p className="text-[13px] text-muted-foreground leading-relaxed max-w-3xl">
          {ccre.ccre_description}
        </p>
      )}

      {/* Epigenomic Signal Chart */}
      <SignalChart ccre={ccre} />

      {/* Assay Support */}
      {assaySupport.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 inline-flex items-center">
            Assay Support
            <Hint text="Epigenomic assays with signal (Z > 1.64) for this cCRE" />
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {assaySupport.map((a) => (
              <span
                key={a}
                className="inline-flex px-2 py-0.5 rounded-md bg-muted text-[13px]"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Functional Evidence — only TRUE flags */}
      {evidenceFlags.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 inline-flex items-center">
            Functional Evidence
            <Hint text="Overlaps with validated regulatory regions and chromatin architecture" />
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {evidenceFlags.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 text-[13px]"
              >
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{f.label}</span>
                <Hint text={f.hint} />
                {f.detail && (
                  <span className="text-muted-foreground text-xs">
                    {f.detail}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experimental Validation — only TRUE flags */}
      {experimentalFlags.length > 0 && (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 inline-flex items-center">
            Experimental Validation
            <Hint text="High-throughput experimental assays testing regulatory activity" />
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {experimentalFlags.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 text-[13px]"
              >
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{f.label}</span>
                <Hint text={f.hint} />
                {f.detail && (
                  <span className="text-muted-foreground text-xs">
                    {f.detail}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Regulated Genes — CCRE_REGULATES_GENE
// ============================================================================

interface RegulatedGeneRow {
  id: string;
  geneSymbol: string;
  geneId: string;
  geneName: string;
  method: string;
  modality: string;
  maxScore: number | null;
  topTissue: string;
  tissueCount: number;
  evidenceCount: number;
  source: string;
}

function transformRegulatedGenes(rows: EdgeRow[]): RegulatedGeneRow[] {
  return rows
    .map((r, i) => ({
      id: `gene-${i}`,
      geneSymbol: String(ep(r, "gene_symbol") ?? nb(r, "symbol") ?? ""),
      geneId: r.neighbor.id,
      geneName: String(nb(r, "name") ?? ""),
      method: String(ep(r, "evidence_method") ?? ""),
      modality: String(ep(r, "evidence_modality") ?? ""),
      maxScore: ep(r, "max_score") != null ? Number(ep(r, "max_score")) : null,
      topTissue: String(ep(r, "top_tissue") ?? ""),
      tissueCount: (ep<string[]>(r, "tissue_names") ?? []).length,
      evidenceCount: Number(ep(r, "evidence_count") ?? 0),
      source: String(ep(r, "source") ?? ""),
    }))
    .sort((a, b) => (b.maxScore ?? 0) - (a.maxScore ?? 0));
}

function fmtMethod(method: string): string {
  return method
    .replace(/_/g, " ")
    .replace(/\((\w)/g, "($1")
    .replace(/\b(abc|eqtl|crispr)\b/gi, (m) => m.toUpperCase());
}

const regulatedGeneColumns: ColumnDef<RegulatedGeneRow>[] = [
  {
    id: "geneSymbol",
    accessorKey: "geneSymbol",
    header: () => (
      <span className="inline-flex items-center">
        Gene
        <Hint text="HGNC symbol of the regulated gene" />
      </span>
    ),
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
    id: "geneName",
    accessorKey: "geneName",
    header: "Name",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-1">
        {row.original.geneName || "—"}
      </span>
    ),
  },
  {
    id: "maxScore",
    accessorKey: "maxScore",
    header: () => (
      <span className="inline-flex items-center">
        Score
        <Hint text="Primary sort field. Compare within same evidence method only — scales differ across methods." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-mono text-[13px]">
        {fmtScore(row.original.maxScore)}
      </span>
    ),
  },
  {
    id: "method",
    accessorKey: "method",
    header: () => (
      <span className="inline-flex items-center">
        Method
        <Hint text="CRISPR = causal perturbation (strongest). eQTL = genotype-expression association. ChIA-PET = chromatin interaction. ABC/EPIraction = computational." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => fmtMethod(row.original.method) || "—",
  },
  {
    id: "modality",
    accessorKey: "modality",
    header: () => (
      <span className="inline-flex items-center">
        Modality
        <Hint text="Experimental > computational for confidence" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.modality || "—",
  },
  {
    id: "topTissue",
    accessorKey: "topTissue",
    header: () => (
      <span className="inline-flex items-center">
        Top Tissue
        <Hint text="Tissue with the highest regulatory score for this link" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.topTissue || "—",
  },
  {
    id: "tissueCount",
    accessorKey: "tissueCount",
    header: "Tissues",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.tissueCount > 0 ? row.original.tissueCount : "—",
  },
  {
    id: "evidenceCount",
    accessorKey: "evidenceCount",
    header: () => (
      <span className="inline-flex items-center">
        Evidence
        <Hint text="Higher counts = more robust. 1 = single tissue. 50+ = broadly supported." />
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "source",
    accessorKey: "source",
    header: () => (
      <span className="inline-flex items-center">
        Source
        <Hint text="Originating database or consortium" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.source || "—",
  },
];

// ============================================================================
// Overlapping Variants — VARIANT_OVERLAPS_CCRE
// ============================================================================

interface OverlappingVariantRow {
  id: string;
  variantId: string;
  annotationLabel: string;
  relativePosition: number;
  distanceToCenter: number;
  ccreSize: number;
}

function transformVariants(rows: EdgeRow[]): OverlappingVariantRow[] {
  return rows
    .map((r, i) => ({
      id: `var-${i}`,
      variantId: r.neighbor.id,
      annotationLabel: String(ep(r, "annotation_label") ?? ""),
      relativePosition: Number(ep(r, "relative_position") ?? 0),
      distanceToCenter: Number(ep(r, "distance_to_center") ?? 0),
      ccreSize: Number(ep(r, "ccre_size") ?? 0),
    }))
    .sort(
      (a, b) => Math.abs(a.distanceToCenter) - Math.abs(b.distanceToCenter),
    );
}

const variantColumns: ColumnDef<OverlappingVariantRow>[] = [
  {
    id: "variantId",
    accessorKey: "variantId",
    header: "Variant",
    enableSorting: true,
    cell: ({ row }) => (
      <Link
        href={`/hg38/variant/${row.original.variantId}/functional-annotation/overview`}
        className="text-primary hover:underline font-mono text-[13px]"
      >
        {row.original.variantId}
      </Link>
    ),
  },
  {
    id: "annotationLabel",
    accessorKey: "annotationLabel",
    header: () => (
      <span className="inline-flex items-center">
        Annotation
        <Hint text="Human-readable expansion of cCRE annotation code" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.annotationLabel || "—",
  },
  {
    id: "distanceToCenter",
    accessorKey: "distanceToCenter",
    header: () => (
      <span className="inline-flex items-center">
        Distance to Center
        <Hint text="Closer to 0 = more likely to disrupt core regulatory motif. Variants at element edges are less likely to be functional." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const d = row.original.distanceToCenter;
      return (
        <span className="font-mono text-[13px]">
          {d >= 0 ? "+" : ""}
          {d.toFixed(0)} bp
        </span>
      );
    },
  },
  {
    id: "relativePosition",
    accessorKey: "relativePosition",
    header: () => (
      <span className="inline-flex items-center">
        Relative Position
        <Hint text="0.5 = dead center. Complement to distance-to-center for normalized comparison." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-mono text-[13px]">
        {(row.original.relativePosition * 100).toFixed(1)}%
      </span>
    ),
  },
  {
    id: "ccreSize",
    accessorKey: "ccreSize",
    header: () => (
      <span className="inline-flex items-center">
        cCRE Size
        <Hint text="Length of the cCRE element in base pairs" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.ccreSize} bp</span>
    ),
  },
];

// ============================================================================
// Main Page Component
// ============================================================================

export function CcrePage({ ccre, counts, relations }: CcrePageProps) {
  const [activeTab, setActiveTab] = useState("profile");

  const regulatedGenes = useMemo(
    () => transformRegulatedGenes(getRows(relations, "CCRE_REGULATES_GENE")),
    [relations],
  );
  const overlappingVariants = useMemo(
    () => transformVariants(getRows(relations, "VARIANT_OVERLAPS_CCRE")),
    [relations],
  );

  const tabs = [
    { value: "profile", label: "Profile", count: undefined },
    {
      value: "genes",
      label: "Regulated Genes",
      count: counts?.CCRE_REGULATES_GENE,
    },
    {
      value: "variants",
      label: "Overlapping Variants",
      count: counts?.VARIANT_OVERLAPS_CCRE,
    },
    { value: "browser", label: "Genome Browser", count: undefined },
  ];

  // Genome browser region — pad 5kb each side for context (cCREs are ~150–350 bp)
  const span = ccre.end_position - ccre.start_position;
  const browserPadding = Math.max(5000, span * 10);
  const browserStart = Math.max(0, ccre.start_position - browserPadding);
  const browserEnd = ccre.end_position + browserPadding;

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
        <ProfileTab ccre={ccre} onTabChange={setActiveTab} />
      </TabsContent>

      <TabsContent value="genes" className="pt-6">
        <DataSurface
          columns={regulatedGeneColumns}
          data={regulatedGenes}
          title="Regulated Genes"
          subtitle="Sorted by maximum regulatory score"
          searchPlaceholder="Search genes..."
          searchColumn="geneSymbol"
          exportable
          exportFilename={`${ccre.id}-regulated-genes`}
          defaultPageSize={25}
          emptyMessage="No regulated gene data available"
        />
      </TabsContent>

      <TabsContent value="variants" className="pt-6">
        <DataSurface
          columns={variantColumns}
          data={overlappingVariants}
          title="Overlapping Variants"
          subtitle="Sorted by distance to cCRE center (closest first)"
          searchPlaceholder="Search variants..."
          searchColumn="variantId"
          exportable
          exportFilename={`${ccre.id}-overlapping-variants`}
          defaultPageSize={25}
          emptyMessage="No overlapping variants found"
        />
      </TabsContent>

      <TabsContent value="browser" className="pt-2">
        <BrowserPage
          chromosome={`chr${ccre.chromosome}`}
          start={browserStart}
          end={browserEnd}
        />
      </TabsContent>
    </Tabs>
  );
}
