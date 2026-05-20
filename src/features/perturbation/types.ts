export interface CrisprRow {
  perturbation_gene: string;
  score_name: string;
  score_value: number;
  is_significant: boolean;
  significance_criteria?: string;
  dataset_id: string;
  perturbation_type?: string;
  tissue?: string;
  tissue_id?: string;
  cell_type?: string;
  cell_type_id?: string;
  cell_line?: string;
  cell_line_id?: string;
  disease?: string;
  disease_id?: string;
  study_title?: string;
  study_year?: number;
  score_interpretation?: string;
  model_system_label?: string;
  readout_type_label?: string;
  readout_technology_label?: string;
  sex_label?: string;
  developmental_stage_label?: string;
}

export interface FetchCrisprParams {
  dataset_id?: string;
  tissue?: string;
  disease?: string;
  cell_line?: string;
  perturbation_type?: string;
  score_name?: string;
  significant_only?: boolean;
  cursor?: string;
  limit?: number;
}

export interface PerturbSeqRow {
  perturbation_gene: string;
  effect_gene: string;
  log2fc: number;
  padj?: number;
  score_name: string;
  score_value: number;
  is_significant: boolean;
  dataset_id: string;
  perturbation_type?: string;
  tissue?: string;
  tissue_id?: string;
  cell_type?: string;
  cell_type_id?: string;
  cell_line?: string;
  disease?: string;
  disease_id?: string;
  study_title?: string;
  study_year?: number;
  model_system_label?: string;
  readout_type_label?: string;
  readout_technology_label?: string;
  sex_label?: string;
  developmental_stage_label?: string;
}

export interface FetchPerturbSeqParams {
  dataset_id?: string;
  tissue?: string;
  disease?: string;
  cell_line?: string;
  perturbation_type?: string;
  score_name?: string;
  significant_only?: boolean;
  effect_gene?: string;
  cell_type?: string;
  cursor?: string;
  limit?: number;
}

// Full dataset metadata returned by /perturbations/{loc}/datasets. All label
// arrays are non-null but may be empty. The frontend reads the first element
// for the common single-value case; rendering as a list is up to the caller.
export interface DatasetEntry {
  dataset_id: string;
  assay: "crispr" | "perturb_seq" | "mave";
  study_title?: string;
  study_year?: number;
  study_uri?: string;
  first_author?: string;
  last_author?: string;
  experiment_title?: string;
  experiment_summary?: string;
  license_labels: string[];
  sex_labels: string[];
  developmental_stage_labels: string[];
  readout_technology_labels: string[];
  tissue_labels: string[];
  cell_type_labels: string[];
  cell_line_labels: string[];
  disease_labels: string[];
  data_modalities: string[];
  perturbation_type_labels: string[];
  method_name_labels: string[];
  method_uri: string[];
  model_system_labels: string[];
  readout_type_labels: string[];
}
