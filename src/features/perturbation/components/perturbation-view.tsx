"use client";

import { cn } from "@infra/utils";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Dash } from "@shared/components/ui/dash";
import { DataSurface } from "@shared/components/ui/data-surface/data-surface";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { Filter, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CrisprTissueFacet } from "../api";
import { useCrispr } from "../hooks/use-crispr";
import type { CrisprRow, PerturbSeqRow } from "../types";

const PERTURBATION_TYPES = ["CRISPRn", "CRISPRi", "CRISPRa"] as const;
type PerturbationType = (typeof PERTURBATION_TYPES)[number];

const PERTURBATION_TYPE_DESCRIPTIONS: Record<PerturbationType, string> = {
  CRISPRn: "Knockout: gene fully disabled.",
  CRISPRi: "Interference: gene expression suppressed.",
  CRISPRa: "Activation: gene expression amplified.",
};

const PERTURBATION_TYPE_STYLE: Record<PerturbationType, string> = {
  CRISPRn: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  CRISPRi: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  CRISPRa:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
};

const PERTURBATION_TYPE_FALLBACK_STYLE =
  "bg-muted text-muted-foreground border-border";

function isPerturbationType(value: string): value is PerturbationType {
  return (PERTURBATION_TYPES as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// Story sentence
// ---------------------------------------------------------------------------

function StoryLine({
  geneSymbol,
  summary,
}: {
  geneSymbol: string;
  summary: PerturbationViewProps["summary"];
}) {
  const hasEssential = summary.crisprScreens > 0 || summary.essentialIn > 0;
  const hasDownstream =
    summary.perturbSeqDatasets > 0 || summary.downstreamTargets > 0;
  if (!hasEssential && !hasDownstream) return null;

  const fg = "text-foreground tabular-nums font-medium";
  return (
    <p className="text-sm text-muted-foreground leading-relaxed">
      {hasEssential && (
        <>
          <strong className="text-foreground font-semibold">
            {geneSymbol}
          </strong>{" "}
          is essential in{" "}
          <span className={fg}>{summary.essentialIn.toLocaleString()}</span>{" "}
          cell {summary.essentialIn === 1 ? "line" : "lines"} across{" "}
          <span className={fg}>{summary.crisprScreens.toLocaleString()}</span>{" "}
          CRISPR screen{summary.crisprScreens === 1 ? "" : "s"}.{" "}
        </>
      )}
      {hasDownstream && (
        <>
          Perturbing it shifts expression of{" "}
          <span className={fg}>
            {summary.downstreamTargets.toLocaleString()}
          </span>{" "}
          downstream gene{summary.downstreamTargets === 1 ? "" : "s"} in{" "}
          <span className={fg}>
            {summary.perturbSeqDatasets.toLocaleString()}
          </span>{" "}
          Perturb-seq atlas
          {summary.perturbSeqDatasets === 1 ? "" : "es"}.
        </>
      )}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Shared cell renderers
// ---------------------------------------------------------------------------

function MagnitudeBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((Math.abs(value) / max) * 100, 100) : 0;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-16 h-1 rounded-full bg-muted overflow-hidden cursor-help">
          <div
            className={cn(
              "h-full rounded-full",
              value < 0 ? "bg-blue-500" : "bg-red-500",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        |value| = {Math.abs(value).toFixed(2)}, relative to {max.toFixed(2)}
        {" (largest in view)"}
      </TooltipContent>
    </Tooltip>
  );
}

function GeneLink({ gene }: { gene: string }) {
  return (
    <Link
      href={`/hg38/gene/${encodeURIComponent(gene)}`}
      className="text-sm font-medium text-primary hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {gene}
    </Link>
  );
}

function PvalueCell({ value }: { value: number | undefined }) {
  if (value == null) return <Dash />;
  return (
    <span className="text-xs tabular-nums text-muted-foreground">
      {value < 0.001 ? value.toExponential(1) : value.toFixed(3)}
    </span>
  );
}

function StudyCell({
  datasetId,
  studyTitle,
  studyYear,
}: {
  datasetId: string;
  studyTitle?: string;
  studyYear?: number;
}) {
  const label = (
    <span className="text-xs text-muted-foreground truncate max-w-[140px] block">
      {datasetId}
    </span>
  );
  if (!studyTitle) return label;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm text-xs">
        <p className="font-medium">{studyTitle}</p>
        {studyYear && <p className="opacity-70">{studyYear}</p>}
      </TooltipContent>
    </Tooltip>
  );
}

function TechniqueBadge({ value }: { value: string }) {
  if (isPerturbationType(value)) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold cursor-help",
              PERTURBATION_TYPE_STYLE[value],
            )}
          >
            {value}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {PERTURBATION_TYPE_DESCRIPTIONS[value]}
        </TooltipContent>
      </Tooltip>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
        PERTURBATION_TYPE_FALLBACK_STYLE,
      )}
    >
      {value}
    </span>
  );
}

