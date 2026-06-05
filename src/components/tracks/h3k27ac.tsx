import { Track } from "@/components/gosling";

const h3k27acURL =
  "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz/H3K27ac_All_ENCODE_MAR20_2024_merged.bw";

export const h3k27acTrack: Track = {
  alignment: "overlay",
  title: "Aggregated H3K27ac ChIP-seq signal, all biosamples",
  data: {
    url: h3k27acURL,
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
      color: { value: "yellow" },
      stroke: { value: "yellow" },
      strokeWidth: { value: 0.8 },
      opacity: { value: 0.7 },
      tooltip: [
        { field: "value", type: "quantitative", alt: "H3K27ac signal" },
      ],
    },
  ],
  width: 800,
  height: 100,
};
