"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_BASE } from "@/config/api";

export { assignDomainColors, domainColor } from "./colors";
export { ProteinHeader, ProteinPanels } from "./protein-object";
export type {
  ComplexRow,
  ProteinDomain,
  ProteinStructureViewProps,
  ProteinSummary,
  TranscriptRow,
} from "./types";

import type { ProteinDomain, ProteinStructureViewProps } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Viewer3D = any;

// ---------------------------------------------------------------------------
// Domain architecture map (SVG) — linked to 3D viewer
// ---------------------------------------------------------------------------

const TRACK_HEIGHT = 32;
const TICK_HEIGHT = 6;
const PADDING_X = 2;
const AXIS_GAP = 4;
const MARKER_HEIGHT = 46;

function niceTickStep(length: number): number {
  const rough = length / 8;
  const mag = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / mag;
  if (normalized <= 1) return mag;
  if (normalized <= 2) return 2 * mag;
  if (normalized <= 5) return 5 * mag;
  return 10 * mag;
}

/** Three-letter → one-letter amino acid codes */
const AA3_TO_1: Record<string, string> = {
  ALA: "A",
  ARG: "R",
  ASN: "N",
  ASP: "D",
  CYS: "C",
  GLN: "Q",
  GLU: "E",
  GLY: "G",
  HIS: "H",
  ILE: "I",
  LEU: "L",
  LYS: "K",
  MET: "M",
  PHE: "F",
  PRO: "P",
  SER: "S",
  THR: "T",
  TRP: "W",
  TYR: "Y",
  VAL: "V",
};

