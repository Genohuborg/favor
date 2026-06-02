"use client";

import { createColumns, tooltip } from "@infra/table/column-builder";
import { cn } from "@infra/utils";
import { Card, CardContent } from "@shared/components/ui/card";
import { DataSurface } from "@shared/components/ui/data-surface";
import { ScoreBar } from "@shared/components/ui/score-bar";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

// =============================================================================
// Types
// =============================================================================

export interface PartnerGene {
  geneId: string;
  geneSymbol: string;
}

export interface ModuleRow extends PartnerGene {
  /** Co-expression z-score (CoXPresdb), null if not co-expressed. */
  zScore: number | null;
  /** Co-essentiality Pearson r (DepMap), null if not co-essential. */
  pearsonR: number | null;
  /** Genetic interaction present (BioGRID). */
  interacts: boolean;
  /** Number of evidence lines supporting this partner (0-3). */
  support: number;
}

export interface FunctionalPartnersViewProps {
  geneSymbol: string;
  module: ModuleRow[];
  regulators: PartnerGene[];
  targets: PartnerGene[];
}

function geneHref(geneId: string): string {
  return `/hg38/gene/${geneId}/gene-level-annotation/llm-summary`;
}

// =============================================================================
// Regulatory circuit
// =============================================================================

function GeneChips({
  genes,
  max = 12,
}: {
  genes: PartnerGene[];
  max?: number;
}) {
  if (genes.length === 0) {
    return <span className="text-sm text-muted-foreground">none recorded</span>;
  }
  const shown = genes.slice(0, max);
  const rest = genes.length - shown.length;
  return (
    <span className="text-sm leading-relaxed">
      {shown.map((g, i) => (
        <span key={g.geneId}>
          <Link
            href={geneHref(g.geneId)}
            className="text-primary hover:underline"
          >
            {g.geneSymbol}
          </Link>
          {i < shown.length - 1 && (
            <span className="text-muted-foreground"> · </span>
          )}
        </span>
      ))}
      {rest > 0 && <span className="text-muted-foreground"> +{rest} more</span>}
    </span>
  );
}

function RegulatoryCircuit({
  geneSymbol,
  regulators,
  targets,
}: {
  geneSymbol: string;
  regulators: PartnerGene[];
  targets: PartnerGene[];
}) {
  if (regulators.length === 0 && targets.length === 0) return null;

  return (
    <Card className="border border-border">
      <CardContent className="px-6 py-5 space-y-3">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Regulatory circuit
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-[7rem_1fr] gap-x-4 items-baseline">
            <span className="text-sm text-muted-foreground">
              ↑ regulated by
            </span>
            <GeneChips genes={regulators} />
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-x-4 items-baseline">
            <span className="text-sm font-semibold text-foreground">
              {geneSymbol}
            </span>
            <span />
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-x-4 items-baseline">
            <span className="text-sm text-muted-foreground">↓ regulates</span>
            <GeneChips genes={targets} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Transcription-factor regulation from TRRUST.
        </p>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Convergence indicator
// =============================================================================

function Convergence({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              i <= n ? "bg-foreground" : "bg-border",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">{n}</span>
    </div>
  );
}

// =============================================================================
// Module matrix columns
// =============================================================================

const col = createColumns<ModuleRow>();

const moduleColumns: ColumnDef<ModuleRow>[] = [
  col.accessor("geneSymbol", {
    header: "Gene",
    accessor: "geneSymbol",
    description: tooltip({
      title: "Partner Gene",
      description: "HGNC symbol for the partner gene. Links to its gene page.",
    }),
    cell: ({ row }) => (
      <Link
        href={geneHref(row.original.geneId)}
        className="text-primary hover:underline font-medium"
      >
        {row.original.geneSymbol}
      </Link>
    ),
  }),
  col.accessor("zScore", {
    header: "Co-expression",
    accessor: (row) => row.zScore ?? Number.NEGATIVE_INFINITY,
    description: tooltip({
      title: "Co-expression z-score",
      description:
        "RNA co-expression strength (CoXPresdb). Higher means more strongly co-expressed.",
      guides: [
        { threshold: ">= 8", meaning: "High" },
        { threshold: "5 - 8", meaning: "Medium" },
        { threshold: "3 - 5", meaning: "Low" },
      ],
    }),
    sortable: true,
    sortDescFirst: true,
    cell: ({ row }) =>
      row.original.zScore === null ? (
        <span className="text-muted-foreground">–</span>
      ) : (
        <ScoreBar value={row.original.zScore} max={10} decimals={1} />
      ),
  }),
  col.accessor("pearsonR", {
    header: "Co-essentiality",
    accessor: (row) => row.pearsonR ?? Number.NEGATIVE_INFINITY,
    description: tooltip({
      title: "Co-essentiality (Pearson r)",
      description:
        "Correlation of CRISPR knockout fitness across cell lines (DepMap). Higher means more co-essential.",
      range: "[-1, 1]",
    }),
    sortable: true,
    sortDescFirst: true,
    cell: ({ row }) =>
      row.original.pearsonR === null ? (
        <span className="text-muted-foreground">–</span>
      ) : (
        <ScoreBar value={row.original.pearsonR} max={1} />
      ),
  }),
  col.display("interacts", {
    header: "Interaction",
    description: tooltip({
      title: "Genetic Interaction",
      description: "A recorded genetic interaction (BioGRID).",
    }),
    cell: ({ row }) =>
      row.original.interacts ? (
        <span className="text-foreground">●</span>
      ) : (
        <span className="text-muted-foreground">–</span>
      ),
  }),
  col.accessor("support", {
    header: "Convergence",
    accessor: (row) => row.support,
    description: tooltip({
      title: "Convergence",
      description:
        "How many independent evidence types support this partner. Partners backed by more methods are the most likely to share function.",
    }),
    sortable: true,
    sortDescFirst: true,
    cell: ({ row }) => <Convergence n={row.original.support} />,
  }),
];

// =============================================================================
// Component
// =============================================================================

export function FunctionalPartnersView({
  geneSymbol,
  module,
  regulators,
  targets,
}: FunctionalPartnersViewProps) {
  const hasCircuit = regulators.length > 0 || targets.length > 0;

  if (module.length === 0 && !hasCircuit) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        No functional partner data available for {geneSymbol}.
      </div>
    );
  }

  const multiSupported = module.filter((m) => m.support >= 2).length;

  return (
    <div className="space-y-6">
      <RegulatoryCircuit
        geneSymbol={geneSymbol}
        regulators={regulators}
        targets={targets}
      />

      {module.length > 0 && (
        <DataSurface
          data={module}
          columns={moduleColumns}
          title="Functional module"
          subtitle={
            multiSupported > 0
              ? `${module.length} partners · ${multiSupported} supported by ≥2 evidence types`
              : `${module.length} partners — ranked by how many evidence types agree`
          }
          searchColumn="geneSymbol"
          searchPlaceholder="Search genes..."
          exportFilename={`${geneSymbol}-functional-module`}
          defaultPageSize={15}
        />
      )}
    </div>
  );
}
