"use client";

import { cn } from "@infra/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { ConfidenceDots } from "@shared/components/ui/confidence-dots";
import { ScopeBar } from "@shared/components/ui/data-surface/scope-bar";
import type { DimensionConfig } from "@shared/components/ui/data-surface/types";
import { NoDataState } from "@shared/components/ui/error-states";
import { ExternalLink } from "@shared/components/ui/external-link";
import { Input } from "@shared/components/ui/input";
import { ScoreBar } from "@shared/components/ui/score-bar";
import { Tip } from "@shared/components/ui/tip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import { ChevronDown, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DiseasePortfolioOverviewProps {
  relations?: unknown;
  edges?: unknown;
  geneId?: string;
  geneSymbol?: string | null;
  className?: string;
}

type DiseaseEdge = {
  id: string;
  label: string;
  description: string | null;
  otScore: number | null;
  evidenceCount: number | null;
  causalityLevel: string | null;
  confidenceClass: string | null;
  sources: string[];
  modeOfInheritance: string | null;
  clingenClassification: string | null;
  genccClassification: string | null;
  civicEvidenceType: string | null;
  pubmedIds: string[];
  isCancer: boolean;
  isRare: boolean;
  primaryAnatomicalSystems: string[];
  causalGeneCount: number | null;
  associatedGeneCount: number | null;
  drugCount: number | null;
  maxTrialPhase: number | null;
  synonyms: string[];
};

// ---------------------------------------------------------------------------
// Human-readable lookups
// ---------------------------------------------------------------------------

const LINK_STRENGTH: Record<
  string,
  { label: string; tip: string; dot: string }
> = {
  causal: {
    label: "Causal",
    tip: "This gene is an established cause of this disease, confirmed by expert review (e.g. ClinGen, OMIM).",
    dot: "bg-emerald-500",
  },
  implicated: {
    label: "Implicated",
    tip: "Functional or clinical evidence links this gene to this disease (e.g. Orphanet, CIViC, PharmGKB), but not yet classified as a confirmed cause.",
    dot: "bg-amber-500",
  },
  associated: {
    label: "Associated",
    tip: "A statistical association was found in large-scale studies (e.g. GWAS), but no direct causal mechanism has been confirmed.",
    dot: "bg-blue-500",
  },
};

const CONFIDENCE: Record<string, { label: string; tip: string; dots: number }> =
  {
    high: {
      label: "High confidence",
      tip: "Multiple independent sources confirm this link with high confidence.",
      dots: 3,
    },
    medium: {
      label: "Moderate confidence",
      tip: "Supported by some evidence, but not yet confirmed by multiple high-quality sources.",
      dots: 2,
    },
    low: {
      label: "Low confidence",
      tip: "Based on limited evidence. Requires further validation.",
      dots: 1,
    },
  };

const VALIDITY_LABELS: Record<string, string> = {
  Definitive: "Confirmed cause",
  Strong: "Strong evidence for causality",
  Moderate: "Moderate evidence for causality",
  Limited: "Limited evidence",
  Disputed: "Disputed",
  Refuted: "Refuted",
  "No Known Disease Relationship": "No known relationship",
};

const INHERITANCE_LABELS: Record<string, string> = {
  AD: "Autosomal dominant",
  AR: "Autosomal recessive",
  XL: "X-linked",
  XLR: "X-linked recessive",
  XLD: "X-linked dominant",
  Mi: "Mitochondrial",
  Mu: "Multigenic / multifactorial",
  DD: "Digenic",
  So: "Somatic",
  SP: "Somatic + germline mosaicism",
  IC: "Isolated cases",
};

const SYSTEM_LABELS: Record<string, string> = {
  integumentary: "Skin & Tissue",
  oncology: "Oncology",
  reproductive_breast: "Breast / Reproductive",
  reproductive_female: "Female Reproductive",
  reproductive_male: "Male Reproductive",
  nervous: "Neurology",
  cardiovascular: "Heart & Circulation",
  respiratory: "Respiratory",
  digestive: "Digestive",
  endocrine: "Endocrine",
  hematologic: "Blood",
  immune: "Immune System",
  musculoskeletal: "Muscle & Bone",
  renal_urinary: "Kidney & Urinary",
  ophthalmic: "Eye",
  psychiatric: "Mental Health",
  dermatologic: "Skin",
  metabolic: "Metabolic",
  infectious: "Infectious",
  rare: "Rare Disease",
};

