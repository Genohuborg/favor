export interface AssayInfo {
  name: string;
  bigwig?: string;
  description?: string;
}

export interface SubtissueInfo {
  name: string;
  displayName?: string;
  description?: string;
  assays: AssayInfo[];
}

export const TissueConfig: { [key: string]: SubtissueInfo[] } = {
  Brain: [
    {
      name: "dorsolateral prefrontal cortex, male adult (90 or above years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_90_or_above_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_90_or_above_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_90_or_above_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_90_or_above_years_with_mild_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_90_or_above_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_90_or_above_years_with_mild_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_90_or_above_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_90_or_above_years_with_mild_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (89 years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_89_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_89_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_89_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_89_years_with_mild_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_89_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_89_years_with_mild_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_89_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_89_years_with_mild_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (90 or above years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_mild_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_mild_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_mild_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (88 years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_88_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_88_years_with_mild_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_88_years_with_mild_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_88_years_with_mild_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (87 years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_87_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_87_years_with_mild_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_87_years_with_mild_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_87_years_with_mild_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (83 years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_83_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_83_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_83_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_83_years_with_mild_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_83_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_83_years_with_mild_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_83_years_with_mild_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_83_years_with_mild_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (90 or above years) with Cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_cognitive_impairment__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (86 years) with Cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_86_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_86_years_with_cognitive_impairment__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_86_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_86_years_with_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_86_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_86_years_with_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_86_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_86_years_with_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (81 years) with Cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_81_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_81_years_with_cognitive_impairment__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_81_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_81_years_with_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_81_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_81_years_with_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_81_years_with_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_81_years_with_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (90 or above years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (89 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_89_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_89_years_with_alzheimer_s_disease__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_89_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_89_years_with_alzheimer_s_disease__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_89_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_89_years_with_alzheimer_s_disease__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_89_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_89_years_with_alzheimer_s_disease__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (88 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_88_years_with_alzheimer_s_disease__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_88_years_with_alzheimer_s_disease__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_88_years_with_alzheimer_s_disease__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_88_years_with_alzheimer_s_disease__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (86 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_86_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_86_years_with_alzheimer_s_disease__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_86_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_86_years_with_alzheimer_s_disease__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_86_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_86_years_with_alzheimer_s_disease__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_86_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_86_years_with_alzheimer_s_disease__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (85 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_85_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_85_years_with_alzheimer_s_disease__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_85_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_85_years_with_alzheimer_s_disease__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_85_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_85_years_with_alzheimer_s_disease__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_85_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_85_years_with_alzheimer_s_disease__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (81 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_81_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_81_years_with_alzheimer_s_disease__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_81_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_81_years_with_alzheimer_s_disease__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_81_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_81_years_with_alzheimer_s_disease__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_81_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_81_years_with_alzheimer_s_disease__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (74 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_74_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_74_years_with_alzheimer_s_disease__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_74_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_74_years_with_alzheimer_s_disease__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_74_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_74_years_with_alzheimer_s_disease__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_74_years_with_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_74_years_with_alzheimer_s_disease__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "SK-N-SH, treated with 6 \u03bcM all-trans-retinoic acid for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/sk_n_sh_treated_with_6_\u03bcm_all_trans_retinoic_acid_for_48_hours/sk_n_sh_treated_with_6_\u03bcm_all_trans_retinoic_acid_for_48_hours__dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "SK-N-SH",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/sk_n_sh/sk_n_sh__dnase.bigWig",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "neural progenitor cell (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (87 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_87_years_/dorsolateral_prefrontal_cortex_male_adult_87_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_87_years_/dorsolateral_prefrontal_cortex_male_adult_87_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_87_years_/dorsolateral_prefrontal_cortex_male_adult_87_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_87_years_/dorsolateral_prefrontal_cortex_male_adult_87_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (86 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_86_years_/dorsolateral_prefrontal_cortex_male_adult_86_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_86_years_/dorsolateral_prefrontal_cortex_male_adult_86_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_86_years_/dorsolateral_prefrontal_cortex_male_adult_86_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_86_years_/dorsolateral_prefrontal_cortex_male_adult_86_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (84 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_84_years_/dorsolateral_prefrontal_cortex_male_adult_84_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_84_years_/dorsolateral_prefrontal_cortex_male_adult_84_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_84_years_/dorsolateral_prefrontal_cortex_male_adult_84_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_84_years_/dorsolateral_prefrontal_cortex_male_adult_84_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (83 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_83_years_/dorsolateral_prefrontal_cortex_male_adult_83_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_83_years_/dorsolateral_prefrontal_cortex_male_adult_83_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_83_years_/dorsolateral_prefrontal_cortex_male_adult_83_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_83_years_/dorsolateral_prefrontal_cortex_male_adult_83_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (82 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_82_years_/dorsolateral_prefrontal_cortex_male_adult_82_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_82_years_/dorsolateral_prefrontal_cortex_male_adult_82_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_82_years_/dorsolateral_prefrontal_cortex_male_adult_82_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_82_years_/dorsolateral_prefrontal_cortex_male_adult_82_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_78_years_/dorsolateral_prefrontal_cortex_male_adult_78_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_78_years_/dorsolateral_prefrontal_cortex_male_adult_78_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_78_years_/dorsolateral_prefrontal_cortex_male_adult_78_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_78_years_/dorsolateral_prefrontal_cortex_male_adult_78_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (71 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_71_years_/dorsolateral_prefrontal_cortex_male_adult_71_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_71_years_/dorsolateral_prefrontal_cortex_male_adult_71_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_71_years_/dorsolateral_prefrontal_cortex_male_adult_71_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_71_years_/dorsolateral_prefrontal_cortex_male_adult_71_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (90 or above years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (89 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_89_years_/dorsolateral_prefrontal_cortex_female_adult_89_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_89_years_/dorsolateral_prefrontal_cortex_female_adult_89_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_89_years_/dorsolateral_prefrontal_cortex_female_adult_89_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_89_years_/dorsolateral_prefrontal_cortex_female_adult_89_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (88 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_/dorsolateral_prefrontal_cortex_female_adult_88_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_/dorsolateral_prefrontal_cortex_female_adult_88_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_/dorsolateral_prefrontal_cortex_female_adult_88_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_88_years_/dorsolateral_prefrontal_cortex_female_adult_88_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (87 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_/dorsolateral_prefrontal_cortex_female_adult_87_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_/dorsolateral_prefrontal_cortex_female_adult_87_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_/dorsolateral_prefrontal_cortex_female_adult_87_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_/dorsolateral_prefrontal_cortex_female_adult_87_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (84 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_84_years_/dorsolateral_prefrontal_cortex_female_adult_84_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_84_years_/dorsolateral_prefrontal_cortex_female_adult_84_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_84_years_/dorsolateral_prefrontal_cortex_female_adult_84_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_84_years_/dorsolateral_prefrontal_cortex_female_adult_84_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (83 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_83_years_/dorsolateral_prefrontal_cortex_female_adult_83_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_83_years_/dorsolateral_prefrontal_cortex_female_adult_83_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_83_years_/dorsolateral_prefrontal_cortex_female_adult_83_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_83_years_/dorsolateral_prefrontal_cortex_female_adult_83_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (82 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_82_years_/dorsolateral_prefrontal_cortex_female_adult_82_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_82_years_/dorsolateral_prefrontal_cortex_female_adult_82_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_82_years_/dorsolateral_prefrontal_cortex_female_adult_82_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_82_years_/dorsolateral_prefrontal_cortex_female_adult_82_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (79 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_79_years_/dorsolateral_prefrontal_cortex_female_adult_79_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_79_years_/dorsolateral_prefrontal_cortex_female_adult_79_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_79_years_/dorsolateral_prefrontal_cortex_female_adult_79_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_79_years_/dorsolateral_prefrontal_cortex_female_adult_79_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_78_years_/dorsolateral_prefrontal_cortex_female_adult_78_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_78_years_/dorsolateral_prefrontal_cortex_female_adult_78_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_78_years_/dorsolateral_prefrontal_cortex_female_adult_78_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_78_years_/dorsolateral_prefrontal_cortex_female_adult_78_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "glutamatergic neuron (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/glutamatergic_neuron_in_vitro_differentiated_cells_/glutamatergic_neuron_in_vitro_differentiated_cells___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/glutamatergic_neuron_in_vitro_differentiated_cells_/glutamatergic_neuron_in_vitro_differentiated_cells___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/glutamatergic_neuron_in_vitro_differentiated_cells_/glutamatergic_neuron_in_vitro_differentiated_cells___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/glutamatergic_neuron_in_vitro_differentiated_cells_/glutamatergic_neuron_in_vitro_differentiated_cells___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "bipolar neuron (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/bipolar_neuron_in_vitro_differentiated_cells_/bipolar_neuron_in_vitro_differentiated_cells___dnase.bigWig",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "astrocyte",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/astrocyte/astrocyte__dnase.bigWig",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "astrocyte (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/astrocyte_in_vitro_differentiated_cells_/astrocyte_in_vitro_differentiated_cells___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/astrocyte_in_vitro_differentiated_cells_/astrocyte_in_vitro_differentiated_cells___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/astrocyte_in_vitro_differentiated_cells_/astrocyte_in_vitro_differentiated_cells___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/astrocyte_in_vitro_differentiated_cells_/astrocyte_in_vitro_differentiated_cells___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (87 years) with Alzheimer's disease, Cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_87_years_with_alzheimer_s_disease_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_87_years_with_alzheimer_s_disease_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_87_years_with_alzheimer_s_disease_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_87_years_with_alzheimer_s_disease_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_87_years_with_alzheimer_s_disease_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_87_years_with_alzheimer_s_disease_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (90 or above years) with Alzheimer's disease, Cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_alzheimer_s_disease_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (87 years) with Alzheimer's disease, Cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_with_alzheimer_s_disease_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_87_years_with_alzheimer_s_disease_cognitive_impairment__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_with_alzheimer_s_disease_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_87_years_with_alzheimer_s_disease_cognitive_impairment__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_with_alzheimer_s_disease_cognitive_impairment/dorsolateral_prefrontal_cortex_female_adult_87_years_with_alzheimer_s_disease_cognitive_impairment__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "SK-N-MC",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/sk_n_mc/sk_n_mc__dnase.bigWig",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "neural cell (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "motor neuron (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "choroid plexus epithelial cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/choroid_plexus_epithelial_cell/choroid_plexus_epithelial_cell__dnase.bigWig",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "brain organoid ( 90 days post differentiation)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/brain_organoid_90_days_post_differentiation_/brain_organoid_90_days_post_differentiation___dnase.bigWig",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "brain organoid ( 180 days post differentiation)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/brain_organoid_180_days_post_differentiation_/brain_organoid_180_days_post_differentiation___dnase.bigWig",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "brain organoid ( 30 days post differentiation)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "BE2C",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/be2c/be2c__dnase.bigWig",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "astrocyte of the cerebellum",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/astrocyte_of_the_cerebellum/astrocyte_of_the_cerebellum__dnase.bigWig",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "temporal lobe, male adult (81 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/temporal_lobe_male_adult_81_years_/temporal_lobe_male_adult_81_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/temporal_lobe_male_adult_81_years_/temporal_lobe_male_adult_81_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "temporal lobe, female adult (75 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/temporal_lobe_female_adult_75_years_/temporal_lobe_female_adult_75_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/temporal_lobe_female_adult_75_years_/temporal_lobe_female_adult_75_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "substantia nigra, male adult (81 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/substantia_nigra_male_adult_81_years_/substantia_nigra_male_adult_81_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "neurosphere, embryo (15 weeks)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/neurosphere_embryo_15_weeks_/neurosphere_embryo_15_weeks___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/neurosphere_embryo_15_weeks_/neurosphere_embryo_15_weeks___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (81 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_81_years_/dorsolateral_prefrontal_cortex_male_adult_81_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_81_years_/dorsolateral_prefrontal_cortex_male_adult_81_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (75 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_75_years_/dorsolateral_prefrontal_cortex_female_adult_75_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_75_years_/dorsolateral_prefrontal_cortex_female_adult_75_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "layer of hippocampus, male adult (81 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/layer_of_hippocampus_male_adult_81_years_/layer_of_hippocampus_male_adult_81_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/layer_of_hippocampus_male_adult_81_years_/layer_of_hippocampus_male_adult_81_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "layer of hippocampus, male adult (73 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/layer_of_hippocampus_male_adult_73_years_/layer_of_hippocampus_male_adult_73_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/layer_of_hippocampus_male_adult_73_years_/layer_of_hippocampus_male_adult_73_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "layer of hippocampus, female adult (75 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/layer_of_hippocampus_female_adult_75_years_/layer_of_hippocampus_female_adult_75_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/layer_of_hippocampus_female_adult_75_years_/layer_of_hippocampus_female_adult_75_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "H54",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/h54/h54__dnase.bigWig",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "D721Med",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/d721med/d721med__dnase.bigWig",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "cingulate gyrus, male adult (81 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/cingulate_gyrus_male_adult_81_years_/cingulate_gyrus_male_adult_81_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/cingulate_gyrus_male_adult_81_years_/cingulate_gyrus_male_adult_81_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "cingulate gyrus, female adult (75 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/cingulate_gyrus_female_adult_75_years_/cingulate_gyrus_female_adult_75_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/cingulate_gyrus_female_adult_75_years_/cingulate_gyrus_female_adult_75_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "caudate nucleus, male adult (81 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/caudate_nucleus_male_adult_81_years_/caudate_nucleus_male_adult_81_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/caudate_nucleus_male_adult_81_years_/caudate_nucleus_male_adult_81_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "caudate nucleus, female adult (75 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/caudate_nucleus_female_adult_75_years_/caudate_nucleus_female_adult_75_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/caudate_nucleus_female_adult_75_years_/caudate_nucleus_female_adult_75_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "brain, male embryo (122 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/brain_male_embryo_122_days_/brain_male_embryo_122_days___dnase.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/brain_male_embryo_122_days_/brain_male_embryo_122_days___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "angular gyrus, male adult (81 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/angular_gyrus_male_adult_81_years_/angular_gyrus_male_adult_81_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/angular_gyrus_male_adult_81_years_/angular_gyrus_male_adult_81_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "angular gyrus, female adult (75 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/angular_gyrus_female_adult_75_years_/angular_gyrus_female_adult_75_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/angular_gyrus_female_adult_75_years_/angular_gyrus_female_adult_75_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (90 or above years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_90_or_above_years_with_mild_cognitive_impairment/posterior_cingulate_gyrus_female_adult_90_or_above_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (90 or above years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_90_or_above_years_with_mild_cognitive_impairment/head_of_caudate_nucleus_male_adult_90_or_above_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (89 years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_89_years_with_mild_cognitive_impairment/head_of_caudate_nucleus_male_adult_89_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (84 years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_84_years_with_mild_cognitive_impairment/head_of_caudate_nucleus_male_adult_84_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (90 or above years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_90_or_above_years_with_mild_cognitive_impairment/head_of_caudate_nucleus_female_adult_90_or_above_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (89 years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_89_years_with_mild_cognitive_impairment/head_of_caudate_nucleus_female_adult_89_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (88 years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_88_years_with_mild_cognitive_impairment/head_of_caudate_nucleus_female_adult_88_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (87 years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_87_years_with_mild_cognitive_impairment/head_of_caudate_nucleus_female_adult_87_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (83 years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_83_years_with_mild_cognitive_impairment/head_of_caudate_nucleus_female_adult_83_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (78 years) with mild cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_78_years_with_mild_cognitive_impairment/head_of_caudate_nucleus_female_adult_78_years_with_mild_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (90 or above years) with Cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_90_or_above_years_with_cognitive_impairment/head_of_caudate_nucleus_female_adult_90_or_above_years_with_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (86 years) with Cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_86_years_with_cognitive_impairment/head_of_caudate_nucleus_female_adult_86_years_with_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (81 years) with Cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_81_years_with_cognitive_impairment/head_of_caudate_nucleus_female_adult_81_years_with_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, male adult (80 years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_male_adult_80_years_with_cognitive_impairment_alzheimer_s_disease/posterior_cingulate_gyrus_male_adult_80_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, male adult (73 years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_male_adult_73_years_with_cognitive_impairment_alzheimer_s_disease/posterior_cingulate_gyrus_male_adult_73_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (87 years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_87_years_with_cognitive_impairment_alzheimer_s_disease/posterior_cingulate_gyrus_female_adult_87_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (87 years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_87_years_with_cognitive_impairment_alzheimer_s_disease/dorsolateral_prefrontal_cortex_male_adult_87_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (90 or above years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_cognitive_impairment_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_90_or_above_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, female adult (87 years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_female_adult_87_years_with_cognitive_impairment_alzheimer_s_disease/dorsolateral_prefrontal_cortex_female_adult_87_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (87 years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_87_years_with_cognitive_impairment_alzheimer_s_disease/head_of_caudate_nucleus_male_adult_87_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (84 years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_84_years_with_cognitive_impairment_alzheimer_s_disease/head_of_caudate_nucleus_male_adult_84_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (80 years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_80_years_with_cognitive_impairment_alzheimer_s_disease/head_of_caudate_nucleus_male_adult_80_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (73 years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_73_years_with_cognitive_impairment_alzheimer_s_disease/head_of_caudate_nucleus_male_adult_73_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (90 or above years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_90_or_above_years_with_cognitive_impairment_alzheimer_s_disease/head_of_caudate_nucleus_female_adult_90_or_above_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (87 years) with Cognitive impairment, Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_87_years_with_cognitive_impairment_alzheimer_s_disease/head_of_caudate_nucleus_female_adult_87_years_with_cognitive_impairment_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, male adult (90 or above years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_male_adult_90_or_above_years_with_alzheimer_s_disease/posterior_cingulate_gyrus_male_adult_90_or_above_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (90 or above years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_90_or_above_years_with_alzheimer_s_disease/posterior_cingulate_gyrus_female_adult_90_or_above_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (89 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_89_years_with_alzheimer_s_disease/posterior_cingulate_gyrus_female_adult_89_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (88 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_88_years_with_alzheimer_s_disease/posterior_cingulate_gyrus_female_adult_88_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (86 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_86_years_with_alzheimer_s_disease/posterior_cingulate_gyrus_female_adult_86_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (90 or above years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_90_or_above_years_with_alzheimer_s_disease/head_of_caudate_nucleus_male_adult_90_or_above_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (87 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_87_years_with_alzheimer_s_disease/head_of_caudate_nucleus_male_adult_87_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (90 or above years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_90_or_above_years_with_alzheimer_s_disease/head_of_caudate_nucleus_female_adult_90_or_above_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (89 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_89_years_with_alzheimer_s_disease/head_of_caudate_nucleus_female_adult_89_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (86 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_86_years_with_alzheimer_s_disease/head_of_caudate_nucleus_female_adult_86_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (81 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_81_years_with_alzheimer_s_disease/head_of_caudate_nucleus_female_adult_81_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (74 years) with Alzheimer's disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_74_years_with_alzheimer_s_disease/head_of_caudate_nucleus_female_adult_74_years_with_alzheimer_s_disease__dnase.bigWig",
        },
      ],
    },
    {
      name: "dorsolateral prefrontal cortex, male adult (73 years) with Alzheimer's disease, Cognitive impairment",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/dorsolateral_prefrontal_cortex_male_adult_73_years_with_alzheimer_s_disease_cognitive_impairment/dorsolateral_prefrontal_cortex_male_adult_73_years_with_alzheimer_s_disease_cognitive_impairment__dnase.bigWig",
        },
      ],
    },
    {
      name: "superior temporal gyrus, male adult (84 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/superior_temporal_gyrus_male_adult_84_years_/superior_temporal_gyrus_male_adult_84_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "substantia nigra, female adult (75 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/substantia_nigra_female_adult_75_years_/substantia_nigra_female_adult_75_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "smooth muscle cell of the brain vasculature, female",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/smooth_muscle_cell_of_the_brain_vasculature_female/smooth_muscle_cell_of_the_brain_vasculature_female__dnase.bigWig",
        },
      ],
    },
    {
      name: "SK-N-DZ, treated with dimethyl sulfoxide for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/sk_n_dz_treated_with_dimethyl_sulfoxide_for_72_hours/sk_n_dz_treated_with_dimethyl_sulfoxide_for_72_hours__dnase.bigWig",
        },
      ],
    },
    {
      name: "SK-N-DZ",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/sk_n_dz/sk_n_dz__dnase.bigWig",
        },
      ],
    },
    {
      name: "putamen, male adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/putamen_male_adult_78_years_/putamen_male_adult_78_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, male adult (83 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_male_adult_83_years_/posterior_cingulate_gyrus_male_adult_83_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, male adult (82 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_male_adult_82_years_/posterior_cingulate_gyrus_male_adult_82_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, male adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_male_adult_78_years_/posterior_cingulate_gyrus_male_adult_78_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (90 or above years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_90_or_above_years_/posterior_cingulate_gyrus_female_adult_90_or_above_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (89 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_89_years_/posterior_cingulate_gyrus_female_adult_89_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (88 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_88_years_/posterior_cingulate_gyrus_female_adult_88_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (87 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_87_years_/posterior_cingulate_gyrus_female_adult_87_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (85 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_85_years_/posterior_cingulate_gyrus_female_adult_85_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (84 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_84_years_/posterior_cingulate_gyrus_female_adult_84_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (82 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_82_years_/posterior_cingulate_gyrus_female_adult_82_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (77 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_77_years_/posterior_cingulate_gyrus_female_adult_77_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "posterior cingulate gyrus, female adult (75 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/posterior_cingulate_gyrus_female_adult_75_years_/posterior_cingulate_gyrus_female_adult_75_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "pons, male adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/pons_male_adult_78_years_/pons_male_adult_78_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "occipital lobe, male adult (84 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/occipital_lobe_male_adult_84_years_/occipital_lobe_male_adult_84_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "neurosphere, female embryo (17 weeks)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/neurosphere_female_embryo_17_weeks_/neurosphere_female_embryo_17_weeks___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "neuron (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "mid-neurogenesis radial glial cells (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "middle frontal gyrus, male adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/middle_frontal_gyrus_male_adult_78_years_/middle_frontal_gyrus_male_adult_78_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "midbrain, male adult (78 years) male adult (84 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/midbrain_male_adult_78_years_male_adult_84_years_/midbrain_male_adult_78_years_male_adult_84_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "medulla oblongata, male adult (84 years) male adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/medulla_oblongata_male_adult_84_years_male_adult_78_years_/medulla_oblongata_male_adult_84_years_male_adult_78_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "M059J",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/m059j/m059j__dnase.bigWig",
        },
      ],
    },
    {
      name: "inferior parietal cortex, male adult (84 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/inferior_parietal_cortex_male_adult_84_years_/inferior_parietal_cortex_male_adult_84_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (90 or above years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_90_or_above_years_/head_of_caudate_nucleus_male_adult_90_or_above_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (87 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_87_years_/head_of_caudate_nucleus_male_adult_87_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (86 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_86_years_/head_of_caudate_nucleus_male_adult_86_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (85 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_85_years_/head_of_caudate_nucleus_male_adult_85_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (84 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_84_years_/head_of_caudate_nucleus_male_adult_84_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (83 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_83_years_/head_of_caudate_nucleus_male_adult_83_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (82 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_82_years_/head_of_caudate_nucleus_male_adult_82_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_78_years_/head_of_caudate_nucleus_male_adult_78_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, male adult (71 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_male_adult_71_years_/head_of_caudate_nucleus_male_adult_71_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (90 or above years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_90_or_above_years_/head_of_caudate_nucleus_female_adult_90_or_above_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (89 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_89_years_/head_of_caudate_nucleus_female_adult_89_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (88 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_88_years_/head_of_caudate_nucleus_female_adult_88_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (87 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_87_years_/head_of_caudate_nucleus_female_adult_87_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (83 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_83_years_/head_of_caudate_nucleus_female_adult_83_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (82 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_82_years_/head_of_caudate_nucleus_female_adult_82_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (79 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_79_years_/head_of_caudate_nucleus_female_adult_79_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_78_years_/head_of_caudate_nucleus_female_adult_78_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "head of caudate nucleus, female adult (77 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/head_of_caudate_nucleus_female_adult_77_years_/head_of_caudate_nucleus_female_adult_77_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "H4",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/h4/h4__dnase.bigWig",
        },
      ],
    },
    {
      name: "globus pallidus, male adult (84 years) male adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/globus_pallidus_male_adult_84_years_male_adult_78_years_/globus_pallidus_male_adult_84_years_male_adult_78_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "germinal matrix, male embryo (20 weeks)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/germinal_matrix_male_embryo_20_weeks_/germinal_matrix_male_embryo_20_weeks___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "frontal cortex, male adult (27 years) male adult (35 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/frontal_cortex_male_adult_27_years_male_adult_35_years_/frontal_cortex_male_adult_27_years_male_adult_35_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "frontal cortex, female adult (80 years) female adult (67 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/frontal_cortex_female_adult_80_years_female_adult_67_years_/frontal_cortex_female_adult_80_years_female_adult_67_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "ecto neural progenitor cell (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "Daoy",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/daoy/daoy__dnase.bigWig",
        },
      ],
    },
    {
      name: "D341Med",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/d341med/d341med__dnase.bigWig",
        },
      ],
    },
    {
      name: "cerebellum, male adult (53 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/cerebellum_male_adult_53_years_/cerebellum_male_adult_53_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "cerebellum, male adult (27 years) male adult (35 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/cerebellum_male_adult_27_years_male_adult_35_years_/cerebellum_male_adult_27_years_male_adult_35_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "cerebellar cortex, male adult (84 years) male adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/cerebellar_cortex_male_adult_84_years_male_adult_78_years_/cerebellar_cortex_male_adult_84_years_male_adult_78_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "caudate nucleus, male adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/caudate_nucleus_male_adult_78_years_/caudate_nucleus_male_adult_78_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "brain, male embryo (76 days) male embryo (72 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "brain, male embryo (105 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "brain, male embryo (104 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/brain_male_embryo_104_days_/brain_male_embryo_104_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "brain, male embryo (101 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "brain, female embryo (96 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/brain_female_embryo_96_days_/brain_female_embryo_96_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "brain, female embryo (85 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "brain, female embryo (17 weeks)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "brain, female embryo (142 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "brain, female embryo (117 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/brain/brain_female_embryo_117_days_/brain_female_embryo_117_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "brain, female embryo (109 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "brain, female embryo (105 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "brain, embryo (80 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "brain, male embryo (58 days) embryo (56 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "brain, embryo (112 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "brain pericyte",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
  ],
  Adipose: [
    {
      name: "omental fat pad, female adult (51 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/omental_fat_pad_female_adult_51_years_/omental_fat_pad_female_adult_51_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/omental_fat_pad_female_adult_51_years_/omental_fat_pad_female_adult_51_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/omental_fat_pad_female_adult_51_years_/omental_fat_pad_female_adult_51_years___ctcf.bigWig",
        },
      ],
    },
    {
      name: "subcutaneous adipose tissue, female adult (53 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/subcutaneous_adipose_tissue_female_adult_53_years_/subcutaneous_adipose_tissue_female_adult_53_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/subcutaneous_adipose_tissue_female_adult_53_years_/subcutaneous_adipose_tissue_female_adult_53_years___ctcf.bigWig",
        },
      ],
    },
    {
      name: "subcutaneous abdominal adipose tissue, female adult (49 years) nuclear fraction",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/subcutaneous_abdominal_adipose_tissue_female_adult_49_years_nuclear_fraction/subcutaneous_abdominal_adipose_tissue_female_adult_49_years_nuclear_fraction__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/subcutaneous_abdominal_adipose_tissue_female_adult_49_years_nuclear_fraction/subcutaneous_abdominal_adipose_tissue_female_adult_49_years_nuclear_fraction__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "subcutaneous abdominal adipose tissue, female adult (81 years) nuclear fraction",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/subcutaneous_abdominal_adipose_tissue_female_adult_81_years_nuclear_fraction/subcutaneous_abdominal_adipose_tissue_female_adult_81_years_nuclear_fraction__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "subcutaneous abdominal adipose tissue, female adult (59 years) nuclear fraction",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/subcutaneous_abdominal_adipose_tissue_female_adult_59_years_nuclear_fraction/subcutaneous_abdominal_adipose_tissue_female_adult_59_years_nuclear_fraction__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "subcutaneous abdominal adipose tissue, female adult (41 years) nuclear fraction",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/subcutaneous_abdominal_adipose_tissue_female_adult_41_years_nuclear_fraction/subcutaneous_abdominal_adipose_tissue_female_adult_41_years_nuclear_fraction__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "subcutaneous abdominal adipose tissue, female adult (25 years) nuclear fraction",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/subcutaneous_abdominal_adipose_tissue_female_adult_25_years_nuclear_fraction/subcutaneous_abdominal_adipose_tissue_female_adult_25_years_nuclear_fraction__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "omental fat pad, male adult (54 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/omental_fat_pad_male_adult_54_years_/omental_fat_pad_male_adult_54_years___ctcf.bigWig",
        },
      ],
    },
    {
      name: "omental fat pad, male adult (37 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/omental_fat_pad_male_adult_37_years_/omental_fat_pad_male_adult_37_years___ctcf.bigWig",
        },
      ],
    },
    {
      name: "omental fat pad, female adult (53 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/adipose/omental_fat_pad_female_adult_53_years_/omental_fat_pad_female_adult_53_years___dnase.bigWig",
        },
      ],
    },
  ],
  Heart: [
    {
      name: "right atrium auricular region, female adult (51 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_atrium_auricular_region_female_adult_51_years_/right_atrium_auricular_region_female_adult_51_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_atrium_auricular_region_female_adult_51_years_/right_atrium_auricular_region_female_adult_51_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_atrium_auricular_region_female_adult_51_years_/right_atrium_auricular_region_female_adult_51_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "heart right ventricle, male adult (69 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_69_years_/heart_right_ventricle_male_adult_69_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_69_years_/heart_right_ventricle_male_adult_69_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_69_years_/heart_right_ventricle_male_adult_69_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_69_years_/heart_right_ventricle_male_adult_69_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_69_years_/heart_right_ventricle_male_adult_69_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart right ventricle, male adult (66 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_66_years_/heart_right_ventricle_male_adult_66_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_66_years_/heart_right_ventricle_male_adult_66_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_66_years_/heart_right_ventricle_male_adult_66_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_66_years_/heart_right_ventricle_male_adult_66_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_66_years_/heart_right_ventricle_male_adult_66_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart right ventricle, male adult (61 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_61_years_/heart_right_ventricle_male_adult_61_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_61_years_/heart_right_ventricle_male_adult_61_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_61_years_/heart_right_ventricle_male_adult_61_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_61_years_/heart_right_ventricle_male_adult_61_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_61_years_/heart_right_ventricle_male_adult_61_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart right ventricle, male adult (43 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_43_years_/heart_right_ventricle_male_adult_43_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_43_years_/heart_right_ventricle_male_adult_43_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_43_years_/heart_right_ventricle_male_adult_43_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_43_years_/heart_right_ventricle_male_adult_43_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_43_years_/heart_right_ventricle_male_adult_43_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart right ventricle, female adult (46 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_46_years_/heart_right_ventricle_female_adult_46_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_46_years_/heart_right_ventricle_female_adult_46_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_46_years_/heart_right_ventricle_female_adult_46_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_46_years_/heart_right_ventricle_female_adult_46_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_46_years_/heart_right_ventricle_female_adult_46_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, male adult (43 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_43_years_/heart_left_ventricle_male_adult_43_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_43_years_/heart_left_ventricle_male_adult_43_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_43_years_/heart_left_ventricle_male_adult_43_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_43_years_/heart_left_ventricle_male_adult_43_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_43_years_/heart_left_ventricle_male_adult_43_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, female adult (59 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_59_years_/heart_left_ventricle_female_adult_59_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_59_years_/heart_left_ventricle_female_adult_59_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_59_years_/heart_left_ventricle_female_adult_59_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_59_years_/heart_left_ventricle_female_adult_59_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_59_years_/heart_left_ventricle_female_adult_59_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, female adult (53 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_53_years_/heart_left_ventricle_female_adult_53_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_53_years_/heart_left_ventricle_female_adult_53_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_53_years_/heart_left_ventricle_female_adult_53_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_53_years_/heart_left_ventricle_female_adult_53_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_53_years_/heart_left_ventricle_female_adult_53_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "right atrium auricular region, female adult (53 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_atrium_auricular_region_female_adult_53_years_/right_atrium_auricular_region_female_adult_53_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_atrium_auricular_region_female_adult_53_years_/right_atrium_auricular_region_female_adult_53_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_atrium_auricular_region_female_adult_53_years_/right_atrium_auricular_region_female_adult_53_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_atrium_auricular_region_female_adult_53_years_/right_atrium_auricular_region_female_adult_53_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "mesothelial cell of epicardium (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/mesothelial_cell_of_epicardium_in_vitro_differentiated_cells_/mesothelial_cell_of_epicardium_in_vitro_differentiated_cells___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/mesothelial_cell_of_epicardium_in_vitro_differentiated_cells_/mesothelial_cell_of_epicardium_in_vitro_differentiated_cells___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "left ventricle myocardium inferior, male adult (60 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/left_ventricle_myocardium_inferior_male_adult_60_years_/left_ventricle_myocardium_inferior_male_adult_60_years___dnase.bigWig",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "heart right ventricle, male adult (40 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_40_years_/heart_right_ventricle_male_adult_40_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_40_years_/heart_right_ventricle_male_adult_40_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_40_years_/heart_right_ventricle_male_adult_40_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_40_years_/heart_right_ventricle_male_adult_40_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart right ventricle, female adult (59 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_59_years_/heart_right_ventricle_female_adult_59_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_59_years_/heart_right_ventricle_female_adult_59_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_59_years_/heart_right_ventricle_female_adult_59_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_59_years_/heart_right_ventricle_female_adult_59_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart right ventricle, female adult (56 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_56_years_/heart_right_ventricle_female_adult_56_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_56_years_/heart_right_ventricle_female_adult_56_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_56_years_/heart_right_ventricle_female_adult_56_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_adult_56_years_/heart_right_ventricle_female_adult_56_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, male adult (66 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_66_years_/heart_left_ventricle_male_adult_66_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_66_years_/heart_left_ventricle_male_adult_66_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_66_years_/heart_left_ventricle_male_adult_66_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_66_years_/heart_left_ventricle_male_adult_66_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, male adult (61 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_61_years_/heart_left_ventricle_male_adult_61_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_61_years_/heart_left_ventricle_male_adult_61_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_61_years_/heart_left_ventricle_male_adult_61_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_61_years_/heart_left_ventricle_male_adult_61_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, female adult (56 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_56_years_/heart_left_ventricle_female_adult_56_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_56_years_/heart_left_ventricle_female_adult_56_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_56_years_/heart_left_ventricle_female_adult_56_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_56_years_/heart_left_ventricle_female_adult_56_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, female adult (51 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_51_years_/heart_left_ventricle_female_adult_51_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_51_years_/heart_left_ventricle_female_adult_51_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_51_years_/heart_left_ventricle_female_adult_51_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_51_years_/heart_left_ventricle_female_adult_51_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, female adult (46 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_46_years_/heart_left_ventricle_female_adult_46_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_46_years_/heart_left_ventricle_female_adult_46_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_46_years_/heart_left_ventricle_female_adult_46_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_adult_46_years_/heart_left_ventricle_female_adult_46_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart right ventricle, male adult (73 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_73_years_/heart_right_ventricle_male_adult_73_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_73_years_/heart_right_ventricle_male_adult_73_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_73_years_/heart_right_ventricle_male_adult_73_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, male adult (73 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_73_years_/heart_left_ventricle_male_adult_73_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_73_years_/heart_left_ventricle_male_adult_73_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_73_years_/heart_left_ventricle_male_adult_73_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, male adult (40 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_40_years_/heart_left_ventricle_male_adult_40_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_40_years_/heart_left_ventricle_male_adult_40_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_40_years_/heart_left_ventricle_male_adult_40_years___h3k27ac.bigWig",
        },
      ],
    },
    {
      name: "cardiac fibroblast, female adult",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/cardiac_fibroblast_female_adult/cardiac_fibroblast_female_adult__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/cardiac_fibroblast_female_adult/cardiac_fibroblast_female_adult__ctcf.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/cardiac_fibroblast_female_adult/cardiac_fibroblast_female_adult__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "Right ventricle myocardium superior, male adult (60 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_ventricle_myocardium_superior_male_adult_60_years_/right_ventricle_myocardium_superior_male_adult_60_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_ventricle_myocardium_superior_male_adult_60_years_/right_ventricle_myocardium_superior_male_adult_60_years___atac.bigWig",
        },
      ],
    },
    {
      name: "Right ventricle myocardium inferior, male adult (60 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_ventricle_myocardium_inferior_male_adult_60_years_/right_ventricle_myocardium_inferior_male_adult_60_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_ventricle_myocardium_inferior_male_adult_60_years_/right_ventricle_myocardium_inferior_male_adult_60_years___atac.bigWig",
        },
      ],
    },
    {
      name: "right cardiac atrium, male adult (60 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_cardiac_atrium_male_adult_60_years_/right_cardiac_atrium_male_adult_60_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_cardiac_atrium_male_adult_60_years_/right_cardiac_atrium_male_adult_60_years___atac.bigWig",
        },
      ],
    },
    {
      name: "right cardiac atrium, male adult (34 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_cardiac_atrium_male_adult_34_years_/right_cardiac_atrium_male_adult_34_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_cardiac_atrium_male_adult_34_years_/right_cardiac_atrium_male_adult_34_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "right cardiac atrium, female adult (59 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_cardiac_atrium_female_adult_59_years_/right_cardiac_atrium_female_adult_59_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_cardiac_atrium_female_adult_59_years_/right_cardiac_atrium_female_adult_59_years___atac.bigWig",
        },
      ],
    },
    {
      name: "left ventricle myocardium superior, male adult (60 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/left_ventricle_myocardium_superior_male_adult_60_years_/left_ventricle_myocardium_superior_male_adult_60_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/left_ventricle_myocardium_superior_male_adult_60_years_/left_ventricle_myocardium_superior_male_adult_60_years___atac.bigWig",
        },
      ],
    },
    {
      name: "heart right ventricle, male child (3 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_child_3_years_/heart_right_ventricle_male_child_3_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_child_3_years_/heart_right_ventricle_male_child_3_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart right ventricle, male adult (54 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_54_years_/heart_right_ventricle_male_adult_54_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_54_years_/heart_right_ventricle_male_adult_54_years___atac.bigWig",
        },
      ],
    },
    {
      name: "heart right ventricle, male adult (34 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_34_years_/heart_right_ventricle_male_adult_34_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_34_years_/heart_right_ventricle_male_adult_34_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, male child (3 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_child_3_years_/heart_left_ventricle_male_child_3_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_child_3_years_/heart_left_ventricle_male_child_3_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, male adult (54 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_54_years_/heart_left_ventricle_male_adult_54_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_54_years_/heart_left_ventricle_male_adult_54_years___ctcf.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, male adult (34 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_34_years_/heart_left_ventricle_male_adult_34_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_34_years_/heart_left_ventricle_male_adult_34_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "cardiovascular progenitor cell (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/cardiovascular_progenitor_cell_in_vitro_differentiated_cells_/cardiovascular_progenitor_cell_in_vitro_differentiated_cells___dnase.bigWig",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "cardiac fibroblast",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/cardiac_fibroblast/cardiac_fibroblast__dnase.bigWig",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "right cardiac atrium, female adult (46 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/right_cardiac_atrium_female_adult_46_years_/right_cardiac_atrium_female_adult_46_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "left cardiac atrium, female embryo (101 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/left_cardiac_atrium_female_embryo_101_days_/left_cardiac_atrium_female_embryo_101_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "left cardiac atrium, female adult (59 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/left_cardiac_atrium_female_adult_59_years_/left_cardiac_atrium_female_adult_59_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart, male embryo (96 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "heart, male embryo (91 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_male_embryo_91_days_/heart_male_embryo_91_days___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "heart, male embryo (72 days) male embryo (76 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_male_embryo_72_days_male_embryo_76_days_/heart_male_embryo_72_days_male_embryo_76_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart, male embryo (120 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_male_embryo_120_days_/heart_male_embryo_120_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart, male embryo (110 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "heart, male embryo (105 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_male_embryo_105_days_/heart_male_embryo_105_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart, male child (3 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "heart, male adult (27 years) male adult (35 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_male_adult_27_years_male_adult_35_years_/heart_male_adult_27_years_male_adult_35_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart, female embryo (91 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_female_embryo_91_days_/heart_female_embryo_91_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart, female embryo (147 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_female_embryo_147_days_/heart_female_embryo_147_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart, female embryo (117 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "heart, female embryo (98 days) female embryo (116 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_female_embryo_98_days_female_embryo_116_days_/heart_female_embryo_98_days_female_embryo_116_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart, female embryo (110 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_female_embryo_110_days_/heart_female_embryo_110_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart, female embryo (105 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "heart, female embryo (103 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "heart, embryo (96 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "heart, embryo (80 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_embryo_80_days_/heart_embryo_80_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart, female embryo (76 days) embryo (59 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "heart, embryo (101 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "heart right ventricle, male adult (55 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_male_adult_55_years_/heart_right_ventricle_male_adult_55_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart right ventricle, female embryo (103 days) female embryo (101 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_right_ventricle_female_embryo_103_days_female_embryo_101_days_/heart_right_ventricle_female_embryo_103_days_female_embryo_101_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, male adult (69 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_male_adult_69_years_/heart_left_ventricle_male_adult_69_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "heart left ventricle, female embryo (136 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "heart left ventricle, female embryo (101 days) female embryo (103 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/heart_left_ventricle_female_embryo_101_days_female_embryo_103_days_/heart_left_ventricle_female_embryo_101_days_female_embryo_103_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "cardiac septum, female adult (41 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/heart/cardiac_septum_female_adult_41_years_/cardiac_septum_female_adult_41_years___dnase.bigWig",
        },
      ],
    },
  ],
  Liver: [
    {
      name: "right lobe of liver, female adult (53 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/right_lobe_of_liver_female_adult_53_years_/right_lobe_of_liver_female_adult_53_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/right_lobe_of_liver_female_adult_53_years_/right_lobe_of_liver_female_adult_53_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/right_lobe_of_liver_female_adult_53_years_/right_lobe_of_liver_female_adult_53_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "HepG2",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/hepg2/hepg2__dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "hepatocyte (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "liver, male adult (32 years) with nonobstructive coronary artery disease",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/liver_male_adult_32_years_with_nonobstructive_coronary_artery_disease/liver_male_adult_32_years_with_nonobstructive_coronary_artery_disease__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/liver_male_adult_32_years_with_nonobstructive_coronary_artery_disease/liver_male_adult_32_years_with_nonobstructive_coronary_artery_disease__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "right lobe of liver, male adult (45 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/right_lobe_of_liver_male_adult_45_years_/right_lobe_of_liver_male_adult_45_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/right_lobe_of_liver_male_adult_45_years_/right_lobe_of_liver_male_adult_45_years___atac.bigWig",
        },
      ],
    },
    {
      name: "right lobe of liver, female child (16 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/right_lobe_of_liver_female_child_16_years_/right_lobe_of_liver_female_child_16_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/right_lobe_of_liver_female_child_16_years_/right_lobe_of_liver_female_child_16_years___atac.bigWig",
        },
      ],
    },
    {
      name: "right lobe of liver, female adult (47 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/right_lobe_of_liver_female_adult_47_years_/right_lobe_of_liver_female_adult_47_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/right_lobe_of_liver_female_adult_47_years_/right_lobe_of_liver_female_adult_47_years___atac.bigWig",
        },
      ],
    },
    {
      name: "right lobe of liver, female adult (41 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/right_lobe_of_liver_female_adult_41_years_/right_lobe_of_liver_female_adult_41_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/right_lobe_of_liver_female_adult_41_years_/right_lobe_of_liver_female_adult_41_years___atac.bigWig",
        },
      ],
    },
    {
      name: "liver, male adult (31 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/liver_male_adult_31_years_/liver_male_adult_31_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/liver_male_adult_31_years_/liver_male_adult_31_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "liver, female adult (25 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/liver_female_adult_25_years_/liver_female_adult_25_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/liver_female_adult_25_years_/liver_female_adult_25_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "liver, male adult (78 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/liver_male_adult_78_years_/liver_male_adult_78_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "liver, female embryo (101 days) female embryo (113 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "liver, male adult (32 years) with nonobstructive coronary artery disease female child (6 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "liver, embryo (59 days) embryo (80 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/liver_embryo_59_days_embryo_80_days_/liver_embryo_59_days_embryo_80_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "left lobe of liver, male adult (45 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/left_lobe_of_liver_male_adult_45_years_/left_lobe_of_liver_male_adult_45_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "HuH-7",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/huh_7/huh_7__dnase.bigWig",
        },
      ],
    },
    {
      name: "HuH-7.5",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/huh_7_5/huh_7_5__dnase.bigWig",
        },
      ],
    },
    {
      name: "hepatocyte",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/liver/hepatocyte/hepatocyte__dnase.bigWig",
        },
      ],
    },
  ],
  Lung: [
    {
      name: "lower lobe of left lung, male adult (60 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_left_lung_male_adult_60_years_/lower_lobe_of_left_lung_male_adult_60_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_left_lung_male_adult_60_years_/lower_lobe_of_left_lung_male_adult_60_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_left_lung_male_adult_60_years_/lower_lobe_of_left_lung_male_adult_60_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_left_lung_male_adult_60_years_/lower_lobe_of_left_lung_male_adult_60_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_left_lung_male_adult_60_years_/lower_lobe_of_left_lung_male_adult_60_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "left lung, female child (16 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_female_child_16_years_/left_lung_female_child_16_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_female_child_16_years_/left_lung_female_child_16_years___atac.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_female_child_16_years_/left_lung_female_child_16_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_female_child_16_years_/left_lung_female_child_16_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_female_child_16_years_/left_lung_female_child_16_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "upper lobe of left lung, male adult (54 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_male_adult_54_years_/upper_lobe_of_left_lung_male_adult_54_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_male_adult_54_years_/upper_lobe_of_left_lung_male_adult_54_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_male_adult_54_years_/upper_lobe_of_left_lung_male_adult_54_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_male_adult_54_years_/upper_lobe_of_left_lung_male_adult_54_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "upper lobe of left lung, male adult (37 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_male_adult_37_years_/upper_lobe_of_left_lung_male_adult_37_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_male_adult_37_years_/upper_lobe_of_left_lung_male_adult_37_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_male_adult_37_years_/upper_lobe_of_left_lung_male_adult_37_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_male_adult_37_years_/upper_lobe_of_left_lung_male_adult_37_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "upper lobe of left lung, female adult (53 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_female_adult_53_years_/upper_lobe_of_left_lung_female_adult_53_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_female_adult_53_years_/upper_lobe_of_left_lung_female_adult_53_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_female_adult_53_years_/upper_lobe_of_left_lung_female_adult_53_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_female_adult_53_years_/upper_lobe_of_left_lung_female_adult_53_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "upper lobe of left lung, female adult (51 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_female_adult_51_years_/upper_lobe_of_left_lung_female_adult_51_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_female_adult_51_years_/upper_lobe_of_left_lung_female_adult_51_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_female_adult_51_years_/upper_lobe_of_left_lung_female_adult_51_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_female_adult_51_years_/upper_lobe_of_left_lung_female_adult_51_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "PC-9",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "lower lobe of left lung, female adult (59 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_left_lung_female_adult_59_years_/lower_lobe_of_left_lung_female_adult_59_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_left_lung_female_adult_59_years_/lower_lobe_of_left_lung_female_adult_59_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_left_lung_female_adult_59_years_/lower_lobe_of_left_lung_female_adult_59_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_left_lung_female_adult_59_years_/lower_lobe_of_left_lung_female_adult_59_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "left lung, male adult (40 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_male_adult_40_years_/left_lung_male_adult_40_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_male_adult_40_years_/left_lung_male_adult_40_years___ctcf.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_male_adult_40_years_/left_lung_male_adult_40_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_male_adult_40_years_/left_lung_male_adult_40_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "IMR-90",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/imr_90/imr_90__dnase.bigWig",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "AG04450",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/ag04450/ag04450__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "A549",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "atac",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "fibroblast of lung, male adult (45 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/fibroblast_of_lung_male_adult_45_years_/fibroblast_of_lung_male_adult_45_years___dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/fibroblast_of_lung_male_adult_45_years_/fibroblast_of_lung_male_adult_45_years___ctcf.bigWig",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "fibroblast of lung, male adult (45 years) female child (11 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "fibroblast of lung",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/fibroblast_of_lung/fibroblast_of_lung__dnase.bigWig",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "bronchial epithelial cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/bronchial_epithelial_cell/bronchial_epithelial_cell__dnase.bigWig",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "A549, treated with 100 nM dexamethasone (agonist) for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "A549, treated with 0.02 percent ethanol for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/a549_treated_with_0_02_percent_ethanol_for_1_hour/a549_treated_with_0_02_percent_ethanol_for_1_hour__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "WI38, treated with 20.0 nM afimoxifene for 72.0 hours stably expressing RAF1",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "WI38",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "upper lobe of right lung, male adult (60 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_right_lung_male_adult_60_years_/upper_lobe_of_right_lung_male_adult_60_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_right_lung_male_adult_60_years_/upper_lobe_of_right_lung_male_adult_60_years___atac.bigWig",
        },
      ],
    },
    {
      name: "lung, male child (3 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_male_child_3_years_/lung_male_child_3_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_male_child_3_years_/lung_male_child_3_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "lung, female embryo (120 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_female_embryo_120_days_/lung_female_embryo_120_days___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "lung, female adult (47 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_female_adult_47_years_/lung_female_adult_47_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_female_adult_47_years_/lung_female_adult_47_years___atac.bigWig",
        },
      ],
    },
    {
      name: "lung, female adult (30 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_female_adult_30_years_/lung_female_adult_30_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_female_adult_30_years_/lung_female_adult_30_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "lung, embryo (101 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_embryo_101_days_/lung_embryo_101_days___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "lower lobe of right lung, male adult (60 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_right_lung_male_adult_60_years_/lower_lobe_of_right_lung_male_adult_60_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_right_lung_male_adult_60_years_/lower_lobe_of_right_lung_male_adult_60_years___atac.bigWig",
        },
      ],
    },
    {
      name: "Calu3",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/calu3/calu3__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/calu3/calu3__h3k27ac.bigWig",
        },
      ],
    },
    {
      name: "WI38, stably expressing RAF1",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "upper lobe of left lung, male adult (60 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_male_adult_60_years_/upper_lobe_of_left_lung_male_adult_60_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "upper lobe of left lung, female adult (61 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/upper_lobe_of_left_lung_female_adult_61_years_/upper_lobe_of_left_lung_female_adult_61_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "right lung, male embryo (96 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "right lung, male embryo (87 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "right lung, male embryo (115 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/right_lung_male_embryo_115_days_/right_lung_male_embryo_115_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "right lung, male embryo (105 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/right_lung_male_embryo_105_days_/right_lung_male_embryo_105_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "right lung, female embryo (98 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "right lung, female embryo (91 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "right lung, female embryo (117 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/right_lung_female_embryo_117_days_/right_lung_female_embryo_117_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "right lung, female embryo (110 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/right_lung_female_embryo_110_days_/right_lung_female_embryo_110_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "right lung, female embryo (108 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/right_lung_female_embryo_108_days_/right_lung_female_embryo_108_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "right lung, female embryo (107 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "right lung, female embryo (105 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "NCI-H460",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/nci_h460/nci_h460__dnase.bigWig",
        },
      ],
    },
    {
      name: "NCI-H226",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/nci_h226/nci_h226__dnase.bigWig",
        },
      ],
    },
    {
      name: "lung, male embryo (82 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "lung, male embryo (54 days) male embryo (58 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "lung, male embryo (108 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "lung, male embryo (103 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "lung, male adult (27 years) male adult (35 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "lung, female embryo (96 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_female_embryo_96_days_/lung_female_embryo_96_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "lung, female embryo (85 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_female_embryo_85_days_/lung_female_embryo_85_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "lung, female embryo (76 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_female_embryo_76_days_/lung_female_embryo_76_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "lung, female embryo (108 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lung_female_embryo_108_days_/lung_female_embryo_108_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "lung, embryo (80 days) male embryo (76 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "lung, embryo (67 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "lung, embryo (112 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "lower lobe of left lung, female adult (61 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/lower_lobe_of_left_lung_female_adult_61_years_/lower_lobe_of_left_lung_female_adult_61_years___dnase.bigWig",
        },
      ],
    },
    {
      name: "left lung, male embryo (96 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_male_embryo_96_days_/left_lung_male_embryo_96_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "left lung, male embryo (91 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "left lung, male embryo (87 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "left lung, male embryo (115 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_male_embryo_115_days_/left_lung_male_embryo_115_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "left lung, male embryo (113 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_male_embryo_113_days_/left_lung_male_embryo_113_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "left lung, male embryo (105 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "left lung, female embryo (98 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "left lung, female embryo (91 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_female_embryo_91_days_/left_lung_female_embryo_91_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "left lung, female embryo (117 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_female_embryo_117_days_/left_lung_female_embryo_117_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "left lung, female embryo (110 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_female_embryo_110_days_/left_lung_female_embryo_110_days___dnase.bigWig",
        },
      ],
    },
    {
      name: "left lung, female embryo (108 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "left lung, female embryo (107 days)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/lung/left_lung_female_embryo_107_days_/left_lung_female_embryo_107_days___dnase.bigWig",
        },
      ],
    },
  ],
  Blood: [
    {
      name: "K562",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/k562/k562__dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "GM12878",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/gm12878/gm12878__dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "DND-41",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/dnd_41/dnd_41__dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "T-helper 17 cell, male adult (50 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/t_helper_17_cell_male_adult_50_years_/t_helper_17_cell_male_adult_50_years___dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/t_helper_17_cell_male_adult_50_years_/t_helper_17_cell_male_adult_50_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/t_helper_17_cell_male_adult_50_years_/t_helper_17_cell_male_adult_50_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "T-cell, male adult (38 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/t_cell_male_adult_38_years_/t_cell_male_adult_38_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/t_cell_male_adult_38_years_/t_cell_male_adult_38_years___atac.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/t_cell_male_adult_38_years_/t_cell_male_adult_38_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/t_cell_male_adult_38_years_/t_cell_male_adult_38_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "T-cell, female adult (21 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/t_cell_female_adult_21_years_/t_cell_female_adult_21_years___dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/t_cell_female_adult_21_years_/t_cell_female_adult_21_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/t_cell_female_adult_21_years_/t_cell_female_adult_21_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "OCI-LY7",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "natural killer cell, male adult (33 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/natural_killer_cell_male_adult_33_years_/natural_killer_cell_male_adult_33_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/natural_killer_cell_male_adult_33_years_/natural_killer_cell_male_adult_33_years___atac.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/natural_killer_cell_male_adult_33_years_/natural_killer_cell_male_adult_33_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/natural_killer_cell_male_adult_33_years_/natural_killer_cell_male_adult_33_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "natural killer cell, female adult (41 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/natural_killer_cell_female_adult_41_years_/natural_killer_cell_female_adult_41_years___dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/natural_killer_cell_female_adult_41_years_/natural_killer_cell_female_adult_41_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/natural_killer_cell_female_adult_41_years_/natural_killer_cell_female_adult_41_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD8-positive, alpha-beta T cell, male adult (42 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_42_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_42_years___dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_42_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_42_years___atac.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_42_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_42_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_42_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_42_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD8-positive, alpha-beta T cell, male adult (36 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_36_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_36_years___dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_36_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_36_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_36_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_36_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, male adult (50 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_50_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_50_years___dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_50_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_50_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_50_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_50_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive B cell, male adult (40 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell_male_adult_40_years_/naive_b_cell_male_adult_40_years___dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell_male_adult_40_years_/naive_b_cell_male_adult_40_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell_male_adult_40_years_/naive_b_cell_male_adult_40_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive B cell, female adult (39 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell_female_adult_39_years_/naive_b_cell_female_adult_39_years___dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell_female_adult_39_years_/naive_b_cell_female_adult_39_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell_female_adult_39_years_/naive_b_cell_female_adult_39_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "MM.1S",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "memory B cell, male adult (40 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/memory_b_cell_male_adult_40_years_/memory_b_cell_male_adult_40_years___dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/memory_b_cell_male_adult_40_years_/memory_b_cell_male_adult_40_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/memory_b_cell_male_adult_40_years_/memory_b_cell_male_adult_40_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "HL-60",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/hl_60/hl_60__dnase.bigWig",
        },
        {
          name: "ctcf",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/hl_60/hl_60__ctcf.bigWig",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "effector memory CD8-positive, alpha-beta T cell, male adult (33 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_33_years_/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_33_years___dnase.bigWig",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_33_years_/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_33_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_33_years_/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_33_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta T cell, male adult (21 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd8_positive_alpha_beta_t_cell_male_adult_21_years_/cd8_positive_alpha_beta_t_cell_male_adult_21_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "CD14-positive monocyte, female",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "B cell, male adult (22 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta T cell, male adult (21 years) treated with anti-CD3 and anti-CD28 coated beads for 36 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours__atac.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (20 years) treated with anti-CD3 and anti-CD28 coated beads for 36 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours__dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours__atac.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_anti_cd3_and_anti_cd28_coated_beads_for_36_hours__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "activated B cell, male adult (22 years) treated with 0.5 \u03bcM CpG ODN for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_b_cell_male_adult_22_years_treated_with_0_5_\u03bcm_cpg_odn_for_24_hours/activated_b_cell_male_adult_22_years_treated_with_0_5_\u03bcm_cpg_odn_for_24_hours__dnase.bigWig",
        },
        {
          name: "atac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_b_cell_male_adult_22_years_treated_with_0_5_\u03bcm_cpg_odn_for_24_hours/activated_b_cell_male_adult_22_years_treated_with_0_5_\u03bcm_cpg_odn_for_24_hours__atac.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_b_cell_male_adult_22_years_treated_with_0_5_\u03bcm_cpg_odn_for_24_hours/activated_b_cell_male_adult_22_years_treated_with_0_5_\u03bcm_cpg_odn_for_24_hours__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_b_cell_male_adult_22_years_treated_with_0_5_\u03bcm_cpg_odn_for_24_hours/activated_b_cell_male_adult_22_years_treated_with_0_5_\u03bcm_cpg_odn_for_24_hours__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD8-positive, alpha-beta T cell, with multiple sclerosis",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_with_multiple_sclerosis/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_with_multiple_sclerosis__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_with_multiple_sclerosis/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_with_multiple_sclerosis__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_with_multiple_sclerosis/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_with_multiple_sclerosis__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, with multiple sclerosis",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_with_multiple_sclerosis/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_with_multiple_sclerosis__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_with_multiple_sclerosis/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_with_multiple_sclerosis__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_with_multiple_sclerosis/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_with_multiple_sclerosis__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive B cell, with multiple sclerosis",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell_with_multiple_sclerosis/naive_b_cell_with_multiple_sclerosis__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell_with_multiple_sclerosis/naive_b_cell_with_multiple_sclerosis__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell_with_multiple_sclerosis/naive_b_cell_with_multiple_sclerosis__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta memory T cell, with multiple sclerosis",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_memory_t_cell_with_multiple_sclerosis/cd4_positive_alpha_beta_memory_t_cell_with_multiple_sclerosis__dnase.bigWig",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_memory_t_cell_with_multiple_sclerosis/cd4_positive_alpha_beta_memory_t_cell_with_multiple_sclerosis__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "T-cell, male adult (37 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/t_cell_male_adult_37_years_/t_cell_male_adult_37_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "SU-DHL-6",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "stimulated activated naive CD8-positive, alpha-beta T cell, male adult (36 years) treated with anti-CD3 and anti-CD28 coated beads for 72 hours, 100 ng/mL Interleukin-15 for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "stimulated activated naive CD8-positive, alpha-beta T cell, male adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 72 hours, 100 ng/mL Interleukin-15 for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated naive CD4-positive, alpha-beta T cell, male adult (43 years) treated with 10 ng/mL Interleukin-2 for 5 days, anti-CD3 and anti-CD28 coated beads for 7 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_naive_cd4_positive_alpha_beta_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_naive_cd4_positive_alpha_beta_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_naive_cd4_positive_alpha_beta_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_naive_cd4_positive_alpha_beta_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_naive_cd4_positive_alpha_beta_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_naive_cd4_positive_alpha_beta_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta T cell, male adult (21 years) treated with 10 ng/mL Interleukin-2 for 5 days, anti-CD3 and anti-CD28 coated beads for 7 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd8_positive_alpha_beta_t_cell_male_adult_21_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, male adult (30 years) treated with 10 ng/mL Interleukin-2 for 5 days, anti-CD3 and anti-CD28 coated beads for 7 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (20 years) treated with 10 ng/mL Interleukin-2 for 5 days, anti-CD3 and anti-CD28 coated beads for 7 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd4_positive_alpha_beta_t_cell_male_adult_20_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta memory T cell, male adult (43 years) treated with 10 ng/mL Interleukin-2 for 5 days, anti-CD3 and anti-CD28 coated beads for 7 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/activated_cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days/activated_cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years_treated_with_10_ng_ml_interleukin_2_for_5_days_anti_cd3_and_anti_cd28_coated_beads_for_7_days__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "natural killer cell, male adult (37 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/natural_killer_cell_male_adult_37_years_/natural_killer_cell_male_adult_37_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/natural_killer_cell_male_adult_37_years_/natural_killer_cell_male_adult_37_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD8-positive, alpha-beta T cell, male adult (33 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_33_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_33_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_33_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_33_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_33_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_33_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD8-positive, alpha-beta T cell, male adult (30 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_30_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_30_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_30_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_30_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_30_years_/naive_thymus_derived_cd8_positive_alpha_beta_t_cell_male_adult_30_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD8-positive, alpha-beta T cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell/naive_thymus_derived_cd8_positive_alpha_beta_t_cell__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell/naive_thymus_derived_cd8_positive_alpha_beta_t_cell__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd8_positive_alpha_beta_t_cell/naive_thymus_derived_cd8_positive_alpha_beta_t_cell__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, male adult (48 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_48_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_48_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_48_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_48_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_48_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_48_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, male adult (43 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_43_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_43_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_43_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_43_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_43_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_43_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, male adult (35 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_35_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_35_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_35_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_35_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_35_years_/naive_thymus_derived_cd4_positive_alpha_beta_t_cell_male_adult_35_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell/naive_thymus_derived_cd4_positive_alpha_beta_t_cell__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell/naive_thymus_derived_cd4_positive_alpha_beta_t_cell__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_thymus_derived_cd4_positive_alpha_beta_t_cell/naive_thymus_derived_cd4_positive_alpha_beta_t_cell__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "naive B cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell/naive_b_cell__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell/naive_b_cell__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/naive_b_cell/naive_b_cell__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "Karpas-422",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "GM12865",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "GM12864",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "GM06990",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "effector memory CD8-positive, alpha-beta T cell, male adult (36 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years_/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years_/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years_/effector_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "DOHH2",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "central memory CD8-positive, alpha-beta T cell, male adult (36 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/central_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years_/central_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/central_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years_/central_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/central_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years_/central_memory_cd8_positive_alpha_beta_t_cell_male_adult_36_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta memory T cell, male adult (30 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years_/cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years_/cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years_/cd8_positive_alpha_beta_memory_t_cell_male_adult_30_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta memory T cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd8_positive_alpha_beta_memory_t_cell/cd8_positive_alpha_beta_memory_t_cell__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd8_positive_alpha_beta_memory_t_cell/cd8_positive_alpha_beta_memory_t_cell__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd8_positive_alpha_beta_memory_t_cell/cd8_positive_alpha_beta_memory_t_cell__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, male adult (21 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_t_cell_male_adult_21_years_/cd4_positive_alpha_beta_t_cell_male_adult_21_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_t_cell_male_adult_21_years_/cd4_positive_alpha_beta_t_cell_male_adult_21_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, male adult (20 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_t_cell_male_adult_20_years_/cd4_positive_alpha_beta_t_cell_male_adult_20_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_t_cell_male_adult_20_years_/cd4_positive_alpha_beta_t_cell_male_adult_20_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_t_cell_male_adult_20_years_/cd4_positive_alpha_beta_t_cell_male_adult_20_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta memory T cell, male adult (43 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years_/cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years_/cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years_/cd4_positive_alpha_beta_memory_t_cell_male_adult_43_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta memory T cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_memory_t_cell/cd4_positive_alpha_beta_memory_t_cell__dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_memory_t_cell/cd4_positive_alpha_beta_memory_t_cell__h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd4_positive_alpha_beta_memory_t_cell/cd4_positive_alpha_beta_memory_t_cell__h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "CD14-positive monocyte, male adult (30 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd14_positive_monocyte_male_adult_30_years_/cd14_positive_monocyte_male_adult_30_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd14_positive_monocyte_male_adult_30_years_/cd14_positive_monocyte_male_adult_30_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/cd14_positive_monocyte_male_adult_30_years_/cd14_positive_monocyte_male_adult_30_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "B cell, male adult (37 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/b_cell_male_adult_37_years_/b_cell_male_adult_37_years___h3k27ac.bigWig",
        },
        {
          name: "h3k4me3",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/b_cell_male_adult_37_years_/b_cell_male_adult_37_years___h3k4me3.bigWig",
        },
      ],
    },
    {
      name: "B cell, female adult (27 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
          bigwig:
            "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/blood/b_cell_female_adult_27_years_/b_cell_female_adult_27_years___dnase.bigWig",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated T-cell, female adult (21 years) treated with 50 U/mL Interleukin-2 for 72 hours, anti-CD3 and anti-CD28 coated beads for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated naive CD4-positive, alpha-beta T cell, male adult (43 years) treated with anti-CD3 and anti-CD28 coated beads for 36 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (35 years) treated with 10 ng/mL Interleukin-2 for 14 days, anti-CD3 and anti-CD28 coated beads for 24 hours, anti-CD3 and anti-CD28 coated beads for 14 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta memory T cell, male adult (43 years) treated with anti-CD3 and anti-CD28 coated beads for 36 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "IgD-negative memory B cell, with multiple sclerosis",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta memory T cell, with multiple sclerosis",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "CD4-positive, CD25-positive, alpha-beta regulatory T cell, with multiple sclerosis",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "CD14-positive monocyte, with multiple sclerosis",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "T-helper 2 cell, male adult (35 years) treated with 5 \u03bcg/mL Interferon-gamma antibody for 36 hours, 100 ng/mL Interleukin-4 for 36 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
        },
      ],
    },
    {
      name: "T-helper 1 cell, male adult (35 years) treated with 1 \u03bcg/mL Interleukin-4 antibody for 36 hours, 30 ng/mL Interleukin-12 subunit alpha for 36 hours, 30 ng/mL Interleukin-12 subunit beta for 36 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "T-helper 17 cell, treated with phorbol 13-acetate 12-myristate, ionomycin",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "T-helper 17 cell, male adult (42 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "atac",
        },
      ],
    },
    {
      name: "T-cell, female adult (33 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "atac",
        },
      ],
    },
    {
      name: "stimulated activated naive CD8-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 50 U/mL Interleukin-2 for 24 hours, 100 ng/mL Interleukin-15 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "atac",
        },
      ],
    },
    {
      name: "activated naive CD8-positive, alpha-beta T cell, male adult (30 years) treated with anti-CD3 and anti-CD28 coated beads for 7 days, 10 ng/mL Interleukin-2 for 5 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "stimulated activated naive B cell, male adult (40 years) treated with 1 \u03bcg/mL anti-CD40 for 72 hours, 100 ng/mL Interleukin-4 for 72 hours, 10 \u03bcg/mL anti-IgM for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "stimulated activated naive B cell, female adult (39 years) treated with 1 \u03bcg/mL anti-CD40 for 72 hours, 100 ng/mL Interleukin-4 for 72 hours, 10 \u03bcg/mL anti-IgM for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "stimulated activated memory B cell, male adult (40 years) treated with 1 \u03bcg/mL anti-CD40 for 72 hours, 100 ng/mL Interleukin-4 for 72 hours, 10 \u03bcg/mL anti-IgM for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "stimulated activated effector memory CD8-positive, alpha-beta T cell, male adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 72 hours, 100 ng/mL Interleukin-12 subunit beta for 72 hours, 100 ng/mL Interleukin-12 subunit alpha for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "peripheral blood mononuclear cell, male adult (39 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "peripheral blood mononuclear cell, male adult (32 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "peripheral blood mononuclear cell, female adult (28 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "neutrophil",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "natural killer cell, male adult (47 years) treated with 100 ng/mL Interleukin-18 for 72 hours, 100 ng/mL Interleukin-12 subunit beta for 72 hours, 100 ng/mL Interleukin-12 subunit alpha for 72 hours, 100 ng/mL Interleukin-15 for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "natural killer cell, male adult (47 years) treated with 100 ng/mL Interleukin-12 subunit alpha for 72 hours, 100 ng/mL Interleukin-15 for 72 hours, 100 ng/mL Interleukin-12 subunit beta for 72 hours, 100 ng/mL Interleukin-18 for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "atac",
        },
      ],
    },
    {
      name: "natural killer cell, female adult (41 years) treated with 100 ng/mL Interleukin-18 for 72 hours, 100 ng/mL Interleukin-12 subunit beta for 72 hours, 100 ng/mL Interleukin-12 subunit alpha for 72 hours, 100 ng/mL Interleukin-15 for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, male adult (42 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, male adult (38 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "Loucy",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "Jurkat, Clone E6-1",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "IgD-negative memory B cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "GM20000",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "GM13977",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "GM13976",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "GM12875",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "GM10266",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "GM10248",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "effector memory CD4-positive, alpha-beta T cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "dendritic cell, male adult (51 years) treated with 40 ng/mL Interleukin-4 for 4 days, 50 ng/mL granulocyte-macrophage colony-stimulating factor for 4 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "CD4-positive, CD25-positive, alpha-beta regulatory T cell, male adult (42 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
        },
      ],
    },
    {
      name: "CD4-positive, CD25-positive, alpha-beta regulatory T cell, male adult (38 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "atac",
        },
        {
          name: "h3k27ac",
        },
      ],
    },
    {
      name: "CD4-positive, CD25-positive, alpha-beta regulatory T cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, treated with phorbol 13-acetate 12-myristate, ionomycin",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "CD14-positive monocyte, male adult (51 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "CD14-positive monocyte, male adult (37 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "CD14-positive monocyte, male adult (21 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
        },
      ],
    },
    {
      name: "CD14-positive monocyte",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "B cell, female adult (43 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated T-helper 17 cell, male adult (50 years) treated with 50 U/mL Interleukin-2 for 72 hours, anti-CD3 and anti-CD28 coated beads for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated T-cell, male adult (43 years) treated with 50 U/mL Interleukin-2 for 72 hours, anti-CD3 and anti-CD28 coated beads for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated T-cell, male adult (42 years) treated with 50 U/mL Interleukin-2 for 4 hours, anti-CD3 and anti-CD28 coated beads for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "atac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated T-cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 50 U/mL Interleukin-2 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated naive CD8-positive, alpha-beta T cell, male adult (30 years) treated with anti-CD3 and anti-CD28 coated beads for 36 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated naive CD4-positive, alpha-beta T cell, male adult (50 years) treated with 50 U/mL Interleukin-2 for 72 hours, anti-CD3 and anti-CD28 coated beads for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
        {
          name: "h3k27ac",
        },
      ],
    },
    {
      name: "activated naive CD8-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 50 U/mL Interleukin-2 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated naive CD8-positive, alpha-beta T cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated naive CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 50 U/mL Interleukin-2 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "T-helper 9 cell, female adult (25 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 2 cell, male adult (42 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 2 cell, male adult (38 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 2 cell, male adult (33 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 2 cell, male adult (30 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 2 cell, male adult (24 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 2 cell, female adult (26 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 2 cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 22 cell, female adult (25 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 1 cell, male adult (56 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 1 cell, male adult (42 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 1 cell, male adult (38 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 1 cell, male adult (33 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 1 cell, male adult (30 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 1 cell, male adult (24 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 1 cell, female adult (26 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 1 cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 1 cell, mixed sex",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 17 cell, male adult (48 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 17 cell, male adult (24 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 17 cell, male adult (30 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-helper 17 cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T follicular helper cell, female adult (25 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (55 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (49 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (48 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (47 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (40 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (39 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (36 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (34 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (33 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (30 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (28 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (26 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (25 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (24 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (21 years) treated with 7.5 \u03bcg/kg G-CSF for 4 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (21 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, male adult (19 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (53 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (43 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (40 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (35 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (32 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (31 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (28 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (25 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (24 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (23 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (22 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (19 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell, female adult (18 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "T-cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "suppressor macrophage, male adult (21 years) treated with lipopolysaccharide for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "suppressor macrophage, male adult (40 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "suppressor macrophage, male adult (21 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "suppressor macrophage, male adult (24 years) treated with lipopolysaccharide for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated naive B cell, female adult (39 years) treated with 10 \u03bcg/mL anti-IgM for 72 hours, 1 \u03bcg/mL anti-CD40 for 72 hours, 100 ng/mL Interleukin-4 for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated effector memory CD8-positive, alpha-beta T cell, male adult (36 years) treated with 100 ng/mL Interleukin-12 subunit alpha for 72 hours, anti-CD3 and anti-CD28 coated beads for 72 hours, 100 ng/mL Interleukin-12 subunit beta for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated effector memory CD8-positive, alpha-beta T cell, male adult (33 years) treated with 100 ng/mL Interleukin-12 subunit alpha for 72 hours, anti-CD3 and anti-CD28 coated beads for 72 hours, 100 ng/mL Interleukin-12 subunit beta for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-7 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-4 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-15 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-7 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-4 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-2 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-15 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-7 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-15 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-12 subunit alpha for 24 hours, 100 ng/mL Interleukin-12 subunit beta for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-7 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-4 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-2 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-15 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-12 subunit alpha for 1 hour, 100 ng/mL Interleukin-12 subunit beta for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-7 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-4 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-15 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-12 subunit alpha for 4 hours, 100 ng/mL Interleukin-12 subunit beta for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-7 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-4 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-2 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-15 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-4 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-7 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-4 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-2 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL TNF-alpha for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-4 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-12 subunit alpha for 4 hours, 100 ng/mL Interleukin-12 subunit beta for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL TNF-alpha for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-4 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-2 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-23 for 48 hours, 100 ng/mL Interleukin-1b for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-12 subunit alpha for 48 hours, 100 ng/mL Interleukin-12 subunit beta for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL TNF-alpha for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-4 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-2 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-23 for 24 hours, 100 ng/mL Interleukin-1b for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL TNF-alpha for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-23 for 1 hour, 100 ng/mL Interleukin-1b for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-15 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL TNF-alpha for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-4 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-2 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-23 for 4 hours, 100 ng/mL Interleukin-1b for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-12 subunit alpha for 4 hours, 100 ng/mL Interleukin-12 subunit beta for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL TNF-alpha for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-4 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-2 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-23 for 48 hours, 100 ng/mL Interleukin-1b for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-15 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-12 subunit alpha for 48 hours, 100 ng/mL Interleukin-12 subunit beta for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL TNF-alpha for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-4 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-2 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-23 for 24 hours, 100 ng/mL Interleukin-1b for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-15 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-12 subunit alpha for 24 hours, 100 ng/mL Interleukin-12 subunit beta for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL TNF-alpha for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-4 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-23 for 1 hour, 100 ng/mL Interleukin-1b for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-15 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-23 for 4 hours, 100 ng/mL Interleukin-1b for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 100 ng/mL Interleukin-12 subunit alpha for 4 hours, 100 ng/mL Interleukin-12 subunit beta for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL TNF-alpha for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-2 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-15 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 100 ng/mL Interleukin-12 subunit alpha for 48 hours, 100 ng/mL Interleukin-12 subunit beta for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-4 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-2 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 100 ng/mL Interleukin-23 for 24 hours, 100 ng/mL Interleukin-1b for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL TNF-alpha for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "stimulated activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 100 ng/mL Interleukin-4 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "RPMI8226",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "peripheral blood mononuclear cell, male adult (27 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "neutrophil, male",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "natural killer cell, male adult (21 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "natural killer cell, female adult (41 years) treated with 100 ng/mL Interleukin-12 subunit alpha for 72 hours, 100 ng/mL Interleukin-15 for 72 hours, 100 ng/mL Interleukin-12 subunit beta for 72 hours, 100 ng/mL Interleukin-18 for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "natural killer cell, female adult (34 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "NAMALWA, treated with Sendai virus for 2.0 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "NAMALWA",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "naive thymus-derived CD8-positive, alpha-beta T cell, male adult (56 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "naive thymus-derived CD8-positive, alpha-beta T cell, male adult (24 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, male adult (26 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, male adult (24 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, female adult (35 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, female adult (25 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "naive thymus-derived CD4-positive, alpha-beta T cell, mixed sex",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "mononuclear cell, male",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "memory B cell, female adult (39 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "KOPT-K1",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
      ],
    },
    {
      name: "K562, treated with 500.0 \u03bcM sodium butyrate for 72.0 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "K562, treated with 1.0 \u03bcM vorinostat for 72.0 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "K562, treated with 0.05 percent dimethyl sulfoxide for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "K562, G2 phase",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "K562, G1 phase",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "inflammatory macrophage, male adult (21 years) treated with lipopolysaccharide for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "inflammatory macrophage, male adult (40 years) treated with lipopolysaccharide for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "inflammatory macrophage, male adult (40 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "hematopoietic multipotent progenitor cell (in vitro differentiated cells)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "GM19240",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "GM19239",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "GM19238",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "GM12892",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "GM12891",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "GM12874",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "GM12873",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "GM12872",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "GM12801",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "GM08714",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "effector memory CD4-positive, alpha-beta T cell, male adult (56 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "effector memory CD4-positive, alpha-beta T cell, male adult (24 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "effector memory CD4-positive, alpha-beta T cell, female adult (25 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "effector CD4-positive, alpha-beta T cell, male adult (56 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "effector CD4-positive, alpha-beta T cell, female adult (25 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CMK",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "central memory CD8-positive, alpha-beta T cell, male adult (33 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "central memory CD4-positive, alpha-beta T cell, male adult (42 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "central memory CD4-positive, alpha-beta T cell, male adult (38 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta T cell, male adult (42 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta T cell, male adult (38 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta T cell, male adult (37 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta T cell, male adult (28 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta T cell, male adult (21 years) treated with 7.5 \u03bcg/kg G-CSF for 4 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta T cell, female adult (34 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta T cell, female adult (33 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta T cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
      ],
    },
    {
      name: "CD8-positive, alpha-beta memory T cell, male adult (24 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, CD25-positive, alpha-beta regulatory T cell, male adult (56 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, CD25-positive, alpha-beta regulatory T cell, male adult (28 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, CD25-positive, alpha-beta regulatory T cell, male adult (24 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, CD25-positive, alpha-beta regulatory T cell, female adult (21 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, male adult (42 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, male adult (38 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, male adult (37 years) treated with 7.5 \u03bcg/kg G-CSF for 4 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, male adult (37 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, male adult (21 years) treated with 7.5 \u03bcg/kg G-CSF for 4 days",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (39 years) treated with Interleukin-4 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (39 years) treated with Interleukin-21 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (39 years) treated with Interleukin-17A for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (39 years) treated with Interleukin-15 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (39 years) treated with Interleukin-12 subunit beta for 1 hour, Interleukin-12 subunit alpha for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (39 years) treated with Interleukin-10 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (39 years) treated with 100 ng/mL Interleukin-2 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (39 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (37 years) treated with 100 ng/mL Interleukin-6 for 8 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (37 years) treated with Interleukin-6 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (37 years) treated with Interleukin-17A for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (37 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (33 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (26 years) treated with Interleukin-15 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (26 years) treated with Interferon gamma for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (26 years) treated with Interleukin-4 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (39 years) treated with Interleukin-1 beta for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell, female adult (26 years) treated with Interferon alpha-2 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD4-positive, alpha-beta T cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
      ],
    },
    {
      name: "CD1c-positive myeloid dendritic cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD14-positive monocyte, male adult (40 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "CD14-positive monocyte, female adult (34 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "B cell, male adult (21 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "B cell, female adult (34 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "B cell, female adult (43 years) female adult (27 years)",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "ctcf",
        },
      ],
    },
    {
      name: "B cell",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k4me3",
        },
      ],
    },
    {
      name: "activated T-helper 9 cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 16 hours, 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-helper 1 cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 16 hours, 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-helper 1 cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 16 hours, 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-helper 1 cell, female adult (33 years) treated with 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 50 U/mL Interleukin-2 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 50 U/mL Interleukin-2 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 50 U/mL Interleukin-2 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 50 U/mL Interleukin-2 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated T-cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 50 U/mL Interleukin-2 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, CD25-positive, alpha-beta regulatory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 16 hours, 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, CD25-positive, alpha-beta regulatory T cell, female adult (21 years) treated with 50 U/mL Interleukin-2 for 72 hours, anti-CD3 and anti-CD28 coated beads for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated naive CD4-positive, alpha-beta T cell, male adult (48 years) treated with 50 U/mL Interleukin-2 for 72 hours, anti-CD3 and anti-CD28 coated beads for 72 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
      ],
    },
    {
      name: "activated naive CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 50 U/mL Interleukin-2 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "h3k27ac",
        },
      ],
    },
    {
      name: "activated gamma-delta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 16 hours, 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated gamma-delta T cell, female adult (33 years) treated with 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated effector memory CD4-positive, alpha-beta T cell, male adult (42 years) treated with 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated effector memory CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 16 hours, 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated effector memory CD4-positive, alpha-beta T cell, male adult (38 years) treated with 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated naive CD8-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 16 hours, 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 50 U/mL Interleukin-2 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 50 U/mL Interleukin-2 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 50 U/mL Interleukin-2 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 50 U/mL Interleukin-2 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD8-positive, alpha-beta memory T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 50 U/mL Interleukin-2 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated naive CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 16 hours, 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated naive CD4-positive, alpha-beta T cell, male adult (42 years) treated with 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated naive CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 16 hours, 50 U/mL Interleukin-2 for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours, 50 U/mL Interleukin-2 for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours, 50 U/mL Interleukin-2 for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 50 U/mL Interleukin-2 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (42 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour, 50 U/mL Interleukin-2 for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 48 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 24 hours, 50 U/mL Interleukin-2 for 24 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, male adult (38 years) treated with anti-CD3 and anti-CD28 coated beads for 1 hour",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, female adult (37 years) treated with 100 ng/mL Interleukin-6 for 8 hours, 50 U/mL Interleukin-2 for 16 hours, anti-CD3 and anti-CD28 coated beads for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, female adult (37 years) treated with 100 ng/mL Interleukin-4 for 8 hours, 50 U/mL Interleukin-2 for 16 hours, anti-CD3 and anti-CD28 coated beads for 16 hours",
      assays: [
        {
          name: "ccres",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, female adult (37 years) treated with 100 ng/mL Interleukin-10 for 8 hours, 50 U/mL Interleukin-2 for 16 hours, anti-CD3 and anti-CD28 coated beads for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, female adult (37 years) treated with 50 U/mL Interleukin-2 for 16 hours, anti-CD3 and anti-CD28 coated beads for 16 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
    {
      name: "activated CD4-positive, alpha-beta T cell, female adult (33 years) treated with anti-CD3 and anti-CD28 coated beads for 4 hours",
      assays: [
        {
          name: "ccres",
        },
        {
          name: "dnase",
        },
      ],
    },
  ],
};

export function getTissueOptions() {
  return Object.keys(TissueConfig);
}

export function getSubtissueOptions(tissue: string) {
  return TissueConfig[tissue] || [];
}

export function getSubtissueByName(tissue: string, subtissueName: string) {
  const subtissues = TissueConfig[tissue] || [];
  return subtissues.find((s) => s.name === subtissueName);
}

export function getAssayInfo(
  tissue: string,
  subtissueName: string,
  assayName: string,
) {
  const subtissue = getSubtissueByName(tissue, subtissueName);
  return subtissue?.assays.find((a) => a.name === assayName);
}
