import { myProvider } from "@/lib/ai";
import { streamText } from "ai";
import { prisma } from "@/lib/prisma";
import { fetchGeneAnnotation } from "@/lib/gene/annotation/api";
import { waitUntil } from "@vercel/functions";

export const maxDuration = 300;

function constructGenePrompt(geneData: any, symbol: string): string {
  const sections: string[] = [];

  sections.push("# GENE IDENTIFICATION");
  sections.push(`Gene Symbol: ${symbol}`);
  if (geneData.ensembl_gene) sections.push(`Ensembl ID: ${geneData.ensembl_gene}`);
  if (geneData.entrez_id) sections.push(`Entrez Gene ID: ${geneData.entrez_id}`);
  if (geneData.hgnc_id_x) sections.push(`HGNC ID: ${geneData.hgnc_id_x}`);
  if (geneData.name) sections.push(`Gene Name: ${geneData.name}`);
  if (geneData.gene_full_name) sections.push(`Full Name: ${geneData.gene_full_name}`);

  sections.push("\n# GENOMIC LOCATION");
  if (geneData.chr) sections.push(`Chromosome: ${geneData.chr}`);
  if (geneData.location) sections.push(`Location: ${geneData.location}`);
  if (geneData.cyto_location) sections.push(`Cytogenetic Location: ${geneData.cyto_location}`);
  if (geneData.locus_type) sections.push(`Locus Type: ${geneData.locus_type}`);

  sections.push("\n# FUNCTION & BIOLOGICAL ROLE");
  if (geneData.function_description) sections.push(`Function: ${geneData.function_description}`);
  if (geneData.go_biological_process) sections.push(`GO Biological Process: ${geneData.go_biological_process}`);
  if (geneData.go_molecular_function) sections.push(`GO Molecular Function: ${geneData.go_molecular_function}`);
  if (geneData.go_cellular_component) sections.push(`GO Cellular Component: ${geneData.go_cellular_component}`);

  sections.push("\n# DISEASE ASSOCIATIONS");
  if (geneData.disease_description) sections.push(`Disease Description: ${geneData.disease_description}`);
  if (geneData.mim_disease) sections.push(`OMIM Disease: ${geneData.mim_disease}`);
  if (geneData.orphanet_disorder) sections.push(`Orphanet Disorder: ${geneData.orphanet_disorder}`);
  if (geneData.hpo_name) sections.push(`Human Phenotype: ${geneData.hpo_name}`);

  sections.push("\n# PATHWAYS");
  if (geneData.pathway_kegg_full) sections.push(`KEGG Pathways: ${geneData.pathway_kegg_full}`);
  if (geneData.pathway_bio_carta_full) sections.push(`BioCarta Pathways: ${geneData.pathway_bio_carta_full}`);
  if (geneData.pathway_consensus_path_db) sections.push(`ConsensusPathDB: ${geneData.pathway_consensus_path_db}`);

  sections.push("\n# PROTEIN INTERACTIONS");
  if (geneData.interactions_int_act) sections.push(`IntAct: ${geneData.interactions_int_act}`);
  if (geneData.interactions_bio_grid) sections.push(`BioGRID: ${geneData.interactions_bio_grid}`);

  sections.push("\n# EXPRESSION & TISSUE SPECIFICITY");
  if (geneData.tissue_specificity_uniprot) sections.push(`Tissue Specificity: ${geneData.tissue_specificity_uniprot}`);
  if (geneData.expression_egenetics) sections.push(`Expression (eGenetics): ${geneData.expression_egenetics}`);
  if (geneData.rna_tissue_specificity) sections.push(`RNA Tissue Specificity: ${geneData.rna_tissue_specificity}`);

  sections.push("\n# CONSTRAINT & HAPLOINSUFFICIENCY");
  if (geneData.p_li !== null) sections.push(`pLI: ${geneData.p_li}`);
  if (geneData.gnom_ad_p_li !== null) sections.push(`gnomAD pLI: ${geneData.gnom_ad_p_li}`);
  if (geneData.p_hi !== null) sections.push(`Haploinsufficiency Score: ${geneData.p_hi}`);
  if (geneData.ghis !== null) sections.push(`GHIS: ${geneData.ghis}`);
  if (geneData.lof_tool_score !== null) sections.push(`LoF Tool Score: ${geneData.lof_tool_score}`);

  sections.push("\n# GENE DAMAGE & ESSENTIALITY");
  if (geneData.essential_gene) sections.push(`Essential Gene: ${geneData.essential_gene}`);
  if (geneData.gene_indispensability_score) sections.push(`Indispensability Score: ${geneData.gene_indispensability_score}`);

  sections.push("\n# MODEL ORGANISM PHENOTYPES");
  if (geneData.mgi_mouse_phenotype) sections.push(`Mouse Phenotype: ${geneData.mgi_mouse_phenotype}`);
  if (geneData.zfin_zebrafish_phenotype_quality) sections.push(`Zebrafish Phenotype: ${geneData.zfin_zebrafish_phenotype_quality}`);

  return sections.join("\n");
}

