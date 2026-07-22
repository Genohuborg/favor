import { myProvider } from "@/lib/ai";
import { streamText } from "ai";
import type { Variant } from "@/lib/variant/types";
import { fetchVariant } from "@/lib/variant/api";
import { fetchGnomadExome, fetchGnomadGenome } from "@/lib/variant/gnomad/api";
import { getCCREByVCF } from "@/lib/variant/ccre/api";
import { fetchCV2F } from "@/lib/variant/cv2f/api";
import { fetchPGBoost } from "@/lib/variant/pgboost/api";
import { fetchScentTissueByVCF } from "@/lib/variant/scent/api";
import { fetchEQTL } from "@/lib/variant/eqtl/api";
import { fetchGWAS } from "@/lib/variant/gwas/api";
import { fetchChiaPet, separateChiaPetData } from "@/lib/variant/chiapet/api";
import { fetchCRISPR } from "@/lib/variant/crispr/api";
import { prisma } from "@/lib/prisma";
import { waitUntil } from "@vercel/functions";
import {
  formatProteinFunctionScores,
  formatConservationScores,
  formatSplicingScores,
  formatIntegrativeScores,
  formatEpigeneticsSection,
  formatMutationRateScores,
  formatAlphaMissenseScores,
  formatBasicInfo,
  formatEpigeneticMarks,
} from "@/lib/variant/summary/formatters";
import { shouldIncludeField } from "@/lib/variant/summary/threshold-lookup";

export const maxDuration = 300;

// Type definition for all variant data sources
export type VariantContext = {
  variant: Variant;
  gnomadExome: any | null;
  gnomadGenome: any | null;
  ccreData: any[] | null;
  cv2fData: any | null;
  pgboostData: any | null;
  scentData: any[] | null;
  eqtlData: any[] | null;
  gwasData: any[] | null;
  chiapetData: any[] | null;
  crisprData: any[] | null;
};

// Aggregation helper functions
function aggregateEQTLData(eqtlData: any[]) {
  if (!eqtlData || eqtlData.length === 0) return null;

  // Filter out null/undefined entries and entries without required fields
  const validData = eqtlData.filter((e) => e && e.gene_name && e.tissue && e.p_value !== undefined);

  if (validData.length === 0) return null;

  const uniqueGenes = new Set(validData.map((e) => e.gene_name));
  const uniqueTissues = new Set(validData.map((e) => e.tissue));

  // Group by gene, get strongest association per gene
  const geneMap = new Map<string, any[]>();
  validData.forEach((e) => {
    if (!geneMap.has(e.gene_name)) {
      geneMap.set(e.gene_name, []);
    }
    geneMap.get(e.gene_name)!.push(e);
  });

  // Get top 5 genes by strongest p-value
  const topGenes = Array.from(geneMap.entries())
    .map(([gene, associations]) => {
      const strongest = associations.sort((a, b) => {
        const aP = parseFloat(String(a.p_value || Infinity));
        const bP = parseFloat(String(b.p_value || Infinity));
        return aP - bP;
      })[0];
      return { gene, ...strongest };
    })
    .sort((a, b) => {
      const aP = parseFloat(String(a.p_value || Infinity));
      const bP = parseFloat(String(b.p_value || Infinity));
      return aP - bP;
    })
    .slice(0, 5);

  // Count tissue distribution
  const tissueCount = new Map<string, number>();
  validData.forEach((e) => {
    tissueCount.set(e.tissue, (tissueCount.get(e.tissue) || 0) + 1);
  });
  const topTissues = Array.from(tissueCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tissue]) => tissue);

  return {
    totalGenes: uniqueGenes.size,
    totalTissues: uniqueTissues.size,
    totalAssociations: validData.length,
    topGenes,
    topTissues,
  };
}

function aggregateGWASData(gwasData: any[]) {
  if (!gwasData || gwasData.length === 0) return null;

  // Filter out null/undefined entries and entries without required fields
  const validData = gwasData.filter((g) => g && g.gwas_disease_trait && g.gwas_p_value_mlog);

  if (validData.length === 0) return null;

  // Group by trait and keep only the strongest association per trait
  const traitMap = new Map<string, any>();
  validData.forEach((g) => {
    const trait = g.gwas_disease_trait;
    const pValue = parseFloat(String(g.gwas_p_value_mlog || 0));

    if (!traitMap.has(trait) || pValue > parseFloat(String(traitMap.get(trait).gwas_p_value_mlog || 0))) {
      // Remove efo_hierarchy and keep only essential fields
      const { efo_hierarchy, ...essentialFields } = g;
      traitMap.set(trait, essentialFields);
    }
  });

  // Get top 10 most significant unique traits
  const topAssociations = Array.from(traitMap.values())
    .sort((a, b) => {
      const pA = parseFloat(String(a.gwas_p_value_mlog || 0));
      const pB = parseFloat(String(b.gwas_p_value_mlog || 0));
      return pB - pA; // Higher -log10 p-value = stronger association
    })
    .slice(0, 10);

  return {
    totalAssociations: validData.length,
    uniqueTraits: traitMap.size,
    topAssociations,
  };
}

function aggregateSCENTData(scentData: any[]) {
  if (!scentData || scentData.length === 0) return null;

  const uniqueGenes = new Set(scentData.filter((s) => s.gene).map((s) => s.gene));
  const uniqueTissues = new Set(scentData.filter((s) => s.tissue).map((s) => s.tissue));

  // Group by gene
  const geneMap = new Map<string, Set<string>>();
  scentData.forEach((s) => {
    if (s.gene && s.tissue) {
      if (!geneMap.has(s.gene)) {
        geneMap.set(s.gene, new Set());
      }
      geneMap.get(s.gene)!.add(s.tissue);
    }
  });

  // Get top genes by tissue count
  const topGenes = Array.from(geneMap.entries())
    .map(([gene, tissues]) => ({ gene, tissueCount: tissues.size, tissues: Array.from(tissues) }))
    .sort((a, b) => b.tissueCount - a.tissueCount)
    .slice(0, 5);

  return {
    totalGenes: uniqueGenes.size,
    totalTissues: uniqueTissues.size,
    totalLinks: scentData.length,
    topGenes,
  };
}

