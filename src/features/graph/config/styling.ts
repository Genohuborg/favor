import type { EdgeType } from "../types/edge";
import { EDGE_TYPE_CONFIG } from "../types/edge";
import type { EntityType } from "../types/entity";

// =============================================================================
// Node Styling by Entity Type
// =============================================================================

export const NODE_TYPE_COLORS: Record<
  EntityType,
  { background: string; border: string; text: string }
> = {
  Gene: { background: "#dbeafe", border: "#3b82f6", text: "#1e40af" },
  Disease: { background: "#fee2e2", border: "#ef4444", text: "#991b1b" },
  Drug: { background: "#d1fae5", border: "#10b981", text: "#065f46" },
  Pathway: { background: "#ede9fe", border: "#8b5cf6", text: "#5b21b6" },
  Variant: { background: "#fef3c7", border: "#f59e0b", text: "#92400e" },
  Phenotype: { background: "#fae8ff", border: "#d946ef", text: "#86198f" },
  GOTerm: { background: "#dcfce7", border: "#16a34a", text: "#166534" },
  SideEffect: { background: "#fef9c3", border: "#ca8a04", text: "#854d0e" },
  cCRE: { background: "#cffafe", border: "#0891b2", text: "#155e75" },
  Metabolite: { background: "#fce7f3", border: "#db2777", text: "#9d174d" },
  Signal: { background: "#e0e7ff", border: "#6366f1", text: "#3730a3" },
  ProteinDomain: { background: "#ede9fe", border: "#7c3aed", text: "#5b21b6" },
  Tissue: { background: "#ccfbf1", border: "#14b8a6", text: "#115e59" },
  CellType: { background: "#dbeafe", border: "#2563eb", text: "#1e3a8a" },
};

export const SEED_NODE_COLORS = {
  background: "#6366f1",
  border: "#4338ca",
  text: "#ffffff",
};

export function getNodeColors(
  type: EntityType,
  isSeed: boolean,
): { background: string; border: string; text: string } {
  if (isSeed) return SEED_NODE_COLORS;
  return (
    NODE_TYPE_COLORS[type] ?? {
      background: "#f1f5f9",
      border: "#64748b",
      text: "#334155",
    }
  );
}

export function getNodeSize(
  _type: EntityType,
  isSeed: boolean,
  depth: number,
): number {
  if (isSeed) return 52;
  const baseSize = 36;
  const depthReduction = Math.min(depth, 3) * 4;
  return baseSize - depthReduction;
}

// =============================================================================
// Edge Styling
// =============================================================================

export function getEdgeColor(type: EdgeType): string {
  return EDGE_TYPE_CONFIG[type]?.color ?? "#94a3b8";
}

export function getEdgeWidth(numSources: number | undefined): number {
  if (!numSources || numSources <= 1) return 1.5;
  if (numSources <= 2) return 2;
  if (numSources <= 3) return 2.5;
  return 3;
}
