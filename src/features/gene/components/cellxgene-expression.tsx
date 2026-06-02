"use client";

import { Badge } from "@infra/table/column-builder";
import { Input } from "@shared/components/ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SegmentedControl } from "./segmented-control";

// =============================================================================
// Types
// =============================================================================

export interface CellxgeneRow {
  cellTypeId: string;
  cellType: string;
  meanLogNormMax: number | null;
  specificityMax: number | null;
  fractionExpressing: number | null;
  nCells: number | null;
}

type SortKey = "specificity" | "mean" | "fraction";
type LimitOption = "25" | "50" | "all";

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "specificity", label: "Specificity" },
  { value: "mean", label: "Mean expr" },
  { value: "fraction", label: "% expressing" },
];

const LIMIT_OPTIONS: Array<{ value: LimitOption; label: string }> = [
  { value: "25", label: "Top 25" },
  { value: "50", label: "Top 50" },
  { value: "all", label: "All" },
];

// Sequential ramp for mean expression (light → deep violet).
const EXPR_RAMP = ["#ede9fe", "#c4b5fd", "#8b5cf6", "#6d28d9", "#4c1d95"];

// =============================================================================
// Helpers
// =============================================================================

function compactCount(n: number | null): string {
  if (n === null) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return `${n}`;
}

function percent(f: number | null): string {
  return f === null ? "–" : `${Math.round(f * 100)}%`;
}

function sortValue(row: CellxgeneRow, key: SortKey): number {
  const v =
    key === "specificity"
      ? row.specificityMax
      : key === "fraction"
        ? row.fractionExpressing
        : row.meanLogNormMax;
  return v ?? Number.NEGATIVE_INFINITY;
}

/** Specificity → marker classification (the interpretive layer). */
function marker(specificity: number | null) {
  if (specificity === null) return null;
  if (specificity >= 0.5) return { label: "Marker", color: "emerald" as const };
  if (specificity >= 0.3) return { label: "Enriched", color: "amber" as const };
  return null;
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}
function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
/** Map normalized t∈[0,1] onto the expression ramp. */
function rampColor(t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const segments = EXPR_RAMP.length - 1;
  const x = clamped * segments;
  const i = Math.min(segments - 1, Math.floor(x));
  const f = x - i;
  const [r1, g1, b1] = hexToRgb(EXPR_RAMP[i]);
  const [r2, g2, b2] = hexToRgb(EXPR_RAMP[i + 1]);
  return `rgb(${lerp(r1, r2, f)}, ${lerp(g1, g2, f)}, ${lerp(b1, b2, f)})`;
}

/** Dot diameter in px from fraction expressing. */
function dotSize(fraction: number | null): number {
  return 6 + (fraction ?? 0) * 14;
}

// =============================================================================
// Component
// =============================================================================

export function CellxgeneExpression({ rows }: { rows: CellxgeneRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("specificity");
  const [limit, setLimit] = useState<LimitOption>("25");
  const [query, setQuery] = useState("");

  const maxMean = useMemo(
    () => Math.max(0, ...rows.map((r) => r.meanLogNormMax ?? 0)),
    [rows],
  );

  const ranked = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? rows.filter((r) => r.cellType.toLowerCase().includes(q))
      : rows;
    const sorted = [...filtered].sort(
      (a, b) => sortValue(b, sortKey) - sortValue(a, sortKey),
    );
    return limit === "all"
      ? sorted
      : sorted.slice(0, Number.parseInt(limit, 10));
  }, [rows, sortKey, limit, query]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 px-6 py-3 border-b border-border bg-muted/50">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cell types..."
            className="h-8 w-56 pl-8 text-sm"
          />
        </div>
        <SegmentedControl
          label="Sort"
          value={sortKey}
          options={SORT_OPTIONS}
          onChange={setSortKey}
        />
        <SegmentedControl
          label="Show"
          value={limit}
          options={LIMIT_OPTIONS}
          onChange={setLimit}
        />
      </div>

      <div className="px-6 py-4">
        {ranked.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {query
              ? "No matching cell types."
              : "No CellxGene expression available"}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-[minmax(10rem,1.4fr)_2.5rem_3rem_minmax(6rem,1fr)_5rem] items-center gap-3 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>Cell type</span>
              <span className="text-center">Expr</span>
              <span className="text-right">% cells</span>
              <span>Specificity</span>
              <span />
            </div>
            <div className="divide-y divide-border/60">
              {ranked.map((row) => {
                const tag = marker(row.specificityMax);
                const meanNorm =
                  maxMean > 0 ? (row.meanLogNormMax ?? 0) / maxMean : 0;
                const size = dotSize(row.fractionExpressing);
                const spec = row.specificityMax ?? 0;
                return (
                  <div
                    key={row.cellTypeId}
                    className="grid grid-cols-[minmax(10rem,1.4fr)_2.5rem_3rem_minmax(6rem,1fr)_5rem] items-center gap-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <div
                        className="truncate text-foreground"
                        title={row.cellType}
                      >
                        {row.cellType}
                      </div>
                      {row.nCells !== null && (
                        <div className="text-xs text-muted-foreground tabular-nums">
                          {compactCount(row.nCells)} cells
                        </div>
                      )}
                    </div>
                    <div
                      className="flex items-center justify-center"
                      title={
                        row.meanLogNormMax !== null
                          ? `mean expression ${row.meanLogNormMax.toFixed(3)}`
                          : undefined
                      }
                    >
                      <span
                        className="rounded-full"
                        style={{
                          width: size,
                          height: size,
                          backgroundColor: rampColor(meanNorm),
                        }}
                      />
                    </div>
                    <span className="text-right text-xs tabular-nums text-muted-foreground">
                      {percent(row.fractionExpressing)}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-foreground/60"
                          style={{ width: `${spec * 100}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                        {row.specificityMax === null
                          ? "–"
                          : row.specificityMax.toFixed(2)}
                      </span>
                    </div>
                    <span>
                      {tag && <Badge color={tag.color}>{tag.label}</Badge>}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>% cells expressing</span>
                {[0.25, 0.6, 1].map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-muted-foreground/50"
                    style={{ width: dotSize(f), height: dotSize(f) }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span>mean expression</span>
                <span
                  className="h-2 w-24 rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${EXPR_RAMP.join(", ")})`,
                  }}
                />
                <span>low → high</span>
              </div>
              <span>Marker / Enriched from expression specificity.</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