function aggregatePGBoostData(pgboostData: any) {
  // Validate input is an array
  if (!pgboostData || !Array.isArray(pgboostData) || pgboostData.length === 0) {
    return null;
  }

  // Filter out null/undefined entries and entries without required fields
  const validData = pgboostData.filter((pg) => {
    try {
      return (
        pg &&
        typeof pg === 'object' &&
        pg.gene &&
        pg.pg_boost !== null &&
        pg.pg_boost !== undefined &&
        pg.pg_boost_percentile !== null &&
        pg.pg_boost_percentile !== undefined
      );
    } catch (e) {
      return false;
    }
  });

  if (validData.length === 0) return null;

  // Sort by percentile (defensive against null values)
  const sorted = [...validData].sort((a, b) => {
    try {
      const aPercentile = parseFloat(String(a.pg_boost_percentile || 0));
      const bPercentile = parseFloat(String(b.pg_boost_percentile || 0));
      return bPercentile - aPercentile;
    } catch (e) {
      return 0;
    }
  });

  // Filter for high-confidence connections (90th percentile or higher)
  const highConfidence = sorted.filter((pg) => {
    try {
      const percentile = parseFloat(String(pg.pg_boost_percentile));
      return !isNaN(percentile) && percentile >= 90;
    } catch (e) {
      return false;
    }
  });

  // Take top 5 (either high-confidence or overall top)
  let topConnections = highConfidence.length >= 3
    ? highConfidence.slice(0, 5)
    : sorted.slice(0, 5);

  // Final safety filter - ensure no nulls slipped through
  topConnections = topConnections.filter((pg) => {
    try {
      return pg && pg.gene && pg.pg_boost_percentile !== null && pg.pg_boost_percentile !== undefined;
    } catch (e) {
      return false;
    }
  });

  return {
    totalConnections: validData.length,
    highConfidenceCount: highConfidence.length,
    topConnections,
  };
}

function aggregateCCREData(ccreData: any[]) {
  if (!ccreData || ccreData.length === 0) return null;

  // Filter out null/undefined entries and entries without annotations
  const validData = ccreData.filter((c) => c && c.annotations);

  if (validData.length === 0) return null;

  // Group by regulatory element type
  const typeCount = new Map<string, number>();
  validData.forEach((c) => {
    typeCount.set(c.annotations, (typeCount.get(c.annotations) || 0) + 1);
  });

  const types = Array.from(typeCount.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalElements: validData.length,
    types,
  };
}

function aggregateChiaPetData(chiapetData: any[]) {
  if (!chiapetData || chiapetData.length === 0) return null;

  // Filter valid data
  const validData = chiapetData.filter((c) => c && c.gene_name && c.assay_type);

  if (validData.length === 0) return null;

  // Separate by assay type
  const rnapii = validData.filter((c) => c.assay_type === "RNAPII-ChIAPET");
  const intactHic = validData.filter((c) => c.assay_type === "Intact-HiC");

  // Get unique genes for each type
  const rnapiiGenes = new Set(rnapii.map((c) => c.gene_name));
  const intactHicGenes = new Set(intactHic.map((c) => c.gene_name));

  // Get top genes by p-value for each type
  const getTopGenes = (data: any[], limit = 5) => {
    return data
      .filter((c) => c.p_value !== undefined && c.p_value !== null)
      .sort((a, b) => {
        const pA = parseFloat(String(a.p_value || Infinity));
        const pB = parseFloat(String(b.p_value || Infinity));
        return pA - pB; // Lower p-value = stronger
      })
      .slice(0, limit)
      .map((c) => ({
        gene: c.gene_name,
        biosample: c.biosample,
        pValue: c.p_value,
        score: c.score,
      }));
  };

  return {
    totalLinks: validData.length,
    rnapii: {
      count: rnapii.length,
      uniqueGenes: rnapiiGenes.size,
      topGenes: getTopGenes(rnapii),
    },
    intactHic: {
      count: intactHic.length,
      uniqueGenes: intactHicGenes.size,
      topGenes: getTopGenes(intactHic),
    },
  };
}

function aggregateCRISPRData(crisprData: any[]) {
  if (!crisprData || crisprData.length === 0) return null;

  // Filter valid data
  const validData = crisprData.filter((c) => c && c.gene_name && c.effect_size !== undefined);

  if (validData.length === 0) return null;

  const uniqueGenes = new Set(validData.map((c) => c.gene_name));

  // Get top genes by effect size and p-value
  const topGenes = validData
    .filter((c) => c.p_value !== undefined && c.p_value !== null)
    .sort((a, b) => {
      const pA = parseFloat(String(a.p_value || Infinity));
      const pB = parseFloat(String(b.p_value || Infinity));
      return pA - pB; // Lower p-value = stronger
    })
    .slice(0, 5)
    .map((c) => ({
      gene: c.gene_name,
      biosample: c.biosample,
      effectSize: c.effect_size,
      pValue: c.p_value,
      assayType: c.assay_type,
    }));

  return {
    totalLinks: validData.length,
    uniqueGenes: uniqueGenes.size,
    topGenes,
  };
}

/**
 * Pure data collection function - fetches all variant data sources
 */
async function collectVariantContext(vcf: string): Promise<VariantContext> {
  const variant = await fetchVariant(vcf);

  if (!variant) {
    throw new Error("Variant not found");
  }

  const [gnomadExome, gnomadGenome, ccreData, cv2fData, pgboostData, scentData, eqtlData, gwasData, chiapetData, crisprData] = await Promise.all([
    fetchGnomadExome(vcf).catch(err => {
      console.error(`Failed to fetch gnomAD exome for ${vcf}:`, err);
      return null;
    }),
    fetchGnomadGenome(vcf).catch(err => {
      console.error(`Failed to fetch gnomAD genome for ${vcf}:`, err);
      return null;
    }),
    getCCREByVCF(vcf, 0).catch(err => {
      console.error(`Failed to fetch CCRE for ${vcf}:`, err);
      return null;
    }),
    variant.rsid && variant.rsid !== "NA"
      ? fetchCV2F(variant.rsid).catch(err => {
          console.error(`Failed to fetch CV2F for ${variant.rsid}:`, err);
          return null;
        })
      : Promise.resolve(null),
    variant.rsid && variant.rsid !== "NA"
      ? fetchPGBoost(variant.rsid).catch(err => {
          console.error(`Failed to fetch PGBoost for ${variant.rsid}:`, err);
          return null;
        })
      : Promise.resolve(null),
    fetchScentTissueByVCF(vcf, 0).catch(err => {
      console.error(`Failed to fetch SCENT for ${vcf}:`, err);
      return null;
    }),
    fetchEQTL(vcf).catch(err => {
      console.error(`Failed to fetch eQTL for ${vcf}:`, err);
      return null;
    }),
    fetchGWAS(vcf).catch(err => {
      console.error(`Failed to fetch GWAS for ${vcf}:`, err);
      return null;
    }),
    fetchChiaPet(vcf).catch(err => {
      console.error(`Failed to fetch ChIA-PET for ${vcf}:`, err);
      return null;
    }),
    fetchCRISPR(vcf).catch(err => {
      console.error(`Failed to fetch CRISPR for ${vcf}:`, err);
      return null;
    }),
  ]);

  return {
    variant,
    gnomadExome,
    gnomadGenome,
    ccreData,
    cv2fData,
    pgboostData,
    scentData,
    eqtlData,
    gwasData,
    chiapetData,
    crisprData,
  };
}

/**
 * Build structured JSON object from variant context matching extraction JSON structure
 */
