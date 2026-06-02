"use client";

import { cn } from "@infra/utils";
import {
  Plot,
  type PlotParams,
} from "@shared/components/ui/charts/plotly-chart";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchAllGwasAssociations } from "../api/gwas";
import type { GwasAssociationRow } from "../types/gwas";

type PlotData = PlotParams["data"][number];
type PlotLayout = PlotParams["layout"];
type PlotConfig = NonNullable<PlotParams["config"]>;
type Annotation = NonNullable<PlotLayout["annotations"]>[number];
type Shape = NonNullable<PlotLayout["shapes"]>[number];
type ThresholdValue = "all" | number;
type YScale = "linear" | "sqrt";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GW_SIG = 7.3; // −log₁₀(5e-8)
// p-values underflow to 0 below ~1e-300, where the API stores nonsense
// −log₁₀(p) (3040, 9629, …). Clamp at 300 so they don't blow up the axis;
// clamped points are drawn as triangles and flagged "p < 1e-300".
const DISPLAY_MAX = 300;
const MAX_LABELS = 10;
const CHART_HEIGHT = 460;

// Warm/cool alternation per trait band — high contrast, not garish.
const BAND_A = "#5b7fba"; // steel blue
const BAND_B = "#7eae82"; // sage green
const BAND_A_LIGHT = "rgba(91,127,186,0.5)";
const BAND_B_LIGHT = "rgba(126,174,130,0.5)";
const SIG_LINE = "rgba(220,80,80,0.55)";

const PLOT_CONFIG: PlotConfig = {
  responsive: true,
  displaylogo: false,
  scrollZoom: true,
  displayModeBar: "hover",
  modeBarButtonsToRemove: ["lasso2d", "select2d"],
};
const PLOT_STYLE = { width: "100%" } as const;

