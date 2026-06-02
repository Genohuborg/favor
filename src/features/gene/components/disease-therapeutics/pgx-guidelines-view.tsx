"use client";

import { createColumns, tooltip } from "@infra/table/column-builder";
import { DataSurface } from "@shared/components/ui/data-surface";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface PgxGuidelineRow {
  drugId: string;
  drugLabel: string;
  nRecommendations: number | null;
  evidenceCount: number | null;
}

interface PgxGuidelinesViewProps {
  geneSymbol: string;
  rows: PgxGuidelineRow[];
}

const col = createColumns<PgxGuidelineRow>();

const columns: ColumnDef<PgxGuidelineRow>[] = [
  col.display("drug", {
    header: "Drug",
    cell: ({ row }) => {
      const { drugId, drugLabel } = row.original;
      return (
        <Link
          href={`/drug/${drugId}`}
          className="text-primary hover:underline font-medium"
        >
          {drugLabel}
        </Link>
      );
    },
  }),
  col.accessor("nRecommendations", {
    header: "Recommendations",
    accessor: (row) => row.nRecommendations ?? 0,
    description: tooltip({
      title: "Dosing Recommendations",
      description:
        "Number of clinical dosing/therapeutic recommendations in the guideline. More indicates richer, more actionable guidance.",
    }),
    sortable: true,
    sortDescFirst: true,
    cell: ({ row }) => {
      const n = row.original.nRecommendations;
      return n === null ? "-" : <span className="tabular-nums">{n}</span>;
    },
  }),
  col.accessor("evidenceCount", {
    header: "Evidence",
    accessor: (row) => row.evidenceCount ?? 0,
    sortable: true,
    cell: ({ row }) => {
      const n = row.original.evidenceCount;
      return n === null ? "-" : <span className="tabular-nums">{n}</span>;
    },
  }),
];

export function PgxGuidelinesView({
  geneSymbol,
  rows,
}: PgxGuidelinesViewProps) {
  return (
    <DataSurface
      data={rows}
      columns={columns}
      title="Pharmacogenomic Guidelines"
      subtitle={`Clinical PGx guidelines linking ${geneSymbol} to drug response`}
      searchPlaceholder="Search drugs..."
      exportFilename={`${geneSymbol}-pgx-guidelines`}
      emptyMessage={`No pharmacogenomic guidelines for ${geneSymbol}.`}
      defaultPageSize={15}
    />
  );
}