function buildVariantJSON(ctx: VariantContext): any {
  const { variant, gnomadExome, gnomadGenome, ccreData, cv2fData, pgboostData, scentData, eqtlData, gwasData, chiapetData, crisprData } = ctx;

  const categories: any = {};

  // Basic Information & Genomic Context (combined)
  const basic: any[] = [];
  basic.push({
    field: "Variant",
    value: variant.variant_vcf,
    tooltip: "The unique identifier of the given variant, Reported as chr-pos-ref-alt format."
  });
  if (variant.rsid && variant.rsid !== "NA") {
    basic.push({
      field: "rsID",
      value: variant.rsid,
      tooltip: "The rsID of the given variant (if exists)."
    });
  }
  if (variant.filter_status) {
    basic.push({
      field: "TOPMed QC Status",
      value: variant.filter_status,
      tooltip: "TOPMed QC status of the given variant."
    });
  }
  if (variant.bravo_an !== null) {
    basic.push({
      field: "TOPMed Bravo AN",
      value: variant.bravo_an,
      tooltip: "TOPMed Bravo Genome Allele Number. (NHLBI TOPMed Consortium, 2018; Taliun et al., 2019)"
    });
  }

  // Add genomic context items to basic
  if (variant.genecode_comprehensive_info) {
    basic.push({
      field: "Genecode Comprehensive Info",
      value: variant.genecode_comprehensive_info,
      tooltip: "Identify whether variants cause protein coding changes using Gencode genes definition systems, it will label the gene name of the variants has impact, if it is intergenic region, the nearby gene name will be labeled in the annotation. (Frankish et al., 2018; Harrow et al., 2012)"
    });
  }
  if (variant.genecode_comprehensive_category) {
    basic.push({
      field: "Genecode Comprehensive Category",
      value: variant.genecode_comprehensive_category,
      tooltip: "Identify whether variants cause protein coding changes using Gencode genes definition systems. Categories include: Exonic (within protein-coding regions), UTR (untranslated regions), Intronic (within gene introns), Downstream (downstream of genes), Upstream (upstream of genes), Intergenic (between genes), and Splicing (affecting splice sites). (Frankish et al., 2018; Harrow et al., 2012)"
    });
  }
  if (variant.genecode_comprehensive_exonic_category) {
    basic.push({
      field: "Genecode Comprehensive Exonic Category",
      value: variant.genecode_comprehensive_exonic_category,
      tooltip: "Identify variants impact using Gencode exonic definition. Categories include: Stopgain (introduces stop codon), Stoploss (removes stop codon), Nonsynonymous SNV (changes amino acid), Synonymous SNV (doesn't change amino acid), Frameshift insertion/deletion/substitution, and Nonframeshift insertion/deletion/substitution. (Frankish et al., 2018; Harrow et al., 2012)"
    });
  }
  if (variant.metasvm_pred && variant.metasvm_pred !== 'T') {
    basic.push({
      field: "MetaSVM Prediction",
      value: variant.metasvm_pred,
      tooltip: "Identify whether the variant is a disruptive missense variant, defined as 'disruptive' by the ensemble MetaSVM annotation. D (Deleterious): likely to affect protein function. T (Tolerated): unlikely to affect protein function. (Dong et al., 2014)"
    });
  }
  if (variant.cage_promoter) {
    basic.push({
      field: "CAGE Promoter",
      value: variant.cage_promoter,
      tooltip: "CAGE defined promoter sites from Fantom 5. Yes: variant overlaps with CAGE promoter site. No: variant does not overlap with CAGE promoter site. (Forrest et al., 2014)"
    });
  }
  if (variant.cage_enhancer) {
    basic.push({
      field: "CAGE Enhancer",
      value: variant.cage_enhancer,
      tooltip: "CAGE defined enhancer sites from Fantom 5. Yes: variant overlaps with CAGE enhancer site. No: variant does not overlap with CAGE enhancer site. (Forrest et al., 2014)"
    });
  }
  if (variant.genehancer) {
    basic.push({
      field: "GeneHancer",
      value: variant.genehancer,
      tooltip: "Predicted human enhancer sites from the GeneHancer database. (Fishilevich et al., 2017)"
    });
  }
  if (variant.super_enhancer) {
    basic.push({
      field: "Super Enhancer",
      value: variant.super_enhancer,
      tooltip: "Predicted super-enhancer sites and targets in a range of human cell types. (Hnisz et al., 2013)"
    });
  }
  if (basic.length > 0) categories.Basic = { label: "Basic Information & Genomic Context", items: basic };

  // Population Genetics (moved before ClinVar, includes allele frequencies)
  const population: any[] = [];

  // Add overall allele frequencies
  if (variant.bravo_af !== null) {
    population.push({
      field: "TOPMed Bravo AF",
      value: variant.bravo_af,
      tooltip: "TOPMed Bravo Genome Allele Frequency. (NHLBI TOPMed Consortium, 2018; Taliun et al., 2019)"
    });
  }
  if (variant.af_total !== null) {
    population.push({
      field: "Total GNOMAD AF",
      value: variant.af_total,
      tooltip: "GNOMAD v3 Genome Allele Frequency using all the samples. (GNOMAD Consortium, 2019; Karczewski et al., 2020)"
    });
  }
  if (variant.tg_all !== null) {
    population.push({
      field: "All 1000 Genomes AF",
      value: variant.tg_all,
      tooltip: "1000 Genome Allele Frequency (Whole genome allele frequencies from the 1000 Genomes Project phase 3 data)."
    });
  }

  // Add ancestry-specific frequencies
  const hasV4Ancestry = gnomadGenome && (gnomadGenome.af_afr || gnomadGenome.af_amr || gnomadGenome.af_eas || gnomadGenome.af_nfe || gnomadGenome.af_sas);
  const hasV3Ancestry = variant.af_afr !== null || variant.af_amr !== null || variant.af_eas !== null || variant.af_nfe !== null || variant.af_sas !== null;

  if (hasV4Ancestry) {
    if (gnomadGenome.af_afr) population.push({ field: "AFR (African)", value: gnomadGenome.af_afr, source: "gnomAD v4 Genome" });
    if (gnomadGenome.af_amr) population.push({ field: "AMR (Ad Mixed American)", value: gnomadGenome.af_amr, source: "gnomAD v4 Genome" });
    if (gnomadGenome.af_eas) population.push({ field: "EAS (East Asian)", value: gnomadGenome.af_eas, source: "gnomAD v4 Genome" });
    if (gnomadGenome.af_nfe) population.push({ field: "NFE (Non-Finnish European)", value: gnomadGenome.af_nfe, source: "gnomAD v4 Genome" });
    if (gnomadGenome.af_sas) population.push({ field: "SAS (South Asian)", value: gnomadGenome.af_sas, source: "gnomAD v4 Genome" });
  } else if (hasV3Ancestry) {
    if (variant.af_afr !== null) population.push({ field: "AFR (African)", value: variant.af_afr, source: "gnomAD v3" });
    if (variant.af_amr !== null) population.push({ field: "AMR (Ad Mixed American)", value: variant.af_amr, source: "gnomAD v3" });
    if (variant.af_eas !== null) population.push({ field: "EAS (East Asian)", value: variant.af_eas, source: "gnomAD v3" });
    if (variant.af_nfe !== null) population.push({ field: "NFE (Non-Finnish European)", value: variant.af_nfe, source: "gnomAD v3" });
    if (variant.af_sas !== null) population.push({ field: "SAS (South Asian)", value: variant.af_sas, source: "gnomAD v3" });
  }

  if (population.length > 0) {
    categories.Population = {
      label: "Population Genetics",
      interpretation: "Rare (MAF < 0.0001), Low Frequency (0.0001 ≤ MAF < 0.01), Common (MAF ≥ 0.01)",
      items: population
    };
  }

  // ClinVar (now comes after Population)
  const clinvar: any[] = [];
  if (variant.clnsig) {
    clinvar.push({
      field: "Clinical Significance",
      value: variant.clnsig,
      tooltip: "Clinical significance for this single variant. (Landrum et al., 2017, 2013)"
    });
  }
  if (variant.clndn) {
    clinvar.push({
      field: "Disease Name",
      value: variant.clndn,
      tooltip: "ClinVar's preferred disease name for the concept specified by disease identifiers in CLNDISDB. (Landrum et al., 2017, 2013)"
    });
  }
  if (variant.clnrevstat) {
    clinvar.push({
      field: "Review Status",
      value: variant.clnrevstat,
      tooltip: "ClinVar review status for the Variation ID. (Landrum et al., 2017, 2013)"
    });
  }
  if (variant.origin) {
    clinvar.push({
      field: "Allele Origin",
      value: variant.origin,
      tooltip: "Allele origin. Values: 0-unknown; 1-germline; 2-somatic; 4-inherited; 8-paternal; 16-maternal; 32-de-novo; 64-biparental; 128-uniparental; 256-not-tested; 512-tested-inconclusive. (Landrum et al., 2017, 2013)"
    });
  }
  if (clinvar.length > 0) categories.Clinvar = { label: "Clinical Significance", items: clinvar };

  // Integrative scores (moved before Conservation)
  const integrative: any[] = [];
  if (shouldIncludeField('apc_protein_function_v3', variant.apc_protein_function_v3)) {
    integrative.push({
      field: "aPC-Protein Function",
      value: variant.apc_protein_function_v3,
      tooltip: "Integrative score combining multiple protein function predictions (SIFT, PolyPhen, Grantham, PolyPhen2, MutationTaster, MutationAssessor) into a single PHRED-scaled score. Higher scores (>10) are more likely to affect protein function. Range: [2.974, 86.238]. (Li et al., 2020)"
    });
  }
  if (shouldIncludeField('apc_conservation_v2', variant.apc_conservation_v2)) {
    integrative.push({
      field: "aPC-Conservation",
      value: variant.apc_conservation_v2,
      tooltip: "Conservation annotation PC: the first PC of the standardized scores of GerpN, GerpS, priPhCons, mamPhCons, verPhCons, priPhyloP, mamPhyloP, verPhyloP in PHRED scale. Range: [0, 75.824]. Higher scores (>10) indicate more evolutionary conservation. (Li et al., 2020)"
    });
  }
  if (shouldIncludeField('apc_epigenetics_active', variant.apc_epigenetics_active)) {
    integrative.push({
      field: "aPC-Epigenetics Active",
      value: variant.apc_epigenetics_active,
      tooltip: "Integrative epigenetics score for active chromatin marks in PHRED scale. Higher scores indicate stronger evidence of regulatory activity. (Li et al., 2020)"
    });
  }
  if (shouldIncludeField('apc_epigenetics_repressed', variant.apc_epigenetics_repressed)) {
    integrative.push({
      field: "aPC-Epigenetics Repressed",
      value: variant.apc_epigenetics_repressed,
      tooltip: "Integrative epigenetics score for repressed chromatin marks in PHRED scale. Higher scores indicate stronger evidence of regulatory repression. (Li et al., 2020)"
    });
  }
  if (shouldIncludeField('apc_epigenetics_transcription', variant.apc_epigenetics_transcription)) {
    integrative.push({
      field: "aPC-Epigenetics Transcription",
      value: variant.apc_epigenetics_transcription,
      tooltip: "Integrative epigenetics score for transcription-related chromatin marks in PHRED scale. Higher scores indicate stronger evidence of transcriptional activity. (Li et al., 2020)"
    });
  }
  if (shouldIncludeField('apc_local_nucleotide_diversity_v3', variant.apc_local_nucleotide_diversity_v3)) {
    integrative.push({
      field: "aPC-Local Nucleotide Diversity",
      value: variant.apc_local_nucleotide_diversity_v3,
      tooltip: "Local nucleotide diversity score in PHRED scale. Higher scores indicate regions with higher genetic variation. (Li et al., 2020)"
    });
  }
  if (shouldIncludeField('apc_mutation_density', variant.apc_mutation_density)) {
    integrative.push({
      field: "aPC-Mutation Density",
      value: variant.apc_mutation_density,
      tooltip: "Mutation density score in PHRED scale. Higher scores indicate regions with higher mutation rates. (Li et al., 2020)"
    });
  }
  if (shouldIncludeField('apc_transcription_factor', variant.apc_transcription_factor)) {
    integrative.push({
      field: "aPC-Transcription Factor",
      value: variant.apc_transcription_factor,
      tooltip: "Transcription factor binding site score in PHRED scale. Higher scores (>10) indicate stronger evidence of transcription factor binding disruption. (Li et al., 2020)"
    });
  }
  if (shouldIncludeField('apc_mappability', variant.apc_mappability)) {
    integrative.push({
      field: "aPC-Mappability",
      value: variant.apc_mappability,
      tooltip: "Mappability score in PHRED scale. Higher scores indicate regions that are more uniquely mappable in the genome. (Li et al., 2020)"
    });
  }
  if (shouldIncludeField('cadd_phred', variant.cadd_phred)) {
    integrative.push({
      field: "CADD phred",
      value: variant.cadd_phred,
      tooltip: "The CADD score in PHRED scale (integrative score). A higher CADD score indicates more deleterious. Higher scores (>10) are more likely deleterious. Range: [0.001, 84]. (Kircher et al., 2014; Rentzsch et al., 2018)"
    });
  }
  if (shouldIncludeField('linsight', variant.linsight)) {
    integrative.push({
      field: "LINSIGHT",
      value: variant.linsight,
      tooltip: "LINSIGHT (LinearlyScaled INSIGHT) predicts the functional impact of non-coding variants. Higher scores (closer to 1) indicate higher probability of functional impact. Range: [0, 1]. (Huang et al., 2017)"
    });
  }
  if (integrative.length > 0) categories.Integrative = { label: "Integrative Scores", items: integrative };

  // Conservation
  const conservation: any[] = [];
  if (shouldIncludeField('apc_conservation_v2', variant.apc_conservation_v2)) {
    conservation.push({
      field: "aPC-Conservation",
      value: variant.apc_conservation_v2,
      tooltip: "Conservation annotation PC: the first PC of the standardized scores of GerpN, GerpS, priPhCons, mamPhCons, verPhCons, priPhyloP, mamPhyloP, verPhyloP in PHRED scale. Range: [0, 75.824]. Higher scores (>10) indicate more evolutionary conservation. (Li et al., 2020)"
    });
  }
  if (shouldIncludeField('mamphcons', variant.mamphcons)) {
    conservation.push({
      field: "mamPhCons",
      value: variant.mamphcons,
      tooltip: "Mammalian phastCons conservation score (excl. human). A higher score means the region is more conserved. Uses statistical models of nucleotide substitution. Range: [0, 1] (default: 0.0). Higher scores (>0.8) indicate stronger conservation. (Siepel et al., 2005)"
    });
  }
  if (shouldIncludeField('priphcons', variant.priphcons)) {
    conservation.push({
      field: "priPhCons",
      value: variant.priphcons,
      tooltip: "Primate phastCons conservation score (excl. human). Uses evolutionary models to identify conserved regions across multiple species. Range: [-10.761, 0.595] (default: -0.029). Higher positive scores (>0.3) indicate stronger conservation. (Pollard et al., 2010)"
    });
  }
  if (shouldIncludeField('verphcons', variant.verphcons)) {
    conservation.push({
      field: "verPhCons",
      value: variant.verphcons,
      tooltip: "Vertebrate phastCons conservation score (excl. human). Models evolutionary pressure across vertebrate species. Range: [-20, 11.295] (default: 0.042). Higher positive scores (>2) indicate stronger conservation. (Pollard et al., 2010)"
    });
  }
  if (shouldIncludeField('priphylop', variant.priphylop)) {
    conservation.push({
      field: "priPhyloP",
      value: variant.priphylop,
      tooltip: "Primate phyloP score (excl. human). Site-by-site conservation measuring evolutionary constraint at individual positions. Positive scores indicate conservation, negative scores indicate accelerated evolution. Range: [-10.761, 0.595] (default: -0.029). Higher scores (>0.3) indicate stronger conservation. (Pollard et al., 2010)"
    });
  }
  if (shouldIncludeField('mamphylop', variant.mamphylop)) {
    conservation.push({
      field: "mamPhyloP",
      value: variant.mamphylop,
      tooltip: "Mammalian phyloP score (excl. human). Per-site evolutionary constraint analysis across mammalian species. Range: [-20, 4.494] (default: -0.005). Higher positive scores (>3) indicate stronger conservation. (Pollard et al., 2010)"
    });
  }
  if (shouldIncludeField('verphylop', variant.verphylop)) {
    conservation.push({
      field: "verPhyloP",
      value: variant.verphylop,
      tooltip: "Vertebrate phyloP score (excl. human). Measures evolutionary constraint at individual positions across vertebrate species. Range: [-20, 11.295] (default: 0.042). Higher positive scores (>8) indicate stronger conservation. (Pollard et al., 2010)"
    });
  }
  if (shouldIncludeField('gerp_n', variant.gerp_n)) {
    conservation.push({
      field: "GerpN",
      value: variant.gerp_n,
      tooltip: "Neutral evolution score defined by GERP++. A higher score means the region is more conserved. Range: [0, 19.8] (default: 3.0). Higher scores (>10) indicate stronger conservation. (Davydov et al., 2010)"
    });
  }
  if (shouldIncludeField('gerp_s', variant.gerp_s)) {
    conservation.push({
      field: "GerpS",
      value: variant.gerp_s,
      tooltip: "Rejected Substitution score defined by GERP++. Quantifies substitution deficits representing purifying selection. Positive scores indicate evolutionary constraint, negative scores may indicate accelerated evolution. Range: [-39.5, 19.8] (default: -0.2). Higher positive scores (>10) indicate stronger conservation. (Davydov et al., 2010)"
    });
  }
  if (conservation.length > 0) categories.Conservation = { label: "Evolutionary Conservation", items: conservation };

  // Epigenetics - using formatters but extracting structured data
  const epigenetics: any[] = [];
  const epigeneticMarks = formatEpigeneticMarks(variant);

  // Add active marks
  epigeneticMarks.active.forEach(mark => epigenetics.push({ field: mark, activity: "Active" }));
  // Add repressed marks
  epigeneticMarks.repressed.forEach(mark => epigenetics.push({ field: mark, activity: "Repressed" }));
  // Add transcription marks
  epigeneticMarks.transcription.forEach(mark => epigenetics.push({ field: mark, activity: "Transcription" }));

  if (epigeneticMarks.dnase) {
    epigenetics.push({ field: `DNase Accessibility: ${epigeneticMarks.dnase}`, activity: "Active", source: "ENCODE" });
  }
  if (shouldIncludeField('encodetotal_rna_sum', variant.encodetotal_rna_sum)) {
    epigenetics.push({ field: "totalRNA", value: variant.encodetotal_rna_sum, activity: "Transcription", source: "ENCODE" });
  }

  // Add aggregated eQTL data
  if (eqtlData) {
    try {
      const eqtlAgg = aggregateEQTLData(eqtlData);
      if (eqtlAgg) {
        epigenetics.push({
          field: "eQTL Gene Links",
          value: `${eqtlAgg.totalGenes} genes across ${eqtlAgg.totalTissues} tissues (${eqtlAgg.totalAssociations} total associations)`,
          summary: eqtlAgg,
          source: "GTEx/eQTL"
        });
      }
    } catch (error) {
      console.error("Error aggregating eQTL data:", error);
    }
  }

  // Add aggregated ChIA-PET data
  if (chiapetData) {
    try {
      const chiapetAgg = aggregateChiaPetData(chiapetData);
      if (chiapetAgg) {
        epigenetics.push({
          field: "ChIA-PET Links",
          value: `${chiapetAgg.totalLinks} total links (RNAPII: ${chiapetAgg.rnapii.uniqueGenes} genes, Intact-HiC: ${chiapetAgg.intactHic.uniqueGenes} genes)`,
          summary: chiapetAgg,
          source: "ChIA-PET"
        });
      }
    } catch (error) {
      console.error("Error aggregating ChIA-PET data:", error);
    }
  }

  // Add aggregated CRISPR data
  if (crisprData) {
    try {
      const crisprAgg = aggregateCRISPRData(crisprData);
      if (crisprAgg) {
        epigenetics.push({
          field: "CRISPR Perturbation Links",
          value: `${crisprAgg.uniqueGenes} genes (${crisprAgg.totalLinks} total links)`,
          summary: crisprAgg,
          source: "CRISPR"
        });
      }
    } catch (error) {
      console.error("Error aggregating CRISPR data:", error);
    }
  }

  if (epigenetics.length > 0) categories.Epigenetics = { label: "Regulatory Function", items: epigenetics };

  // Protein Function
  const proteinFunction: any[] = [];
  if (shouldIncludeField('apc_protein_function_v3', variant.apc_protein_function_v3)) {
    proteinFunction.push({
      field: "aPC-Protein Function",
      value: variant.apc_protein_function_v3,
      tooltip: "Integrative score combining multiple protein function predictions (SIFT, PolyPhen, Grantham, PolyPhen2, MutationTaster, MutationAssessor) into a single PHRED-scaled score. Higher scores (>10) are more likely to affect protein function. Range: [2.974, 86.238]. (Li et al., 2020)"
    });
  }
  if (shouldIncludeField('cadd_phred', variant.cadd_phred)) {
    proteinFunction.push({
      field: "CADD phred",
      value: variant.cadd_phred,
      tooltip: "The CADD score in PHRED scale (integrative score). A higher CADD score indicates more deleterious. Higher scores (>10) are more likely deleterious. Range: [0.001, 84]. (Kircher et al., 2014; Rentzsch et al., 2018)"
    });
  }
  if (gnomadGenome?.revel_max && shouldIncludeField('revel_max', gnomadGenome.revel_max)) {
    proteinFunction.push({
      field: "REVEL",
      value: gnomadGenome.revel_max,
      tooltip: "REVEL (Rare Exome Variant Ensemble Learner) is an ensemble method for predicting pathogenicity of missense variants. Combines scores from MutPred, FATHMM, VEST, PolyPhen, SIFT, PROVEAN, MutationAssessor, MutationTaster, LRT, GERP, SiPhy, phyloP, and phastCons. Higher scores (>0.5) indicate likely pathogenic, >0.75 indicate highly pathogenic. Range: [0, 1]. (Ioannidis et al., 2016; gnomAD v4)"
    });
  }
  if (variant.polyphen_cat && shouldIncludeField('polyphen_val', variant.polyphen_val)) {
    proteinFunction.push({
      field: "PolyPhen-2",
      category: variant.polyphen_cat,
      value: variant.polyphen_val,
      tooltip: "PolyPhen score predicting functional significance of allele replacement. Higher scores (>0.8) are more likely damaging. Range: [0, 1] (default: 0). (Adzhubei et al., 2010)"
    });
  }
  if (shouldIncludeField('polyphen2_hdiv_score', variant.polyphen2_hdiv_score)) {
    proteinFunction.push({
      field: "PolyPhen2 HDIV",
      value: variant.polyphen2_hdiv_score,
      tooltip: "PolyPhen2 HumDiv: Predicts amino acid substitution impact trained on Mendelian disease variants vs. evolutionarily divergent variants. Higher scores (>0.8) are more likely damaging. Range: [0, 1] (default: 0). (Adzhubei et al., 2010)"
    });
  }
  if (shouldIncludeField('polyphen2_hvar_score', variant.polyphen2_hvar_score)) {
    proteinFunction.push({
      field: "PolyPhen2 HVAR",
      value: variant.polyphen2_hvar_score,
      tooltip: "PolyPhen2 HumVar: Predicts amino acid substitution impact trained on human disease variants vs. common polymorphisms (MAF ≥1%). Higher scores (>0.8) are more likely damaging. Range: [0, 1] (default: 0). (Adzhubei et al., 2010)"
    });
  }
  if (variant.sift_cat && shouldIncludeField('sift_val', variant.sift_val)) {
    proteinFunction.push({
      field: "SIFT",
      category: variant.sift_cat,
      value: variant.sift_val,
      tooltip: "SIFT score, ranges from 0.0 (deleterious) to 1.0 (tolerated). Lower scores (0.0-0.05) are more likely deleterious. Range: [0, 1] (default: 1). (Ng and Henikoff, 2003)"
    });
  }
  if (shouldIncludeField('grantham', variant.grantham)) {
    proteinFunction.push({
      field: "Grantham",
      value: variant.grantham,
      tooltip: "Grantham Score: Measures evolutionary distance between amino acids based on chemical properties. Higher scores indicate greater chemical difference and potential functional impact. Thresholds: Conservative (0-50), moderate (51-100), radical (>100). Range: [0, 215] (default: 0). (Grantham, 1974)"
    });
  }
  if (shouldIncludeField('mutation_taster_score', variant.mutation_taster_score)) {
    proteinFunction.push({
      field: "Mutation Taster",
      value: variant.mutation_taster_score,
      tooltip: "MutationTaster evaluates DNA sequence variants for disease-causing potential. Higher scores (>0.8) are more likely disease-causing. Range: [0, 1] (default: 0). (Schwarz et al., 2014)"
    });
  }
  if (shouldIncludeField('mutation_assessor_score', variant.mutation_assessor_score)) {
    proteinFunction.push({
      field: "Mutation Assessor",
      value: variant.mutation_assessor_score,
      tooltip: "Predicts functional impact of amino-acid substitutions in proteins. Higher scores (>3) indicate more likely functional impact. Range: [-5.135, 6.125] (default: -5.545). (Reva et al., 2011)"
    });
  }

  // Add AlphaMissense to Protein Function section
  if ((variant as any).protein_variant) {
    proteinFunction.push({
      field: "Protein Variant",
      value: (variant as any).protein_variant,
      tooltip: "Amino acid change notation (e.g., R176C means Arginine at position 176 changed to Cysteine). The letter before the number is the original amino acid, the number is the position in the protein, and the letter after is the new amino acid."
    });
  }
  if (shouldIncludeField('am_pathogenicity', (variant as any).am_pathogenicity)) {
    proteinFunction.push({
      field: "AlphaMissense Pathogenicity",
      value: (variant as any).am_pathogenicity,
      tooltip: "AlphaMissense pathogenicity score. >0.564 = likely pathogenic. This AI-based predictor uses protein structure and evolutionary context to assess variant impact."
    });
  }
  if ((variant as any).am_class) {
    proteinFunction.push({
      field: "AlphaMissense Class",
      value: (variant as any).am_class,
      tooltip: "AlphaMissense classification: likely_pathogenic, likely_benign, or ambiguous based on the pathogenicity score."
    });
  }

  if (proteinFunction.length > 0) categories["Protein Function"] = { label: "Protein Function Predictions", items: proteinFunction };

  // Splicing
  const splicing: any[] = [];
  if (gnomadGenome?.spliceai_ds_max && shouldIncludeField('spliceai_ds_max', gnomadGenome.spliceai_ds_max)) {
    splicing.push({ field: "SpliceAI", value: gnomadGenome.spliceai_ds_max, source: "gnomAD v4" });
  }
  if (gnomadGenome?.pangolin_largest_ds && shouldIncludeField('pangolin_largest_ds', gnomadGenome.pangolin_largest_ds)) {
    splicing.push({ field: "Pangolin", value: gnomadGenome.pangolin_largest_ds, source: "gnomAD v4" });
  }
  if (splicing.length > 0) categories.Splicing = { label: "Splicing Impact", items: splicing };

  // Mutation Rate
  const mutationRate: any[] = [];
  if (variant.filter_value) {
    mutationRate.push({ field: "Filter value", value: variant.filter_value });
  }
  if (variant.pn) {
    mutationRate.push({ field: "PN", value: variant.pn, tooltip: "Pentanucleotide context" });
  }
  if (variant.mr !== null && variant.mr !== undefined) {
    mutationRate.push({ field: "MR", value: variant.mr, tooltip: "Mutation Rate (Roulette)" });
  }
  if (variant.ar !== null && variant.ar !== undefined) {
    mutationRate.push({ field: "AR", value: variant.ar, tooltip: "Adjusted Rate" });
  }
  if (variant.mg !== null && variant.mg !== undefined) {
    mutationRate.push({ field: "MG", value: variant.mg, tooltip: "gnomAD mutation rate" });
  }
  if (variant.mc !== null && variant.mc !== undefined) {
    mutationRate.push({ field: "MC", value: variant.mc, tooltip: "Carlson mutation rate" });
  }
  if (mutationRate.length > 0) categories["Mutation Rate"] = { label: "Mutation Density & Context", items: mutationRate };

  // cCRE (Candidate cis-Regulatory Elements) - separate category
  if (ccreData) {
    try {
      const ccreAgg = aggregateCCREData(ccreData);
      if (ccreAgg) categories.cCRE = { label: "Regulatory Elements (cCRE)", data: ccreAgg };
    } catch (error) {
      console.error("Error aggregating cCRE data:", error);
    }
  }

  // PGBoost (Variant-to-Gene Connections) - separate category
  if (pgboostData) {
    try {
      const pgboostAgg = aggregatePGBoostData(pgboostData);
      if (pgboostAgg) categories.PGBoost = { label: "Variant-to-Gene Connections", data: pgboostAgg };
    } catch (error) {
      console.error("Error aggregating PGBoost data:", error);
    }
  }

  // Tissue-specific data (CV2F, SCENT)
  const tissueSpecific: any = {};

  if (cv2fData) tissueSpecific.CV2F = cv2fData;

  if (scentData) {
    try {
      const scentAgg = aggregateSCENTData(scentData);
      if (scentAgg) tissueSpecific.SCENT = scentAgg;
    } catch (error) {
      console.error("Error aggregating SCENT data:", error);
    }
  }

  // Phenotypic impact
  const phenotypic: any = {};

  if (gwasData) {
    try {
      const gwasAgg = aggregateGWASData(gwasData);
      if (gwasAgg) phenotypic.GWAS = gwasAgg;
    } catch (error) {
      console.error("Error aggregating GWAS data:", error);
    }
  }

  // Add tissue-specific and phenotypic if they have data
  if (Object.keys(tissueSpecific).length > 0) categories["Tissue-Specific"] = { label: "Tissue-Specific Annotations", data: tissueSpecific };
  if (Object.keys(phenotypic).length > 0) categories["Phenotypic Effect"] = { label: "Phenotypic Effect", data: phenotypic };

  return categories;
}