const THRESHOLDS: ReadonlyArray<{ label: string; value: ThresholdValue }> = [
  { label: "All", value: "all" },
  { label: "1e-2", value: 2 },
  { label: "1e-4", value: 4 },
  { label: "1e-6", value: 6 },
  { label: "1e-8", value: 8 },
];

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function num(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatPScientific(mlog: number): string {
  if (mlog <= 0) return "1";
  const exp = Math.floor(mlog);
  const mantissa = 10 ** -(mlog - exp);
  return `${mantissa.toFixed(2)}e-${exp}`;
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

const toScaled = (scale: YScale, v: number) =>
  scale === "sqrt" ? Math.sqrt(Math.max(0, v)) : v;

/** Evenly-spaced ticks in scaled space, labelled with raw −log₁₀(p). */
function buildYTicks(
  scale: YScale,
  dataMax: number,
): { tickvals: number[]; ticktext: string[] } {
  const max = Math.max(1, dataMax);
  const fromScaled = scale === "sqrt" ? (v: number) => v * v : (v: number) => v;
  const sMax = toScaled(scale, max);
  const n = 5;
  const tickvals = Array.from({ length: n + 1 }, (_, i) => (i * sMax) / n);
  const ticktext = tickvals.map((v) => {
    const raw = fromScaled(v);
    return raw >= 10 ? String(Math.round(raw)) : raw.toFixed(1);
  });
  return { tickvals, ticktext };
}

// Deterministic jitter in [-0.3, 0.3] so stacked points in a band separate.
function jitter(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return ((Math.abs(h) % 1000) / 1000 - 0.5) * 0.6;
}

interface PlotPoint {
  x: number; // band + jitter
  even: boolean;
  mlog: number; // −log₁₀(p), clamped to DISPLAY_MAX
  capped: boolean; // raw value exceeded DISPLAY_MAX
  trait: string;
  gene: string;
  study: string;
}

interface TraitGroup {
  trait: string;
  band: number;
  maxMlog: number;
}

/** Group plottable rows by trait, sorted alphabetically (stable band order). */
function buildPoints(rows: GwasAssociationRow[]): {
  points: PlotPoint[];
  groups: TraitGroup[];
} {
  const byTrait = new Map<string, GwasAssociationRow[]>();
  for (const r of rows) {
    if (num(r.pvalueMlog) === null) continue;
    const trait = r.diseaseTrait || r.trait || "Unknown trait";
    const list = byTrait.get(trait);
    if (list) list.push(r);
    else byTrait.set(trait, [r]);
  }

  const traits = [...byTrait.keys()].sort((a, b) => a.localeCompare(b));
  const points: PlotPoint[] = [];
  const groups: TraitGroup[] = [];

  traits.forEach((trait, band) => {
    const even = band % 2 === 0;
    let maxMlog = 0;
    byTrait.get(trait)?.forEach((r, i) => {
      const raw = num(r.pvalueMlog) as number;
      const mlog = Math.min(raw, DISPLAY_MAX);
      if (mlog > maxMlog) maxMlog = mlog;
      points.push({
        x: band + jitter(`${trait}|${r.studyAccession ?? r.vid}|${i}`),
        even,
        mlog,
        capped: raw > DISPLAY_MAX,
        trait,
        gene: r.mappedGene ?? "—",
        study: r.studyAccession ?? "—",
      });
    });
    groups.push({ trait, band, maxMlog });
  });

  return { points, groups };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * PheWAS-style Manhattan of a variant's GWAS Catalog associations: one dot per
 * association, banded by trait (alphabetical, stable order), −log₁₀(p) on the
 * y-axis. Sourced from the REST `/gwas/{ref}` endpoint (the graph trait edge
 * holds ClinVar associations with no p-values). The y-axis clamps at 300 (the
 * p≈0 underflow floor) and defaults to √. Performance: three traces (a faded
 * WebGL cloud, crisp markers above the line, triangles at the cap) with
 * per-point colour arrays, so trace count is flat regardless of trait count.
 */
export function GwasCatalogPlot({ variantVcf }: { variantVcf: string }) {
  const [threshold, setThreshold] = useState<ThresholdValue>("all");
  const [yScale, setYScale] = useState<YScale>("sqrt");

  const { data, isLoading } = useQuery({
    queryKey: ["gwas-catalog-plot", variantVcf],
    queryFn: () => fetchAllGwasAssociations(variantVcf, {}, 1000),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(variantVcf),
  });

  const { points, groups } = useMemo(() => buildPoints(data ?? []), [data]);

  const visible = useMemo(() => {
    if (threshold === "all") return points;
    return points.filter((p) => p.mlog >= threshold);
  }, [points, threshold]);

  const { traces, dataMax, cappedCount } = useMemo(() => {
    const sub: PlotPoint[] = [];
    const sig: PlotPoint[] = [];
    const cap: PlotPoint[] = [];
    let max = 0;
    for (const p of visible) {
      if (p.mlog > max) max = p.mlog;
      if (p.capped) cap.push(p);
      else if (p.mlog >= GW_SIG) sig.push(p);
      else sub.push(p);
    }

    const hover =
      (variantVcf ? `<b>${variantVcf}</b><br>` : "") +
      "<b>%{customdata[0]}</b><br>" +
      "<span style='color:#888'>−log₁₀P:</span> %{customdata[1]}" +
      "<br><span style='color:#888'>Gene:</span> %{customdata[2]}" +
      "<br><span style='color:#888'>Study:</span> %{customdata[3]}" +
      "<extra></extra>";

    const cd = (p: PlotPoint): string[] => [
      truncate(p.trait, 60),
      p.capped
        ? `≥${DISPLAY_MAX} (p < 1e-${DISPLAY_MAX})`
        : `${p.mlog.toFixed(1)} (p=${formatPScientific(p.mlog)})`,
      p.gene,
      p.study,
    ];
    const ys = (pts: PlotPoint[]) => pts.map((p) => toScaled(yScale, p.mlog));

    const made: PlotData[] = [];

    if (sub.length) {
      made.push({
        type: "scattergl",
        mode: "markers",
        x: sub.map((p) => p.x),
        y: ys(sub),
        customdata: sub.map(cd),
        marker: {
          size: 5,
          opacity: 0.55,
          color: sub.map((p) => (p.even ? BAND_A_LIGHT : BAND_B_LIGHT)),
          line: { width: 0 },
        },
        hovertemplate: hover,
      } as PlotData);
    }
    if (sig.length) {
      made.push({
        type: "scattergl",
        mode: "markers",
        x: sig.map((p) => p.x),
        y: ys(sig),
        customdata: sig.map(cd),
        marker: {
          size: 7,
          opacity: 0.9,
          color: sig.map((p) => (p.even ? BAND_A : BAND_B)),
          line: { width: 0.5, color: "rgba(0,0,0,0.3)" },
        },
        hovertemplate: hover,
      } as PlotData);
    }
    if (cap.length) {
      made.push({
        type: "scatter",
        mode: "markers",
        x: cap.map((p) => p.x),
        y: ys(cap),
        customdata: cap.map(cd),
        marker: {
          size: 11,
          symbol: "triangle-up",
          opacity: 1,
          color: cap.map((p) => (p.even ? BAND_A : BAND_B)),
          line: { width: 1, color: "rgba(0,0,0,0.45)" },
        },
        hovertemplate: hover,
      } as PlotData);
    }

    return { traces: made, dataMax: max, cappedCount: cap.length };
  }, [visible, yScale, variantVcf]);

  const layout = useMemo<PlotLayout>(() => {
    const ticks = buildYTicks(yScale, dataMax);
    // Extra headroom above the ceiling so the angled peak labels have room.
    const yTop = toScaled(yScale, Math.max(GW_SIG + 1, dataMax)) * 1.18;
    const thr = threshold === "all" ? GW_SIG : Math.max(GW_SIG, threshold);

    // Label the most significant traits at their peak, skipping any within a
    // label-width estimate of a higher-priority label. Alphabetical x order
    // scatters the peaks, so labels land at varied x and height (no cramming).
    const gap = Math.max(1, Math.round(groups.length * 0.08));
    const labeled: TraitGroup[] = [];
    for (const g of [...groups].sort((a, b) => b.maxMlog - a.maxMlog)) {
      if (labeled.length >= MAX_LABELS) break;
      if (g.maxMlog < thr) break;
      if (labeled.every((l) => Math.abs(l.band - g.band) >= gap)) {
        labeled.push(g);
      }
    }

    const shapes: Shape[] = [
      {
        type: "line",
        xref: "paper",
        x0: 0,
        x1: 1,
        yref: "y",
        y0: toScaled(yScale, GW_SIG),
        y1: toScaled(yScale, GW_SIG),
        line: { color: SIG_LINE, width: 1, dash: "dot" },
      },
    ];
    const annotations: Annotation[] = [
      {
        xref: "paper",
        x: 1,
        xanchor: "right",
        yref: "y",
        y: toScaled(yScale, GW_SIG),
        yanchor: "bottom",
        text: "5×10⁻⁸",
        showarrow: false,
        font: { size: 10, color: SIG_LINE },
      },
      ...labeled.map(
        (g): Annotation => ({
          xref: "x",
          yref: "y",
          x: g.band,
          y: toScaled(yScale, g.maxMlog),
          text: truncate(g.trait, 24),
          showarrow: false,
          yanchor: "bottom",
          textangle: "-30",
          font: { size: 9, color: "#475569" },
        }),
      ),
    ];

    if (cappedCount > 0) {
      const yCap = toScaled(yScale, DISPLAY_MAX);
      shapes.push({
        type: "line",
        xref: "paper",
        x0: 0,
        x1: 1,
        yref: "y",
        y0: yCap,
        y1: yCap,
        line: { color: "rgba(0,0,0,0.14)", width: 1, dash: "dash" },
      });
      annotations.push({
        xref: "paper",
        x: 0,
        xanchor: "left",
        yref: "y",
        y: yCap,
        yanchor: "bottom",
        text: `p < 1e-${DISPLAY_MAX} ▲`,
        showarrow: false,
        font: { size: 10, color: "#94a3b8" },
      });
    }

    return {
      height: CHART_HEIGHT,
      autosize: true,
      margin: { l: 52, r: 16, t: 60, b: 28 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: {
        family: "system-ui, -apple-system, sans-serif",
        color: "#6b7280",
      },
      hovermode: "closest",
      dragmode: "zoom",
      showlegend: false,
      xaxis: {
        showticklabels: false,
        showgrid: false,
        zeroline: false,
        range: [-0.7, Math.max(0.7, groups.length - 0.3)],
        title: {
          text: `${groups.length.toLocaleString()} traits`,
          font: { size: 11, color: "#6b7280" },
          standoff: 4,
        },
      },
      yaxis: {
        range: [0, yTop],
        zeroline: false,
        gridcolor: "rgba(128,128,128,0.14)",
        tickvals: ticks.tickvals,
        ticktext: ticks.ticktext,
        tickfont: { size: 10, color: "#6b7280" },
        title: {
          text: "−log₁₀(p)",
          font: { size: 11, color: "#6b7280" },
          standoff: 8,
        },
      },
      shapes,
      annotations,
      hoverlabel: {
        bgcolor: "#ffffff",
        bordercolor: "rgba(0,0,0,0.08)",
        font: { size: 12, color: "#111827" },
        align: "left",
      },
    };
  }, [groups, dataMax, threshold, yScale, cappedCount]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <div className="text-sm font-medium text-foreground">
            Trait associations
          </div>
          <div className="text-xs text-muted-foreground">Loading…</div>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ height: CHART_HEIGHT }}
        >
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
      </div>
    );
  }

  if (points.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-4 pt-3 pb-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground tracking-tight">
            Trait associations
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {visible.length.toLocaleString()} associations ·{" "}
            {groups.length.toLocaleString()} traits
            {cappedCount > 0 && (
              <span>
                {" "}
                · {cappedCount.toLocaleString()} at p &lt; 1e-{DISPLAY_MAX}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Scale */}
          <div className="inline-flex items-center rounded-lg border border-border bg-card p-0.5 gap-px">
            {(["linear", "sqrt"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setYScale(mode)}
                className={cn(
                  "rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                  yScale === mode
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {mode === "linear" ? "Linear" : "√"}
              </button>
            ))}
          </div>
          {/* Significance filter */}
          <div className="inline-flex items-center rounded-lg border border-border bg-card p-0.5 gap-px">
            {THRESHOLDS.map(({ label, value }) => (
              <button
                key={label}
                type="button"
                onClick={() => setThreshold(value)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  value === threshold
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plot */}
      <div className="px-2 pb-2">
        <Plot
          data={traces}
          layout={layout}
          config={PLOT_CONFIG}
          style={PLOT_STYLE}
          useResizeHandler
        />
      </div>
    </div>
  );
}