function systemLabel(raw: string): string {
  return (
    SYSTEM_LABELS[raw] ??
    raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function inheritanceLabel(raw: string): string {
  return INHERITANCE_LABELS[raw] ?? raw;
}

function validityLabel(raw: string): string {
  return VALIDITY_LABELS[raw] ?? raw;
}

function trialPhaseLabel(phase: number): string {
  if (phase >= 4) return "Approved";
  if (phase >= 3) return "Phase III";
  if (phase >= 2) return "Phase II";
  if (phase >= 1) return "Phase I";
  return "Preclinical";
}

// ---------------------------------------------------------------------------
// Progressive rendering
// ---------------------------------------------------------------------------

const PAGE_SIZE = 100;

// ---------------------------------------------------------------------------
// Small UI pieces
// ---------------------------------------------------------------------------

function formatScore(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—";
  return value.toFixed(2);
}

// ---------------------------------------------------------------------------
// Data extraction
// ---------------------------------------------------------------------------

function extractDiseaseEdges(
  relations: unknown,
  edges?: unknown,
): DiseaseEdge[] {
  const source = relations ?? edges;
  if (!source || typeof source !== "object") return [];

  let rows: any[] = [];
  const record = source as Record<string, unknown>;
  const byType =
    record.GENE_ASSOCIATED_WITH_DISEASE ??
    record.ASSOCIATED_WITH_DISEASE ??
    record.gene_associated_with_disease;

  if (byType && typeof byType === "object") {
    const typed = byType as Record<string, unknown>;
    if (Array.isArray(typed.rows)) rows = typed.rows;
    else if (Array.isArray(byType)) rows = byType as any[];
  }

  if (rows.length === 0 && Array.isArray(source)) rows = source;

  return rows
    .map((row: any): DiseaseEdge | null => {
      const neighbor = row?.neighbor ?? row?.target ?? {};
      const link = row?.link ?? row?.edge ?? {};
      const props = link?.props ?? link ?? {};
      const id = neighbor?.id ?? row?.neighbor_id ?? row?.id;
      if (!id) return null;

      return {
        id: String(id),
        label: String(
          neighbor?.disease_name ??
            neighbor?.name ??
            neighbor?.label ??
            "Unknown disease",
        ),
        description:
          typeof neighbor?.description === "string"
            ? neighbor.description
            : null,
        otScore: typeof props.ot_score === "number" ? props.ot_score : null,
        evidenceCount:
          typeof props.evidence_count === "number"
            ? props.evidence_count
            : null,
        causalityLevel:
          typeof props.validity_tier === "string"
            ? props.validity_tier.replace(/\b\w/g, (c: string) =>
                c.toUpperCase(),
              )
            : null,
        confidenceClass: props.confidence_class ?? null,
        sources: Array.isArray(props.sources) ? props.sources : [],
        modeOfInheritance: props.mode_of_inheritance ?? null,
        clingenClassification: props.clingen_classification ?? null,
        genccClassification: props.gencc_best_classification ?? null,
        civicEvidenceType: props.civic_evidence_type ?? null,
        pubmedIds: Array.isArray(props.pubmed_ids) ? props.pubmed_ids : [],
        isCancer: neighbor?.is_cancer === true,
        isRare: neighbor?.is_rare_disease === true,
        primaryAnatomicalSystems: Array.isArray(
          neighbor?.primary_anatomical_systems,
        )
          ? neighbor.primary_anatomical_systems
          : [],
        causalGeneCount:
          typeof neighbor?.causal_gene_count === "number"
            ? neighbor.causal_gene_count
            : null,
        associatedGeneCount:
          typeof neighbor?.associated_gene_count === "number"
            ? neighbor.associated_gene_count
            : null,
        drugCount:
          typeof neighbor?.drug_count === "number" ? neighbor.drug_count : null,
        maxTrialPhase:
          typeof neighbor?.max_trial_phase === "number"
            ? neighbor.max_trial_phase
            : null,
        synonyms: Array.isArray(neighbor?.synonyms) ? neighbor.synonyms : [],
      };
    })
    .filter((d): d is DiseaseEdge => d !== null)
    .sort((a, b) => {
      const diff = (b.otScore ?? -1) - (a.otScore ?? -1);
      return diff !== 0 ? diff : a.label.localeCompare(b.label);
    });
}

function pickArea(systems: string[]): string {
  if (!systems.length) return "Other";
  if (systems.includes("oncology")) return "Oncology";
  return systemLabel(systems[0]);
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DiseasePortfolioOverview({
  relations,
  edges,
  geneId,
  geneSymbol,
  className,
}: DiseasePortfolioOverviewProps) {
  const [scoreFilter, setScoreFilter] = useState("all");
  const [linkFilter, setLinkFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [sortMode, setSortMode] = useState("score-desc");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const diseases = useMemo(
    () => extractDiseaseEdges(relations, edges),
    [relations, edges],
  );

  const areaOptions = useMemo(() => {
    const areas = new Set<string>();
    diseases.forEach((d) => areas.add(pickArea(d.primaryAnatomicalSystems)));
    return [{ value: "all", label: "All" }].concat(
      Array.from(areas)
        .sort()
        .map((a) => ({ value: a, label: a })),
    );
  }, [diseases]);

  const linkOptions = useMemo(() => {
    const levels = new Set<string>();
    diseases.forEach((d) => {
      if (d.causalityLevel) levels.add(d.causalityLevel);
    });
    return [{ value: "all", label: "All" }].concat(
      Array.from(levels)
        .sort()
        .map((l) => ({
          value: l,
          label: LINK_STRENGTH[l]?.label ?? l,
        })),
    );
  }, [diseases]);

  const dimensions = useMemo<DimensionConfig[]>(
    () => [
      {
        label: "Link type",
        value: linkFilter,
        onChange: setLinkFilter,
        options: linkOptions,
      },
      {
        label: "Body system",
        value: areaFilter,
        onChange: setAreaFilter,
        options: areaOptions,
      },
      {
        label: "Min score",
        value: scoreFilter,
        onChange: setScoreFilter,
        options: [
          { value: "all", label: "Any" },
          { value: "0.2", label: "0.2+" },
          { value: "0.4", label: "0.4+" },
          { value: "0.6", label: "0.6+" },
          { value: "0.8", label: "0.8+" },
        ],
      },
      {
        label: "Sort",
        value: sortMode,
        onChange: setSortMode,
        options: [
          { value: "score-desc", label: "Score" },
          { value: "evidence-desc", label: "Evidence" },
          { value: "alpha", label: "A-Z" },
        ],
        presentation: "segmented",
      },
    ],
    [linkFilter, linkOptions, areaFilter, areaOptions, scoreFilter, sortMode],
  );

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const minScore = scoreFilter === "all" ? null : parseFloat(scoreFilter);

    return diseases.filter((d) => {
      if (minScore !== null && (d.otScore ?? -1) < minScore) return false;
      if (linkFilter !== "all" && d.causalityLevel !== linkFilter) return false;
      if (
        areaFilter !== "all" &&
        pickArea(d.primaryAnatomicalSystems) !== areaFilter
      )
        return false;
      if (query.length > 0) {
        const matches =
          d.label.toLowerCase().includes(query) ||
          d.synonyms.some((s) => s.toLowerCase().includes(query)) ||
          d.description?.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [diseases, search, scoreFilter, linkFilter, areaFilter]);

  const sorted = useMemo(() => {
    const items = [...filtered];
    if (sortMode === "alpha")
      return items.sort((a, b) => a.label.localeCompare(b.label));
    if (sortMode === "evidence-desc") {
      return items.sort((a, b) => {
        const diff = (b.evidenceCount ?? -1) - (a.evidenceCount ?? -1);
        return diff !== 0 ? diff : a.label.localeCompare(b.label);
      });
    }
    return items.sort((a, b) => {
      const diff = (b.otScore ?? -1) - (a.otScore ?? -1);
      return diff !== 0 ? diff : a.label.localeCompare(b.label);
    });
  }, [filtered, sortMode]);

  // Slice for progressive rendering
  const visible = useMemo(
    () => sorted.slice(0, visibleCount),
    [sorted, visibleCount],
  );
  const hasMore = sorted.length > visibleCount;

  const grouped = useMemo(() => {
    const map = new Map<string, DiseaseEdge[]>();
    visible.forEach((d) => {
      const area = pickArea(d.primaryAnatomicalSystems);
      if (!map.has(area)) map.set(area, []);
      map.get(area)?.push(d);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [visible]);

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

  const showMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  if (!diseases.length) {
    return (
      <NoDataState
        categoryName="Disease Portfolio"
        description="No disease associations are available for this gene."
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
                Disease Portfolio
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                {filtered.length === diseases.length
                  ? `${diseases.length} associations`
                  : `${filtered.length} of ${diseases.length} associations`}{" "}
                for {geneSymbol ?? geneId}
              </div>
            </div>
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder="Search diseases..."
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
            {/* ── Disease List ── */}
            <div className="border-b border-border lg:border-b-0 lg:border-r border-r-border">
              <div className="max-h-[600px] overflow-y-auto">
                {grouped.length === 0 && (
                  <div className="px-5 py-8 text-xs text-muted-foreground text-center">
                    No diseases match your filters.
                  </div>
                )}
                {grouped.map(([area, items]) => (
                  <div key={area}>
                    <div className="px-5 py-1.5 border-b border-border bg-muted sticky top-0 z-10">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {area}
                        <span className="ml-1 text-muted-foreground/60">
                          {items.length}
                        </span>
                      </span>
                    </div>
                    {items.map((d) => {
                      const isSelected = d.id === selectedId;

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
                              <span className="text-[13px] font-medium text-foreground leading-snug line-clamp-2">
                                {d.label}
                              </span>
                            </div>
                            <ScoreBar value={d.otScore} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
                {hasMore && (
                  <button
                    type="button"
                    onClick={showMore}
                    className="w-full px-5 py-3 text-center text-xs text-primary hover:bg-accent/50 transition-colors flex items-center justify-center gap-1"
                  >
                    <ChevronDown className="h-3 w-3" />
                    Show more ({sorted.length - visibleCount} remaining)
                  </button>
                )}
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
                    Select a disease to view details.
                  </div>
                )}

                {selected && (
                  <div className="space-y-5">
                    {/* ─ Title ─ */}
                    <div className="space-y-2">
                      <h3 className="text-[15px] font-semibold text-foreground leading-snug">
                        {selected.label}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {selected.causalityLevel &&
                          LINK_STRENGTH[selected.causalityLevel] && (
                            <Tip
                              content={
                                LINK_STRENGTH[selected.causalityLevel].tip
                              }
                            >
                              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span
                                  className={cn(
                                    "h-2 w-2 rounded-full shrink-0",
                                    LINK_STRENGTH[selected.causalityLevel].dot,
                                  )}
                                />
                                {LINK_STRENGTH[selected.causalityLevel].label}
                              </span>
                            </Tip>
                          )}
                        {selected.confidenceClass &&
                          CONFIDENCE[selected.confidenceClass] && (
                            <Tip
                              content={CONFIDENCE[selected.confidenceClass].tip}
                            >
                              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <ConfidenceDots
                                  count={
                                    CONFIDENCE[selected.confidenceClass].dots
                                  }
                                />
                                {CONFIDENCE[selected.confidenceClass].label}
                              </span>
                            </Tip>
                          )}
                        {selected.isCancer && (
                          <span className="text-xs text-red-500/80">
                            Cancer
                          </span>
                        )}
                        {selected.isRare && (
                          <span className="text-xs text-violet-500/80">
                            Rare disease
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ─ Stats row ─ */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <div>
                        <Tip content="Overall association score from Open Targets (0–1). Higher means more and stronger evidence across all data types.">
                          <span className="text-[11px] text-muted-foreground">
                            Score
                          </span>
                        </Tip>
                        <div className="text-sm font-semibold text-foreground tabular-nums">
                          {formatScore(selected.otScore)}
                        </div>
                      </div>
                      <div>
                        <Tip content="Total number of individual evidence items supporting this gene–disease link across all databases.">
                          <span className="text-[11px] text-muted-foreground">
                            Evidence
                          </span>
                        </Tip>
                        <div className="text-sm font-semibold text-foreground tabular-nums">
                          {selected.evidenceCount?.toLocaleString() ?? "—"}
                        </div>
                      </div>
                      {selected.drugCount !== null &&
                        selected.drugCount > 0 && (
                          <div>
                            <Tip content="Number of drugs that target this gene and are used or tested for this disease.">
                              <span className="text-[11px] text-muted-foreground">
                                Drugs
                              </span>
                            </Tip>
                            <div className="text-sm font-semibold text-foreground tabular-nums">
                              {selected.drugCount.toLocaleString()}
                              {selected.maxTrialPhase !== null && (
                                <span className="text-[11px] text-muted-foreground font-normal ml-1">
                                  {trialPhaseLabel(selected.maxTrialPhase)}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      {selected.causalGeneCount !== null &&
                        selected.causalGeneCount > 0 && (
                          <div>
                            <Tip content="Number of genes with confirmed causal links to this disease.">
                              <span className="text-[11px] text-muted-foreground">
                                Causal genes
                              </span>
                            </Tip>
                            <div className="text-sm font-semibold text-foreground tabular-nums">
                              {selected.causalGeneCount.toLocaleString()}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* ─ Description ─ */}
                    {selected.description && (
                      <p className="text-[13px] text-muted-foreground leading-relaxed">
                        {selected.description}
                      </p>
                    )}

                    {/* ─ Gene–disease validity ─ */}
                    {(selected.clingenClassification ||
                      selected.genccClassification ||
                      selected.modeOfInheritance ||
                      selected.civicEvidenceType) && (
                      <div className="space-y-2">
                        <Tip content="Expert classifications of how strongly this gene is linked to this disease and how the disease is inherited.">
                          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                            Gene–disease validity
                          </span>
                        </Tip>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          {selected.clingenClassification && (
                            <div>
                              <Tip content="ClinGen is an NIH-funded expert panel that curates gene–disease relationships. Their classifications range from Confirmed cause to Refuted.">
                                <span className="text-[11px] text-muted-foreground">
                                  ClinGen panel
                                </span>
                              </Tip>
                              <div className="text-[13px] text-foreground">
                                {validityLabel(selected.clingenClassification)}
                              </div>
                            </div>
                          )}
                          {selected.genccClassification && (
                            <div>
                              <Tip content="GenCC aggregates gene–disease classifications from multiple international curation efforts.">
                                <span className="text-[11px] text-muted-foreground">
                                  GenCC consensus
                                </span>
                              </Tip>
                              <div className="text-[13px] text-foreground">
                                {validityLabel(selected.genccClassification)}
                              </div>
                            </div>
                          )}
                          {selected.modeOfInheritance && (
                            <div>
                              <Tip content="How this disease is passed from parents to children. For example, autosomal dominant means one copy of the altered gene is sufficient to cause disease.">
                                <span className="text-[11px] text-muted-foreground">
                                  Inheritance
                                </span>
                              </Tip>
                              <div className="text-[13px] text-foreground">
                                {inheritanceLabel(selected.modeOfInheritance)}
                              </div>
                            </div>
                          )}
                          {selected.civicEvidenceType && (
                            <div>
                              <Tip content="CIViC provides community-curated clinical relevance annotations for this gene–disease link.">
                                <span className="text-[11px] text-muted-foreground">
                                  Clinical relevance
                                </span>
                              </Tip>
                              <div className="text-[13px] text-foreground">
                                {selected.civicEvidenceType}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ─ Data sources ─ */}
                    {selected.sources.length > 0 && (
                      <div className="space-y-1.5">
                        <Tip content="Databases that contributed evidence for this gene–disease association.">
                          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                            Data sources
                          </span>
                        </Tip>
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

                    {/* ─ Body systems ─ */}
                    {selected.primaryAnatomicalSystems.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                          Affected body systems
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selected.primaryAnatomicalSystems.map((sys) => (
                            <span
                              key={sys}
                              className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {systemLabel(sys)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─ Synonyms ─ */}
                    {selected.synonyms.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                          Also known as
                        </span>
                        <p className="text-[13px] text-muted-foreground leading-relaxed">
                          {selected.synonyms.slice(0, 6).join(", ")}
                          {selected.synonyms.length > 6 && (
                            <span className="text-[11px]">
                              {" "}
                              +{selected.synonyms.length - 6} more
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* ─ Links ─ */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border/60">
                      <ExternalLink
                        href={`https://platform.opentargets.org/disease/${encodeURIComponent(selected.id)}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Open Targets
                      </ExternalLink>
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
