export const siteConfig = {
  name: "FAVOR",
  description: "Functional Annotation of Variants Online Resource",
  links: {
    // The hosting platform's public status page. Replaced nercStatus 2026-09-07
    // when NERC was decommissioned; the feed is consumed server-side in
    // features/platform-status/sources/hosting.ts, which strips the provider's
    // name out of every string before it renders.
    hostingStatus: "https://jetstream.status.io/",
    whatsNew: "/whats-new",
  },
  version: "v2025.1",
};