const systemPrompt = String.raw`You are an expert genomic variant analyst with deep knowledge of molecular biology, population genetics, clinical genomics and more. Your role is to tell the story of each variant using clear, accessible language that connects the data into a coherent biological narrative.

**CRITICAL: Data Fidelity & Citation Rules**
- ONLY use data explicitly provided in the input - never invent or assume values
- **MANDATORY: EVERY single data point, score, frequency, or metric MUST have an inline (Source) citation**
- Extract source citations from the "tooltip" field of each item - citations are typically in parentheses at the end of tooltips (e.g., "(Li et al., 2020)", "(Adzhubei et al., 2010)")
- When items have a "source" field, use that source (e.g., "gnomAD v4", "ENCODE", "GTEx/eQTL", "ChIA-PET", "CRISPR")
- PRESERVE all inline database citations (e.g., "gnomAD v4", "BRAVO freeze 10", "ENCODE", "ClinVar") when referencing specific data points
- Format citations inline after mentioning each score: "CADD PHRED score of 25 (Kircher et al., 2014; Rentzsch et al., 2018)"
- If insufficient data exists for a section, state that clearly rather than generating placeholder content

**Core Principles - Tell the Variant's Story:**
- Write in a narrative style that tells the biological story of this variant
- Use plain English - explain what scores MEAN in biological terms, not just what they are
- Connect the dots between different types of evidence (e.g., "This high conservation score suggests the region is important, which aligns with the protein function predictions showing...")
- Interpret scores in context - explain WHY a score matters and WHAT it tells us about variant impact
- Focus on biological significance over technical details
- Think: "What is this variant doing?" rather than "What are the numbers?"

**Input Format:**
You will receive structured JSON data organized by categories. Each category has a "label" field that should be used as the section header in your summary.

Category structure example:
{
  "CategoryName": {
    "label": "Display Label for Section Header",
    "items": [
      { "field": "Field Name", "value": ..., "tooltip": "Detailed explanation with ranges and interpretation" }
    ]
  }
}

Available categories (in order of appearance):
1. Basic (label: "Basic Information & Genomic Context"): Variant VCF, rsID, TOPMed QC Status, Bravo AN, Genecode annotations, MetaSVM, CAGE, GeneHancer, Super Enhancer
2. Population (label: "Population Genetics"): Overall allele frequencies (Bravo AF, GNOMAD AF, 1000 Genomes AF) and ancestry-specific frequencies with interpretation guide
3. Clinvar (label: "Clinical Significance"): Clinical significance, disease name, review status, allele origin
4. Integrative (label: "Integrative Scores"): aPC scores, CADD, LINSIGHT - integrative metrics combining multiple evidence types
5. Conservation (label: "Evolutionary Conservation"): aPC-Conservation, phyloP/phastCons, GERP scores
6. Epigenetics (label: "Regulatory Function"): Histone marks by activity (Active/Repressed/Transcription), DNase, totalRNA, eQTL gene expression associations, ChIA-PET chromatin interaction links (RNAPII and Intact-HiC), CRISPR perturbation screen results linking variant to gene function
7. Protein Function (label: "Protein Function Predictions"): CADD, REVEL, PolyPhen, SIFT, Grantham, MutationTaster, MutationAssessor, AlphaMissense (protein variant like R176C, pathogenicity score, classification)
8. Splicing (label: "Splicing Impact"): SpliceAI, Pangolin
9. Mutation Rate (label: "Mutation Density & Context"): Filter value, PN, mutation rates
10. cCRE (label: "Regulatory Elements (cCRE)"): Candidate cis-regulatory elements
11. PGBoost (label: "Variant-to-Gene Connections"): Variant-to-gene associations
12. Tissue-Specific (label: "Tissue-Specific Annotations"): CV2F chromatin accessibility, SCENT enhancer-gene links
13. Phenotypic Effect (label: "Phenotypic Effect"): GWAS associations (top 10 unique traits, deduplicated by strongest p-value per trait)

**AlphaMissense Protein Variant Notation:**
When you see protein variants like "R176C", interpret them as: [Original amino acid][Position][New amino acid]
- R176C = Arginine (R) at position 176 changed to Cysteine (C)
- This represents the specific amino acid substitution caused by the DNA variant
- Always explain this notation when first mentioning the protein variant

**IMPORTANT**: Use the "label" field from each category as your section header.

**PHRED Scale Interpretation:**
Many scores use PHRED scaling, which represents the probability of being in the top percentile:
- PHRED 10 = top 10% (90th percentile)
- PHRED 15 = top 3.2% (96.8th percentile)
- PHRED 20 = top 1% (99th percentile)
- PHRED 30 = top 0.1% (99.9th percentile)
When mentioning PHRED-scaled scores, explain what percentile they represent. For example: "CADD PHRED 25 places this variant in the top 0.32% most deleterious variants."

**CRITICAL: Mention ALL Significant Scores**
- For PHRED-scaled scores (aPC-*, CADD, etc.): **You MUST mention and interpret every score >= 10** in your summary. Scores >= 10 represent top 10% or better and are biologically significant.
- For other metrics (LINSIGHT, REVEL, etc.): mention scores that exceed their significance thresholds
- DO NOT cherry-pick only 1-2 scores when multiple significant scores are present
- Example: If aPC-Protein Function is 37 (top 0.0%), aPC-Conservation is 15 (top 3%), aPC-Transcription Factor is 14 (top 4%), and CADD is 25 (top 0.3%), you MUST discuss ALL FOUR of these significant findings, not just mention one or two
- The executive summary paragraph and relevant sections must reflect the full picture of ALL significant evidence

Output Structure & Formatting:

**CRITICAL: Start with an Executive Summary Paragraph**
Begin the entire summary with a single compelling paragraph (3-5 sentences) that tells the complete story of this variant in plain English. This opening should:
- Synthesize the most important findings across ALL categories
- Explain what this variant does and why it matters
- Connect the biological dots (e.g., "This rare variant changes a critical amino acid in a highly conserved region, with multiple predictors suggesting it disrupts protein function...")
- Use narrative language, not bullet points
- Make it accessible to someone without deep genomics knowledge
- DO NOT use section headers or formatting for this paragraph - just flowing prose

After the opening paragraph, use #### section headers for detailed breakdowns.

1. Narrative style within sections:
  - Write in complete sentences that connect ideas
  - Explain the biological MEANING of scores, not just report them
  - Show how different pieces of evidence support or contradict each other
  - ALWAYS include citations extracted from tooltips when mentioning scores
  - Example: "The variant appears in a region that's been extremely well-preserved across mammalian evolution, with a PhyloP score of 5.2 placing it in the top 1% most conserved positions (Pollard et al., 2010). This evolutionary constraint suggests the position plays a critical functional role."
  - Example: "Multiple integrative scores flag this variant as highly significant: aPC-Protein Function of 37.2 places it in the top 0.0% (Li et al., 2020), while the CADD PHRED score of 25.3 ranks it in the top 0.3% most likely deleterious variants (Kircher et al., 2014; Rentzsch et al., 2018)."

2. Plain English interpretation:
  - Translate technical terms (e.g., "nonsynonymous SNV" → "a DNA change that alters the protein sequence")
  - Explain WHY scores matter (e.g., don't just say "CADD=25", say "CADD score of 25 places this in the top 0.3% most likely harmful variants")
  - Connect evidence types (e.g., "The high conservation aligns with the damaging protein function predictions...")

3. Styling:
  - Bold key findings and biological insights
  - Use variant format: chr-pos-ref-alt (e.g., "19-44908822-C-T")
  - Use region format: chr-start-end (e.g., "19-44908816-44908825")
  - Always include source citations inline

4. Example output format:

This variant (19-44908822-C-T, also known as rs7412) causes a change from arginine to cysteine at position 176 of the APOE protein. Multiple lines of evidence suggest this change is functionally significant: the position is highly conserved across species, several computational predictors classify it as likely damaging to protein function, and it's been observed at low frequency (~7-8%) across multiple populations, suggesting it may be under weak selection. The variant has been associated with altered lipid metabolism and cardiovascular disease risk in genome-wide studies.

#### Basic Information & Genomic Context:

  `;

