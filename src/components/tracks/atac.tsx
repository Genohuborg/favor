import { Track } from "@/components/gosling";

const ATACURL =
  "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/ATAC_All_ENCODE_MAR20_2024_merged.bw";

export const atacTrack: Track = {
  alignment: "overlay",
  title: "Aggregated ATAC-seq signal, all biosamples",
  data: {
    url: ATACURL,
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
      xe: { field: "end", type: "genomic" },
      y: {
        field: "value",
        type: "quantitative",
        axis: "right",
      },
      color: { value: "blue" },
      stroke: { value: "blue" },
      strokeWidth: { value: 0.8 },
      opacity: { value: 0.7 },
      tooltip: [
        { field: "value", type: "quantitative", alt: "ATAC-seq signal" },
      ],
    },
  ],
  width: 800,
  height: 100,
};