const systemPrompt = `You are an expert genomics researcher with deep knowledge of human genetics, molecular biology, and clinical genomics. Your role is to synthesize gene annotation data into clear, comprehensive gene summaries.

**CRITICAL: Data Fidelity Rules**
- ONLY use data explicitly provided in the input
- If data is missing, state "not available" or omit that section
- Do NOT speculate or make up information
- Cite actual values when interpreting scores
- Clearly state when evidence is limited

**Core Principles:**
- Provide expert biological reasoning grounded in provided data
- Integrate evidence across multiple data sources
- Explain significance for both research and clinical contexts
- Use precise terminology while remaining accessible

**Response Structure (use markdown):**

## Gene Overview
- Official gene symbol, name, and key identifiers
- Genomic location and locus type
- Brief summary of primary function

## Molecular Function & Biological Role
- Core molecular function and biological processes
- Cellular localization
- Key pathways involved
- Protein interactions (if significant)

## Disease Associations & Clinical Significance
- Known disease associations with inheritance patterns
- OMIM and Orphanet disorders
- Human phenotypes
- Clinical actionability and testing relevance

## Constraint & Selection Pressure
- Interpret constraint metrics (pLI, LOEUF, etc.)
- Haploinsufficiency predictions
- Explain what these scores suggest about gene function
- Discuss tolerance to variation

## Expression & Tissue Specificity
- Tissue-specific expression patterns
- Functional significance of expression
- Implications for disease mechanisms

## Translational Relevance
- Therapeutic targeting potential
- Biomarker potential
- Research applications

## Key Takeaways
- 3-4 bullet points summarizing:
  - Core biological role
  - Disease relevance
  - Constraint/essentiality
  - Research/clinical significance

**Style Guidelines:**
- Be concise but comprehensive
- Use appropriate scientific uncertainty
- Explain biological significance, not just list facts
- Target audience: researchers and clinical geneticists`;

async function generateGeneSummaryInBackground(symbol: string, modelId: string) {
  try {
    const existingRecord = await prisma.geneSummary.findUnique({
      where: { symbol },
    });

    if (existingRecord?.status === "completed" && existingRecord.summary) {
      console.log(`Summary already exists for ${symbol}, skipping generation`);
      return;
    }

    await prisma.geneSummary.update({
      where: { symbol },
      data: { status: "generating" },
    });

    const geneData = await fetchGeneAnnotation(symbol);

    if (!geneData) {
      await prisma.geneSummary.update({
        where: { symbol },
        data: {
          status: "failed",
          error: "Gene not found in annotation database",
        },
      });
      return;
    }

    const structuredGeneData = constructGenePrompt(geneData, symbol);

    const result = streamText({
      model: myProvider.languageModel(modelId),
      system: systemPrompt,
      prompt: `Provide a comprehensive summary for this gene:\n\n${structuredGeneData}`,
    });

    let fullText = "";
    for await (const chunk of result.textStream) {
      fullText += chunk;
    }

    await prisma.geneSummary.update({
      where: { symbol },
      data: {
        summary: fullText,
        status: "completed",
        ensemblGene: geneData.ensembl_gene || null,
        hgncId: geneData.hgnc_id_x || null,
        ncbiGeneId: geneData.entrez_id?.toString() || null,
      },
    });
  } catch (error) {
    console.error("Error generating gene summary:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await prisma.geneSummary.update({
      where: { symbol },
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
      symbol,
      model = "gpt-4o-mini",
    }: {
      symbol: string;
      model?: string;
    } = await req.json();

    if (!symbol) {
      return Response.json({ error: "Gene symbol required" }, { status: 400 });
    }

    const existingRecord = await prisma.geneSummary.findUnique({
      where: { symbol },
    });

    if (existingRecord) {
      if (existingRecord.status === "completed" && existingRecord.summary) {
        return Response.json({ status: "completed", summary: existingRecord.summary });
      }
      if (existingRecord.status === "generating") {
        return Response.json({ status: "generating" });
      }
      if (existingRecord.status === "failed") {
        await prisma.geneSummary.update({
          where: { symbol },
          data: { status: "generating", error: null },
        });
        waitUntil(generateGeneSummaryInBackground(symbol, model));
        return Response.json({ status: "generating" });
      }
      if (existingRecord.status === "pending") {
        await prisma.geneSummary.update({
          where: { symbol },
          data: { status: "generating" },
        });
        waitUntil(generateGeneSummaryInBackground(symbol, model));
        return Response.json({ status: "generating" });
      }
    } else {
      await prisma.geneSummary.create({
        data: {
          symbol,
          model,
          status: "generating",
        },
      });
      waitUntil(generateGeneSummaryInBackground(symbol, model));
      return Response.json({ status: "generating" });
    }
  } catch (error) {
    console.error("Error in gene-summary route:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate gene summary";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