function ReadoutGroupHeader({ caption }: { caption: string }) {
  return (
    <span className="inline-flex items-center gap-1 justify-center">
      READOUT
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Scoring conventions"
            className="inline-flex"
          >
            <Info className="w-3 h-3 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm text-xs">
          {caption}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}

// Pull a coarse cell-context label out of a Perturb-seq dataset id slug
// (e.g. nadig_2025_jurkat → "Jurkat"). Falls back to the raw id when the
// slug doesn't end in a recognizable cell token.
const DATASET_CELL_HINTS = new Set([
  "jurkat",
  "hct116",
  "k562",
  "hek293",
  "hela",
  "rpe1",
  "a549",
  "u2os",
  "thp1",
  "mcf7",
  "h9",
  "ips",
]);

function deriveCellContext(datasetId: string): string | null {
  const tail = datasetId.split("_").pop()?.toLowerCase() ?? "";
  if (DATASET_CELL_HINTS.has(tail)) {
    return tail.toUpperCase() === tail
      ? tail
      : tail.charAt(0).toUpperCase() + tail.slice(1);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Downstream (Perturb-seq) columns
// ---------------------------------------------------------------------------

function buildPerturbSeqColumns(maxLog2fc: number): ColumnDef<PerturbSeqRow>[] {
  return [
    {
      id: "perturbation_group",
      header: "PERTURBATION",
      meta: { align: "center" },
      columns: [
        {
          id: "technique",
          header: "Technique",
          enableSorting: false,
          accessorFn: (r) => r.perturbation_type ?? "Perturb-seq",
          cell: ({ getValue }) => (
            <TechniqueBadge value={getValue() as string} />
          ),
        },
        {
          id: "study",
          header: "Study",
          enableSorting: false,
          accessorKey: "dataset_id",
          cell: ({ row }) => (
            <StudyCell
              datasetId={row.original.dataset_id}
              studyTitle={row.original.study_title}
              studyYear={row.original.study_year}
            />
          ),
        },
      ],
    },
    {
      id: "system_group",
      header: "SYSTEM",
      meta: { align: "center" },
      columns: [
        {
          id: "cell_context",
          header: "Cell context",
          enableSorting: false,
          accessorFn: (r) =>
            r.cell_type ?? r.cell_line ?? deriveCellContext(r.dataset_id),
          cell: ({ getValue }) => {
            const v = getValue() as string | null;
            if (!v) return <Dash />;
            return (
              <Badge variant="outline" className="text-[11px]">
                {v}
              </Badge>
            );
          },
        },
      ],
    },
    {
      id: "readout_group",
      header: () => (
        <ReadoutGroupHeader caption="Each Perturb-seq screen reports its own statistic. Default convention: negative LFC means downregulation of the effect gene." />
      ),
      meta: { align: "center" },
      columns: [
        {
          id: "effect_gene",
          header: "Effect gene",
          accessorKey: "effect_gene",
          enableSorting: false,
          cell: ({ getValue }) => <GeneLink gene={getValue() as string} />,
        },
        {
          id: "log2fc",
          header: "LFC",
          accessorKey: "log2fc",
          enableSorting: true,
          sortDescFirst: true,
          cell: ({ row }) => {
            const v = row.original.log2fc;
            const down = v < 0;
            return (
              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    "text-xs tabular-nums font-medium inline-flex items-center gap-1",
                    down ? "text-blue-600" : "text-red-600",
                  )}
                >
                  <span aria-hidden>{down ? "↓" : "↑"}</span>
                  <span className="sr-only">{down ? "down" : "up"}</span>
                  {v > 0 ? "+" : ""}
                  {v.toFixed(2)}
                </span>
                <MagnitudeBar value={v} max={maxLog2fc} />
              </div>
            );
          },
        },
        {
          id: "padj",
          header: "Padj",
          accessorKey: "padj",
          enableSorting: true,
          cell: ({ getValue }) => (
            <PvalueCell value={getValue() as number | undefined} />
          ),
        },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Knockout (CRISPR) columns
// ---------------------------------------------------------------------------

function SystemStackCell({ row }: { row: CrisprRow }) {
  const { cell_line, tissue, disease } = row;
  if (!cell_line && !tissue && !disease) return <Dash />;
  const subtitleParts = [tissue, disease].filter(Boolean) as string[];
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-sm font-medium text-foreground">
        {cell_line ?? "—"}
      </span>
      {subtitleParts.length > 0 && (
        <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
          {subtitleParts.join(" · ")}
        </span>
      )}
    </div>
  );
}

function ScoreCell({ row, max }: { row: CrisprRow; max: number }) {
  return (
    <div className="flex flex-col gap-1 leading-tight">
      <span className="text-xs tabular-nums font-medium text-foreground">
        {row.score_value.toFixed(2)}
      </span>
      <MagnitudeBar value={row.score_value} max={max} />
      <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">
        {row.score_name}
      </span>
    </div>
  );
}

function SigCell({ row }: { row: CrisprRow }) {
  const sig = row.is_significant;
  const criteria = row.significance_criteria;
  const label = (
    <span
      className={cn(
        "text-xs font-medium",
        sig ? "text-red-500" : "text-muted-foreground",
      )}
    >
      {sig ? "✓" : "—"}
    </span>
  );
  if (!criteria || criteria === "-") return label;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        Threshold: {criteria}
      </TooltipContent>
    </Tooltip>
  );
}

function RowInterpretationIcon({ row }: { row: CrisprRow }) {
  if (!row.score_interpretation) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm text-xs">
        {row.score_interpretation}
      </TooltipContent>
    </Tooltip>
  );
}

function buildCrisprColumns(maxScore: number): ColumnDef<CrisprRow>[] {
  return [
    {
      id: "perturbation_group",
      header: "PERTURBATION",
      meta: { align: "center" },
      columns: [
        {
          id: "technique",
          header: "Technique",
          accessorKey: "perturbation_type",
          enableSorting: false,
          cell: ({ getValue }) => {
            const t = getValue() as string | undefined;
            if (!t) return <Dash />;
            return <TechniqueBadge value={t} />;
          },
        },
        {
          id: "study",
          header: "Study",
          accessorKey: "dataset_id",
          enableSorting: false,
          cell: ({ row }) => (
            <StudyCell
              datasetId={row.original.dataset_id}
              studyTitle={row.original.study_title}
              studyYear={row.original.study_year}
            />
          ),
        },
      ],
    },
    {
      id: "system_group",
      header: "SYSTEM",
      meta: { align: "center" },
      columns: [
        {
          id: "system",
          header: "Cell line / tissue / disease",
          enableSorting: false,
          cell: ({ row }) => <SystemStackCell row={row.original} />,
        },
      ],
    },
    {
      id: "readout_group",
      header: () => (
        <ReadoutGroupHeader caption="Scoring conventions vary by screen (FDR, Rho, Gamma, MAGeCK, etc.). Hover the info icon on a row for that screen's specific interpretation." />
      ),
      meta: { align: "center" },
      columns: [
        {
          id: "score",
          header: "Score",
          accessorKey: "score_value",
          enableSorting: true,
          sortDescFirst: true,
          cell: ({ row }) => <ScoreCell row={row.original} max={maxScore} />,
        },
        {
          id: "is_significant",
          header: "Sig",
          accessorKey: "is_significant",
          enableSorting: true,
          cell: ({ row }) => <SigCell row={row.original} />,
        },
        {
          id: "interpretation",
          header: "",
          enableSorting: false,
          cell: ({ row }) => <RowInterpretationIcon row={row.original} />,
        },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function DownstreamSection({
  data,
  geneSymbol,
  totalCount,
}: {
  data: PerturbSeqRow[];
  geneSymbol: string;
  totalCount: number;
}) {
  const maxLog2fc = useMemo(
    () => Math.max(...data.map((r) => Math.abs(r.log2fc)), 1),
    [data],
  );
  const columns = useMemo(() => buildPerturbSeqColumns(maxLog2fc), [maxLog2fc]);

  return (
    <DataSurface
      title="Downstream expression effects"
      subtitle={`${totalCount} gene${totalCount === 1 ? "" : "s"} significantly affected when ${geneSymbol} is perturbed (perturb-seq, padj < 0.05)`}
      data={data}
      columns={columns}
      searchable={false}
      defaultPageSize={25}
      pageSizeOptions={[25, 50]}
      exportable
      exportFilename={`downstream-effects-${geneSymbol}`}
      emptyMessage={`No perturb-seq downstream effects found for ${geneSymbol}`}
    />
  );
}

function CrisprTissuePicker({
  facets,
  selected,
  onToggle,
  onClear,
}: {
  facets: CrisprTissueFacet[];
  selected: ReadonlySet<string>;
  onToggle: (tissue: string) => void;
  onClear: () => void;
}) {
  if (facets.length === 0) return null;
  const label =
    selected.size === 0
      ? "All tissues"
      : selected.size === 1
        ? [...selected][0]
        : `${selected.size} tissues`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-7 px-2.5 text-[11px] gap-1.5",
            selected.size > 0 && "text-primary border-primary/40",
          )}
        >
          <Filter className="h-3 w-3" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2 max-h-80 overflow-auto">
        <div className="flex items-center justify-between px-1.5 pb-1.5 border-b border-border mb-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Tissue
          </span>
          {selected.size > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-[11px] text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          {facets.map((f) => {
            const active = selected.has(f.tissue);
            return (
              <button
                key={f.tissue}
                type="button"
                onClick={() => onToggle(f.tissue)}
                className={cn(
                  "flex items-center justify-between gap-2 px-2 py-1 rounded text-xs transition-colors text-left",
                  active
                    ? "bg-primary/10 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span className="truncate">{f.tissue}</span>
                <span className="tabular-nums text-[10px] text-muted-foreground/70 shrink-0">
                  {f.count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CrisprFilterBar({
  selectedTypes,
  onToggleType,
  significantOnly,
  onToggleSignificant,
  tissueFacets,
  selectedTissues,
  onToggleTissue,
  onClearTissues,
  isFetching,
  countLabel,
}: {
  selectedTypes: ReadonlySet<PerturbationType>;
  onToggleType: (t: PerturbationType) => void;
  significantOnly: boolean;
  onToggleSignificant: () => void;
  tissueFacets: CrisprTissueFacet[];
  selectedTissues: ReadonlySet<string>;
  onToggleTissue: (tissue: string) => void;
  onClearTissues: () => void;
  isFetching: boolean;
  countLabel: string;
}) {
  const pillBase =
    "inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer select-none";
  const pillActive = "bg-primary/10 text-primary border-primary/30";
  const pillIdle =
    "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30";

  return (
    <div className="flex items-center gap-3 flex-wrap text-[11px]">
      <span className="text-muted-foreground uppercase tracking-wider font-medium">
        Filter
      </span>
      <div className="flex items-center gap-1.5">
        {PERTURBATION_TYPES.map((t) => {
          const active = selectedTypes.has(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => onToggleType(t)}
              className={cn(pillBase, active ? pillActive : pillIdle)}
            >
              {t}
            </button>
          );
        })}
      </div>
      <div className="w-px h-4 bg-border" />
      <CrisprTissuePicker
        facets={tissueFacets}
        selected={selectedTissues}
        onToggle={onToggleTissue}
        onClear={onClearTissues}
      />
      <div className="w-px h-4 bg-border" />
      <button
        type="button"
        onClick={onToggleSignificant}
        className={cn(pillBase, significantOnly ? pillActive : pillIdle)}
      >
        Significant only
      </button>
      <div className="ml-auto flex items-center gap-2 text-muted-foreground">
        {isFetching && <Loader2 className="h-3 w-3 animate-spin" />}
        <span className="tabular-nums">{countLabel}</span>
      </div>
    </div>
  );
}

function KnockoutSection({
  initialData,
  geneSymbol,
  totalCount,
  tissueFacets,
}: {
  initialData: CrisprRow[];
  geneSymbol: string;
  totalCount: number;
  tissueFacets: CrisprTissueFacet[];
}) {
  const [selectedTypes, setSelectedTypes] = useState<
    ReadonlySet<PerturbationType>
  >(() => new Set());
  const [selectedTissues, setSelectedTissues] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [significantOnly, setSignificantOnly] = useState(false);

  const filtersDirty =
    selectedTypes.size > 0 || selectedTissues.size > 0 || significantOnly;

  // Only seed react-query's initialData when filters are pristine AND we have
  // server-rendered rows. An empty seed (e.g. the SSR fetch was rate-limited
  // but the facet succeeded) would mark the query "successful with no data"
  // and react-query wouldn't refetch.
  const canSeedInitialData = !filtersDirty && initialData.length > 0;

  const { rows, hasMore, isLoading, isFetching } = useCrispr({
    loc: geneSymbol,
    filters: {
      perturbation_type:
        selectedTypes.size > 0 ? [...selectedTypes].join(",") : undefined,
      tissue:
        selectedTissues.size > 0 ? [...selectedTissues].join(",") : undefined,
      significant_only: significantOnly || undefined,
    },
    initialData: canSeedInitialData
      ? {
          data: initialData,
          page_info: {
            next_cursor: null,
            count: initialData.length,
            has_more: initialData.length < totalCount,
            total_count: totalCount,
          },
        }
      : undefined,
    enabled: true,
  });

  const data = rows;

  // Best-effort precise total when only tissue filters are active: sum the
  // facet counts. Filtered queries don't expose total_count.
  const tissueOnlyFilter =
    selectedTissues.size > 0 && selectedTypes.size === 0 && !significantOnly;
  const tissueFilterTotal = useMemo(() => {
    if (!tissueOnlyFilter) return null;
    return tissueFacets
      .filter((f) => selectedTissues.has(f.tissue))
      .reduce((sum, f) => sum + f.count, 0);
  }, [tissueFacets, selectedTissues, tissueOnlyFilter]);

  const maxScore = useMemo(
    () => Math.max(...data.map((r) => Math.abs(r.score_value)), 1),
    [data],
  );
  const columns = useMemo(() => buildCrisprColumns(maxScore), [maxScore]);

  const toggleType = (t: PerturbationType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const toggleTissue = (t: string) => {
    setSelectedTissues((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const shown = data.length;
  const shownText = shown.toLocaleString();
  const shownPlus = hasMore ? `${shownText}+` : shownText;

  const countLabel = (() => {
    if (tissueFilterTotal != null) {
      return `${shownText} of ${tissueFilterTotal.toLocaleString()}`;
    }
    return `${shownPlus} shown`;
  })();

  const subtitle = (() => {
    if (tissueFilterTotal != null) {
      return `${geneSymbol}: ${tissueFilterTotal.toLocaleString()} screens match the selected tissues, showing ${shownText}`;
    }
    if (filtersDirty) {
      return `${geneSymbol}: ${shownPlus} screens match the current filters`;
    }
    return `${geneSymbol}: first ${shownPlus} CRISPR screens (filter to narrow)`;
  })();

  return (
    <div className="space-y-3">
      <CrisprFilterBar
        selectedTypes={selectedTypes}
        onToggleType={toggleType}
        significantOnly={significantOnly}
        onToggleSignificant={() => setSignificantOnly((v) => !v)}
        tissueFacets={tissueFacets}
        selectedTissues={selectedTissues}
        onToggleTissue={toggleTissue}
        onClearTissues={() => setSelectedTissues(new Set())}
        isFetching={isFetching}
        countLabel={countLabel}
      />
      <DataSurface
        title="Knockout phenotype across cell systems"
        subtitle={subtitle}
        data={data}
        columns={columns}
        searchable={false}
        defaultPageSize={25}
        pageSizeOptions={[25, 50]}
        exportable
        exportFilename={`crispr-essentiality-${geneSymbol}`}
        loading={isLoading}
        emptyMessage={
          filtersDirty
            ? "No CRISPR screens match the current filters."
            : `No CRISPR essentiality data found for ${geneSymbol}`
        }
      />
    </div>
  );
}

function SourceLine() {
  const linkClass =
    "text-foreground/80 hover:text-foreground underline-offset-2 hover:underline";
  return (
    <p className="text-xs text-muted-foreground">
      Sources:{" "}
      <a
        href="https://www.ebi.ac.uk/perturbation-catalogue/"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        EBI Perturbation Catalogue
      </a>
      {" · "}
      <a
        href="https://orcs.thebiogrid.org/"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        BioGRID ORCS
      </a>
      {" · "}published Perturb-seq atlases
    </p>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface PerturbationViewProps {
  geneSymbol: string;
  summary: {
    perturbSeqDatasets: number;
    downstreamTargets: number;
    crisprScreens: number;
    essentialIn: number;
  };
  downstream: PerturbSeqRow[];
  crispr: CrisprRow[];
  crisprTotalCount: number;
  downstreamTotalCount: number;
  crisprTissueFacets: CrisprTissueFacet[];
}

export function PerturbationView({
  geneSymbol,
  summary,
  downstream,
  crispr,
  crisprTotalCount,
  downstreamTotalCount,
  crisprTissueFacets,
}: PerturbationViewProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <StoryLine geneSymbol={geneSymbol} summary={summary} />
        <SourceLine />
      </header>
      {downstream.length > 0 && (
        <DownstreamSection
          data={downstream}
          geneSymbol={geneSymbol}
          totalCount={downstreamTotalCount}
        />
      )}
      {(crisprTotalCount > 0 || crispr.length > 0) && (
        <KnockoutSection
          initialData={crispr}
          geneSymbol={geneSymbol}
          totalCount={crisprTotalCount}
          tissueFacets={crisprTissueFacets}
        />
      )}
    </div>
  );
}
