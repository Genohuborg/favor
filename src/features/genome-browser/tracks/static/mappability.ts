// src/features/genome-browser/tracks/static/mappability.ts
// Sequence mappability tracks at four k-mer sizes (24/36/50/100), each
// computed by both Bismap and Umap. Total: 8 tracks.

import { Map as MapIcon } from "lucide-react";
import type { GoslingTrackSpec, StaticTrack } from "../../types/tracks";
import { LINKING_ID } from "../constants";

const KMERS = [24, 36, 50, 100] as const;
const ALGOS = ["bismap", "umap"] as const;

type Kmer = (typeof KMERS)[number];
type Algo = (typeof ALGOS)[number];

const ALGO_COLOR: Record<Algo, string> = {
  bismap: "red",
  umap: "blue",
};

const ALGO_LABEL: Record<Algo, string> = {
  bismap: "Bismap",
  umap: "Umap",
};

function mappabilitySpec(k: Kmer, algo: Algo): GoslingTrackSpec {
  return {
    alignment: "overlay",
    title: `Mappability (k${k} ${ALGO_LABEL[algo]})`,
    data: {
      url: `https://higlass.genohub.org/api/v1/tileset_info/?d=mappability-k${k}-${algo}-hg38`,
      type: "vector",
      binSize: 4,
    },
    tracks: [
      {
        mark: "bar",
        x: { field: "start", type: "genomic", linkingId: LINKING_ID },
        xe: { field: "end", type: "genomic" },
        y: { field: "value", type: "quantitative" },
        color: { value: ALGO_COLOR[algo] },
        stroke: { value: ALGO_COLOR[algo] },
        strokeWidth: { value: 0.8 },
        opacity: { value: 0.7 },
        tooltip: [
          { field: "value", type: "quantitative", alt: "Mappability Score" },
        ],
      },
    ],
    width: 900,
    height: 60,
  };
}

export const mappabilityTracks: StaticTrack[] = KMERS.flatMap((k) =>
  ALGOS.map<StaticTrack>((algo) => ({
    kind: "static",
    id: `mappability-k${k}-${algo}`,
    name: `Mappability (k${k}) ${ALGO_LABEL[algo]}`,
    description: `${ALGO_LABEL[algo]} mappability score using ${k}-mer alignment.`,
    category: "mappability",
    defaultHeight: 60,
    icon: MapIcon,
    curated: false,
    specs: [mappabilitySpec(k, algo)],
  })),
);
