// src/features/genome-browser/tracks/static/other.ts
// Miscellaneous integrative scores that don't belong to a larger family.

import { Brain } from "lucide-react";
import type { GoslingTrackSpec, StaticTrack } from "../../types/tracks";
import { LINKING_ID } from "../constants";

const jarvisSpec: GoslingTrackSpec = {
  alignment: "overlay",
  title: "JARVIS: non-coding disease relevance",
  data: {
    url: "https://higlass.genohub.org/api/v1/tileset_info/?d=jarvis-hg38",
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
        { field: "value", type: "quantitative", alt: "JARVIS" },
      ],
    },
  ],
  width: 800,
  height: 60,
};

export const jarvisTrack: StaticTrack = {
  kind: "static",
  id: "jarvis",
  name: "JARVIS",
  description:
    "JARVIS score for prioritizing non-coding regions by disease relevance.",
  category: "other",
  defaultHeight: 60,
  icon: Brain,
  curated: false,
  specs: [jarvisSpec],
};

export const otherTracks: StaticTrack[] = [jarvisTrack];
