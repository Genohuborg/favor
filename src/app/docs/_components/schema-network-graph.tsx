"use client";

import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import { memo, useCallback, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";

if (typeof cytoscape("layout", "cose-bilkent") === "undefined") {
  cytoscape.use(coseBilkent);
}

/* ------------------------------------------------------------------ */
/*  Schema — module-level const                                        */
/* ------------------------------------------------------------------ */

const NODE_META: Record<string, { bg: string; border: string; label: string }> =
  {
    Gene: { bg: "#dbeafe", border: "#3b82f6", label: "Gene" },
    Variant: { bg: "#fef3c7", border: "#f59e0b", label: "Variant" },
    Disease: { bg: "#fee2e2", border: "#ef4444", label: "Disease" },
    Drug: { bg: "#d1fae5", border: "#10b981", label: "Drug" },
    Phenotype: { bg: "#fae8ff", border: "#d946ef", label: "Phenotype" },
    Signal: { bg: "#e0e7ff", border: "#6366f1", label: "Signal" },
    Pathway: { bg: "#ede9fe", border: "#8b5cf6", label: "Pathway" },
    GOTerm: { bg: "#dcfce7", border: "#16a34a", label: "GO Term" },
    Tissue: { bg: "#ccfbf1", border: "#14b8a6", label: "Tissue" },
    ProteinDomain: {
      bg: "#ede9fe",
      border: "#7c3aed",
      label: "Protein Domain",
    },
    SideEffect: { bg: "#fef9c3", border: "#ca8a04", label: "Side Effect" },
    cCRE: { bg: "#cffafe", border: "#0891b2", label: "cCRE" },
    Metabolite: { bg: "#fce7f3", border: "#db2777", label: "Metabolite" },
    CellType: { bg: "#dbeafe", border: "#2563eb", label: "Cell Type" },
  };

interface SchemaEdge {
  from: string;
  to: string;
  label: string;
  sources: string[];
}

const SCHEMA_EDGES: SchemaEdge[] = [
  // Disease genetics
  {
    from: "Gene",
    to: "Disease",
    label: "associated with",
    sources: ["OpenTargets", "PharmGKB", "GWAS Catalog", "OMIM", "Orphanet"],
  },
  {
    from: "Gene",
    to: "Disease",
    label: "altered in",
    sources: ["TCGA", "COSMIC", "cBioPortal"],
  },
  {
    from: "Variant",
    to: "Disease",
    label: "associated with",
    sources: ["GWAS Catalog"],
  },
  {
    from: "Disease",
    to: "Phenotype",
    label: "has phenotype",
    sources: ["HPO", "OMIM", "Orphanet"],
  },
  { from: "Gene", to: "Phenotype", label: "associated with", sources: ["HPO"] },

  // Pharmacogenomics
  {
    from: "Drug",
    to: "Gene",
    label: "acts on",
    sources: ["OpenTargets", "ChEMBL", "DrugCentral"],
  },
  {
    from: "Drug",
    to: "Gene",
    label: "disposition by",
    sources: ["PharmGKB", "DrugCentral"],
  },
  {
    from: "Gene",
    to: "Drug",
    label: "affects response",
    sources: ["PharmGKB"],
  },
  {
    from: "Variant",
    to: "Drug",
    label: "associated with",
    sources: ["OpenTargets", "PharmGKB"],
  },
  {
    from: "Drug",
    to: "Disease",
    label: "indicated for",
    sources: ["OpenTargets", "ChEMBL"],
  },
  {
    from: "Drug",
    to: "Drug",
    label: "interacts with",
    sources: ["ChEMBL", "DrugCentral"],
  },
  {
    from: "Drug",
    to: "SideEffect",
    label: "adverse effect",
    sources: ["OnSIDES", "OFFSIDES", "DrugCentral"],
  },
  {
    from: "Drug",
    to: "SideEffect",
    label: "pair causes",
    sources: ["TWOSIDES"],
  },
  {
    from: "Gene",
    to: "SideEffect",
    label: "associated with",
    sources: ["PharmGKB"],
  },
  {
    from: "Variant",
    to: "SideEffect",
    label: "linked to",
    sources: ["PharmGKB"],
  },

  // Functional biology
  {
    from: "Gene",
    to: "Pathway",
    label: "participates in",
    sources: ["Reactome", "ConsensusPathDB"],
  },
  { from: "Gene", to: "GOTerm", label: "annotated with", sources: ["GOA"] },
  {
    from: "Gene",
    to: "ProteinDomain",
    label: "has domain",
    sources: ["InterPro"],
  },
  {
    from: "Gene",
    to: "Tissue",
    label: "expressed in",
    sources: ["GTEx", "HPA"],
  },
  {
    from: "Pathway",
    to: "Metabolite",
    label: "contains",
    sources: ["Reactome", "ChEBI"],
  },

  // GWAS provenance
  {
    from: "Signal",
    to: "Disease",
    label: "associated with",
    sources: ["GWAS Catalog"],
  },
  {
    from: "Signal",
    to: "Phenotype",
    label: "associated with",
    sources: ["GWAS Catalog"],
  },
  {
    from: "Signal",
    to: "Variant",
    label: "has variant",
    sources: ["GWAS Catalog"],
  },
  {
    from: "Signal",
    to: "Gene",
    label: "implies gene",
    sources: ["OpenTargets L2G"],
  },

  // Regulatory
  { from: "Variant", to: "cCRE", label: "overlaps", sources: ["ENCODE v4"] },
  {
    from: "cCRE",
    to: "Gene",
    label: "regulates",
    sources: ["ENCODE", "GTEx eQTL"],
  },
  {
    from: "Variant",
    to: "Gene",
    label: "implies",
    sources: ["ClinVar", "OpenTargets", "GWAS Catalog"],
  },
  {
    from: "Variant",
    to: "Gene",
    label: "affects",
    sources: ["GENCODE", "ENCODE", "COSMIC"],
  },

  // Molecular interactions
  {
    from: "Gene",
    to: "Gene",
    label: "interacts with",
    sources: ["BioGRID", "IntAct", "STRING", "Reactome"],
  },
  {
    from: "Gene",
    to: "Gene",
    label: "paralog of",
    sources: ["Ensembl Compara"],
  },
];

/* ------------------------------------------------------------------ */
/*  Pre-compute                                                        */
/* ------------------------------------------------------------------ */

interface DedupedEdge {
  from: string;
  to: string;
  relationships: { label: string; sources: string[] }[];
}

function buildDedupedEdges(edges: SchemaEdge[]): DedupedEdge[] {
  const map = new Map<string, DedupedEdge>();
  for (const e of edges) {
    const key = `${e.from}|${e.to}`;
    const existing = map.get(key);
    if (existing) {
      existing.relationships.push({ label: e.label, sources: e.sources });
    } else {
      map.set(key, {
        from: e.from,
        to: e.to,
        relationships: [{ label: e.label, sources: e.sources }],
      });
    }
  }
  return Array.from(map.values());
}

const DEDUPED_EDGES = buildDedupedEdges(SCHEMA_EDGES);

const NODE_DEGREES: Record<string, number> = {};
for (const e of SCHEMA_EDGES) {
  NODE_DEGREES[e.from] = (NODE_DEGREES[e.from] || 0) + 1;
  NODE_DEGREES[e.to] = (NODE_DEGREES[e.to] || 0) + 1;
}
const MAX_DEG = Math.max(...Object.values(NODE_DEGREES), 1);

/* ------------------------------------------------------------------ */
/*  Precomputed tooltip HTML                                           */
/* ------------------------------------------------------------------ */

const EDGE_TOOLTIPS: Record<string, string> = {};
const NODE_TOOLTIPS: Record<string, string> = {};

for (const nodeType of Object.keys(NODE_META)) {
  const meta = NODE_META[nodeType];
  const connected = SCHEMA_EDGES.filter(
    (e) => e.from === nodeType || e.to === nodeType,
  );
  const allSources = [...new Set(connected.flatMap((e) => e.sources))].sort();

  NODE_TOOLTIPS[nodeType] = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <div style="width:14px;height:14px;border-radius:50%;border:2.5px solid ${meta.border};background:${meta.bg};flex-shrink:0"></div>
      <span style="font-size:14px;font-weight:700">${meta.label}</span>
      <span style="font-size:11px;color:var(--muted-foreground)">${connected.length} edge types</span>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">
      ${allSources.map((s) => `<span style="font-size:10px;padding:2px 7px;border-radius:5px;background:var(--muted);color:var(--muted-foreground);font-weight:500;white-space:nowrap">${s}</span>`).join("")}
    </div>
  `;
}

/* ------------------------------------------------------------------ */
/*  Stable Cytoscape elements                                          */
/* ------------------------------------------------------------------ */

const ELEMENTS: cytoscape.ElementDefinition[] = [
  ...Object.keys(NODE_META).map((t) => {
    const deg = NODE_DEGREES[t] || 0;
    const meta = NODE_META[t];
    return {
      data: {
        id: t,
        label: meta.label,
        bg: meta.bg,
        border: meta.border,
        size: 44 + (deg / MAX_DEG) * 36,
      },
    };
  }),
  ...DEDUPED_EDGES.map((e, i) => {
    const edgeId = `e${i}`;
    const allSources = [...new Set(e.relationships.flatMap((r) => r.sources))];
    const fromMeta = NODE_META[e.from];
    const toMeta = NODE_META[e.to];

    EDGE_TOOLTIPS[edgeId] = `
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <span style="font-size:11px;font-weight:600;color:${fromMeta.border};background:${fromMeta.bg};padding:2px 8px;border-radius:6px;border:1.5px solid ${fromMeta.border}">${fromMeta.label}</span>
        <span style="color:var(--muted-foreground);font-size:11px">\u2192</span>
        <span style="font-size:11px;font-weight:600;color:${toMeta.border};background:${toMeta.bg};padding:2px 8px;border-radius:6px;border:1.5px solid ${toMeta.border}">${toMeta.label}</span>
      </div>
      ${e.relationships.map((r) => `<div style="font-size:11px;color:var(--foreground);font-weight:500;margin-bottom:2px">${r.label}</div>`).join("")}
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">
        ${allSources.map((s) => `<span style="font-size:10px;padding:2px 7px;border-radius:5px;background:var(--muted);color:var(--muted-foreground);font-weight:500;white-space:nowrap">${s}</span>`).join("")}
      </div>
    `;

    return {
      data: {
        id: edgeId,
        source: e.from,
        target: e.to,
        width: Math.min(1.2 + e.relationships.length * 0.5, 3),
      },
    };
  }),
];

/* ------------------------------------------------------------------ */
/*  Stylesheet — clean, no edge labels in resting state                */
/* ------------------------------------------------------------------ */

const STYLESHEET: cytoscape.StylesheetStyle[] = [
  {
    selector: "node",
    style: {
      label: "data(label)",
      "background-color": "data(bg)",
      "border-color": "data(border)",
      "border-width": 2,
      width: "data(size)",
      height: "data(size)",
      "font-size": 10,
      "font-weight": 600,
      "text-valign": "bottom",
      "text-halign": "center",
      "text-margin-y": 6,
      "text-wrap": "wrap",
      "text-max-width": "72px",
      color: "#334155",
      "overlay-padding": 6,
    },
  },
  {
    selector: "node:active",
    style: { "overlay-opacity": 0.06 },
  },
  {
    selector: "edge",
    style: {
      "line-color": "#94a3b8",
      width: "data(width)",
      "curve-style": "bezier",
      "target-arrow-shape": "triangle",
      "target-arrow-color": "#94a3b8",
      "arrow-scale": 0.5,
      opacity: 0.2,
    },
  },
  // Highlighted states
  {
    selector: "node.highlighted",
    style: {
      "border-width": 3,
      "font-size": 11,
      "font-weight": 700,
      "z-index": 10,
    },
  },
  {
    selector: "node.seed-highlight",
    style: {
      "border-width": 4,
      "font-size": 12,
      "font-weight": 700,
      "z-index": 11,
      "background-opacity": 1,
    },
  },
  {
    selector: "edge.highlighted",
    style: {
      "line-color": "#6366f1",
      "target-arrow-color": "#6366f1",
      opacity: 0.7,
      width: 2.5,
      "z-index": 10,
    },
  },
  {
    selector: "edge.edge-focus",
    style: {
      "line-color": "#6366f1",
      "target-arrow-color": "#6366f1",
      opacity: 1,
      width: 3,
      "z-index": 11,
    },
  },
  // Dimmed
  {
    selector: "node.dimmed",
    style: { opacity: 0.1 },
  },
  {
    selector: "edge.dimmed",
    style: { opacity: 0.03 },
  },
];

const LEGEND_ENTRIES = Object.entries(NODE_META).map(([type, m]) => ({
  type,
  label: m.label,
  bg: m.bg,
  border: m.border,
}));

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const SchemaNetworkGraph = memo(function SchemaNetworkGraph() {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = (html: string) => {
    const el = tooltipRef.current;
    if (el) {
      el.style.display = "block";
      el.innerHTML = html;
    }
  };

  const hideTooltip = () => {
    const el = tooltipRef.current;
    if (el) el.style.display = "none";
  };

  const handleCy = useCallback(
    (cy: cytoscape.Core) => {
      cy.layout({
        name: "cose-bilkent",
        animate: false,
        nodeDimensionsIncludeLabels: true,
        idealEdgeLength: 150,
        nodeRepulsion: 10000,
        edgeElasticity: 0.08,
        gravity: 0.3,
        gravityRange: 5,
        fit: true,
        padding: 50,
        randomize: true,
        numIter: 3000,
      } as cytoscape.LayoutOptions).run();

      // Node hover
      cy.on("mouseover", "node", (evt) => {
        const node = evt.target;
        const nodeId = node.data("id") as string;
        showTooltip(NODE_TOOLTIPS[nodeId] || "");

        const connected = node.connectedEdges();
        const neighbors = connected.connectedNodes();
        cy.elements().addClass("dimmed");
        node.removeClass("dimmed").addClass("seed-highlight");
        connected.removeClass("dimmed").addClass("highlighted");
        neighbors.removeClass("dimmed").addClass("highlighted");
      });

      cy.on("mouseout", "node", () => {
        hideTooltip();
        cy.elements().removeClass("dimmed highlighted seed-highlight");
      });

      // Edge hover
      cy.on("mouseover", "edge", (evt) => {
        const edge = evt.target;
        const edgeId = edge.data("id") as string;
        showTooltip(EDGE_TOOLTIPS[edgeId] || "");

        cy.elements().addClass("dimmed");
        edge.removeClass("dimmed").addClass("edge-focus");
        edge.source().removeClass("dimmed").addClass("highlighted");
        edge.target().removeClass("dimmed").addClass("highlighted");
      });

      cy.on("mouseout", "edge", () => {
        hideTooltip();
        cy.elements().removeClass("dimmed highlighted edge-focus");
      });
    },
    [hideTooltip, showTooltip],
  );

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="relative h-[560px]">
        <CytoscapeComponent
          elements={ELEMENTS}
          stylesheet={STYLESHEET}
          cy={handleCy}
          wheelSensitivity={0.3}
          minZoom={0.4}
          maxZoom={2.5}
          boxSelectionEnabled={false}
          autounselectify
          className="w-full h-full"
        />

        <div
          ref={tooltipRef}
          className="absolute top-3 right-3 rounded-xl border border-border bg-background/95 backdrop-blur-sm px-4 py-3 shadow-lg max-w-[280px] text-foreground pointer-events-none"
          style={{ display: "none", zIndex: 10 }}
        />
      </div>

      {/* Legend */}
      <div className="border-t border-border px-5 py-3">
        <div className="flex flex-wrap gap-x-3.5 gap-y-1.5">
          {LEGEND_ENTRIES.map((e) => (
            <div key={e.type} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full border-[1.5px]"
                style={{ backgroundColor: e.bg, borderColor: e.border }}
              />
              <span className="text-[11px] text-muted-foreground">
                {e.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
