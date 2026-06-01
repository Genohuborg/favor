"use client";

import type { Gene } from "@features/gene/types";
import {
  adaptGtexToTissueArray,
  TISSUE_GROUPS,
} from "@features/gene/utils/tissue-expression";
import { cn } from "@infra/utils";
import {
  BarChart,
  CATEGORICAL_PALETTE,
  type ChartDataRow,
  DEFAULT_BAR_COLOR,
} from "@shared/components/charts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { useMemo, useState } from "react";
import { CellxgeneExpression, type CellxgeneRow } from "./cellxgene-expression";
import { SegmentedControl } from "./segmented-control";

export type { CellxgeneRow };

// =============================================================================
// Types
// =============================================================================

interface ExpressionCardProps {
  gtex?: Gene["gtex"] | null;
  cellxgene?: CellxgeneRow[];
  className?: string;
}

type Source = "gtex" | "cellxgene";
type GroupMode = "none" | "system";
type LimitOption = "10" | "25" | "all";
type ScaleMode = "linear" | "log";

// =============================================================================
// Palettes / helpers
// =============================================================================

const GROUP_PALETTE = [
  ...CATEGORICAL_PALETTE,
  "#0ea5e9",
  "#22c55e",
  "#f97316",
  "#a855f7",
];

const GROUP_COLORS = Object.fromEntries(
  TISSUE_GROUPS.map((group, index) => [
    group,
    GROUP_PALETTE[index % GROUP_PALETTE.length],
  ]),
);

const LIMIT_OPTIONS: Array<{ value: LimitOption; label: string }> = [
  { value: "10", label: "Top 10" },
  { value: "25", label: "Top 25" },
  { value: "all", label: "All" },
];

const GROUP_OPTIONS: Array<{ value: GroupMode; label: string }> = [
  { value: "none", label: "None" },
  { value: "system", label: "Organ System" },
];

const SCALE_OPTIONS: Array<{ value: ScaleMode; label: string }> = [
  { value: "linear", label: "Linear" },
  { value: "log", label: "Log" },
];

function logTransform(value: number) {
  return Math.log10(Math.max(value, 0) + 1);
}
function inverseLogTransform(value: number) {
  return Math.max(10 ** value - 1, 0);
}

// =============================================================================
// Component
// =============================================================================

export function ExpressionCard({
  gtex,
  cellxgene = [],
  className,
}: ExpressionCardProps) {
  const hasCellxgene = cellxgene.length > 0;

  const [source, setSource] = useState<Source>("gtex");
  const [groupMode, setGroupMode] = useState<GroupMode>("system");
  const [limit, setLimit] = useState<LimitOption>("25");
  const [scaleMode, setScaleMode] = useState<ScaleMode>("linear");

  const active: Source =
    source === "cellxgene" && hasCellxgene ? source : "gtex";

  const tissueData = useMemo<ChartDataRow[]>(() => {
    const rows = adaptGtexToTissueArray(gtex)
      .filter((row) => row.value !== null && row.value !== undefined)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    const limited =
      limit === "all" ? rows : rows.slice(0, Number.parseInt(limit, 10));
    return limited.map((row) => ({
      id: row.tissue,
      label: row.label,
      value:
        scaleMode === "log" ? logTransform(row.value ?? 0) : (row.value ?? 0),
      category: groupMode === "system" ? row.group : undefined,
    }));
  }, [gtex, groupMode, limit, scaleMode]);

  const activeGroupColors = useMemo(() => {
    if (groupMode !== "system") return {};
    const groups = new Set(
      adaptGtexToTissueArray(gtex).map((row) => row.group),
    );
    return Object.fromEntries(
      Object.entries(GROUP_COLORS).filter(([group]) => groups.has(group)),
    );
  }, [gtex, groupMode]);

  const title =
    active === "cellxgene" ? "CellxGene Expression" : "GTEx Tissue Expression";
  const subtitle =
    active === "cellxgene"
      ? "Single-cell expression across cell types (CellxGene Census)"
      : "Expression across GTEx tissues (sorted by abundance)";

  return (
    <Card className={cn("border border-border py-0 gap-0", className)}>
      <CardHeader className="border-b border-border px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {hasCellxgene && (
            <SegmentedControl
              value={active}
              options={[
                { value: "gtex", label: "GTEx" },
                { value: "cellxgene", label: "CellxGene" },
              ]}
              onChange={setSource}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {active === "gtex" ? (
          <>
            <div className="flex flex-wrap items-center gap-4 px-6 py-3 border-b border-border bg-muted/50">
              <SegmentedControl
                label="Group"
                value={groupMode}
                options={GROUP_OPTIONS}
                onChange={setGroupMode}
              />
              <SegmentedControl
                label="Scale"
                value={scaleMode}
                options={SCALE_OPTIONS}
                onChange={setScaleMode}
              />
              <SegmentedControl
                label="Top"
                value={limit}
                options={LIMIT_OPTIONS}
                onChange={setLimit}
              />
            </div>
            <div className="px-6 py-6">
              <BarChart
                data={tissueData}
                layout="horizontal"
                showLegend={groupMode === "system"}
                colorField="category"
                colorScheme={
                  groupMode === "system"
                    ? { type: "categorical", colors: activeGroupColors }
                    : { type: "single", color: DEFAULT_BAR_COLOR }
                }
                valueFormatter={(value) => {
                  const raw =
                    scaleMode === "log" ? inverseLogTransform(value) : value;
                  return Number.isFinite(raw) ? raw.toFixed(2) : "—";
                }}
                emptyMessage="No tissue expression values available"
              />
            </div>
          </>
        ) : (
          <CellxgeneExpression rows={cellxgene} />
        )}
      </CardContent>
    </Card>
  );
}
