// src/features/genome-browser/tracks/static/cadd.ts
// CADD 1.7 deleteriousness scores, split by alternate-allele identity.
// Each track is a vector tileset hosted on the Genohub HiGlass server.

import { Calculator } from "lucide-react";
import type { GoslingTrackSpec, StaticTrack } from "../../types/tracks";
import { LINKING_ID } from "../constants";

const CADD_BASE = "https://higlass.genohub.org/api/v1/tileset_info/?d=cadd";

function caddSpec(allele: "a" | "c" | "g" | "t"): GoslingTrackSpec {
  return {
    alignment: "overlay",
    title: `CADD 1.7 (Mutation ${allele.toUpperCase()})`,
    data: {
      url: `${CADD_BASE}-${allele}-hg38`,
      type: "vector",
      binSize: 4,
    },
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
          {
            field: "value",
            type: "quantitative",
            alt: `CADD 1.7 (Mutation ${allele.toUpperCase()})`,
          },
        ],
      },
    ],
    width: 800,
    height: 60,
  };
}

const ALLELES = ["a", "c", "g", "t"] as const;

export const caddTracks: StaticTrack[] = ALLELES.map((allele) => ({
  kind: "static",
  id: `cadd-${allele}`,
  name: `CADD 1.7 (Mutation ${allele.toUpperCase()})`,
  description: `Combined Annotation Dependent Depletion scores for ${allele.toUpperCase()}>X mutations.`,
  category: "integrative",
  defaultHeight: 60,
  icon: Calculator,
  curated: false,
  specs: [caddSpec(allele)],
}));
