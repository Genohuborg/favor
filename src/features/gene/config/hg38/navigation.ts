import type { GeneNavigationSection } from "@features/gene/types";

export const GENE_NAVIGATION_CONFIG: GeneNavigationSection[] = [
  {
    name: "Gene Annotation",
    slug: "gene-level-annotation",
    subCategories: [
      { text: "LLM Summary", slug: "llm-summary" },
      { text: "Info and IDs", slug: "info-and-ids" },

      { text: "Function", slug: "function" },
      { text: "Expression", slug: "expression" },
      { text: "Protein Structure", slug: "protein-structure" },

      { text: "Human Phenotype", slug: "human-phenotype" },
      { text: "Animal Phenotype", slug: "animal-phenotype" },

      {
        text: "Constraints and Haploinsufficiency",
        slug: "constraints-and-heplo",
      },
      { text: "Perturbation", slug: "perturbation" },
      { text: "Variant Effect Maps", slug: "mave" },
      { text: "Functional Partners", slug: "functional-partners" },

      { text: "Graph Explorer", slug: "graph-explorer" },
      { text: "Interaction Neighborhood", slug: "interaction-neighborhood" },
      { text: "Pathway Leverage Map", slug: "pathway-leverage-map" },
    ],
    showIcons: false,
    groups: [
      {
        name: "Overview",
        items: [
          { text: "LLM Summary", slug: "llm-summary" },
          { text: "Info and IDs", slug: "info-and-ids" },
        ],
      },
      {
        name: "Biology",
        items: [
          { text: "Function", slug: "function" },
          { text: "Expression", slug: "expression" },
          { text: "Protein Structure", slug: "protein-structure" },
        ],
      },
      {
        name: "Functional Evidence",
        items: [
          {
            text: "Constraints and Haploinsufficiency",
            slug: "constraints-and-heplo",
          },
          { text: "Perturbation", slug: "perturbation" },
          { text: "Variant Effect Maps", slug: "mave" },
          { text: "Functional Partners", slug: "functional-partners" },
        ],
      },
      {
        name: "Phenotypes",
        items: [
          { text: "Human Phenotype", slug: "human-phenotype" },
          { text: "Animal Phenotype", slug: "animal-phenotype" },
        ],
      },
      {
        name: "Graph Tools",
        items: [
          { text: "Graph Explorer", slug: "graph-explorer" },
          {
            text: "Interaction Neighborhood",
            slug: "interaction-neighborhood",
          },
          { text: "Pathway Leverage Map", slug: "pathway-leverage-map" },
        ],
      },
    ],
  },
  {
    name: "Disease & Therapeutics",
    slug: "disease-and-therapeutics",
    subCategories: [
      { text: "Disease Portfolio", slug: "disease-portfolio" },
      { text: "Phenotype Signature", slug: "phenotype-signature" },
      {
        text: "Tractability & Target Class",
        slug: "tractability-and-target-class",
      },
      { text: "Drug Landscape", slug: "drug-landscape" },
      { text: "Pharmacogenomics", slug: "pharmacogenomics" },
      { text: "Chemical Probes", slug: "chemical-probes" },
      { text: "Target Enabling Package (TEP)", slug: "tep" },
      { text: "Safety Liabilities", slug: "safety-liabilities" },
      { text: "Cancer Hallmarks", slug: "cancer-hallmarks" },
      { text: "Somatic Alterations", slug: "somatic-alterations" },
    ],
    showIcons: false,
    groups: [
      {
        name: "Evidence",
        items: [
          { text: "Disease Portfolio", slug: "disease-portfolio" },
          { text: "Phenotype Signature", slug: "phenotype-signature" },
        ],
      },
      {
        name: "Therapeutic Readiness",
        items: [
          {
            text: "Tractability & Target Class",
            slug: "tractability-and-target-class",
          },
          { text: "Drug Landscape", slug: "drug-landscape" },
          { text: "Pharmacogenomics", slug: "pharmacogenomics" },
          { text: "Chemical Probes", slug: "chemical-probes" },
          { text: "Target Enabling Package (TEP)", slug: "tep" },
        ],
      },
      {
        name: "Safety & Risk",
        items: [{ text: "Safety Liabilities", slug: "safety-liabilities" }],
      },
      {
        name: "Oncology Context",
        items: [
          { text: "Cancer Hallmarks", slug: "cancer-hallmarks" },
          { text: "Somatic Alterations", slug: "somatic-alterations" },
        ],
      },
    ],
  },

  {
    name: "Variants",
    slug: "variants",
    subCategories: [
      { text: "Summary Statistics", slug: "summary-statistics" },
      { text: "Variant Explorer", slug: "variant-explorer" },
    ],
    showIcons: false,
    groups: [
      {
        name: "Overview",
        items: [{ text: "Summary Statistics", slug: "summary-statistics" }],
      },
      {
        name: "Explore",
        items: [{ text: "Variant Explorer", slug: "variant-explorer" }],
      },
    ],
  },

  {
    name: "Cell/Tissue",
    slug: "tissue-specific",
    subCategories: [
      { text: "Overview", slug: "overview" },
      { text: "Tissue Signals", slug: "tissue-signals" },
      { text: "Chromatin States", slug: "chromatin-states" },
      { text: "Enhancer-Genes", slug: "enhancer-genes" },
      { text: "Accessibility", slug: "accessibility" },
      { text: "Loops", slug: "loops" },
      { text: "Allele-Specific", slug: "allele-specific" },
      { text: "Validated Enhancers", slug: "validated-enhancers" },
      { text: "cCRE Links", slug: "ccre-links" },
      { text: "QTLs", slug: "qtls" },
      { text: "ChromBPNet", slug: "chrombpnet" },
      { text: "V2F Scores", slug: "tissue-scores" },
      { text: "AlphaGenome", slug: "alphagenome" },
    ],
    showIcons: false,
    groups: [
      {
        name: "Overview",
        items: [{ text: "Evidence Summary", slug: "overview" }],
      },
      {
        name: "Epigenomic Signals",
        items: [
          { text: "Tissue Signals", slug: "tissue-signals" },
          { text: "Chromatin States", slug: "chromatin-states" },
          { text: "Accessibility", slug: "accessibility" },
        ],
      },
      {
        name: "Regulatory Links",
        items: [
          { text: "Enhancer-Genes", slug: "enhancer-genes" },
          { text: "cCRE Links", slug: "ccre-links" },
        ],
      },
      {
        name: "Chromatin Architecture",
        items: [
          { text: "Loops", slug: "loops" },
          { text: "Allele-Specific", slug: "allele-specific" },
        ],
      },
      {
        name: "Variant Effects",
        items: [
          { text: "QTLs", slug: "qtls" },
          { text: "ChromBPNet", slug: "chrombpnet" },
          { text: "V2F Scores", slug: "tissue-scores" },
        ],
      },
      {
        name: "AI Predictions",
        items: [{ text: "AlphaGenome", slug: "alphagenome" }],
      },
      {
        name: "Validation",
        items: [{ text: "Validated Enhancers", slug: "validated-enhancers" }],
      },
    ],
  },

  {
    name: "Genome Browser",
    slug: "genome-browser",
    subCategories: [],
    groups: [],
  },
];
