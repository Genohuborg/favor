import { Track } from "@/components/gosling";

const CTCFURL =
  "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/CTCF_All_ENCODE_MAR20_2024_merged.bw";

export const ctcfTrack: Track = {
  alignment: "overlay",
  title: "Aggregated CTCF ChIP-seq signal, all biosamples",
  data: {
    url: CTCFURL,
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
      color: { value: "#ADD8E6" },
      stroke: { value: "#ADD8E6" },
      strokeWidth: { value: 0.8 },
      opacity: { value: 0.7 },
      tooltip: [
        { field: "value", type: "quantitative", alt: "CTCF ChIP-seq signal" },
      ],
    },
  ],
  width: 800,
  height: 100,
};