const DomainMap = memo(function DomainMap({
  domains,
  proteinLength,
  variantPosition,
  variantLabel,
  viewerRef,
  baseStylesRef,
}: {
  domains: ProteinDomain[];
  proteinLength: number;
  variantPosition?: number;
  variantLabel?: string;
  viewerRef: React.RefObject<Viewer3D | null>;
  baseStylesRef: React.RefObject<(() => void) | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hoverLabelRef = useRef<unknown>(null);
  const [width, setWidth] = useState(0);
  const [hoverResi, setHoverResi] = useState<number | null>(null);
  const [hoverInfo, setHoverInfo] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const trackWidth = width - PADDING_X * 2;
  const scale = trackWidth > 0 ? trackWidth / proteinLength : 0;
  const trackTop = variantPosition ? 22 : 6;
  const trackBottom = trackTop + TRACK_HEIGHT;
  const tickTop = trackBottom + AXIS_GAP;
  const labelY = tickTop + TICK_HEIGHT + 10;
  const svgHeight = labelY + 4;

  const ticks = useMemo(() => {
    const step = niceTickStep(proteinLength);
    const result: number[] = [1];
    let pos = step;
    while (pos < proteinLength) {
      result.push(pos);
      pos += step;
    }
    result.push(proteinLength);
    return result;
  }, [proteinLength]);

  const legendItems = useMemo(() => {
    const seen = new Map<string, string>();
    for (const d of domains) {
      if (!seen.has(d.name)) seen.set(d.name, d.color);
    }
    return [...seen.entries()].map(([name, color]) => ({ name, color }));
  }, [domains]);

  const coverage = useMemo(() => {
    if (!domains.length || !proteinLength) return 0;
    const sorted = [...domains].sort((a, b) => a.start - b.start);
    let covered = 0;
    let curStart = sorted[0].start;
    let curEnd = sorted[0].end;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].start <= curEnd + 1) {
        curEnd = Math.max(curEnd, sorted[i].end);
      } else {
        covered += curEnd - curStart + 1;
        curStart = sorted[i].start;
        curEnd = sorted[i].end;
      }
    }
    covered += curEnd - curStart + 1;
    return Math.round((covered / proteinLength) * 100);
  }, [domains, proteinLength]);

  // Highlight a residue on the 3D viewer when hovering the domain bar
  const highlightResidue = useCallback(
    (resi: number | null) => {
      const viewer = viewerRef.current;
      if (!viewer) return;

      // Remove previous hover label
      if (hoverLabelRef.current) {
        viewer.removeLabel(hoverLabelRef.current);
        hoverLabelRef.current = null;
      }

      // Restore base styles
      baseStylesRef.current?.();

      if (resi == null) {
        viewer.render();
        return;
      }

      // Highlight hovered residue
      viewer.setStyle(
        { resi },
        {
          cartoon: { color: "#7c3aed" },
          stick: { color: "#7c3aed", radius: 0.15 },
        },
      );

      // Get atom info for label
      const atoms = viewer.selectedAtoms({ resi });
      if (atoms.length > 0) {
        const ca =
          atoms.find((a: { atom: string }) => a.atom === "CA") ?? atoms[0];
        const resName = ca.resn ?? "";
        const aa1 = AA3_TO_1[resName] ?? resName;
        const text = `${aa1}${resi}`;

        setHoverInfo(`${resName} ${resi}`);

        hoverLabelRef.current = viewer.addLabel(text, {
          position: { x: ca.x, y: ca.y + 2, z: ca.z + 2 },
          backgroundColor: "#7c3aed",
          fontColor: "#ffffff",
          fontSize: 12,
          backgroundOpacity: 0.9,
          showBackground: true,
          borderThickness: 0,
          inFront: true,
        });
      }

      viewer.render();
    },
    [viewerRef, baseStylesRef],
  );

  // Handle mouse move on the SVG track
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg || scale <= 0) return;
      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - PADDING_X;
      if (mouseX < 0 || mouseX > trackWidth) {
        if (hoverResi !== null) {
          setHoverResi(null);
          setHoverInfo(null);
          highlightResidue(null);
        }
        return;
      }
      const resi = Math.max(
        1,
        Math.min(proteinLength, Math.round(mouseX / scale) + 1),
      );
      if (resi !== hoverResi) {
        setHoverResi(resi);
        highlightResidue(resi);
      }
    },
    [scale, trackWidth, proteinLength, hoverResi, highlightResidue],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverResi(null);
    setHoverInfo(null);
    highlightResidue(null);
  }, [highlightResidue]);

  return (
    <div ref={containerRef} className="w-full">
      {width > 0 && (
        <>
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-3">
              <p className="text-sm font-medium text-foreground">
                Domain Architecture
              </p>
              {hoverInfo && (
                <p className="text-xs font-mono text-primary">{hoverInfo}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {proteinLength} aa &middot; {coverage}% annotated
            </p>
          </div>

          <svg
            ref={svgRef}
            width={width}
            height={svgHeight}
            className="block cursor-crosshair"
            aria-label="Protein domain architecture"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Background track */}
            <rect
              x={PADDING_X}
              y={trackTop}
              width={trackWidth}
              height={TRACK_HEIGHT}
              rx={4}
              fill="currentColor"
              className="text-muted"
            />

            {/* Domain blocks — render largest first so smaller domains appear on top */}
            {[...domains]
              .sort((a, b) => b.end - b.start - (a.end - a.start))
              .map((d, i) => {
                const x = PADDING_X + (d.start - 1) * scale;
                const w = Math.max((d.end - d.start + 1) * scale, 2);
                return (
                  <Tooltip key={`${d.id}-${d.start}-${i}`}>
                    <TooltipTrigger asChild>
                      <rect
                        x={x}
                        y={trackTop}
                        width={w}
                        height={TRACK_HEIGHT}
                        rx={3}
                        fill={d.color}
                        className="cursor-crosshair transition-opacity hover:opacity-80"
                        style={{ pointerEvents: "all" }}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <div className="space-y-0.5">
                        <p className="font-medium">{d.name}</p>
                        <p>
                          Residues {d.start}–{d.end}
                        </p>
                        {d.type && <p>Type: {d.type}</p>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}

            {/* Hover position indicator */}
            {hoverResi != null && (
              <line
                x1={PADDING_X + (hoverResi - 1) * scale}
                y1={trackTop}
                x2={PADDING_X + (hoverResi - 1) * scale}
                y2={trackTop + TRACK_HEIGHT}
                stroke="#7c3aed"
                strokeWidth={2}
                style={{ pointerEvents: "none" }}
              />
            )}

            {/* Variant position marker */}
            {variantPosition != null &&
              variantPosition >= 1 &&
              variantPosition <= proteinLength && (
                <>
                  <line
                    x1={PADDING_X + (variantPosition - 1) * scale}
                    y1={trackTop - 2}
                    x2={PADDING_X + (variantPosition - 1) * scale}
                    y2={trackTop + MARKER_HEIGHT}
                    stroke="#dc2626"
                    strokeWidth={2}
                    style={{ pointerEvents: "none" }}
                  />
                  <polygon
                    points={(() => {
                      const cx = PADDING_X + (variantPosition - 1) * scale;
                      const cy = trackTop + TRACK_HEIGHT / 2;
                      return `${cx},${cy - 5} ${cx + 4},${cy} ${cx},${cy + 5} ${cx - 4},${cy}`;
                    })()}
                    fill="#dc2626"
                    style={{ pointerEvents: "none" }}
                  />
                  <text
                    x={PADDING_X + (variantPosition - 1) * scale}
                    y={trackTop - 6}
                    textAnchor="middle"
                    className="fill-destructive text-[10px] font-bold"
                    style={{ pointerEvents: "none" }}
                  >
                    {variantLabel ?? `aa ${variantPosition}`}
                  </text>
                </>
              )}

            {/* Tick marks + labels */}
            {ticks.map((pos) => {
              const x = PADDING_X + (pos - 1) * scale;
              const isEnd = pos === 1 || pos === proteinLength;
              return (
                <g key={pos}>
                  <line
                    x1={x}
                    y1={tickTop}
                    x2={x}
                    y2={tickTop + TICK_HEIGHT}
                    stroke="currentColor"
                    strokeWidth={1}
                    className="text-muted-foreground/40"
                  />
                  <text
                    x={x}
                    y={labelY}
                    textAnchor={
                      pos === 1
                        ? "start"
                        : pos === proteinLength
                          ? "end"
                          : "middle"
                    }
                    className={`fill-muted-foreground ${isEnd ? "text-[10px] font-medium" : "text-[9px]"}`}
                  >
                    {pos}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            {legendItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
              >
                <span
                  className="inline-block size-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate max-w-[160px]">{item.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

// ---------------------------------------------------------------------------
// AlphaFold 3D viewer (3Dmol.js from CDN)
// ---------------------------------------------------------------------------

const PLDDT_COLORS = [
  { label: "Very high (>90)", color: "#0053d6" },
  { label: "Confident (70\u201390)", color: "#65cbf3" },
  { label: "Low (50\u201370)", color: "#ffdb13" },
  { label: "Very low (<50)", color: "#ff7d45" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type $3Dmol = any;

let mol3dPromise: Promise<$3Dmol> | null = null;

function load3Dmol(): Promise<$3Dmol> {
  if (mol3dPromise) return mol3dPromise;
  mol3dPromise = new Promise((resolve, reject) => {
    const w = window as unknown as Record<string, unknown>;
    if (w.$3Dmol) {
      resolve(w.$3Dmol);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://3Dmol.org/build/3Dmol-min.js";
    script.async = true;
    script.onload = () => {
      if (w.$3Dmol) resolve(w.$3Dmol);
      else reject(new Error("3Dmol loaded but not found on window"));
    };
    script.onerror = () => reject(new Error("Failed to load 3Dmol.js"));
    document.head.appendChild(script);
  });
  return mol3dPromise;
}

const AlphaFoldViewer = memo(function AlphaFoldViewer({
  uniprotId,
  variantPosition,
  variantLabel,
  viewerRef,
  baseStylesRef,
}: {
  uniprotId: string;
  variantPosition?: number;
  variantLabel?: string;
  viewerRef: React.MutableRefObject<Viewer3D | null>;
  baseStylesRef: React.MutableRefObject<(() => void) | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;

    (async () => {
      try {
        const $3Dmol = await load3Dmol();
        if (cancelled) return;

        // Try our structures API first, fall back to AlphaFold EBI
        let cifData: string | null = null;

        try {
          const resp = await fetch(
            `${API_BASE}/structures/${encodeURIComponent(uniprotId)}`,
            { credentials: "include" },
          );
          if (resp.ok) cifData = await resp.text();
        } catch {
          // our API failed, try EBI
        }

        if (!cifData) {
          try {
            const apiResp = await fetch(
              `https://alphafold.ebi.ac.uk/api/prediction/${uniprotId}`,
            );
            if (apiResp.ok) {
              const entries = (await apiResp.json()) as Array<{
                cifUrl?: string;
              }>;
              const cifUrl = entries?.[0]?.cifUrl;
              if (cifUrl) {
                const cifResp = await fetch(cifUrl);
                if (cifResp.ok) cifData = await cifResp.text();
              }
            }
          } catch {
            // EBI also failed
          }
        }

        if (!cifData || cancelled) {
          if (!cancelled) setStatus("error");
          return;
        }

        el.innerHTML = "";
        const viewer = $3Dmol.createViewer(el, {
          backgroundColor: "white",
          lowerZoomLimit: 25,
          upperZoomLimit: 800,
        });

        viewer.addModel(cifData, "cif");

        // pLDDT coloring function
        const plddtStyle = {
          cartoon: {
            colorfunc: (atom: { b: number }) => {
              const b = atom.b;
              if (b > 90) return "#0053d6";
              if (b > 70) return "#65cbf3";
              if (b > 50) return "#ffdb13";
              return "#ff7d45";
            },
          },
        };

        // Function to restore base styles (called by DomainMap on hover end)
        const restoreBaseStyles = () => {
          viewer.setStyle({}, plddtStyle);
          // Re-apply variant highlight if present
          if (variantPosition != null) {
            viewer.setStyle(
              { resi: variantPosition },
              {
                cartoon: { color: "#16a34a" },
                stick: { color: "#16a34a", radius: 0.2 },
              },
            );
          }
        };

        // Store refs so DomainMap can access the viewer
        viewerRef.current = viewer;
        baseStylesRef.current = restoreBaseStyles;

        // Apply base styles
        viewer.setStyle({}, plddtStyle);

        // Highlight + annotate variant residue
        if (variantPosition != null) {
          viewer.setStyle(
            { resi: variantPosition },
            {
              cartoon: { color: "#16a34a" },
              stick: { color: "#16a34a", radius: 0.2 },
            },
          );

          // Add persistent label at the variant residue
          const label = variantLabel ?? `aa ${variantPosition}`;
          const atoms = viewer.selectedAtoms({ resi: variantPosition });
          if (atoms.length > 0) {
            const ca =
              atoms.find((a: { atom: string }) => a.atom === "CA") ?? atoms[0];
            viewer.addLabel(label, {
              position: { x: ca.x, y: ca.y + 2, z: ca.z + 2 },
              backgroundColor: "#16a34a",
              fontColor: "#ffffff",
              fontSize: 13,
              backgroundOpacity: 0.9,
              showBackground: true,
              borderThickness: 0,
              inFront: true,
              fixed: true,
            });
          }
        }

        viewer.zoomTo();
        viewer.render();
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      viewerRef.current = null;
      baseStylesRef.current = null;
    };
  }, [uniprotId, variantPosition, variantLabel, viewerRef, baseStylesRef]);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-foreground">3D Structure</p>
        <p className="text-xs text-muted-foreground">
          AlphaFold &middot; {uniprotId}
        </p>
      </div>

      <div
        className="relative rounded-lg border border-border overflow-hidden"
        style={{ height: 480 }}
      >
        {status === "loading" && (
          <div className="absolute inset-0 z-10 bg-muted animate-pulse flex items-center justify-center">
            <span className="text-sm text-muted-foreground">
              Loading 3D structure…
            </span>
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 z-10 bg-muted flex items-center justify-center">
            <span className="text-sm text-muted-foreground">
              No AlphaFold structure available for this protein
            </span>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* pLDDT color legend */}
      {status === "ready" && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">
            Confidence
          </span>
          {PLDDT_COLORS.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
            >
              <span
                className="inline-block size-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: c.color }}
              />
              {c.label}
            </div>
          ))}
          {variantPosition != null && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span
                className="inline-block size-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: "#16a34a" }}
              />
              Variant position
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Combined component — lifts viewer ref so bar ↔ 3D are linked
// ---------------------------------------------------------------------------

export const ProteinStructureView = memo(function ProteinStructureView({
  uniprotId,
  geneSymbol,
  domains,
  proteinLength,
  variantPosition,
  variantLabel,
}: ProteinStructureViewProps) {
  const viewerRef = useRef<Viewer3D | null>(null);
  const baseStylesRef = useRef<(() => void) | null>(null);

  if (!uniprotId && domains.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">
          No protein structure data available for {geneSymbol}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {domains.length > 0 && proteinLength > 0 && (
        <DomainMap
          domains={domains}
          proteinLength={proteinLength}
          variantPosition={variantPosition}
          variantLabel={variantLabel}
          viewerRef={viewerRef}
          baseStylesRef={baseStylesRef}
        />
      )}
      {uniprotId && (
        <AlphaFoldViewer
          uniprotId={uniprotId}
          variantPosition={variantPosition}
          variantLabel={variantLabel}
          viewerRef={viewerRef}
          baseStylesRef={baseStylesRef}
        />
      )}
    </div>
  );
});
