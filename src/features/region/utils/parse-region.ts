/**
 * Region coordinate parser.
 *
 * Accepts formats like:
 *   1-10001-20002
 *   chr1-10001-20002
 *   chr1:10001-20002
 *   chrX:100000-200000
 *
 * Returns null if input does not match a valid genomic region.
 */

const VALID_CHROMOSOMES = new Set([
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "X",
  "Y",
  "MT",
]);

const MAX_POSITION = 300_000_000;

export interface ParsedRegion {
  chromosome: string;
  start: number;
  end: number;
  /** Normalized form: chr-start-end (e.g. "1-10001-20002") */
  loc: string;
}

function normalizeChromosome(chr: string): string | null {
  const cleaned = chr.toUpperCase().replace(/^CHR/, "");
  return VALID_CHROMOSOMES.has(cleaned) ? cleaned : null;
}

/**
 * Parse a region string into structured coordinates.
 * Returns null if invalid.
 */
export function parseRegion(query: string): ParsedRegion | null {
  const trimmed = query.trim();

  // Split by common separators: - : _
  // Also handle mixed separators like chr1:10001-20002
  const parts = trimmed.split(/[-:_]/);

  if (parts.length !== 3) return null;

  const [chrRaw, startRaw, endRaw] = parts;

  const chromosome = normalizeChromosome(chrRaw);
  if (!chromosome) return null;

  const start = parseInt(startRaw, 10);
  const end = parseInt(endRaw, 10);

  if (!Number.isInteger(start) || !Number.isInteger(end)) return null;
  if (start < 1 || end < 1) return null;
  if (start > end) return null;
  if (end > MAX_POSITION) return null;

  return {
    chromosome,
    start,
    end,
    loc: `${chromosome}-${start}-${end}`,
  };
}

/**
 * Check if a string looks like a genomic region (partial or complete).
 * Used to differentiate from partial VCF input.
 */
export function looksLikeRegion(query: string): boolean {
  const parts = query.trim().split(/[-:_]/);
  if (parts.length !== 3) return false;

  const chr = parts[0].toUpperCase().replace(/^CHR/, "");
  if (!VALID_CHROMOSOMES.has(chr)) return false;

  // Both remaining parts must be numeric (distinguishes from VCF where 3rd part is an allele)
  return /^\d+$/.test(parts[1]) && /^\d+$/.test(parts[2]);
}

/**
 * Format a region size in human-readable form.
 */
export function formatRegionSize(start: number, end: number): string {
  if (start === end) return "1 bp";
  const size = end - start;
  if (size >= 1_000_000) return `${(size / 1_000_000).toFixed(1)} Mb`;
  if (size >= 1_000) return `${(size / 1_000).toFixed(1)} kb`;
  return `${size} bp`;
}
