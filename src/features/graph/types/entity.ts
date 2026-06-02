// =============================================================================
// Entity Types (Discriminated Union)
// =============================================================================

interface BaseEntity {
  id: string;
  label: string;
}

export interface GeneEntity extends BaseEntity {
  type: "Gene";
  symbol: string;
  ensemblId: string;
}

export interface DiseaseEntity extends BaseEntity {
  type: "Disease";
  mondoId?: string;
  orphanetId?: string;
}

export interface DrugEntity extends BaseEntity {
  type: "Drug";
  drugBankId?: string;
  chemblId?: string;
}

export interface PathwayEntity extends BaseEntity {
  type: "Pathway";
  source?: string;
  category?: string;
}

export interface VariantEntity extends BaseEntity {
  type: "Variant";
  rsId?: string;
  chromosome?: string;
  position?: number;
}

export interface PhenotypeEntity extends BaseEntity {
  type: "Phenotype";
  definition?: string;
}

export interface GOTermEntity extends BaseEntity {
  type: "GOTerm";
  namespace?: string;
}

export interface SideEffectEntity extends BaseEntity {
  type: "SideEffect";
  meddraId?: string;
}

export interface cCREEntity extends BaseEntity {
  type: "cCRE";
  accession?: string;
}

export interface MetaboliteEntity extends BaseEntity {
  type: "Metabolite";
  hmdbId?: string;
}

export interface SignalEntity extends BaseEntity {
  type: "Signal";
  signalId?: string;
}

export interface ProteinDomainEntity extends BaseEntity {
  type: "ProteinDomain";
  interProId?: string;
}

export interface TissueEntity extends BaseEntity {
  type: "Tissue";
  uberonId?: string;
}

export interface CellTypeEntity extends BaseEntity {
  type: "CellType";
  cellOntologyId?: string;
}

export type ExplorerEntity =
  | GeneEntity
  | DiseaseEntity
  | DrugEntity
  | PathwayEntity
  | VariantEntity
  | PhenotypeEntity
  | GOTermEntity
  | SideEffectEntity
  | cCREEntity
  | MetaboliteEntity
  | SignalEntity
  | ProteinDomainEntity
  | TissueEntity
  | CellTypeEntity;

export type EntityType = ExplorerEntity["type"];

export const ENTITY_TYPES: EntityType[] = [
  "Gene",
  "Disease",
  "Drug",
  "Pathway",
  "Variant",
  "Phenotype",
  "GOTerm",
  "SideEffect",
  "cCRE",
  "Metabolite",
  "Signal",
  "ProteinDomain",
  "Tissue",
  "CellType",
];
