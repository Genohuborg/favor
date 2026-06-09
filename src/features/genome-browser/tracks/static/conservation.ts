// src/features/genome-browser/tracks/static/conservation.ts
// Evolutionary conservation tracks (dbNSFP GerpN and GerpR), each backed
// by a vector tileset on the Genohub HiGlass server.

import { History } from "lucide-react";
import type { GoslingTrackSpec, StaticTrack } from "../../types/tracks";
import { LINKING_ID } from "../constants";

const GERPN_URL =
  "https://higlass.genohub.org/api/v1/tileset_info/?d=dbnsfp-gerpn-hg38";
const GERPR_URL =
  "https://higlass.genohub.org/api/v1/tileset_info/?d=dbnsfp-gerpr-hg38";

function vectorBarSpec(opts: {
  url: string;
  title: string;
  binSize?: number;
  tooltipLabel: string;
}): GoslingTrackSpec {
  return {
    alignment: "overlay",
    title: opts.title,
    data: {
      url: opts.url,
      type: "vector",
      ...(opts.binSize ? { binSize: opts.binSize } : {}),
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
          { field: "value", type: "quantitative", alt: opts.tooltipLabel },
        ],
      },
    ],
    width: 800,
    height: 60,
  };
}

export const gerpNTrack: StaticTrack = {
  kind: "static",
  id: "gerpn",
  name: "GerpN",
  description: "GERP++ neutral evolution scores from dbNSFP.",
  category: "conservation",
  defaultHeight: 60,
  icon: History,
  curated: false,
  specs: [
    vectorBarSpec({
      url: GERPN_URL,
      title: "GerpN",
      tooltipLabel: "dbNSFP GerpN",
    }),
  ],
};

export const gerpRTrack: StaticTrack = {
  kind: "static",
  id: "gerpr",
  name: "GerpR",
  description: "GERP++ rejected substitution scores from dbNSFP.",
  category: "conservation",
  defaultHeight: 60,
  icon: History,
  curated: false,
  specs: [
    vectorBarSpec({
      url: GERPR_URL,
      title: "GerpR",
      binSize: 4,
      tooltipLabel: "dbNSFP GerpR",
    }),
  ],
};

export const conservationTracks: StaticTrack[] = [gerpNTrack, gerpRTrack];
