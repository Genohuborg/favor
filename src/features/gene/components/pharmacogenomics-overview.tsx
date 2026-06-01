"use client";

import { cn } from "@infra/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { ScopeBar } from "@shared/components/ui/data-surface/scope-bar";
import type { DimensionConfig } from "@shared/components/ui/data-surface/types";
import { NoDataState } from "@shared/components/ui/error-states";
import { ExternalLink } from "@shared/components/ui/external-link";
import { Input } from "@shared/components/ui/input";
import { Tip } from "@shared/components/ui/tip";
import { TooltipProvider } from "@shared/components/ui/tooltip";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PharmacogenomicsOverviewProps {
  relations?: unknown;
  edges?: unknown;
  geneSymbol?: string | null;
  className?: string;
}

type PgxEdge = {
  id: string;
  drugName: string;
  evidenceOrigin: string | null;
  cancerTypes: string[];
  variantNames: string[];
  hgvsExpressions: string[];
  evidenceStatements: string[];
  bestEvidenceLevel: string | null;
  evidenceCount: number;
  confidenceClass: string | null;
  pubmedIds: string[];
  sources: string[];
  nccnGuideline: string | null;
  drugSubtitle: string | null;
};

// ---------------------------------------------------------------------------
// Labels & helpers
// ---------------------------------------------------------------------------

const EVIDENCE_LEVELS: Record<
  string,
  { label: string; tip: string; color: string; rank: number }
> = {
  A: {
    label: "Level A",
    tip: "Validated association — supported by an approved therapy or established clinical guidelines.",
    color: "bg-emerald-500",
    rank: 5,
  },
  B: {
    label: "Level B",
    tip: "Clinical evidence — supported by clinical trials or well-powered studies showing response.",
    color: "bg-blue-500",
    rank: 4,
  },
  C: {
    label: "Level C",
    tip: "Case study — evidence from individual case reports or small studies.",
    color: "bg-amber-500",
    rank: 3,
  },
  D: {
    label: "Level D",
    tip: "Preclinical evidence — supported by in vitro or in vivo models only.",
    color: "bg-muted-foreground/40",
    rank: 2,
  },
  E: {
    label: "Level E",
    tip: "Inferential — indirect evidence based on related genes or pathways.",
    color: "bg-muted-foreground/20",
    rank: 1,
  },
};

const ORIGIN_LABELS: Record<string, { label: string; tip: string }> = {
  predictive_evidence: {
    label: "Predictive",
    tip: "Evidence that this gene's status predicts response to a specific drug treatment.",
  },
  pharmacogenomic: {
    label: "Pharmacogenomic",
    tip: "Pharmacokinetic or pharmacodynamic evidence — how genetic variation affects drug metabolism or efficacy.",
  },
  diagnostic: {
    label: "Diagnostic",
    tip: "Evidence that this gene-drug pair informs disease diagnosis.",
  },
  prognostic: {
    label: "Prognostic",
    tip: "Evidence that this gene's status predicts patient outcome regardless of treatment.",
  },
};

// ---------------------------------------------------------------------------
// Data extraction
// ---------------------------------------------------------------------------

