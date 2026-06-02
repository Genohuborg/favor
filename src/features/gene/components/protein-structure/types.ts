export interface ProteinDomain {
  id: string;
  name: string;
  start: number; // 1-based residue
  end: number;
  type?: string;
  color: string;
}

export interface ProteinStructureViewProps {
  uniprotId: string;
  geneSymbol: string;
  domains: ProteinDomain[];
  proteinLength: number;
  /** Amino acid position to highlight (1-based) — from variant's dbnsfp.aapos */
  variantPosition?: number;
  /** Label for the variant marker, e.g. "p.R175H" */
  variantLabel?: string;
}

// ---------------------------------------------------------------------------
// Protein layer (UniProt protein / GENCODE transcripts / Complex Portal)
// ---------------------------------------------------------------------------

export interface ProteinSummary {
  uniprotId: string;
  name: string | null;
  mnemonic: string | null;
  lengthAa: number | null;
  massDa: number | null;
  functionDescription: string | null;
}

export interface TranscriptRow {
  transcriptId: string;
  name: string;
  transcriptType: string | null;
  isCanonical: boolean;
  isManeSelect: boolean;
  supportLevel: string | null;
}

export interface ComplexRow {
  complexId: string;
  name: string;
  assembly: string | null;
  nComponents: number | null;
  stoichiometry: string | null;
}
