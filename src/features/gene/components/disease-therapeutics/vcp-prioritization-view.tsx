"use client";

import { createColumns, tooltip } from "@infra/table/column-builder";
import { DataSurface } from "@shared/components/ui/data-surface";
import { ScoreBar } from "@shared/components/ui/score-bar";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface VcpRow {
  targetId: string;
  targetLabel: string;
  maxVcpScore: number | null;
  nVariants: number | null;
  nVariantsHigh: number | null;
}

interface VcpPrioritizationViewProps {
  geneSymbol: string;
  rows: VcpRow[];
  targetKind: "disease" | "phenotype";
}

const KIND_LABEL: Record<VcpPrioritizationViewProps["targetKind"], string> = {
  disease: "Disease",
  phenotype: "Phenotype",
};

function targetHref(
  targetKind: VcpPrioritizationViewProps["targetKind"],
  id: string,
): string {
  return targetKind === "disease" ? `/disease/${id}` : `/phenotype/${id}`;
}

export function VcpPrioritizationView({
  geneSymbol,
  rows,
  targetKind,
}: VcpPrioritizationViewProps) {
  const col = createColumns<VcpRow>();
  const label = KIND_LABEL[targetKind];

  const columns: ColumnDef<VcpRow>[] = [
    col.display("target", {
      header: label,
      cell: ({ row }) => {
        const { targetId, targetLabel } = row.original;
        return (
          <Link
            href={targetHref(targetKind, targetId)}
            className="text-primary hover:underline font-medium"
          >
            {targetLabel}
          </Link>
        );
      },
    }),
    col.accessor("maxVcpScore", {
      header: "Max VCP",
      accessor: (row) => row.maxVcpScore ?? Number.NEGATIVE_INFINITY,
      description: tooltip({
        title: "Max VCP Score",
        description:
          "Highest variant-centric-pipeline prioritization score across this gene's variants for this trait.",
        range: "[0, 1]",
      }),
      sortable: true,
      sortDescFirst: true,
      cell: ({ row }) => (
        <ScoreBar value={row.original.maxVcpScore} max={1} decimals={3} />
      ),
    }),
    col.accessor("nVariants", {
      header: "Variants",
      accessor: (row) => row.nVariants ?? 0,
      description: tooltip({
        title: "Variants",
        description: "Number of variants linking this gene to the trait.",
      }),
      sortable: true,
      cell: ({ row }) => {
        const n = row.original.nVariants;
        return n === null ? "-" : <span className="tabular-nums">{n}</span>;
      },
    }),
    col.accessor("nVariantsHigh", {
      header: "High-VCP",
      accessor: (row) => row.nVariantsHigh ?? 0,
      description: tooltip({
        title: "High-VCP Variants",
        description: "Variants with a high prioritization score.",
      }),
      sortable: true,
      cell: ({ row }) => {
        const n = row.original.nVariantsHigh;
        return n === null ? "-" : <span className="tabular-nums">{n}</span>;
      },
    }),
  ];

  return (
    <DataSurface
      data={rows}
      columns={columns}
      title={`Prioritized ${label}s`}
      subtitle={`${label}s prioritized for ${geneSymbol} by the variant-centric pipeline`}
      searchPlaceholder={`Search ${label.toLowerCase()}s...`}
      exportFilename={`${geneSymbol}-vcp-${targetKind}`}
      emptyMessage={`No ${label.toLowerCase()} prioritization for ${geneSymbol}.`}
      defaultPageSize={15}
    />
  );
}
