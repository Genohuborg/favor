"use client";

import { cn } from "@infra/utils";
import cytoscape, {
  type Core,
  type EdgeSingular,
  type EventObject,
  type NodeSingular,
  type StylesheetStyle,
} from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import dagre from "cytoscape-dagre";
import { memo, useEffect, useMemo, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { getExplorerLayoutOptions } from "../config/layout";
import { NODE_TYPE_COLORS } from "../config/styling";
import type { ExplorerEdge, ExplorerNode } from "../types/node";
import type { ExplorerCytoscapeProps } from "../types/props";

// Register layout extensions
if (typeof cytoscape("layout", "cose-bilkent") === "undefined") {
  cytoscape.use(coseBilkent);
}
if (typeof cytoscape("layout", "dagre") === "undefined") {
  cytoscape.use(dagre);
}

// =============================================================================
// Stylesheet — includes Phase 1 hover highlighting classes
// =============================================================================

const STYLESHEET: StylesheetStyle[] = [
  // Base node style — with transition for smooth hover fade
  {
    selector: "node",
    style: {
      "background-color": "data(backgroundColor)",
      "border-color": "data(borderColor)",
      "border-width": 2,
      width: "data(nodeSize)",
      height: "data(nodeSize)",
      label: "data(label)",
      "text-valign": "bottom",
      "text-halign": "center",
      "text-margin-y": 6,
      "font-size": 11,
      "font-weight": 500,
      color: "#334155",
      "text-outline-color": "#ffffff",
      "text-outline-width": 2,
      "transition-property": "opacity, border-width, border-color",
      "transition-duration": 350,
    },
  },
  // Seed node
  {
    selector: "node.seed",
    style: {
      "border-width": 3,
      "font-weight": 600,
    },
  },
  // Selected node
  {
    selector: "node:selected",
    style: {
      "border-width": 3,
      "border-color": "#1e40af",
    },
  },
  // Multi-selected nodes
  {
    selector: "node.multi-selected",
    style: {
      "border-width": 3,
      "border-color": "#9333ea",
      "border-style": "double" as never,
    },
  },
  // Path highlight - nodes in path
  {
    selector: "node.path-node",
    style: {
      "border-width": 4,
      "border-color": "#f59e0b",
      "z-index": 100,
    },
  },
  // Path highlight - dimmed nodes
  {
    selector: "node.path-dimmed",
    style: {
      opacity: 0.3,
    },
  },

  // --- HOVER HIGHLIGHTING (Phase 1.2) ---
  // The hovered node itself
  {
    selector: "node.hover-source",
    style: {
      "border-width": 3,
      "z-index": 100,
    },
  },
  // 1-hop neighbors of hovered node
  {
    selector: "node.hover-neighbor",
    style: {
      "z-index": 50,
      opacity: 1,
    },
  },
  // Everything else when a hover is active
  {
    selector: "node.hover-dimmed",
    style: {
      opacity: 0.15,
    },
  },

  // Entity type specific styles
  {
    selector: "node.entity-gene",
    style: {
      "background-color": NODE_TYPE_COLORS.Gene.background,
      "border-color": NODE_TYPE_COLORS.Gene.border,
      color: NODE_TYPE_COLORS.Gene.text,
    },
  },
  {
    selector: "node.entity-disease",
    style: {
      "background-color": NODE_TYPE_COLORS.Disease.background,
      "border-color": NODE_TYPE_COLORS.Disease.border,
      color: NODE_TYPE_COLORS.Disease.text,
    },
  },
  {
    selector: "node.entity-drug",
    style: {
      "background-color": NODE_TYPE_COLORS.Drug.background,
      "border-color": NODE_TYPE_COLORS.Drug.border,
      color: NODE_TYPE_COLORS.Drug.text,
    },
  },
  {
    selector: "node.entity-pathway",
    style: {
      "background-color": NODE_TYPE_COLORS.Pathway.background,
      "border-color": NODE_TYPE_COLORS.Pathway.border,
      color: NODE_TYPE_COLORS.Pathway.text,
    },
  },
  {
    selector: "node.entity-variant",
    style: {
      "background-color": NODE_TYPE_COLORS.Variant.background,
      "border-color": NODE_TYPE_COLORS.Variant.border,
      color: NODE_TYPE_COLORS.Variant.text,
    },
  },
  {
    selector: "node.entity-phenotype",
    style: {
      "background-color": NODE_TYPE_COLORS.Phenotype.background,
      "border-color": NODE_TYPE_COLORS.Phenotype.border,
      color: NODE_TYPE_COLORS.Phenotype.text,
    },
  },
  {
    selector: "node.entity-goterm",
    style: {
      "background-color": NODE_TYPE_COLORS.GOTerm.background,
      "border-color": NODE_TYPE_COLORS.GOTerm.border,
      color: NODE_TYPE_COLORS.GOTerm.text,
    },
  },
  {
    selector: "node.entity-sideeffect",
    style: {
      "background-color": NODE_TYPE_COLORS.SideEffect.background,
      "border-color": NODE_TYPE_COLORS.SideEffect.border,
      color: NODE_TYPE_COLORS.SideEffect.text,
    },
  },
  {
    selector: "node.entity-signal",
    style: {
      "background-color": NODE_TYPE_COLORS.Signal.background,
      "border-color": NODE_TYPE_COLORS.Signal.border,
      color: NODE_TYPE_COLORS.Signal.text,
    },
  },
  {
    selector: "node.entity-proteindomain",
    style: {
      "background-color": NODE_TYPE_COLORS.ProteinDomain.background,
      "border-color": NODE_TYPE_COLORS.ProteinDomain.border,
      color: NODE_TYPE_COLORS.ProteinDomain.text,
    },
  },
  {
    selector: "node.entity-tissue",
    style: {
      "background-color": NODE_TYPE_COLORS.Tissue.background,
      "border-color": NODE_TYPE_COLORS.Tissue.border,
      color: NODE_TYPE_COLORS.Tissue.text,
    },
  },
  {
    selector: "node.entity-celltype",
    style: {
      "background-color": NODE_TYPE_COLORS.CellType.background,
      "border-color": NODE_TYPE_COLORS.CellType.border,
      color: NODE_TYPE_COLORS.CellType.text,
    },
  },
  {
    selector: "node.entity-ccre",
    style: {
      "background-color": NODE_TYPE_COLORS.cCRE.background,
      "border-color": NODE_TYPE_COLORS.cCRE.border,
      color: NODE_TYPE_COLORS.cCRE.text,
    },
  },
  {
    selector: "node.entity-metabolite",
    style: {
      "background-color": NODE_TYPE_COLORS.Metabolite.background,
      "border-color": NODE_TYPE_COLORS.Metabolite.border,
      color: NODE_TYPE_COLORS.Metabolite.text,
    },
  },

  // Base edge style — with transition for smooth hover fade
  {
    selector: "edge",
    style: {
      "curve-style": "bezier",
      "line-color": "data(lineColor)",
      width: "data(edgeWidth)",
      opacity: 0.7,
      "target-arrow-shape": "triangle",
      "target-arrow-color": "data(lineColor)",
      "arrow-scale": 0.8,
      "transition-property": "opacity, width",
      "transition-duration": 350,
    },
  },
  // Edge hover (CSS pseudo, for when no JS highlight is active)
  {
    selector: "edge:hover",
    style: {
      opacity: 1,
      width: 3,
      "z-index": 10,
    },
  },
  // Edge selected (Cytoscape native)
  {
    selector: "edge:selected",
    style: {
      "line-color": "#6366f1",
      "target-arrow-color": "#6366f1",
      width: 4,
      opacity: 1,
    },
  },
  // Edge selected (via class)
  {
    selector: "edge.selected",
    style: {
      "line-color": "#6366f1",
      "target-arrow-color": "#6366f1",
      width: 4,
      opacity: 1,
      "z-index": 20,
    },
  },
  // Path highlight edges
  {
    selector: "edge.path-edge",
    style: {
      "line-color": "#f59e0b",
      "target-arrow-color": "#f59e0b",
      width: 4,
      opacity: 1,
      "z-index": 50,
    },
  },
  {
    selector: "edge.path-dimmed",
    style: {
      opacity: 0.2,
    },
  },

  // --- HOVER HIGHLIGHTING (Phase 1.2) ---
  // Edges connecting to hovered node
  {
    selector: "edge.hover-highlight",
    style: {
      opacity: 1,
      width: 3,
      "z-index": 50,
    },
  },
  // Edges dimmed during hover
  {
    selector: "edge.hover-dimmed",
    style: {
      opacity: 0.08,
    },
  },
  // Hovered edge itself
  {
    selector: "edge.hover-source",
    style: {
      opacity: 1,
      width: 4,
      "z-index": 60,
    },
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

function dataToNode(data: Record<string, unknown>): ExplorerNode {
  return {
    id: String(data.id ?? ""),
    key: "" as ExplorerNode["key"],
    type: String(data.type ?? "Gene") as ExplorerNode["type"],
    label: String(data.label ?? "Unknown"),
    entity: {
      type: String(data.type ?? "Gene"),
      id: String(data.id ?? ""),
      label: String(data.label ?? "Unknown"),
    } as ExplorerNode["entity"],
    isSeed: Boolean(data.isSeed),
    depth: typeof data.depth === "number" ? data.depth : 0,
    degree: typeof data.degree === "number" ? data.degree : undefined,
    hubScore: typeof data.hubScore === "number" ? data.hubScore : undefined,
    percentile:
      typeof data.percentile === "number" ? data.percentile : undefined,
  };
}

function dataToEdge(data: Record<string, unknown>): ExplorerEdge {
  return {
    id: String(data.id ?? ""),
    key: "" as ExplorerEdge["key"],
    type: String(
      data.type ?? "GENE_ASSOCIATED_WITH_DISEASE",
    ) as ExplorerEdge["type"],
    sourceId: String(data.source ?? ""),
    targetId: String(data.target ?? ""),
    sourceKey: "" as ExplorerEdge["sourceKey"],
    targetKey: "" as ExplorerEdge["targetKey"],
    numSources:
      typeof data.numSources === "number" ? data.numSources : undefined,
    numExperiments:
      typeof data.numExperiments === "number" ? data.numExperiments : undefined,
    fields:
      typeof data.fields === "object" && data.fields !== null
        ? (data.fields as Record<string, unknown>)
        : undefined,
  };
}

// =============================================================================
// Hover highlighting helpers (all internal to Cytoscape, no React re-render)
// =============================================================================

function clearHoverClasses(cy: Core) {
  cy.batch(() => {
    cy.elements().removeClass(
      "hover-source hover-neighbor hover-highlight hover-dimmed",
    );
  });
}

function applyNodeHoverHighlight(cy: Core, node: NodeSingular) {
  const neighborhood = node.neighborhood();
  const neighborNodes = neighborhood.nodes();
  const neighborEdges = neighborhood.edges();

  cy.batch(() => {
    // Dim everything
    cy.elements().addClass("hover-dimmed");
    // Un-dim the hovered node and its neighborhood
    node.removeClass("hover-dimmed").addClass("hover-source");
    neighborNodes.removeClass("hover-dimmed").addClass("hover-neighbor");
    neighborEdges.removeClass("hover-dimmed").addClass("hover-highlight");
  });
}

function applyEdgeHoverHighlight(cy: Core, edge: EdgeSingular) {
  const source = edge.source();
  const target = edge.target();

  cy.batch(() => {
    cy.elements().addClass("hover-dimmed");
    edge.removeClass("hover-dimmed").addClass("hover-source");
    source.removeClass("hover-dimmed").addClass("hover-neighbor");
    target.removeClass("hover-dimmed").addClass("hover-neighbor");
  });
}

/**
 * After hover ends, restore the selection-based highlight (if any).
 * If nothing is selected, just clear all hover classes.
 */
function restoreSelectionHighlight(
  cy: Core,
  selectedNodeIdsRef: { current: Set<string> | undefined },
  selectedEdgeIdRef: { current: string | null | undefined },
) {
  clearHoverClasses(cy);

  const nodeIds = selectedNodeIdsRef.current;
  const edgeId = selectedEdgeIdRef.current;

  if (nodeIds && nodeIds.size === 1) {
    const nodeId = Array.from(nodeIds)[0];
    const node = cy.getElementById(nodeId);
    if (node.length > 0 && node.isNode()) {
      applyNodeHoverHighlight(cy, node as NodeSingular);
    }
  } else if (edgeId) {
    const edge = cy.getElementById(edgeId);
    if (edge.length > 0 && edge.isEdge()) {
      applyEdgeHoverHighlight(cy, edge as EdgeSingular);
    }
  }
}

// =============================================================================
// Component
// =============================================================================

function ExplorerCytoscapeInner({
  elements,
  layout,
  onNodeClick,
  onNodeHover,
  onEdgeClick,
  onEdgeHover,
  onNodeDoubleClick,
  onBackgroundClick,
  selectedNodeIds,
  selectedEdgeId,
  pathHighlight,
  className,
}: ExplorerCytoscapeProps) {
  const cyRef = useRef<Core | null>(null);
  const layoutRef = useRef(layout);
  const initializedRef = useRef(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable callback refs
  const onNodeClickRef = useRef(onNodeClick);
  const onNodeHoverRef = useRef(onNodeHover);
  const onEdgeClickRef = useRef(onEdgeClick);
  const onEdgeHoverRef = useRef(onEdgeHover);
  const onNodeDoubleClickRef = useRef(onNodeDoubleClick);
  const onBackgroundClickRef = useRef(onBackgroundClick);

  // Selection refs (so event handlers can restore selection highlight on mouseout)
  const selectedNodeIdsRef = useRef(selectedNodeIds);
  const selectedEdgeIdRef = useRef(selectedEdgeId);

  useEffect(() => {
    return () => {
      initializedRef.current = false;
      cyRef.current = null;
    };
  }, []);

  useEffect(() => {
    onNodeClickRef.current = onNodeClick;
  }, [onNodeClick]);
  useEffect(() => {
    onNodeHoverRef.current = onNodeHover;
  }, [onNodeHover]);
  useEffect(() => {
    onEdgeClickRef.current = onEdgeClick;
  }, [onEdgeClick]);
  useEffect(() => {
    onEdgeHoverRef.current = onEdgeHover;
  }, [onEdgeHover]);
  useEffect(() => {
    onNodeDoubleClickRef.current = onNodeDoubleClick;
  }, [onNodeDoubleClick]);
  useEffect(() => {
    onBackgroundClickRef.current = onBackgroundClick;
  }, [onBackgroundClick]);
  useEffect(() => {
    selectedNodeIdsRef.current = selectedNodeIds;
  }, [selectedNodeIds]);
  useEffect(() => {
    selectedEdgeIdRef.current = selectedEdgeId;
  }, [selectedEdgeId]);

  // Selection highlighting: dims non-related nodes/edges when something is selected
  useEffect(() => {
    if (!cyRef.current || !initializedRef.current) return;
    const cy = cyRef.current;
    if (cy.destroyed()) return;

    // Clear previous classes
    cy.nodes().removeClass("multi-selected");
    cy.edges().removeClass("selected");
    clearHoverClasses(cy);

    if (selectedNodeIds && selectedNodeIds.size === 1) {
      // Single node selected — highlight 1-hop neighborhood
      const nodeId = Array.from(selectedNodeIds)[0];
      const node = cy.getElementById(nodeId);
      if (node.length > 0 && node.isNode()) {
        applyNodeHoverHighlight(cy, node as NodeSingular);
      }
    } else if (selectedNodeIds && selectedNodeIds.size > 1) {
      // Multi-select — mark selected nodes
      cy.nodes().forEach((node) => {
        if (selectedNodeIds.has(node.id())) {
          node.addClass("multi-selected");
        }
      });
    } else if (selectedEdgeId) {
      // Edge selected — highlight edge + endpoints
      const edge = cy.getElementById(selectedEdgeId);
      if (edge.length > 0 && edge.isEdge()) {
        edge.addClass("selected");
        applyEdgeHoverHighlight(cy, edge as EdgeSingular);
      }
    }
  }, [selectedNodeIds, selectedEdgeId]);

  // Path highlighting
  useEffect(() => {
    if (!cyRef.current || !initializedRef.current) return;
    const cy = cyRef.current;
    if (cy.destroyed()) return;

    cy.nodes().removeClass("path-node path-dimmed");
    cy.edges().removeClass("path-edge path-dimmed");

    if (
      pathHighlight &&
      (pathHighlight.nodeIds.size > 0 || pathHighlight.edgeIds.size > 0)
    ) {
      cy.nodes().forEach((node) => {
        if (pathHighlight.nodeIds.has(node.id())) {
          node.addClass("path-node");
        } else {
          node.addClass("path-dimmed");
        }
      });

      cy.edges().forEach((edge) => {
        if (pathHighlight.edgeIds.has(edge.id())) {
          edge.addClass("path-edge");
        } else {
          edge.addClass("path-dimmed");
        }
      });
    }
  }, [pathHighlight]);

  // Layout changes
  useEffect(() => {
    if (!cyRef.current || !initializedRef.current) return;
    const cy = cyRef.current;
    if (cy.destroyed()) return;
    if (layoutRef.current === layout) return;

    layoutRef.current = layout;
    const layoutOptions = getExplorerLayoutOptions(layout);
    cy.layout(layoutOptions).run();
  }, [layout]);

  // Element change detection
  const elementsKey = useMemo(
    () =>
      elements
        .map((el) => el.data.id)
        .sort()
        .join(","),
    [elements],
  );

  const prevElementCountRef = useRef(elements.length);

  useEffect(() => {
    if (!cyRef.current || !initializedRef.current) return;
    const cy = cyRef.current;
    if (cy.destroyed()) return;

    const currentElementIds = cy
      .elements()
      .map((el) => el.id())
      .sort()
      .join(",");
    const elementCountChanged = elements.length !== prevElementCountRef.current;
    prevElementCountRef.current = elements.length;

    if (currentElementIds !== elementsKey || elementCountChanged) {
      cy.elements().remove();
      cy.add(elements);

      const layoutOptions = getExplorerLayoutOptions(layout);
      cy.layout(layoutOptions).run();
    }
  }, [elementsKey, elements, layout]);

  // Cytoscape init callback
  const handleCy = (cy: Core) => {
    if (initializedRef.current && cyRef.current === cy) return;

    cyRef.current = cy;
    initializedRef.current = true;

    cy.style().fromJson(STYLESHEET).update();

    const layoutOptions = getExplorerLayoutOptions(layoutRef.current);
    cy.layout(layoutOptions).run();

    // ---- Node click: select ----
    cy.on("tap", "node", (event: EventObject) => {
      const node = event.target as NodeSingular;
      const data = node.data();
      const originalEvent = event.originalEvent as MouseEvent | undefined;
      onNodeClickRef.current?.(dataToNode(data), originalEvent);
    });

    // ---- Node double-click: placeholder for Focus mode (Phase 1.4) ----
    cy.on("dbltap", "node", (event: EventObject) => {
      const node = event.target as NodeSingular;
      const data = node.data();
      onNodeDoubleClickRef.current?.(dataToNode(data));
    });

    // ---- Edge click ----
    cy.on("tap", "edge", (event: EventObject) => {
      const edge = event.target as EdgeSingular;
      const data = edge.data();
      const midpoint = edge.midpoint();
      const container = cy.container();

      if (container && onEdgeClickRef.current) {
        const rect = container.getBoundingClientRect();
        const pan = cy.pan();
        const zoom = cy.zoom();

        const renderedX = midpoint.x * zoom + pan.x;
        const renderedY = midpoint.y * zoom + pan.y;

        onEdgeClickRef.current(dataToEdge(data), {
          x: rect.left + renderedX,
          y: rect.top + renderedY,
        });
      }
    });

    // ---- Background click: clear selection (Phase 1.4) ----
    cy.on("tap", (event: EventObject) => {
      if (event.target === cy) {
        onBackgroundClickRef.current?.();
      }
    });

    // ---- Node hover: highlight 1-hop neighborhood (delayed) ----
    cy.on("mouseover", "node", (event: EventObject) => {
      const node = event.target as NodeSingular;
      const data = node.data();
      const container = cy.container();

      // Cancel any pending hover
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

      hoverTimerRef.current = setTimeout(() => {
        applyNodeHoverHighlight(cy, node);

        if (container) {
          const renderedPosition = node.renderedPosition();
          const rect = container.getBoundingClientRect();
          onNodeHoverRef.current?.(dataToNode(data), {
            x: rect.left + renderedPosition.x,
            y: rect.top + renderedPosition.y,
          });
        }
      }, 1000);
    });

    cy.on("mouseout", "node", () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      restoreSelectionHighlight(cy, selectedNodeIdsRef, selectedEdgeIdRef);
      onNodeHoverRef.current?.(null, null);
    });

    // ---- Edge hover: highlight endpoints + tooltip (delayed) ----
    cy.on("mouseover", "edge", (event: EventObject) => {
      const edge = event.target as EdgeSingular;
      const data = edge.data();

      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

      hoverTimerRef.current = setTimeout(() => {
        if (edge.removed() || !edge.inside()) return;
        applyEdgeHoverHighlight(cy, edge);

        const container = cy.container();
        if (container && onEdgeHoverRef.current) {
          const midpoint = edge.midpoint();
          const rect = container.getBoundingClientRect();
          const pan = cy.pan();
          const zoom = cy.zoom();

          onEdgeHoverRef.current(dataToEdge(data), {
            x: rect.left + midpoint.x * zoom + pan.x,
            y: rect.top + midpoint.y * zoom + pan.y,
          });
        }
      }, 1000);
    });

    cy.on("mouseout", "edge", () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      restoreSelectionHighlight(cy, selectedNodeIdsRef, selectedEdgeIdRef);
      onEdgeHoverRef.current?.(null, null);
    });

    // ---- Cursor changes on hover ----
    cy.on("mouseover", "node, edge", () => {
      const container = cy.container();
      if (container) container.style.cursor = "pointer";
    });

    cy.on("mouseout", "node, edge", () => {
      const container = cy.container();
      if (container) container.style.cursor = "default";
    });

    // ---- Fit graph after layout, top-aligned ----
    cy.on("layoutstop", () => {
      cy.fit(undefined, 20);
      // Shift graph to top of canvas instead of vertically centered
      const bb = cy.elements().renderedBoundingBox();
      if (bb && bb.h < cy.height()) {
        const pan = cy.pan();
        cy.pan({ x: pan.x, y: pan.y - (bb.y1 - 20) });
      }
    });
  };

  return (
    <div className={cn("relative w-full h-full bg-muted", className)}>
      <CytoscapeComponent
        elements={elements}
        stylesheet={STYLESHEET}
        className="w-full h-full"
        cy={handleCy}
        wheelSensitivity={0.3}
        minZoom={0.2}
        maxZoom={3}
        boxSelectionEnabled={true}
        autounselectify={false}
      />
    </div>
  );
}

export const ExplorerCytoscape = memo(ExplorerCytoscapeInner);
