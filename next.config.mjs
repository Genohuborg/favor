import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  webpack: (config) => {
    // Force streamdown's ESM build. DO NOT REMOVE without testing a
    // server-rendered route (not just the chat widget).
    //
    // streamdown ships "exports": { import: "./dist/index.js",
    // require: "./dist/index.cjs" } and webpack picks the CJS build for the
    // server graph. That build `require()`s shiki, which is ESM-only:
    //
    //   ./node_modules/streamdown/dist/index.cjs
    //   Module not found: ESM packages (shiki) need to be imported.
    //
    // Next did not fail the build over that -- it silently left streamdown's
    // `Streamdown` export as `undefined`, so SSR threw "Element type is
    // invalid ... but got: undefined". <ChatInterface /> is rendered from the
    // ROOT LAYOUT, so that one undefined component returned HTTP 500 for
    // EVERY server-rendered route on the site, not just the chat.
    //
    // `transpilePackages: ["streamdown"]` was tried first and did not help:
    // webpack still resolved the CJS entry. Aliasing the ESM entry directly
    // is what actually fixes the resolution.
    config.resolve.alias = {
      ...config.resolve.alias,
      streamdown: path.resolve(
        process.cwd(),
        "node_modules/streamdown/dist/index.js",
      ),
    };
    return config;
  },
};

export default nextConfig;
