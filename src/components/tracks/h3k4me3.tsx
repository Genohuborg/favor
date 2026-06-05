import type { Track } from "@/components/gosling";

const H3k4me3URL =
  "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/H3K4me3_All_ENCODE_MAR20_2024_merged.bw";

export const h3k4me3Track: Track = {
  alignment: "overlay",
  title: "Aggregated H3K4me3 ChIP-seq signal, all biosamples",
  data: {
    url: H3k4me3URL,
    type: "bigwig",
    column: "position",
    value: "value",
    aggregation: "sum",
    binSize: 1,
  },
  tracks: [
    {
      mark: "bar",
      x: { field: "start", type: "genomic", linkingId: "link1" },
      y: { field: "value", type: "quantitative", axis: "right" },
      color: { value: "red" },
      stroke: { value: "red" },
      strokeWidth: { value: 0.8 },
      opacity: { value: 0.7 },
      tooltip: [
        { field: "value", type: "quantitative", alt: "H3K4me3 signal" },
      ],
    },
  ],
  width: 800,
  height: 100,
};
