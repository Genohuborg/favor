import type { ElementDefinition } from "cytoscape";
import {
  getEdgeColor,
  getEdgeWidth,
  getNodeColors,
  getNodeSize,
} from "../config/styling";
import type { EdgeType } from "../types/edge";
import type { EntityType } from "../types/entity";
import type { GraphFilters } from "../types/filters";
import type { ExplorerEdge, ExplorerNode } from "../types/node";

/**
 * Convert ExplorerNode to Cytoscape element data
 */
export function nodeToElementData(node: ExplorerNode): Record<string, unknown> {
  const colors = getNodeColors(node.type, node.isSeed);
  const size = getNodeSize(node.type, node.isSeed, node.depth);

  return {
    id: node.id,
    label: node.label,
    type: node.type,
    subtitle: node.subtitle,
    isSeed: node.isSeed,
    depth: node.depth,
    degree: node.degree,
    hubScore: node.hubScore,
    percentile: node.percentile,
    backgroundColor: colors.background,
    borderColor: colors.border,
    textColor: colors.text,
    nodeSize: size,
  };
}

/**
 * Convert ExplorerEdge to Cytoscape element data
 */
export function edgeToElementData(edge: ExplorerEdge): Record<string, unknown> {
  const color = getEdgeColor(edge.type);
  const width = getEdgeWidth(edge.numSources);

  return {
    id: edge.id,
    source: edge.sourceId,
    target: edge.targetId,
    type: edge.type,
    numSources: edge.numSources,
    numExperiments: edge.numExperiments,
    lineColor: color,
    edgeWidth: width,
  };
}

/**
 * Transform explorer nodes and edges to Cytoscape elements
 */
export function transformToElements(
  nodes: Map<string, ExplorerNode>,
  edges: Map<string, ExplorerEdge>,
  filters: GraphFilters,
): ElementDefinition[] {
  const elements: ElementDefinition[] = [];
  const visibleNodeIds = new Set<string>();

  // First pass: identify visible edges and their connected nodes
  const hasActiveEdgeFilters =
    filters.minSources > 0 ||
    filters.minExperiments > 0 ||
    (filters.scoreThreshold != null && filters.scoreThreshold > 0);
  edges.forEach((edge) => {
    if (!filters.edgeTypes.has(edge.type)) return;
    if ((edge.numSources ?? 0) < filters.minSources) return;
    if ((edge.numExperiments ?? 0) < filters.minExperiments) return;
    // Apply score threshold filter
    if (filters.scoreThreshold != null && filters.scoreField) {
      const val = edge.fields?.[filters.scoreField];
      if (typeof val === "number" && val < filters.scoreThreshold) return;
    }
    visibleNodeIds.add(edge.sourceId);
    visibleNodeIds.add(edge.targetId);
  });

  // Add nodes
  // When edge filters are active (minSources/minExperiments/scoreThreshold > 0),
  // hide non-seed orphaned nodes even if showOrphans is true
  nodes.forEach((node) => {
    if (node.depth > filters.maxDepth) return;
    if (hasActiveEdgeFilters && !visibleNodeIds.has(node.id) && !node.isSeed)
      return;
    if (!filters.showOrphans && !visibleNodeIds.has(node.id) && !node.isSeed)
      return;

    elements.push({
      data: nodeToElementData(node),
      classes: `entity-${node.type.toLowerCase()}${node.isSeed ? " seed" : ""}`,
    });
  });

  // Add visible edges
  edges.forEach((edge) => {
    if (!filters.edgeTypes.has(edge.type)) return;
    if ((edge.numSources ?? 0) < filters.minSources) return;
    if ((edge.numExperiments ?? 0) < filters.minExperiments) return;
    if (filters.scoreThreshold != null && filters.scoreField) {
      const val = edge.fields?.[filters.scoreField];
      if (typeof val === "number" && val < filters.scoreThreshold) return;
    }

    const sourceNode = nodes.get(edge.sourceId);
    const targetNode = nodes.get(edge.targetId);
    if (!sourceNode || !targetNode) return;
    if (
      sourceNode.depth > filters.maxDepth ||
      targetNode.depth > filters.maxDepth
    )
      return;

    elements.push({
      data: edgeToElementData(edge),
      classes: `edge-type`,
    });
  });

  return elements;
}

/**
 * Get summary of graph contents by type
 */
export function getGraphSummary(
  nodes: Map<string, ExplorerNode>,
  edges: Map<string, ExplorerEdge>,
): {
  nodeTypeCounts: Record<EntityType, number>;
  edgeTypeCounts: Record<EdgeType, number>;
} {
  const nodeTypeCounts: Record<EntityType, number> = {} as Record<
    EntityType,
    number
  >;
  const edgeTypeCounts: Record<EdgeType, number> = {} as Record<
    EdgeType,
    number
  >;

  nodes.forEach((node) => {
    nodeTypeCounts[node.type] = (nodeTypeCounts[node.type] ?? 0) + 1;
  });

  edges.forEach((edge) => {
    edgeTypeCounts[edge.type] = (edgeTypeCounts[edge.type] ?? 0) + 1;
  });

  return { nodeTypeCounts, edgeTypeCounts };
}
