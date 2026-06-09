// src/features/genome-browser/tracks/static/recombination.ts
// Recombination rate tracks: 1000 Genomes average, population average,
// and sex-specific maternal / paternal rates.

import { Waves } from "lucide-react";
import type { GoslingTrackSpec, StaticTrack } from "../../types/tracks";
import { LINKING_ID } from "../constants";

const HIGLASS = "https://higlass.genohub.org/api/v1/tileset_info/?d=";

function recombSpec(opts: { url: string; title: string }): GoslingTrackSpec {
  return {
    alignment: "overlay",
    title: opts.title,
    data: { url: opts.url, type: "vector" },
    tracks: [
      {
        mark: "bar",
        x: { field: "start", type: "genomic", linkingId: LINKING_ID },
        xe: { field: "end", type: "genomic" },
        y: { field: "value", type: "quantitative" },
        color: { value: "blue" },
        stroke: { value: "blue" },
        strokeWidth: { value: 0.8 },
        opacity: { value: 0.7 },
        tooltip: [
          { field: "start", type: "genomic", alt: "Start Position" },
          { field: "end", type: "genomic", alt: "End Position" },
          { field: "value", type: "quantitative", alt: "Recombination Rate" },
        ],
      },
    ],
    width: 800,
    height: 70,
  };
}

export const recomb1000gAvgTrack: StaticTrack = {
  kind: "static",
  id: "recomb-1000g-avg",
  name: "Recombination Rate (1000G) Avg",
  description: "Average recombination rate from the 1000 Genomes Project.",
  category: "nucleotide-diversity",
  defaultHeight: 70,
  icon: Waves,
  curated: false,
  specs: [
    recombSpec({
      url: `${HIGLASS}recomb-1000g-avg-hg38`,
      title: "Recombination Rate (1000 Genomes Project) Avg",
    }),
  ],
};

export const recombAvgTrack: StaticTrack = {
  kind: "static",
  id: "recomb-avg",
  name: "Recombination Rate Avg",
  description: "Population-averaged recombination rate.",
  category: "nucleotide-diversity",
  defaultHeight: 70,
  icon: Waves,
  curated: false,
  specs: [
    recombSpec({
      url: `${HIGLASS}recomb-avg-hg38`,
      title: "Recombination Rate Avg",
    }),
  ],
};

export const recombMaternalTrack: StaticTrack = {
  kind: "static",
  id: "recomb-maternal",
  name: "Recombination Rate Maternal",
  description: "Sex-specific recombination rate from female meioses.",
  category: "nucleotide-diversity",
  defaultHeight: 70,
  icon: Waves,
  curated: false,
  specs: [
    recombSpec({
      url: `${HIGLASS}recomb-mat-hg38`,
      title: "Recombination Rate Maternal",
    }),
  ],
};

export const recombPaternalTrack: StaticTrack = {
  kind: "static",
  id: "recomb-paternal",
  name: "Recombination Rate Paternal",
  description: "Sex-specific recombination rate from male meioses.",
  category: "nucleotide-diversity",
  defaultHeight: 70,
  icon: Waves,
  curated: false,
  specs: [
    recombSpec({
      url: `${HIGLASS}recomb-pat-hg38`,
      title: "Recombination Rate Paternal",
    }),
  ],
};

export const recombinationTracks: StaticTrack[] = [
  recomb1000gAvgTrack,
  recombAvgTrack,
  recombMaternalTrack,
  recombPaternalTrack,
];
