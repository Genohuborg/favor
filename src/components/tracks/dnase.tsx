import { FAVOR_VIZ } from "@/lib/config/object-store";
import { Track } from "@/components/gosling";

const DnaseURL =
  `${FAVOR_VIZ}/DNAse_All_ENCODE_MAR20_2024_merged.bw`;

export const dnaseTrack: Track = {
  alignment: "overlay",
  title: "Aggregated DNase signal, all biosamples",
  data: {
    url: DnaseURL,
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
      color: { value: "#00FFFF" },
      stroke: { value: "#00FFFF" },
      strokeWidth: { value: 0.8 },
      opacity: { value: 0.7 },
      tooltip: [{ field: "value", type: "quantitative", alt: "DNase signal" }],
    },
  ],
  width: 800,
  height: 100,
};
