import type { ExplorerConfig } from "../explorer-config";

// =============================================================================
// Gene Explorer Configuration
// =============================================================================

export const GENE_EXPLORER_CONFIG: ExplorerConfig = {
  seedEntityType: "Gene",

  templates: [
    // 1) Gene → Disease
    {
      id: "gene-disease",
      name: "Gene \u2192 Disease",
      description:
        "Disease causality \u2014 curated, cancer, and association evidence",
      icon: "heart-pulse",
      color: "#ef4444",
      targetEntityType: "Disease",
      rankBy: {
        field: "ot_score",
        direction: "desc",
        label: "Score",
      },
      steps: [
        {
          branch: [
            {
              edgeTypes: ["GENE_ASSOCIATED_WITH_DISEASE"],
              direction: "out",
              limit: 30,
            },
            {
              edgeTypes: ["GENE_ALTERED_IN_DISEASE"],
              direction: "out",
              limit: 20,
            },
          ],
        },
      ],
      limits: { maxNodes: 250, maxEdges: 800 },
    },

    // 2) Gene → Variant
    {
      id: "gene-variant",
      name: "Gene \u2192 Variant",
      description:
        "ClinVar, coding impact, and regulatory variants implicating this gene",
      icon: "dna",
      color: "#f59e0b",
      targetEntityType: "Variant",
      rankBy: { field: "max_l2g_score", direction: "desc", label: "L2G Score" },
      steps: [
        {
          branch: [
            { edgeTypes: ["VARIANT_AFFECTS_GENE"], direction: "in", limit: 20 },
            { edgeTypes: ["VARIANT_IMPLIES_GENE"], direction: "in", limit: 20 },
          ],
        },
      ],
      limits: { maxNodes: 300, maxEdges: 1000 },
    },

    // 3) Gene → cCRE → Variant (Regulatory)
    {
      id: "gene-regulatory",
      name: "Gene \u2192 cCRE \u2192 Variant",
      description: "cCREs, regulatory circuits, and variant overlap by tissue",
      icon: "microscope",
      color: "#8b5cf6",
      targetEntityType: "Variant",
      steps: [
        {
          edgeTypes: ["CCRE_REGULATES_GENE"],
          direction: "in",
          limit: 20,
        },
        {
          edgeTypes: ["VARIANT_OVERLAPS_CCRE"],
          direction: "in",
          limit: 20,
        },
        {
          edgeTypes: ["VARIANT_IMPLIES_GENE"],
          direction: "out",
          limit: 30,
          overlayOnly: true,
        },
      ],
      limits: { maxNodes: 250, maxEdges: 800 },
    },

    // 4) Gene → Drug
    {
      id: "gene-drug",
      name: "Gene \u2192 Drug",
      description: "Drug targeting, disease indications, and pharmacogenomics",
      icon: "pill",
      color: "#22c55e",
      targetEntityType: "Drug",
      steps: [
        {
          branch: [
            { edgeTypes: ["DRUG_ACTS_ON_GENE"], direction: "in", limit: 15 },
            {
              edgeTypes: ["GENE_AFFECTS_DRUG_RESPONSE"],
              direction: "out",
              limit: 15,
            },
          ],
        },
        {
          edgeTypes: ["DRUG_ACTS_ON_GENE"],
          direction: "out",
          limit: 30,
          overlayOnly: true,
        },
        {
          branch: [
            {
              edgeTypes: ["DRUG_INDICATED_FOR_DISEASE"],
              direction: "out",
              limit: 12,
            },
            {
              edgeTypes: ["VARIANT_ASSOCIATED_WITH_DRUG"],
              direction: "in",
              limit: 12,
            },
          ],
        },
      ],
      limits: { maxNodes: 250, maxEdges: 800 },
    },

    // 5) Gene → Phenotype
    {
      id: "gene-phenotype",
      name: "Gene \u2192 Phenotype",
      description: "Human and mouse phenotypes from gene perturbation",
      icon: "activity",
      color: "#ec4899",
      targetEntityType: "Phenotype",
      steps: [
        {
          edgeTypes: ["GENE_ASSOCIATED_WITH_PHENOTYPE"],
          direction: "out",
          limit: 30,
        },
        {
          edgeTypes: ["PHENOTYPE_HIERARCHY"],
          direction: "out",
          limit: 15,
          overlayOnly: true,
        },
      ],
      limits: { maxNodes: 200, maxEdges: 600 },
    },
  ],

  defaultTemplateId: "gene-disease",

  edgeTypeGroups: [
    {
      label: "Gene \u2192 Disease",
      types: ["GENE_ASSOCIATED_WITH_DISEASE", "GENE_ALTERED_IN_DISEASE"],
    },
    {
      label: "Gene \u2192 Drug",
      types: ["GENE_AFFECTS_DRUG_RESPONSE"],
    },
    {
      label: "Gene \u2192 Gene",
      types: ["GENE_INTERACTS_WITH_GENE", "GENE_PARALOG_OF_GENE"],
    },
    {
      label: "Gene \u2192 Other",
      types: [
        "GENE_PARTICIPATES_IN_PATHWAY",
        "GENE_ASSOCIATED_WITH_PHENOTYPE",
        "GENE_ANNOTATED_WITH_GO_TERM",
        "GENE_ASSOCIATED_WITH_SIDE_EFFECT",
        "GENE_HAS_PROTEIN_DOMAIN",
        "GENE_EXPRESSED_IN_TISSUE",
      ],
    },
    {
      label: "Drug",
      types: [
        "DRUG_ACTS_ON_GENE",
        "DRUG_DISPOSITION_BY_GENE",
        "DRUG_INDICATED_FOR_DISEASE",
        "DRUG_HAS_ADVERSE_EFFECT",
        "DRUG_PAIR_CAUSES_SIDE_EFFECT",
        "DRUG_INTERACTS_WITH_DRUG",
      ],
    },
    {
      label: "Variant",
      types: [
        "VARIANT_IMPLIES_GENE",
        "VARIANT_AFFECTS_GENE",
        "VARIANT_ASSOCIATED_WITH_TRAIT",
        "VARIANT_ASSOCIATED_WITH_DRUG",
        "VARIANT_LINKED_TO_SIDE_EFFECT",
        "VARIANT_OVERLAPS_CCRE",
      ],
    },
    {
      label: "Signal",
      types: [
        "SIGNAL_ASSOCIATED_WITH_TRAIT__Disease",
        "SIGNAL_ASSOCIATED_WITH_TRAIT__Phenotype",
        "SIGNAL_HAS_VARIANT",
        "SIGNAL_IMPLIES_GENE",
      ],
    },
    {
      label: "Other",
      types: [
        "CCRE_REGULATES_GENE",
        "DISEASE_HAS_PHENOTYPE",
        "PHENOTYPE_EQUIVALENT_TO",
        "PHENOTYPE_HIERARCHY",
        "PHENOTYPE_CLOSURE",
        "DISEASE_SUBCLASS_OF_DISEASE",
        "DISEASE_ANCESTOR_OF_DISEASE",
        "PATHWAY_PART_OF_PATHWAY",
        "PATHWAY_ANCESTOR_OF_PATHWAY",
        "PATHWAY_CONTAINS_METABOLITE",
        "METABOLITE_IS_A_METABOLITE",
        "GO_HIERARCHY",
        "GO_CLOSURE",
        "DOMAIN_SUBCLASS_OF_DOMAIN",
        "DOMAIN_ANCESTOR_OF_DOMAIN",
      ],
    },
  ],

  externalLinks: {
    Gene: [
      {
        label: "Ensembl",
        urlTemplate: "https://www.ensembl.org/Homo_sapiens/Gene/Summary?g={id}",
      },
      {
        label: "GeneCards",
        urlTemplate:
          "https://www.genecards.org/cgi-bin/carddisp.pl?gene={label}",
      },
    ],
    Disease: [
      {
        label: "Monarch Initiative",
        urlTemplate: "https://monarchinitiative.org/{id}",
      },
    ],
    Pathway: [
      {
        label: "Reactome",
        urlTemplate: "https://reactome.org/PathwayBrowser/#/{id}",
      },
    ],
    Drug: [
      { label: "DrugBank", urlTemplate: "https://www.drugbank.com/drugs/{id}" },
    ],
  },

  enableVariantTrail: true,
};
