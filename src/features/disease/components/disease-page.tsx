"use client";

import { cn } from "@infra/utils";
import { Badge } from "@shared/components/ui/badge";
import { DataSurface } from "@shared/components/ui/data-surface/data-surface";
import { EntityLink } from "@shared/components/ui/entity-link";
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
  GraphDisease,
} from "../types";

// ============================================================================
// Props
// ============================================================================

interface DiseasePageProps {
  disease: GraphDisease;
  counts?: EdgeCounts;
  relations?: EdgeRelations;
}

// ============================================================================
// Helpers
// ============================================================================

function fmtCount(n?: number): string {
  if (n == null) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function fmtBigNumber(n: number): string {
  if (n >= 1e9) return `~${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `~${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `~${(n / 1e3).toFixed(1)}k`;
  return n.toLocaleString();
}

function getRows(
  relations: EdgeRelations | undefined,
  type: string,
): EdgeRow[] {
  return relations?.[type]?.rows ?? [];
}

function ep<T = unknown>(row: EdgeRow, key: string): T | undefined {
  return row.link.props[key] as T | undefined;
}

function nb<T = unknown>(row: EdgeRow, key: string): T | undefined {
  return (row.neighbor as Record<string, unknown>)[key] as T | undefined;
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

// ============================================================================
// Lookup Maps
// ============================================================================

const AGE_OF_ONSET: Record<string, string> = {
  HP_0030674: "Neonatal",
  HP_0003623: "Neonatal",
  HP_0003593: "Infantile",
  HP_0011463: "Childhood",
  HP_0003621: "Juvenile",
  HP_0003581: "Adult",
  HP_0003584: "Late onset",
  HP_0034429: "Antenatal",
};

const FREQUENCY_LABEL: Record<string, string> = {
  HP_0040281: "Very frequent (>80%)",
  HP_0040282: "Frequent (30–79%)",
  HP_0040283: "Occasional (5–29%)",
  HP_0040284: "Very rare (<5%)",
};

const CONFIDENCE_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

// ============================================================================
// Shared Components
// ============================================================================

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

const CAUSALITY_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  implicated: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  associated: "bg-muted text-muted-foreground",
};

/** Map legacy "causal" from the API to "confirmed" for display */
function normalizeCausality(value: string): string {
  if (value.toLowerCase() === "causal") return "confirmed";
  return value;
}

function CausalityBadge({ value }: { value: string }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  const display = normalizeCausality(value);
  return (
    <span
      className={cn(
        "inline-flex px-1.5 py-0.5 rounded text-xs font-medium capitalize",
        CAUSALITY_COLORS[display] ?? CAUSALITY_COLORS.associated,
      )}
    >
      {display}
    </span>
  );
}

function PropRow({
  label,
  value,
  mono,
  hint,
}: {
  label: string;
  value: string;
  mono?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-[13px]">
      <dt className="text-muted-foreground shrink-0 inline-flex items-center">
        {label}
        {hint && <Hint text={hint} />}
      </dt>
      <dd className={cn("text-right", mono && "font-mono")}>{value}</dd>
    </div>
  );
}

// ============================================================================
// Profile Tab
// ============================================================================

function ProfileTab({ disease }: { disease: GraphDisease }) {
  const [showAllSynonyms, setShowAllSynonyms] = useState(false);

  const visibleSynonyms = showAllSynonyms
    ? disease.synonyms
    : disease.synonyms?.slice(0, 24);
  const hasMoreSynonyms = (disease.synonyms?.length ?? 0) > 24;

  // Header already shows: inheritance, anatomical systems, disorder_type,
  // cancer/rare flags, external IDs — so none of those appear here.
  const hasGenetics =
    disease.heritability_h2 != null ||
    disease.clingen_max_classification ||
    disease.gencc_max_classification ||
    (disease.omim_gene_count != null && disease.omim_gene_count > 0) ||
    disease.age_of_onset_hpo_term ||
    (disease.prs_count != null && disease.prs_count > 0);

  const hasEpidemiology =
    disease.point_prevalence_class ||
    disease.annual_incidence_class ||
    disease.birth_prevalence_class ||
    disease.worldwide_cases != null ||
    disease.sex_bias ||
    disease.has_geographic_variation;

  return (
    <div className="space-y-8">
      {/* Description */}
      {disease.description && (
        <p className="text-[13px] text-foreground leading-relaxed max-w-3xl">
          {disease.description}
        </p>
      )}

      {/* Genetics & Epidemiology */}
      {(hasGenetics || hasEpidemiology) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {hasGenetics && (
            <div>
              <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 inline-flex items-center">
                Genetics
                <Hint text="Heritability, gene curation status, and polygenic risk data" />
              </h3>
              <div className="rounded-lg border border-border bg-card p-5">
                <dl className="space-y-3">
                  {disease.heritability_h2 != null && (
                    <>
                      <PropRow
                        label="Heritability (h²)"
                        value={`${disease.heritability_h2.toFixed(2)}${
                          disease.heritability_se != null
                            ? ` ± ${disease.heritability_se.toFixed(2)}`
                            : ""
                        }`}
                        mono
                        hint="SNP-based heritability from LD score regression. Proportion of phenotypic variance explained by common SNPs. ≥0.5 = high, 0.2–0.5 = moderate."
                      />
                      {disease.heritability_confidence && (
                        <PropRow
                          label="h² confidence"
                          value={disease.heritability_confidence}
                        />
                      )}
                    </>
                  )}
                  {disease.clingen_max_classification && (
                    <PropRow
                      label="ClinGen"
                      value={`${disease.clingen_max_classification}${
                        disease.clingen_gene_count
                          ? ` (${disease.clingen_gene_count} genes)`
                          : ""
                      }`}
                      hint="Gold standard for Mendelian gene-disease validity. Definitive = highest confidence. Only ~6% of diseases have ClinGen curation."
                    />
                  )}
                  {disease.gencc_max_classification && (
                    <PropRow
                      label="GenCC"
                      value={`${disease.gencc_max_classification}${
                        disease.gencc_submitter_count
                          ? ` (${disease.gencc_submitter_count} submitters)`
                          : ""
                      }`}
                      hint="Aggregates assertions from ClinGen, OMIM, Orphanet, PanelApp. Broader coverage (~24%) than ClinGen alone."
                    />
                  )}
                  {disease.omim_gene_count != null &&
                    disease.omim_gene_count > 0 && (
                      <PropRow
                        label="OMIM genes"
                        value={String(disease.omim_gene_count)}
                      />
                    )}
                  {disease.age_of_onset_hpo_term && (
                    <PropRow
                      label="Age of onset"
                      value={
                        AGE_OF_ONSET[disease.age_of_onset_hpo_term] ??
                        disease.age_of_onset_hpo_term
                      }
                      hint="HPO-coded typical age of onset from Orphanet"
                    />
                  )}
                  {disease.prs_count != null && disease.prs_count > 0 && (
                    <>
                      <PropRow
                        label="PRS models"
                        value={String(disease.prs_count)}
                        hint="Published polygenic risk scores in the PGS Catalog"
                      />
                      {disease.prs_best_auroc != null && (
                        <PropRow
                          label="Best AUROC"
                          value={disease.prs_best_auroc.toFixed(2)}
                          mono
                          hint="Best predictive accuracy across published PRS models. 0.5 = random, ≥0.8 = clinically actionable, 1.0 = perfect."
                        />
                      )}
                    </>
                  )}
                </dl>
              </div>
            </div>
          )}

          {hasEpidemiology && (
            <div>
              <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 inline-flex items-center">
                Epidemiology
                <Hint text="Prevalence, incidence, and demographic data from Orphanet" />
              </h3>
              <div className="rounded-lg border border-border bg-card p-5">
                <dl className="space-y-3">
                  {disease.point_prevalence_class && (
                    <PropRow
                      label="Point prevalence"
                      value={disease.point_prevalence_class}
                      hint="Orphanet prevalence band. >1/1000 = common. <1/1000000 = ultra-rare."
                    />
                  )}
                  {disease.annual_incidence_class && (
                    <PropRow
                      label="Annual incidence"
                      value={disease.annual_incidence_class}
                    />
                  )}
                  {disease.birth_prevalence_class && (
                    <PropRow
                      label="Birth prevalence"
                      value={disease.birth_prevalence_class}
                    />
                  )}
                  {disease.worldwide_cases != null && (
                    <PropRow
                      label="Worldwide cases"
                      value={fmtBigNumber(disease.worldwide_cases)}
                    />
                  )}
                  {disease.sex_bias && (
                    <PropRow
                      label="Sex bias"
                      value={disease.sex_bias.replace(/_/g, " ")}
                    />
                  )}
                  {disease.has_geographic_variation && (
                    <PropRow
                      label="Geographic variation"
                      value={
                        disease.prevalence_region_count
                          ? `${disease.prevalence_region_count} regions`
                          : "Yes"
                      }
                    />
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Key Phenotypes */}
      {disease.key_phenotypes?.length ? (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Key Phenotypes
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {disease.key_phenotypes.map((phenotype, i) => (
              <Badge key={i} variant="outline" className="text-xs font-normal">
                {phenotype}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {/* Synonyms */}
      {disease.synonyms?.length ? (
        <div>
          <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Also Known As
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {visibleSynonyms?.map((name, i) => (
              <Badge key={i} variant="outline" className="text-xs font-normal">
                {name}
              </Badge>
            ))}
            {hasMoreSynonyms && !showAllSynonyms && (
              <button
                onClick={() => setShowAllSynonyms(true)}
                className="text-xs text-primary hover:underline px-1"
              >
                +{(disease.synonyms?.length ?? 0) - 24} more
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ============================================================================
// Genes — GENE_ASSOCIATED_WITH_DISEASE
// ============================================================================

interface GeneRow {
  id: string;
  symbol: string;
  geneId: string;
  geneName: string;
  causality: string;
  otScore: number | null;
  gwasP: number | null;
  gwasStudies: number | null;
  confidence: string;
  sources: string[];
  evidenceCount: number;
}

function transformGenes(rows: EdgeRow[]): GeneRow[] {
  return rows
    .map((r, i) => ({
      id: `gene-${i}`,
      symbol: String(ep(r, "gene_symbol") ?? nb(r, "symbol") ?? ""),
      geneId: r.neighbor.id,
      geneName: String(nb(r, "name") ?? ""),
      causality: String(ep(r, "causality_level") ?? ""),
      otScore: ep(r, "ot_score") != null ? Number(ep(r, "ot_score")) : null,
      gwasP:
        ep(r, "gwas_best_p_value_mlog") != null
          ? Number(ep(r, "gwas_best_p_value_mlog"))
          : null,
      gwasStudies:
        ep(r, "gwas_n_studies") != null
          ? Number(ep(r, "gwas_n_studies"))
          : null,
      confidence: String(ep(r, "confidence_class") ?? ""),
      sources: ep<string[]>(r, "sources") ?? [],
      evidenceCount: Number(ep(r, "evidence_count") ?? 0),
    }))
    .sort((a, b) => (b.otScore ?? 0) - (a.otScore ?? 0));
}

const geneColumns: ColumnDef<GeneRow>[] = [
  {
    id: "symbol",
    accessorKey: "symbol",
    header: "Gene",
    enableSorting: true,
    cell: ({ row }) => {
      const link = (
        <Link
          href={`/hg38/gene/${row.original.geneId}/gene-level-annotation/summary`}
          className="text-primary hover:underline font-medium"
        >
          {row.original.symbol}
        </Link>
      );
      if (!row.original.geneName) return link;
      return (
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent>{row.original.geneName}</TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "causality",
    accessorKey: "causality",
    header: () => (
      <span className="inline-flex items-center">
        Causality
        <Hint text="'confirmed' = established Mendelian cause with curated human evidence. 'implicated' = functional/clinical evidence short of definitive. 'associated' = statistical only." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => <CausalityBadge value={row.original.causality} />,
  },
  {
    id: "otScore",
    accessorKey: "otScore",
    header: () => (
      <span className="inline-flex items-center">
        Score
        <Hint text="OpenTargets overall association score [0–1]. Harmonic sum of all evidence sources. ≥0.5 = strong integrated evidence. Reflects breadth, not just strength." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const v = row.original.otScore;
      if (v == null) return "—";
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${Math.min(v * 100, 100)}%` }}
            />
          </div>
          <span className="font-mono text-xs">{v.toFixed(2)}</span>
        </div>
      );
    },
  },
  {
    id: "gwasP",
    accessorKey: "gwasP",
    header: () => (
      <span className="inline-flex items-center">
        -log₁₀(P)
        <Hint text="Strongest GWAS signal for this gene-disease pair. ≥7.3 = genome-wide significant. ≥100 = extremely strong locus." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const v = row.original.gwasP;
      if (v == null) return "—";
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-mono text-[13px] cursor-help">
              {v.toFixed(1)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            p = 10⁻{v.toFixed(1)}
            {row.original.gwasStudies != null &&
              ` across ${row.original.gwasStudies} studies`}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "confidence",
    accessorKey: "confidence",
    header: "Confidence",
    enableSorting: true,
    cell: ({ row }) => <ConfidenceBadge value={row.original.confidence} />,
  },
  {
    id: "sources",
    accessorKey: "sources",
    header: "Sources",
    cell: ({ row }) => (
      <span className="text-[13px]">
        {row.original.sources.join(", ") || "—"}
      </span>
    ),
  },
  {
    id: "evidenceCount",
    accessorKey: "evidenceCount",
    header: () => (
      <span className="inline-flex items-center">
        Evidence
        <Hint text="Total evidence items across all stages. >100 = extremely well-studied pair." />
      </span>
    ),
    enableSorting: true,
  },
];

// ============================================================================
// Drugs — DRUG_INDICATED_FOR_DISEASE
// ============================================================================

interface DrugRow {
  id: string;
  drugId: string;
  drugName: string;
  drugType: string;
  phase: number | null;
  status: string;
  confidence: string;
  sources: string[];
  evidenceCount: number;
}

function transformDrugs(rows: EdgeRow[]): DrugRow[] {
  return rows
    .map((r, i) => ({
      id: `drug-${i}`,
      drugId: r.neighbor.id,
      drugName: String(nb(r, "name") ?? ep(r, "drug_name") ?? ""),
      drugType: String(r.neighbor.type ?? ""),
      phase:
        ep(r, "max_clinical_phase") != null
          ? Number(ep(r, "max_clinical_phase"))
          : null,
      status: String(ep(r, "ttd_clinical_status") ?? nb(r, "status") ?? ""),
      confidence: String(ep(r, "confidence_class") ?? ""),
      sources: ep<string[]>(r, "sources") ?? [],
      evidenceCount: Number(ep(r, "evidence_count") ?? 0),
    }))
    .sort((a, b) => {
      const phaseDiff = (b.phase ?? -1) - (a.phase ?? -1);
      if (phaseDiff !== 0) return phaseDiff;
      return (
        (CONFIDENCE_ORDER[a.confidence] ?? 9) -
        (CONFIDENCE_ORDER[b.confidence] ?? 9)
      );
    });
}

const drugColumns: ColumnDef<DrugRow>[] = [
  {
    id: "drugName",
    accessorKey: "drugName",
    header: "Drug",
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
    id: "drugType",
    accessorKey: "drugType",
    header: "Type",
    enableSorting: true,
    cell: ({ row }) => row.original.drugType || "—",
  },
  {
    id: "phase",
    accessorKey: "phase",
    header: () => (
      <span className="inline-flex items-center">
        Phase
        <Hint text="Highest clinical phase for this drug-disease pair. 4 = approved indication." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => phaseLabel(row.original.phase),
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => (
      <span className="inline-flex items-center">
        TTD Status
        <Hint text="Clinical status from Therapeutic Target Database. Finer-grained stage than clinical phase." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.status || "—",
  },
  {
    id: "confidence",
    accessorKey: "confidence",
    header: "Confidence",
    enableSorting: true,
    cell: ({ row }) => <ConfidenceBadge value={row.original.confidence} />,
  },
  {
    id: "sources",
    accessorKey: "sources",
    header: "Sources",
    cell: ({ row }) => (
      <span className="text-[13px]">
        {row.original.sources.join(", ") || "—"}
      </span>
    ),
  },
  {
    id: "evidenceCount",
    accessorKey: "evidenceCount",
    header: "Evidence",
    enableSorting: true,
  },
];

// ============================================================================
// Variants — VARIANT_ASSOCIATED_WITH_TRAIT
// ============================================================================

interface VariantRow {
  id: string;
  variantId: string;
  rsId: string;
  geneSymbol: string;
  pValueMlog: number | null;
  orBeta: number | null;
  consequence: string;
  clinvar: string;
  confidence: string;
  source: string;
}

function transformVariants(rows: EdgeRow[]): VariantRow[] {
  return rows
    .map((r, i) => ({
      id: `var-${i}`,
      variantId: r.neighbor.id,
      rsId: String(nb(r, "rsID") ?? ""),
      geneSymbol: String(ep(r, "gene_symbol") ?? ""),
      pValueMlog:
        ep(r, "p_value_mlog") != null ? Number(ep(r, "p_value_mlog")) : null,
      orBeta: ep(r, "or_beta") != null ? Number(ep(r, "or_beta")) : null,
      consequence: String(nb(r, "consequence") ?? ""),
      clinvar: String(nb(r, "ClinVar") ?? ""),
      confidence: String(ep(r, "confidence_class") ?? ""),
      source: String(ep(r, "source") ?? ""),
    }))
    .sort((a, b) => (b.pValueMlog ?? 0) - (a.pValueMlog ?? 0));
}

const variantColumns: ColumnDef<VariantRow>[] = [
  {
    id: "variant",
    accessorKey: "variantId",
    header: "Variant",
    enableSorting: true,
    filterFn: (row, _columnId, filterValue: string) => {
      const q = filterValue.toLowerCase();
      return (
        row.original.variantId.toLowerCase().includes(q) ||
        row.original.rsId.toLowerCase().includes(q)
      );
    },
    cell: ({ row }) => {
      const display = row.original.rsId || row.original.variantId;
      return (
        <Link
          href={`/hg38/variant/${encodeURIComponent(row.original.variantId)}`}
          className="text-primary hover:underline font-mono text-[13px]"
        >
          {display}
        </Link>
      );
    },
  },
  {
    id: "geneSymbol",
    accessorKey: "geneSymbol",
    header: "Gene",
    enableSorting: true,
    cell: ({ row }) => {
      const gene = row.original.geneSymbol;
      if (!gene) return <span className="font-medium">—</span>;
      return (
        <EntityLink
          type="genes"
          id={gene}
          stopPropagation
          className="font-medium text-primary hover:underline"
        >
          {gene}
        </EntityLink>
      );
    },
  },
  {
    id: "pValueMlog",
    accessorKey: "pValueMlog",
    header: () => (
      <span className="inline-flex items-center">
        -log₁₀(P)
        <Hint text="-log₁₀ of GWAS association p-value. ≥7.3 = genome-wide significant." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const v = row.original.pValueMlog;
      if (v == null) return "—";
      return <span className="font-mono text-[13px]">{v.toFixed(1)}</span>;
    },
  },
  {
    id: "orBeta",
    accessorKey: "orBeta",
    header: () => (
      <span className="inline-flex items-center">
        OR / Beta
        <Hint text="Odds ratio or effect size of the variant-trait association" />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const v = row.original.orBeta;
      if (v == null) return "—";
      return <span className="font-mono text-[13px]">{v.toFixed(3)}</span>;
    },
  },
  {
    id: "consequence",
    accessorKey: "consequence",
    header: "Consequence",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.consequence
        ? row.original.consequence.replace(/_/g, " ")
        : "—",
  },
  {
    id: "clinvar",
    accessorKey: "clinvar",
    header: "ClinVar",
    enableSorting: true,
    cell: ({ row }) => row.original.clinvar || "—",
  },
  {
    id: "confidence",
    accessorKey: "confidence",
    header: "Confidence",
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
// Phenotypes — DISEASE_HAS_PHENOTYPE
// ============================================================================

interface PhenotypeRow {
  id: string;
  name: string;
  frequency: string;
  evidenceCode: string;
  source: string;
  evidenceCount: number;
}

function transformPhenotypes(rows: EdgeRow[]): PhenotypeRow[] {
  return rows
    .map((r, i) => ({
      id: `pheno-${i}`,
      name: String(ep(r, "phenotype_name") ?? nb(r, "name") ?? ""),
      frequency: String(ep(r, "phenotype_frequency") ?? ""),
      evidenceCode: String(ep(r, "evidence_code") ?? ""),
      source: String(ep(r, "source") ?? ""),
      evidenceCount: Number(ep(r, "evidence_count") ?? 0),
    }))
    .sort((a, b) => b.evidenceCount - a.evidenceCount);
}

const phenotypeColumns: ColumnDef<PhenotypeRow>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Phenotype",
    enableSorting: true,
  },
  {
    id: "frequency",
    accessorKey: "frequency",
    header: () => (
      <span className="inline-flex items-center">
        Frequency
        <Hint text="Reported frequency. May be HPO term, fraction, or percentage. Very frequent (>80%), Frequent (30–79%), Occasional (5–29%), Very rare (<5%)." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const v = row.original.frequency;
      if (!v) return "—";
      return FREQUENCY_LABEL[v] ?? v;
    },
  },
  {
    id: "evidenceCode",
    accessorKey: "evidenceCode",
    header: () => (
      <span className="inline-flex items-center">
        Evidence Code
        <Hint text="PCS = published clinical study (strongest). TAS = traceable author statement. ICE = individual clinical experience. IEA = inferred electronic annotation (weakest)." />
      </span>
    ),
    enableSorting: true,
    cell: ({ row }) => row.original.evidenceCode || "—",
  },
  {
    id: "evidenceCount",
    accessorKey: "evidenceCount",
    header: "Evidence",
    enableSorting: true,
  },
];

// ============================================================================
// Related Diseases — DISEASE_SUBCLASS_OF_DISEASE
// ============================================================================

interface RelatedDiseaseRow {
  id: string;
  diseaseId: string;
  diseaseName: string;
  relationship: "Parent" | "Child";
  isCancer: boolean;
  isRare: boolean;
  causalGenes: number | null;
  drugs: number | null;
}

function transformRelatedDiseases(
  rows: EdgeRow[],
  currentDiseaseId: string,
): RelatedDiseaseRow[] {
  return rows
    .map((r, i) => {
      const isParent = r.link.from.id === currentDiseaseId;
      return {
        id: `rel-${i}`,
        diseaseId: r.neighbor.id,
        diseaseName: String(nb(r, "name") ?? ""),
        relationship: (isParent ? "Parent" : "Child") as "Parent" | "Child",
        isCancer: Boolean(nb(r, "is_cancer")),
        isRare: Boolean(nb(r, "is_rare")),
        causalGenes:
          nb(r, "causal_genes") != null ? Number(nb(r, "causal_genes")) : null,
        drugs: nb(r, "drugs") != null ? Number(nb(r, "drugs")) : null,
      };
    })
    .sort((a, b) => {
      if (a.relationship !== b.relationship)
        return a.relationship === "Parent" ? -1 : 1;
      return 0;
    });
}

const relatedDiseaseColumns: ColumnDef<RelatedDiseaseRow>[] = [
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
        {row.original.diseaseName || row.original.diseaseId}
      </Link>
    ),
  },
  {
    id: "relationship",
    accessorKey: "relationship",
    header: "Relationship",
    enableSorting: true,
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.relationship === "Parent" ? "secondary" : "outline"
        }
        className="text-xs"
      >
        {row.original.relationship}
      </Badge>
    ),
  },
  {
    id: "causalGenes",
    accessorKey: "causalGenes",
    header: "Confirmed Genes",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.causalGenes != null
        ? fmtCount(row.original.causalGenes)
        : "—",
  },
  {
    id: "drugs",
    accessorKey: "drugs",
    header: "Drugs",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.drugs != null ? fmtCount(row.original.drugs) : "—",
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
];

// ============================================================================
// Main Component
// ============================================================================

export function DiseasePage({ disease, counts, relations }: DiseasePageProps) {
  const [activeTab, setActiveTab] = useState("profile");

  const genes = useMemo(
    () => transformGenes(getRows(relations, "GENE_ASSOCIATED_WITH_DISEASE")),
    [relations],
  );
  const drugs = useMemo(
    () => transformDrugs(getRows(relations, "DRUG_INDICATED_FOR_DISEASE")),
    [relations],
  );
  const variants = useMemo(
    () =>
      transformVariants(getRows(relations, "VARIANT_ASSOCIATED_WITH_TRAIT")),
    [relations],
  );
  const phenotypes = useMemo(
    () => transformPhenotypes(getRows(relations, "DISEASE_HAS_PHENOTYPE")),
    [relations],
  );
  const relatedDiseases = useMemo(
    () =>
      transformRelatedDiseases(
        getRows(relations, "DISEASE_SUBCLASS_OF_DISEASE"),
        disease.id,
      ),
    [relations, disease.id],
  );

  const tabs = [
    { value: "profile", label: "Profile", count: undefined },
    {
      value: "genes",
      label: "Genes",
      count: counts?.GENE_ASSOCIATED_WITH_DISEASE,
    },
    {
      value: "drugs",
      label: "Drugs",
      count: counts?.DRUG_INDICATED_FOR_DISEASE,
    },
    {
      value: "variants",
      label: "Variants",
      count: counts?.VARIANT_ASSOCIATED_WITH_TRAIT,
    },
    {
      value: "phenotypes",
      label: "Phenotypes",
      count: counts?.DISEASE_HAS_PHENOTYPE,
    },
    {
      value: "related",
      label: "Related",
      count: counts?.DISEASE_SUBCLASS_OF_DISEASE,
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
      <div className="border-b border-border overflow-x-auto">
        <TabsList variant="line" className="w-full justify-start p-0 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-[13px] py-2.5 px-3"
            >
              {tab.label}
              {(tab.count ?? 0) > 0 && (
                <span className="ml-1 text-xs text-muted-foreground font-normal tabular-nums">
                  {fmtCount(tab.count)}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="profile" className="pt-6">
        <ProfileTab disease={disease} />
      </TabsContent>

      <TabsContent value="genes" className="pt-6">
        <DataSurface
          columns={geneColumns}
          data={genes}
          title="Associated Genes"
          subtitle={
            counts?.GENE_ASSOCIATED_WITH_DISEASE &&
            counts.GENE_ASSOCIATED_WITH_DISEASE > 200
              ? `Showing top 200 of ${fmtCount(counts.GENE_ASSOCIATED_WITH_DISEASE)} — sorted by evidence score`
              : "Sorted by OpenTargets evidence score"
          }
          searchPlaceholder="Search genes..."
          searchColumn="symbol"
          exportable
          exportFilename={`${disease.id}-genes`}
          defaultPageSize={25}
          emptyMessage="No gene association data available"
        />
      </TabsContent>

      <TabsContent value="drugs" className="pt-6">
        <DataSurface
          columns={drugColumns}
          data={drugs}
          title="Drugs"
          subtitle={
            counts?.DRUG_INDICATED_FOR_DISEASE &&
            counts.DRUG_INDICATED_FOR_DISEASE > 200
              ? `Showing 200 of ${fmtCount(counts.DRUG_INDICATED_FOR_DISEASE)} — approved first`
              : "Sorted by clinical phase, approved first"
          }
          searchPlaceholder="Search drugs..."
          searchColumn="drugName"
          exportable
          exportFilename={`${disease.id}-drugs`}
          defaultPageSize={25}
          emptyMessage="No drug data available"
        />
      </TabsContent>

      <TabsContent value="variants" className="pt-6">
        <DataSurface
          columns={variantColumns}
          data={variants}
          title="GWAS Variants"
          subtitle={
            counts?.VARIANT_ASSOCIATED_WITH_TRAIT &&
            counts.VARIANT_ASSOCIATED_WITH_TRAIT > 200
              ? `Showing top 200 of ${fmtCount(counts.VARIANT_ASSOCIATED_WITH_TRAIT)} — most significant first`
              : "Sorted by -log₁₀(P), most significant first"
          }
          searchPlaceholder="Search variants..."
          searchColumn="variant"
          exportable
          exportFilename={`${disease.id}-variants`}
          defaultPageSize={25}
          emptyMessage="No variant association data available"
        />
      </TabsContent>

      <TabsContent value="phenotypes" className="pt-6">
        <DataSurface
          columns={phenotypeColumns}
          data={phenotypes}
          title="Phenotypes"
          subtitle="Sorted by evidence count"
          searchPlaceholder="Search phenotypes..."
          searchColumn="name"
          exportable
          exportFilename={`${disease.id}-phenotypes`}
          defaultPageSize={25}
          emptyMessage="No phenotype data available"
        />
      </TabsContent>

      <TabsContent value="related" className="pt-6">
        <DataSurface
          columns={relatedDiseaseColumns}
          data={relatedDiseases}
          title="Related Diseases"
          subtitle="Disease ontology hierarchy — parents first"
          searchPlaceholder="Search diseases..."
          searchColumn="diseaseName"
          exportable
          exportFilename={`${disease.id}-related-diseases`}
          defaultPageSize={25}
          emptyMessage="No related disease data available"
        />
      </TabsContent>
    </Tabs>
  );
}