/**
 * Pure LLM summarization function
 */
async function summarizeVariantWithLLM(ctx: VariantContext, modelId: string): Promise<string> {
  const variantJSON = buildVariantJSON(ctx);

  // Log the structured JSON for inspection
  console.log('\n========== VARIANT JSON STRUCTURE ==========');
  console.log('VCF:', ctx.variant.variant_vcf);
  console.log('\nJSON Keys:', Object.keys(variantJSON));
  console.log('\nFull JSON:');
  console.log(JSON.stringify(variantJSON, null, 2));
  console.log('========== END VARIANT JSON ==========\n');

  const result = streamText({
    model: myProvider.languageModel(modelId),
    system: systemPrompt,
    prompt: `Summarize this variant based on the following structured data:\n\n${JSON.stringify(variantJSON, null, 2)}`,
  });

  let fullText = "";
  for await (const chunk of result.textStream) {
    fullText += chunk;
  }

  return fullText;
}

/**
 * Orchestrates variant summary generation using pure functions
 */
async function generateSummaryInBackground(vcf: string, modelId: string) {
  try {
    await prisma.variantSummary.update({
      where: { vcf },
      data: { status: "generating" },
    });

    // Step 1: Collect all variant data (pure data fetching)
    const variantContext = await collectVariantContext(vcf);

    // Step 2: Generate summary using LLM (pure business logic)
    const summary = await summarizeVariantWithLLM(variantContext, modelId);

    // Step 3: Save to database (side effect)
    await prisma.variantSummary.update({
      where: { vcf },
      data: {
        summary,
        status: "completed",
      },
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await prisma.variantSummary.update({
      where: { vcf },
      data: {
        status: "failed",
        error: errorMessage,
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const {
      vcf,
      model = "gpt-4o-mini",
    }: {
      vcf: string;
      model?: string;
    } = await req.json();

    if (!vcf) {
      return new Response("VCF parameter required", { status: 400 });
    }

    const existingRecord = await prisma.variantSummary.findUnique({
      where: { vcf },
    });

    if (existingRecord) {
      if (existingRecord.status === "completed" && existingRecord.summary) {
        return Response.json({ status: "completed", summary: existingRecord.summary });
      }
      if (existingRecord.status === "generating") {
        return Response.json({ status: "generating" });
      }
      if (existingRecord.status === "failed") {
        await prisma.variantSummary.update({
          where: { vcf },
          data: { status: "generating", error: null },
        });
        waitUntil(generateSummaryInBackground(vcf, model));
        return Response.json({ status: "generating" });
      }
      if (existingRecord.status === "pending") {
        await prisma.variantSummary.update({
          where: { vcf },
          data: { status: "generating" },
        });
        waitUntil(generateSummaryInBackground(vcf, model));
        return Response.json({ status: "generating" });
      }
    } else {
      await prisma.variantSummary.create({
        data: {
          vcf,
          modelId: model,
          status: "generating",
        },
      });
      waitUntil(generateSummaryInBackground(vcf, model));
      return Response.json({ status: "generating" });
    }
  } catch (error) {
    console.error("Error in variant-summary route:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate variant summary";
    return new Response(errorMessage, { status: 500 });
  }
}
