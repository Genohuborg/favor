/**
 * Object-store base URLs.
 *
 * The bigWig tracks were addressed by a hardcoded NERC MinIO hostname
 * (`minio-s3-favor-4ee4be.apps.shift.nerc.mghpcc.org`) in 679 places — 674 of
 * them in the cCRE tissue config. NERC terminates 2026-09-15, which would have
 * taken every genome-browser track with it.
 *
 * The bucket moved to Jetstream2 as part of the object-tier migration: same
 * bucket name, same keys, 15,746 objects verified by count and bytes. So this
 * is a host change, not a path change — the FAVOR-viz keys are byte-identical
 * on both sides.
 *
 * Overridable by env so a redeploy can repoint without a code change, which is
 * what the old arrangement made impossible.
 */
export const S3_BASE =
  process.env.NEXT_PUBLIC_S3_BASE_URL ?? "https://hcloud.genohub.org/favor-hg38";

/** bigWig / bigBed visualisation tracks. */
export const FAVOR_VIZ = `${S3_BASE}/FAVOR-viz`;
