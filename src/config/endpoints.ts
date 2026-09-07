/**
 * Backend endpoints, in one place.
 *
 * Migrated off NERC 2026-08-30. These used to be hard-coded to
 * `minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org` — 675 literal copies of it
 * across the genome-browser config — which disappears when the NERC project
 * terminates on **2026-09-15**. The failure mode mattered: every genome-browser
 * signal track would have gone blank while the rest of the app looked perfectly
 * healthy, because nothing outside these files touches object storage.
 *
 * Now env-overridable, so the next move is a Vercel environment change rather
 * than a code edit. Defaults are the Jetstream2 deployment and need no
 * configuration.
 *
 *   NEXT_PUBLIC_S3_BASE_URL   MinIO/S3 public endpoint, bucket included
 *   NEXT_PUBLIC_HIGLASS_URL   HiGlass server, up to and including /api/v1
 *
 * The API base lives in `./api` (NEXT_PUBLIC_API_URL) and already points at
 * Jetstream2.
 */

/** MinIO/S3 public endpoint including the bucket. Serves the FAVOR-viz bigWigs. */
export const S3_BASE =
  process.env.NEXT_PUBLIC_S3_BASE_URL ??
  "https://hcloud.genohub.org/favor-hg38";

/** Signal-track prefix: `${S3_BASE}/FAVOR-viz`. */
export const FAVOR_VIZ = `${S3_BASE}/FAVOR-viz`;

/**
 * HiGlass tileset server, up to and including `/api/v1`.
 *
 * This hostname did NOT change in the NERC migration — `higlass.genohub.org`
 * now resolves to Jetstream2, serving the same tilesets (ccre-updated-hg38,
 * jarvis-hg38, dbnsfp-gerpn/gerpr-hg38, genocchi-hg38, mappability-*). It is
 * centralised here anyway so the next move needs no code edit.
 *
 * Do NOT "helpfully" switch this to higlass-favor.genohub.org. That is a
 * different server holding a different, much smaller tileset set, and the
 * tilesets this app asks for are not on it — tracks would render empty while
 * every other track kept working. (The mirror-image mistake bit lipidkp once,
 * in the opposite direction.)
 */
export const HIGLASS_BASE =
  process.env.NEXT_PUBLIC_HIGLASS_URL ?? "https://higlass.genohub.org/api/v1";

/** `tileset_info` query prefix — append a tileset uid. */
export const HIGLASS_TILESET_INFO = `${HIGLASS_BASE}/tileset_info/?d=`;