function extractPgxEdges(relations: unknown, edges?: unknown): PgxEdge[] {
  const source = relations ?? edges;
  if (!source || typeof source !== "object") return [];

  const record = source as Record<string, unknown>;
  const byType =
    record.GENE_AFFECTS_DRUG_RESPONSE ?? record.gene_affects_drug_response;

  let rows: any[] = [];
  if (byType && typeof byType === "object") {
    const typed = byType as Record<string, unknown>;
    if (Array.isArray(typed.rows)) rows = typed.rows;
    else if (Array.isArray(byType)) rows = byType as any[];
  }

  // Parse individual rows
  const parsed: PgxEdge[] = [];
  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const neighbor = row?.neighbor ?? row?.target ?? {};
    const link = row?.link ?? row?.edge ?? {};
    const props = link?.props ?? link ?? {};
    const rawId = neighbor?.id ?? row?.neighbor_id ?? row?.id;
    if (!rawId) continue;

    parsed.push({
      id: `${rawId}_${idx}`,
      drugName: String(
        props.drug_name ?? neighbor?.label ?? neighbor?.name ?? "Unknown",
      ),
      drugSubtitle:
        typeof neighbor?.subtitle === "string" ? neighbor.subtitle : null,
      evidenceOrigin: props.evidence_origin ?? null,
      cancerTypes: Array.isArray(props.cancer_types)
        ? props.cancer_types.filter(Boolean)
        : [],
      variantNames: Array.isArray(props.variant_names)
        ? props.variant_names.filter(Boolean)
        : [],
      hgvsExpressions: Array.isArray(props.hgvs_expressions)
        ? props.hgvs_expressions.filter(Boolean)
        : [],
      evidenceStatements: Array.isArray(props.evidence_statements)
        ? props.evidence_statements.filter(Boolean)
        : [],
      bestEvidenceLevel: props.best_evidence_level ?? null,
      evidenceCount:
        typeof props.evidence_count === "number" ? props.evidence_count : 0,
      confidenceClass: props.confidence_class ?? null,
      pubmedIds: Array.isArray(props.pubmed_ids) ? props.pubmed_ids : [],
      sources: Array.isArray(props.sources) ? props.sources : [],
      nccnGuideline:
        typeof props.nccn_guideline === "string" ? props.nccn_guideline : null,
    });
  }

  // Merge rows with the same drug name (case-insensitive).
  // Keep the row with the best evidence level; combine arrays.
  const merged = new Map<string, PgxEdge>();
  for (const edge of parsed) {
    const key = edge.drugName.toLowerCase();
    const existing = merged.get(key);
    if (!existing) {
      // Title-case the name for display consistency
      edge.drugName =
        edge.drugName.charAt(0).toUpperCase() +
        edge.drugName.slice(1).toLowerCase();
      merged.set(key, edge);
      continue;
    }
    // Merge: keep better evidence level, combine arrays
    const eRank = EVIDENCE_LEVELS[existing.bestEvidenceLevel ?? ""]?.rank ?? 0;
    const nRank = EVIDENCE_LEVELS[edge.bestEvidenceLevel ?? ""]?.rank ?? 0;
    if (nRank > eRank) existing.bestEvidenceLevel = edge.bestEvidenceLevel;
    existing.evidenceCount += edge.evidenceCount;
    existing.cancerTypes = [
      ...new Set([...existing.cancerTypes, ...edge.cancerTypes]),
    ];
    existing.variantNames = [
      ...new Set([...existing.variantNames, ...edge.variantNames]),
    ];
    existing.hgvsExpressions = [
      ...new Set([...existing.hgvsExpressions, ...edge.hgvsExpressions]),
    ];
    existing.evidenceStatements = [
      ...existing.evidenceStatements,
      ...edge.evidenceStatements,
    ];
    existing.pubmedIds = [
      ...new Set([...existing.pubmedIds, ...edge.pubmedIds]),
    ];
    existing.sources = [...new Set([...existing.sources, ...edge.sources])];
    if (!existing.nccnGuideline && edge.nccnGuideline)
      existing.nccnGuideline = edge.nccnGuideline;
    if (!existing.evidenceOrigin && edge.evidenceOrigin)
      existing.evidenceOrigin = edge.evidenceOrigin;
    if (!existing.drugSubtitle && edge.drugSubtitle)
      existing.drugSubtitle = edge.drugSubtitle;
  }

  return Array.from(merged.values()).sort((a, b) => {
    const aRank = EVIDENCE_LEVELS[a.bestEvidenceLevel ?? ""]?.rank ?? 0;
    const bRank = EVIDENCE_LEVELS[b.bestEvidenceLevel ?? ""]?.rank ?? 0;
    const diff = bRank - aRank;
    return diff !== 0 ? diff : b.evidenceCount - a.evidenceCount;
  });
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function PharmacogenomicsOverview({
  relations,
  edges,
  geneSymbol,
  className,
}: PharmacogenomicsOverviewProps) {
  const [originFilter, setOriginFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortMode, setSortMode] = useState("level-desc");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pgxEdges = useMemo(
    () => extractPgxEdges(relations, edges),
    [relations, edges],
  );

  const originOptions = useMemo(() => {
    const origins = new Set<string>();
    pgxEdges.forEach((d) => {
      if (d.evidenceOrigin) origins.add(d.evidenceOrigin);
    });
    return [{ value: "all", label: "All" }].concat(
      Array.from(origins)
        .sort()
        .map((o) => ({
          value: o,
          label:
            ORIGIN_LABELS[o]?.label ??
            o.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        })),
    );
  }, [pgxEdges]);

  const levelOptions = useMemo(() => {
    const levels = new Set<string>();
    pgxEdges.forEach((d) => {
      if (d.bestEvidenceLevel) levels.add(d.bestEvidenceLevel);
    });
    return [{ value: "all", label: "All" }].concat(
      Array.from(levels)
        .sort()
        .map((l) => ({
          value: l,
          label: EVIDENCE_LEVELS[l]?.label ?? `Level ${l}`,
        })),
    );
  }, [pgxEdges]);

  const dimensions = useMemo<DimensionConfig[]>(
    () => [
      ...(originOptions.length > 2
        ? [
            {
              label: "Evidence type",
              value: originFilter,
              onChange: setOriginFilter,
              options: originOptions,
            },
          ]
        : []),
      ...(levelOptions.length > 2
        ? [
            {
              label: "Min level",
              value: levelFilter,
              onChange: setLevelFilter,
              options: levelOptions,
            },
          ]
        : []),
      {
        label: "Sort",
        value: sortMode,
        onChange: setSortMode,
        options: [
          { value: "level-desc", label: "Evidence" },
          { value: "alpha", label: "A-Z" },
        ],
        presentation: "segmented" as const,
      },
    ],
    [originFilter, originOptions, levelFilter, levelOptions, sortMode],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pgxEdges.filter((d) => {
      if (originFilter !== "all" && d.evidenceOrigin !== originFilter)
        return false;
      if (levelFilter !== "all") {
        const minRank = EVIDENCE_LEVELS[levelFilter]?.rank ?? 0;
        const dRank = EVIDENCE_LEVELS[d.bestEvidenceLevel ?? ""]?.rank ?? 0;
        if (dRank < minRank) return false;
      }
      if (query.length > 0) {
        const matches =
          d.drugName.toLowerCase().includes(query) ||
          d.cancerTypes.some((ct) => ct.toLowerCase().includes(query)) ||
          d.variantNames.some((v) => v.toLowerCase().includes(query));
        if (!matches) return false;
      }
      return true;
    });
  }, [pgxEdges, search, originFilter, levelFilter]);

  const sorted = useMemo(() => {
    const items = [...filtered];
    if (sortMode === "alpha")
      return items.sort((a, b) => a.drugName.localeCompare(b.drugName));
    return items; // already sorted by evidence level
  }, [filtered, sortMode]);

  useEffect(() => {
    if (sorted.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !sorted.some((d) => d.id === selectedId)) {
      setSelectedId(sorted[0].id);
    }
  }, [sorted, selectedId]);

  const selected = useMemo(
    () => sorted.find((d) => d.id === selectedId) ?? sorted[0] ?? null,
    [sorted, selectedId],
  );

  if (!pgxEdges.length) {
    return (
      <NoDataState
        categoryName="Pharmacogenomics"
        description={`No pharmacogenomic associations are available for ${geneSymbol ?? "this gene"}.`}
      />
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Card className={cn("border border-border py-0 gap-0", className)}>
        <CardHeader className="border-b border-border px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-semibold text-foreground">
                Pharmacogenomics
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                {filtered.length === pgxEdges.length
                  ? `${pgxEdges.length} drug-response associations`
                  : `${filtered.length} of ${pgxEdges.length} associations`}{" "}
                for {geneSymbol ?? "this gene"}
              </div>
            </div>
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder="Search drugs, variants..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-b border-border bg-muted/40">
            <ScopeBar dimensions={dimensions} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
            {/* ── Drug List ── */}
            <div className="border-b border-border lg:border-b-0 lg:border-r border-r-border">
              <div className="max-h-[600px] overflow-y-auto">
                {sorted.length === 0 && (
                  <div className="px-5 py-8 text-xs text-muted-foreground text-center">
                    No associations match your filters.
                  </div>
                )}
                {sorted.map((d) => {
                  const isSelected = d.id === selectedId;
                  const level = EVIDENCE_LEVELS[d.bestEvidenceLevel ?? ""];

                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedId(d.id)}
                      className={cn(
                        "w-full px-5 py-2.5 text-left transition-colors",
                        "border-b border-border/60",
                        "hover:bg-accent/50",
                        isSelected && "bg-accent/70",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-foreground leading-snug line-clamp-1">
                            {d.drugName}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {level && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full shrink-0",
                                    level.color,
                                  )}
                                />
                                {level.label}
                              </span>
                            )}
                            {d.variantNames.length > 0 && (
                              <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                                {d.variantNames[0]}
                                {d.variantNames.length > 1 &&
                                  ` +${d.variantNames.length - 1}`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {d.evidenceOrigin && (
                            <span className="text-[10px] text-muted-foreground">
                              {ORIGIN_LABELS[d.evidenceOrigin]?.label ??
                                d.evidenceOrigin}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Detail Panel ── */}
            <div>
              <div className="px-5 py-1.5 border-b border-border bg-muted/60">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Details
                </span>
              </div>
              <div className="px-5 py-5 max-h-[600px] overflow-y-auto">
                {!selected && (
                  <div className="text-xs text-muted-foreground">
                    Select a drug to view details.
                  </div>
                )}

                {selected && (
                  <div className="space-y-5">
                    {/* ─ Title ─ */}
                    <div className="space-y-2">
                      <h3 className="text-[15px] font-semibold text-foreground leading-snug">
                        {selected.drugName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {selected.bestEvidenceLevel &&
                          EVIDENCE_LEVELS[selected.bestEvidenceLevel] && (
                            <Tip
                              content={
                                EVIDENCE_LEVELS[selected.bestEvidenceLevel].tip
                              }
                            >
                              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span
                                  className={cn(
                                    "h-2 w-2 rounded-full shrink-0",
                                    EVIDENCE_LEVELS[selected.bestEvidenceLevel]
                                      .color,
                                  )}
                                />
                                {
                                  EVIDENCE_LEVELS[selected.bestEvidenceLevel]
                                    .label
                                }
                              </span>
                            </Tip>
                          )}
                        {selected.evidenceOrigin &&
                          ORIGIN_LABELS[selected.evidenceOrigin] && (
                            <Tip
                              content={
                                ORIGIN_LABELS[selected.evidenceOrigin].tip
                              }
                            >
                              <span className="text-xs text-muted-foreground">
                                {ORIGIN_LABELS[selected.evidenceOrigin].label}
                              </span>
                            </Tip>
                          )}
                      </div>
                    </div>

                    {/* ─ Key metrics ─ */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {selected.evidenceCount > 0 && (
                        <div>
                          <span className="text-[11px] text-muted-foreground">
                            Evidence records
                          </span>
                          <div className="text-sm font-semibold text-foreground tabular-nums">
                            {selected.evidenceCount}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ─ Drug description ─ */}
                    {selected.drugSubtitle && (
                      <p className="text-[13px] text-muted-foreground leading-relaxed">
                        {selected.drugSubtitle}
                      </p>
                    )}

                    {/* ─ Variants ─ */}
                    {selected.variantNames.length > 0 && (
                      <div className="space-y-1.5">
                        <Tip content="Specific genetic variants or molecular profiles associated with altered drug response.">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            Associated variants
                          </span>
                        </Tip>
                        <div className="flex flex-wrap gap-1">
                          {selected.variantNames.map((v) => (
                            <span
                              key={v}
                              className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-[11px] text-foreground font-mono"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                        {selected.hgvsExpressions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selected.hgvsExpressions.slice(0, 5).map((h) => (
                              <span
                                key={h}
                                className="inline-flex items-center rounded bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground font-mono"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ─ Cancer types ─ */}
                    {selected.cancerTypes.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Cancer types
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selected.cancerTypes.map((ct) => (
                            <span
                              key={ct}
                              className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {ct}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─ Evidence statements ─ */}
                    {selected.evidenceStatements.length > 0 && (
                      <div className="space-y-2">
                        <Tip content="Expert-curated evidence statements describing how this gene affects drug response.">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            Evidence
                          </span>
                        </Tip>
                        <div className="space-y-2">
                          {selected.evidenceStatements
                            .slice(0, 3)
                            .map((stmt, i) => (
                              <p
                                key={i}
                                className="text-[12px] text-muted-foreground leading-relaxed pl-3 border-l-2 border-border"
                              >
                                {stmt.length > 300
                                  ? `${stmt.slice(0, 300)}...`
                                  : stmt}
                              </p>
                            ))}
                          {selected.evidenceStatements.length > 3 && (
                            <p className="text-[11px] text-muted-foreground">
                              +{selected.evidenceStatements.length - 3} more
                              evidence statements
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ─ NCCN guideline ─ */}
                    {selected.nccnGuideline && (
                      <div className="space-y-1">
                        <Tip content="NCCN (National Comprehensive Cancer Network) clinical practice guideline referenced for this drug-gene pair.">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            NCCN guideline
                          </span>
                        </Tip>
                        <p className="text-[13px] text-foreground">
                          {selected.nccnGuideline}
                        </p>
                      </div>
                    )}

                    {/* ─ Sources ─ */}
                    {selected.sources.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Data sources
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selected.sources.map((src) => (
                            <span
                              key={src}
                              className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {src}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─ Links ─ */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border/60">
                      {selected.pubmedIds.slice(0, 3).map((pmid) => (
                        <ExternalLink
                          key={pmid}
                          href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`}
                          className="text-xs text-primary hover:underline"
                        >
                          PubMed {pmid}
                        </ExternalLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
