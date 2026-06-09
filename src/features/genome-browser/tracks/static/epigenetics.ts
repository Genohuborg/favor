// src/features/genome-browser/tracks/static/epigenetics.ts
// Aggregated ENCODE epigenetics signals (all biosamples merged) plus
// the gnomAD non-coding constraint (Gnocchi) score.

import { Activity } from "lucide-react";
import type { GoslingTrackSpec, StaticTrack } from "../../types/tracks";
import { LINKING_ID } from "../constants";

const FAVOR_VIZ =
  "https://minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org/favor-hg38/FAVOR-viz";

function bigwigBarSpec(opts: {
  url: string;
  title: string;
  color: string;
  tooltipLabel: string;
  height?: number;
}): GoslingTrackSpec {
  return {
    alignment: "overlay",
    title: opts.title,
    data: {
      url: opts.url,
      type: "bigwig",
      column: "position",
      value: "value",
      aggregation: "sum",
      binSize: 1,
    },
    tracks: [
      {
        mark: "bar",
        x: { field: "start", type: "genomic", linkingId: LINKING_ID },
        xe: { field: "end", type: "genomic" },
        y: { field: "value", type: "quantitative", axis: "right" },
        color: { value: opts.color },
        stroke: { value: opts.color },
        strokeWidth: { value: 0.8 },
        opacity: { value: 0.7 },
        tooltip: [
          { field: "value", type: "quantitative", alt: opts.tooltipLabel },
        ],
      },
    ],
    width: 800,
    height: opts.height ?? 100,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GNOCCHI — vector tileset, not bigwig
// ─────────────────────────────────────────────────────────────────────────────

const gnocchiSpec: GoslingTrackSpec = {
  alignment: "overlay",
  title: "Gnocchi: gnomAD non-coding constraint of haploinsufficient variation",
  data: {
    url: "https://higlass.genohub.org/api/v1/tileset_info/?d=genocchi-hg38",
    type: "vector",
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
        { field: "value", type: "quantitative", alt: "Gnocchi Score" },
      ],
    },
  ],
  width: 800,
  height: 60,
};

export const gnocchiTrack: StaticTrack = {
  kind: "static",
  id: "gnocchi",
  name: "Gnocchi",
  description:
    "gnomAD non-coding constraint score for haploinsufficient variation.",
  category: "epigenetics",
  defaultHeight: 60,
  icon: Activity,
  curated: false,
  specs: [gnocchiSpec],
};

// ─────────────────────────────────────────────────────────────────────────────
// AGGREGATED ENCODE SIGNAL TRACKS
// ─────────────────────────────────────────────────────────────────────────────

export const h3k4me3Track: StaticTrack = {
  kind: "static",
  id: "h3k4me3",
  name: "H3K4me3 (Active Promoters)",
  description:
    "Aggregated H3K4me3 ChIP-seq signal across all ENCODE biosamples.",
  category: "epigenetics",
  defaultHeight: 100,
  icon: Activity,
  curated: false,
  specs: [
    bigwigBarSpec({
      url: `${FAVOR_VIZ}/H3K4me3_All_ENCODE_MAR20_2024_merged.bw`,
      title: "Aggregated H3K4me3 ChIP-seq signal, all biosamples",
      color: "red",
      tooltipLabel: "H3K4me3 signal",
    }),
  ],
};

export const h3k27acTrack: StaticTrack = {
  kind: "static",
  id: "h3k27ac",
  name: "H3K27ac (Enhancer Activity)",
  description:
    "Aggregated H3K27ac ChIP-seq signal across all ENCODE biosamples.",
  category: "epigenetics",
  defaultHeight: 100,
  icon: Activity,
  curated: false,
  specs: [
    bigwigBarSpec({
      url: `${FAVOR_VIZ}/H3K27ac_All_ENCODE_MAR20_2024_merged.bw`,
      title: "Aggregated H3K27ac ChIP-seq signal, all biosamples",
      color: "#ca8a04",
      tooltipLabel: "H3K27ac signal",
    }),
  ],
};

export const atacTrack: StaticTrack = {
  kind: "static",
  id: "atac",
  name: "ATAC-seq (Chromatin Accessibility)",
  description: "Aggregated ATAC-seq signal across all ENCODE biosamples.",
  category: "epigenetics",
  defaultHeight: 100,
  icon: Activity,
  curated: false,
  specs: [
    bigwigBarSpec({
      url: `${FAVOR_VIZ}/ATAC_All_ENCODE_MAR20_2024_merged.bw`,
      title: "Aggregated ATAC-seq signal, all biosamples",
      color: "#2563eb",
      tooltipLabel: "ATAC-seq signal",
    }),
  ],
};

export const dnaseTrack: StaticTrack = {
  kind: "static",
  id: "dnase",
  name: "DNase-seq (Chromatin Accessibility)",
  description:
    "Aggregated DNase hypersensitivity signal across all ENCODE biosamples.",
  category: "epigenetics",
  defaultHeight: 100,
  icon: Activity,
  curated: false,
  specs: [
    bigwigBarSpec({
      url: `${FAVOR_VIZ}/DNAse_All_ENCODE_MAR20_2024_merged.bw`,
      title: "Aggregated DNase signal, all biosamples",
      color: "#0891b2",
      tooltipLabel: "DNase signal",
    }),
  ],
};

export const ctcfTrack: StaticTrack = {
  kind: "static",
  id: "ctcf",
  name: "CTCF Binding",
  description: "Aggregated CTCF ChIP-seq signal across all ENCODE biosamples.",
  category: "epigenetics",
  defaultHeight: 100,
  icon: Activity,
  curated: false,
  specs: [
    bigwigBarSpec({
      url: `${FAVOR_VIZ}/CTCF_All_ENCODE_MAR20_2024_merged.bw`,
      title: "Aggregated CTCF ChIP-seq signal, all biosamples",
      color: "#dc2626",
      tooltipLabel: "CTCF ChIP-seq signal",
    }),
  ],
};

export const epigeneticsTracks: StaticTrack[] = [
  gnocchiTrack,
  h3k4me3Track,
  h3k27acTrack,
  atacTrack,
  dnaseTrack,
  ctcfTrack,
];
